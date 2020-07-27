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

type putAssigneeParameters struct {
	IssueID  string
	Assignee string
}

// PutAssignee sets an assignee for a task. Parameters passed via body:
// 	{
// 		IssueID string
// 		Assignee string
//	}
func PutAssignee(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", config.Get().UiUrl)
	resp.Header().Set("Access-Control-Allow-Credentials", "true")
	resp.Header().Set("Access-Control-Allow-Headers", "Accept,Content-Type")
	resp.Header().Set("Access-Control-Allow-Methods", "PUT")

	if req.Method != http.MethodPut {
		return
	}

	var parameters putAssigneeParameters
	bodyString, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	err = json.Unmarshal(bodyString, &parameters)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	bodyTemplate := template.Must(template.New("body").Parse(setAssigneeBodyStr))
	var buf bytes.Buffer
	err = bodyTemplate.Execute(&buf, parameters)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	jiraReq, err := http.NewRequest("PUT", fmt.Sprintf("%v/issue/%v/assignee", config.Get().JiraBaseUrl, parameters.IssueID), &buf)
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)
	jiraReq.Header.Add("Content-Type", "application/json;charset=UTF-8")
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	jiraResp, err := http.DefaultClient.Do(jiraReq)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	defer jiraResp.Body.Close()
	if jiraResp.StatusCode != http.StatusNoContent {
		http.Error(resp, "", http.StatusBadRequest)
		io.Copy(resp, jiraResp.Body)
		return
	}

	io.Copy(resp, jiraResp.Body)
}

const setAssigneeBodyStr = `
{
	"accountId": {{ if .Assignee }} "{{ .Assignee }}" {{ else }} null {{ end }}
}
`
