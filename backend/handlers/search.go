package handlers

import (
	"io"
	"net/http"
	"strings"

	"github.com/greywind/jiraTasksHandling/config"
)

// GetAllIssuesInTheCurrentSprint returns all tasks that are included to the current sprint.
// You can pass `startAt` parameter via query string for pagination
func GetAllIssuesInTheCurrentSprint(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", config.Get().UiUrl)
	resp.Header().Set("Access-Control-Allow-Credentials", "true")

	startAt := req.URL.Query().Get("startAt")

	jiraReq, _ := http.NewRequest("GET", config.Get().JiraBaseUrl+"/search/", nil)
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	qs := jiraReq.URL.Query()
	qs.Add("jql", "Sprint in openSprints()")
	qs.Add("fields", "summary,status,assignee,subtasks,issuetype")
	if startAt != "" {
		qs.Add("startAt", startAt)
	}

	jiraReq.URL.RawQuery = qs.Encode()

	jiraResp, err := http.DefaultClient.Do(jiraReq)

	if err != nil {
		io.Copy(resp, strings.NewReader(err.Error()))
		return
	}
	defer jiraResp.Body.Close()
	if jiraResp.StatusCode == http.StatusBadRequest {
		http.Error(resp, "", http.StatusBadRequest)
	}

	io.Copy(resp, jiraResp.Body)
}

//GetAllAssignees returns a list of all users available to be assigned to a task
func GetAllAssignees(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", config.Get().UiUrl)
	resp.Header().Set("Access-Control-Allow-Credentials", "true")

	jiraReq, _ := http.NewRequest("GET", config.Get().JiraBaseUrl+"/user/assignable/search", nil)
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	qs := jiraReq.URL.Query()
	qs.Add("project", "10006")

	jiraReq.URL.RawQuery = qs.Encode()

	jiraResp, err := http.DefaultClient.Do(jiraReq)
	if err != nil {
		io.Copy(resp, strings.NewReader(err.Error()))
		return
	}
	defer jiraResp.Body.Close()
	if jiraResp.StatusCode == http.StatusBadRequest {
		http.Error(resp, "", http.StatusBadRequest)
	}

	io.Copy(resp, jiraResp.Body)
}
