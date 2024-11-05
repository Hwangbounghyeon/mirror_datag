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

export interface LoginResponseType {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserType;
}

export type UserType = {
  user_id: number;
  name: string;
  email: string;
  department_id: number;
  is_supervised: boolean;
};

export type RefreshResponseType = {
  access_token: string;
  token_type: string;
};
