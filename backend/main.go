package main

import (
	"net/http"

	"github.com/greywind/jiraTasksHandling/handlers"
)

func main() {
	http.HandleFunc("/getAllIssuesInTheCurrentSprint", handlers.GetAllIssuesInTheCurrentSprint)
	http.HandleFunc("/getAllAssignees", handlers.GetAllAssignees)
	http.HandleFunc("/createQASubtask", handlers.CreateQASubtask)
	http.HandleFunc("/createCRSubtask", handlers.CreateCRSubtask)
	http.HandleFunc("/assignee", handlers.PutAssignee)
	http.ListenAndServe(":8091", nil)
}
