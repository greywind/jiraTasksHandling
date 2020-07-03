export interface IssuetypeDto {
    self: string;
    id: string;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    avatarId: number;
}

export interface AvatarUrlsDto {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
}

export interface ProjectDto {
    self: string;
    id: string;
    key: string;
    name: string;
    projectTypeKey: string;
    simplified: boolean;
    avatarUrls: AvatarUrlsDto;
}

export interface ResolutionDto {
    self: string;
    id: string;
    description: string;
    name: string;
}

export interface WatchesDto {
    self: string;
    watchCount: number;
    isWatching: boolean;
}

export interface PriorityDto {
    self: string;
    iconUrl: string;
    name: string;
    id: string;
}

export interface TypeDto {
    id: string;
    name: string;
    inward: string;
    outward: string;
    self: string;
}

export interface StatusCategoryDto {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: string;
}

export interface StatusDto {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: StatusCategoryDto;
}

export interface IssuelinkDto {
    id: string;
    self: string;
    type: TypeDto;
    inwardIssue: IssueDto;
    outwardIssue: IssueDto;
}

export interface AssigneeDto {
    self: string;
    accountId: string;
    avatarUrls: AvatarUrlsDto;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: string;
}

export interface NonEditableReasonDto {
    reason: string;
    message: string;
}

export interface Customfield10009Dto {
    hasEpicLinkFieldDependency: boolean;
    showField: boolean;
    nonEditableReason: NonEditableReasonDto;
}

export interface CreatorDto {
    self: string;
    accountId: string;
    avatarUrls: AvatarUrlsDto;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: string;
    emailAddress: string;
}

export interface ReporterDto {
    self: string;
    accountId: string;
    avatarUrls: AvatarUrlsDto;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: string;
    emailAddress: string;
}

export interface AggregateprogressDto {
    progress: number;
    total: number;
    percent: number;
}

export interface ProgressDto {
    progress: number;
    total: number;
    percent: number;
}

export interface VotesDto {
    self: string;
    votes: number;
    hasVoted: boolean;
}

export interface ParentDto {
    id: string;
    key: string;
    self: string;
    fields: FieldsDto;
}

export interface FieldsDto {
    statuscategorychangedate: Date;
    issuetype: IssuetypeDto;
    timespent?: number;
    customfield_10073?: any;
    customfield_10075?: any;
    project: ProjectDto;
    customfield_10076?: any;
    fixVersions: any[];
    customfield_10077?: any;
    aggregatetimespent?: number;
    customfield_10078?: any;
    resolution: ResolutionDto;
    customfield_10079?: any;
    customfield_10104?: any;
    resolutiondate?: Date;
    workratio: number;
    watches: WatchesDto;
    lastViewed?: Date;
    created: Date;
    customfield_10100?: any;
    priority: PriorityDto;
    customfield_10101?: any;
    customfield_10102?: any;
    customfield_10103?: any;
    labels: string[];
    timeestimate?: number;
    aggregatetimeoriginalestimate?: number;
    versions: any[];
    issuelinks: IssuelinkDto[];
    assignee: AssigneeDto;
    updated: Date;
    status: StatusDto;
    components: any[];
    customfield_10090?: any;
    customfield_10091?: any;
    customfield_10094?: any;
    timeoriginalestimate?: number;
    customfield_10095?: any;
    customfield_10096?: any;
    customfield_10097?: any;
    description: string;
    customfield_10098?: any;
    customfield_10010: string[];
    customfield_10011: string;
    customfield_10099?: any;
    customfield_10012?: Date;
    customfield_10013: string;
    customfield_10008: string;
    customfield_10009: Customfield10009Dto;
    aggregatetimeestimate?: number;
    summary: string;
    creator: CreatorDto;
    customfield_10080?: any;
    customfield_10081?: any;
    customfield_10082?: any;
    subtasks: IssueDto[];
    customfield_10083: any[];
    customfield_10084?: any;
    reporter: ReporterDto;
    customfield_10087?: any;
    customfield_10000: string;
    customfield_10088?: any;
    aggregateprogress: AggregateprogressDto;
    customfield_10089?: any;
    customfield_10001?: any;
    customfield_10004?: any;
    environment?: any;
    duedate?: any;
    progress: ProgressDto;
    votes: VotesDto;
    parent: ParentDto;
    customfield_10032?: any;
}

export interface IssueDto {
    expand?: string;
    id: string;
    self: string;
    key: string;
    fields: FieldsDto;
}

export enum IssueStatus {
    toDo,
    onHold,
    inProgress,
    crqa,
    readyToRelease,
}

export interface Issue {
    id: string;
    key: string;
    link: string;
    assignee: string;
    status: IssueStatus,
    cr?: Issue,
    qa?: Issue,
}