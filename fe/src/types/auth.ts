export interface Department {
    department_id: number;
    department_name: string;
}

export interface User {
    user_id: number;
    name: string;
    department: number;
}

export interface Authority {
    id: number;
    name: string;
    department: string;
}

export interface Tag {
    id: number;
    tag: string;
}
