export interface LineMetric {
    project: Project,
    metric_line: Timeline
}

export interface Project {
    id: number,
    name: string,
    owner: User
}

export interface User {
    id: number,
    username: string
}

export interface Timeline {
    [value: string]: number;
}
