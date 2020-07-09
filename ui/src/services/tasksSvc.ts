import configSvc from "@core/services/configSvc";
import wget from "@core/wget";
import { Issue, IssueDto, IssueStatus } from "src/models/task";

export interface SearchResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: IssueDto[];
}

function normalizeIssue(issue: IssueDto, _i: number, array: IssueDto[]): Issue {
    if (!issue)
        return undefined;
    if (issue.fields.issuetype.subtask) {
        return {
            id: issue.id,
            issueKey: issue.key,
            summary: issue.fields.summary,
            link: `${configSvc.value.jiraTaskBaseUrl}${issue.key}`,
            status: issue.fields.status.name as IssueStatus,
            assignee: issue.fields.assignee?.displayName || array.find(i => i.id == issue.id).fields.assignee?.displayName || "unassigned",
            subtask: issue.fields.issuetype.subtask,
        };
    }
    const result: Issue = {
        id: issue.id,
        issueKey: issue.key,
        summary: issue.fields.summary,
        link: `${configSvc.value.jiraTaskBaseUrl}${issue.key}`,
        status: issue.fields.status.name as IssueStatus,
        assignee: issue.fields.assignee?.displayName || "unassigned",
        subtask: issue.fields.issuetype.subtask,
        cr: normalizeIssue(issue.fields.subtasks?.find(st => st.fields.summary == `CR for '${issue.fields.summary}'`), _i, array),
        qa: normalizeIssue(issue.fields.subtasks?.find(st => st.fields.summary == `QA for '${issue.fields.summary}'`), _i, array),
    };
    return result;
}

class TasksSvc {
    public async getAllIssuesInTheCurrentSprint(): Promise<Issue[]> {
        const issuesDto: IssueDto[] = [];
        let startAt = 0;
        for (; ;) {
            const response = await wget.get<SearchResponse>("getAllIssuesInTheCurrentSprint", { qs: { startAt } });
            issuesDto.push(...response.issues);
            if (response.total <= response.startAt + response.maxResults)
                break;
            startAt += response.maxResults;
        }

        const result = issuesDto.map(normalizeIssue).filter(i => !i.subtask);
        return result;
    }
}

export default new TasksSvc();