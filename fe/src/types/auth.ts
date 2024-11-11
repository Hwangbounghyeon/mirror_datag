import { DefaultResponseType } from "./default";

export interface User {
  uid: number;
  name: string;
  department_name: string;
}

export interface AuthUser {
  user_id: number;
  user_name: string;
  department_name: string;
}

export interface AuthResponseData {
  image_id: string;
  auth_list: AuthUser[];
}

export type AuthResponse = DefaultResponseType<AuthResponseData>;

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
  refresh_token: string;
  token_type: string;
};
