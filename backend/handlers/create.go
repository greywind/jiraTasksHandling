package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"text/template"

	"github.com/greywind/jiraTasksHandling/config"
)

type issue struct {
	ID      string
	Summary string
}

// CreateQASubtask creates a QA subtask for issue passed via body in form of:
// 	{
// 		ID      string,
// 		Summary string
// 	}
// The summary for a new task will be the summary of parent task prefixed with "QA for"
func CreateQASubtask(resp http.ResponseWriter, req *http.Request) {
	createSubtask(resp, req, createQASubtaskBodyStr)
}

// CreateCRSubtask creates a code review subtask for issue passed via body in form of:
// 	{
// 		ID      string,
// 		Summary string
// 	}
// The summary for a new task will be the summary of parent task prefixed with "CR for"
func CreateCRSubtask(resp http.ResponseWriter, req *http.Request) {
	createSubtask(resp, req, createCRSubtaskBodyStr)
}

func createSubtask(resp http.ResponseWriter, req *http.Request, createSubtaskBodyStr string) {
	resp.Header().Set("Access-Control-Allow-Origin", config.Get().UiUrl)
	resp.Header().Set("Access-Control-Allow-Credentials", "true")
	resp.Header().Set("Access-Control-Allow-Headers", "Accept,Content-Type")

	if req.Method != http.MethodPost {
		return
	}

	var parentIssue issue
	bodyString, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal(bodyString, &parentIssue)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	bodyTemplate := template.Must(template.New("body").Parse(createSubtaskBodyStr))
	var buf bytes.Buffer
	err = bodyTemplate.Execute(&buf, parentIssue)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	jiraReq, _ := http.NewRequest("POST", config.Get().JiraBaseUrl+"/issue/", &buf)
	jiraReq.Header.Add("Content-Type", "application/json")
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	jiraResp, err := http.DefaultClient.Do(jiraReq)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	defer jiraResp.Body.Close()
	if jiraResp.StatusCode == http.StatusBadRequest {
		http.Error(resp, "", http.StatusBadRequest)
		io.Copy(resp, jiraResp.Body)
		return
	}

	bodyString, err = ioutil.ReadAll(jiraResp.Body)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	var parsedJiraResp map[string]string
	err = json.Unmarshal(bodyString, &parsedJiraResp)

	createdIssueLink := parsedJiraResp["self"]

	jiraReq, _ = http.NewRequest("GET", createdIssueLink, nil)
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	jiraResp, err = http.DefaultClient.Do(jiraReq)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	defer jiraResp.Body.Close()
	if jiraResp.StatusCode == http.StatusBadRequest {
		http.Error(resp, "", http.StatusBadRequest)
		io.Copy(resp, jiraResp.Body)
		return
	}

	io.Copy(resp, jiraResp.Body)
}

const createQASubtaskBodyStr = `
{
	"fields": {
		"project": {
			"id": 10006
		},
		"summary": "QA for '{{.Summary}}'",
		"issuetype": {
			"id": 10006
		},
		"parent": {
			"id": "{{.ID}}"
		}
	}
}
`

const createCRSubtaskBodyStr = `
{
	"fields": {
		"project": {
			"id": 10006
		},
		"summary": "CR for '{{.Summary}}'",
		"issuetype": {
			"id": 10002
		},
		"parent": {
			"id": "{{.ID}}"
		}
	}
}
`
