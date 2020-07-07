import { Issue, IssueDto, IssueStatus, StatusDto } from "src/models/task";
import wget from "@core/wget";
import configSvc from "@core/services/configSvc";

export interface SearchResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: IssueDto[];
}

function normalizeIssue(issue: IssueDto): Issue {
    if (!issue)
        return undefined;
    const result: Issue = {
        id: issue.id,
        issueKey: issue.key,
        title: issue.fields.summary,
        link: `${configSvc.value.jiraTaskBaseUrl}${issue.key}`,
        status: issue.fields.status.name as IssueStatus,
        assignee: issue.fields.assignee?.displayName || "unassigned",
        cr: normalizeIssue(issue.fields.subtasks?.find(st => st.fields.summary == `CR for '${issue.fields.summary}'`)),
        qa: normalizeIssue(issue.fields.subtasks?.find(st => st.fields.summary == `QA for '${issue.fields.summary}'`)),
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

        const result = issuesDto.map(normalizeIssue);
        return result;
    }
}

export default new TasksSvc();