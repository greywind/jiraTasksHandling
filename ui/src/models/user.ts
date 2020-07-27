interface AvatarUrlsDto {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
}

export interface UserDto {
    self: string;
    accountId: string;
    accountType: string;
    emailAddress: string;
    avatarUrls: AvatarUrlsDto;
    displayName: string;
    active: boolean;
    timeZone: string;
    locale: string;
}

export interface User {
    accountId: string;
    displayName: string;
    avatar: string;
}