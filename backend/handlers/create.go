package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/greywind/jiraTasksHandling/config"
)

type issue struct {
	ID      string
	Summary string
}

type createIssueBody struct {
	Fields struct {
		Project struct {
			Id int `json:"id,string"`
		} `json:"project"`
		Summary   string `json:"summary"`
		Issuetype struct {
			Id int `json:"id,string"`
		} `json:"issuetype"`
		Parent struct {
			Id string `json:"id"`
		} `json:"parent"`
	} `json:"fields"`
}

func createQASubtaskBody(parentIssue issue) createIssueBody {
	result := createIssueBody{}
	result.Fields.Project.Id = 10006
	result.Fields.Summary = fmt.Sprintf("QA for '%v'", parentIssue.Summary)
	result.Fields.Issuetype.Id = 10006
	result.Fields.Parent.Id = parentIssue.ID

	return result
}

func createCRSubtaskBody(parentIssue issue) createIssueBody {
	result := createIssueBody{}
	result.Fields.Project.Id = 10006
	result.Fields.Summary = fmt.Sprintf("CR for '%v'", parentIssue.Summary)
	result.Fields.Issuetype.Id = 10002
	result.Fields.Parent.Id = parentIssue.ID

	return result
}

// CreateQASubtask creates a QA subtask for issue passed via body in form of:
// 	{
// 		ID      string,
// 		Summary string
// 	}
// The summary for a new task will be the summary of parent task prefixed with "QA for"
func CreateQASubtask(resp http.ResponseWriter, req *http.Request) {
	createSubtask(resp, req, createQASubtaskBody)
}

// CreateCRSubtask creates a code review subtask for issue passed via body in form of:
// 	{
// 		ID      string,
// 		Summary string
// 	}
// The summary for a new task will be the summary of parent task prefixed with "CR for"
func CreateCRSubtask(resp http.ResponseWriter, req *http.Request) {
	createSubtask(resp, req, createCRSubtaskBody)
}

func createSubtask(resp http.ResponseWriter, req *http.Request, createIssueBodyFunc func(issue) createIssueBody) {
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

	body := createIssueBodyFunc(parentIssue)
	bodyJson, err := json.Marshal(body)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	jiraReq, _ := http.NewRequest("POST", config.Get().JiraBaseUrl+"/issue/", bytes.NewReader(bodyJson))
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
