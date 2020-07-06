package handlers

import (
	"bytes"
	"net/http"

	"github.com/greywind/jiraTasksHandling/config"
)

func GetAllIssuesInTheCurrentSprint(resp http.ResponseWriter, req *http.Request) {
	jiraReq, _ := http.NewRequest("GET", config.Get().JiraBaseUrl+"/search/", nil)
	jiraReq.URL.Query().Add("jql", "Sprint in openSprints() AND parent is EMPTY")
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	client := http.DefaultClient

	jiraResp, err := client.Do(jiraReq)

	if err != nil {
		resp.Write(bytes.NewBufferString(err.Error()).Bytes())
		return
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(jiraResp.Body)
	resp.Write(buf.Bytes())
}
