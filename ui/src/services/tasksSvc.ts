import { Issue, IssueDto } from "src/models/task";
import wget from "@core/wget";

export interface SearchResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: IssueDto[];
}

function normalizeIssue(issue: IssueDto): Issue {
    return issue as unknown as Issue;
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