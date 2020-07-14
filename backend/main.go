package main

import (
	"net/http"

	"github.com/greywind/jiraTasksHandling/handlers"
)

func main() {
	http.HandleFunc("/getAllIssuesInTheCurrentSprint", handlers.GetAllIssuesInTheCurrentSprint)
	http.HandleFunc("/createQASubtask", handlers.CreateQASubtask)
	http.HandleFunc("/createCRSubtask", handlers.CreateCRSubtask)
	http.ListenAndServe(":8091", nil)
}
