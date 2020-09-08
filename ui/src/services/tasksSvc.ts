import configSvc from "@core/services/configSvc";
import wget from "@core/wget";
import { Issue, IssueDto, IssueStatus } from "src/models/task";
import { User, UserDto } from "src/models/user";

export interface SearchResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: IssueDto[];
}

export const unassignedUser: User = { accountId: null, avatar: "", displayName: "unassigned" };

function normalizeIssue(issue: IssueDto, i = 0, array: IssueDto[] = []): Issue {
    if (!issue)
        return undefined;
    if (issue.fields.issuetype.subtask) {
        return {
            id: issue.id,
            issueKey: issue.key,
            summary: issue.fields.summary,
            link: `${configSvc.value.jiraTaskBaseUrl}${issue.key}`,
            status: issue.fields.status.name as IssueStatus,
            assignee: normalizeUser(issue.fields.assignee || array.find(i => i.id == issue.id)?.fields?.assignee) || unassignedUser,
            subtask: issue.fields.issuetype.subtask,
        };
    }
    const crSummary = `CR for '${issue.fields.summary}'`.toLowerCase();
    const qaSummary = `QA for '${issue.fields.summary}'`.toLowerCase();
    let qa = issue.fields.subtasks?.find(st => st.fields.summary.toLowerCase() == qaSummary);
    if (!qa)
        qa = issue.fields.subtasks?.find(st => st.fields.issuetype.name == "QA");

    const cr = issue.fields.subtasks?.find(st => st.fields.summary.toLowerCase() == crSummary);

    const result: Issue = {
        id: issue.id,
        issueKey: issue.key,
        summary: issue.fields.summary,
        link: `${configSvc.value.jiraTaskBaseUrl}${issue.key}`,
        status: issue.fields.status.name as IssueStatus,
        assignee: normalizeUser(issue.fields.assignee) || unassignedUser,
        subtask: issue.fields.issuetype.subtask,
        cr: normalizeIssue(cr, i, array),
        qa: normalizeIssue(qa, i, array),
    };
    return result;
}

function normalizeUser(user: Pick<UserDto, "accountId" | "displayName" | "avatarUrls">): User {
    if (!user)
        return undefined;

    return {
        accountId: user.accountId,
        displayName: user.displayName,
        avatar: user.avatarUrls["16x16"],
    };
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
    public async createQASubtask(issue: Issue): Promise<Issue> {
        const issueDto = await wget.post<IssueDto>("createQASubtask", issue);
        return normalizeIssue(issueDto);
    }
    public async createCRSubtask(issue: Issue): Promise<Issue> {
        const issueDto = await wget.post<IssueDto>("createCRSubtask", issue);
        return normalizeIssue(issueDto);
    }
    public async getAllUsers(): Promise<User[]> {
        const usersDto = await wget.get<UserDto[]>("getAllAssignees");
        return usersDto.map(normalizeUser);
    }
    public async assignUser(issue: Issue, assignee: string): Promise<void> {
        await wget.put("assignee", { issueId: issue.id, assignee });
    }
}

export default new TasksSvc();