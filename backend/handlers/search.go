package handlers

import (
	"io"
	"net/http"
	"strings"

	"github.com/greywind/jiraTasksHandling/config"
)

func GetAllIssuesInTheCurrentSprint(resp http.ResponseWriter, req *http.Request) {
	startAt := req.URL.Query().Get("startAt")

	jiraReq, _ := http.NewRequest("GET", config.Get().JiraBaseUrl+"/search/", nil)
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	qs := jiraReq.URL.Query()
	qs.Add("jql", "Sprint in openSprints() AND parent is EMPTY")
	if startAt != "" {
		qs.Add("startAt", startAt)
	}

	jiraReq.URL.RawQuery = qs.Encode()

	jiraResp, err := http.DefaultClient.Do(jiraReq)

	if err != nil {
		io.Copy(resp, strings.NewReader(err.Error()))
		return
	}

	io.Copy(resp, jiraResp.Body)
}
