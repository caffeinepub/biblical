import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Story {
    id: bigint;
    title: string;
    earningsAmount: string;
    body: string;
    createdAt: bigint;
    authorName: string;
    likes: bigint;
    workCategory: string;
    authorPrincipal: Principal;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createStory(title: string, body: string, workCategory: string, earningsAmount: string): Promise<Story>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDisplayName(p: Principal): Promise<string | null>;
    getStories(): Promise<Array<Story>>;
    getStoriesByAuthor(author: Principal): Promise<Array<Story>>;
    getStory(id: bigint): Promise<Story | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeStory(id: bigint): Promise<Story | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setDisplayName(name: string): Promise<void>;
}
