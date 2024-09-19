export interface LineMetric {
    timestamps: number[];
    counts: number[];
}

export interface TimelineData {
    readonly x: number;
    readonly y: number;
}

export interface User {
    id?: number;
    username: string;
    password: string;
}

export interface Project {
    id?: number;
    name: string;
    is_visible?: boolean;
    owner?: User;
}