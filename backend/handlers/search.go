package handlers

import (
	"io"
	"net/http"
	"strings"

	"github.com/greywind/jiraTasksHandling/config"
)

func GetAllIssuesInTheCurrentSprint(resp http.ResponseWriter, req *http.Request) {
	jiraReq, _ := http.NewRequest("GET", config.Get().JiraBaseUrl+"/search/", nil)
	jiraReq.SetBasicAuth(config.Get().JiraUsername, config.Get().JiraPassword)

	qs := jiraReq.URL.Query()
	qs.Add("jql", "Sprint in openSprints() AND parent is EMPTY")

	jiraReq.URL.RawQuery = qs.Encode()

	client := http.DefaultClient

	jiraResp, err := client.Do(jiraReq)

	print(jiraReq.URL.String())

	if err != nil {
		io.Copy(resp, strings.NewReader(err.Error()))
		return
	}

	io.Copy(resp, jiraResp.Body)
}
