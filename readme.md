# Jira tasks handling

This tool was created to ease some routine operation against Jira. Like create some subtasks by specific algorithm and monitor theirs state.

Now it supports one-click creating subtasks for code review and for QA.
## How to run it
### Setup
1. Install [golang](https://golang.org/doc/install)
1. Create a new API token for Jira:
    * Got to the your [account settings](https://id.atlassian.com/manage-profile/security/api-tokens)
    * Click `Create API Token` button on the top of the page
    * Provide some label for it, e.g. `jiraTasksHandling`
    * Copy generated token, you will need it later
1. Create `config.json` file in the `backend` folder with this values:
```json
{
    "jiraBaseUrl": "https://smooveio.atlassian.net/rest/api/2/",
    "jiraUsername": "Your username in Jira (e.g. sergey.b@smoove.io)",
    "jiraPassword": "API token generated in previous step",
    "uiUrl": "http://localhost:8090"
}
```
### Run
* You can start backend from VSCode with `Run > Start Debugging` menu or by pressing F5.
> You can run it outside of VSCode with help of `backend/run.sh` but this will require changes in `ui/config.json`
* To start UI part you should execute `npm start` script in a terminal. After this the tool will be avialble by [localhost:8090](localhost:8090)