package main

import (
	"net/http"

	"github.com/greywind/jiraTasksHandling/handlers"
)

func main() {
	http.HandleFunc("/getAllIssuesInTheCurrentSprint", handlers.GetAllIssuesInTheCurrentSprint)
	http.HandleFunc("/createQASubtask", handlers.CreateQASubtask)
	http.ListenAndServe(":8091", nil)
}
