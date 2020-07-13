package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"text/template"

	"github.com/greywind/jiraTasksHandling/config"
)

type JiraError struct {
	errorMessages []string
	errors        map[string]string
}

type Issue struct {
	Id      string
	Summary string
}

type Subtask struct {
	ParentId string
	Summary  string
}

func CreateQASubtask(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", config.Get().UiUrl)
	resp.Header().Set("Access-Control-Allow-Credentials", "true")
	resp.Header().Set("Access-Control-Allow-Headers", "Accept,Content-Type")

	if req.Method != http.MethodPost {
		return
	}

	var issue Issue
	bodyString, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal(bodyString, &issue)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	qa := Subtask{ParentId: issue.Id, Summary: fmt.Sprintf("QA for '%v'", issue.Summary)}

	bodyTemplate := template.Must(template.New("body").Parse(createQASubtaskBodyStr))
	var buf bytes.Buffer
	bodyTemplate.Execute(&buf, qa)

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
	print(createdIssueLink)

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
		"summary": "{{.Summary}}",
		"issuetype": {
			"id": 10006
		},
		"parent": {
			"id": "{{.ParentId}}"
		}
	}
}
`
