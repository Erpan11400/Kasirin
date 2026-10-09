import type { ApiResponse } from './api';

export interface LoginPayload {
  email?: string;
  username?: string;
  password?: string;
}

export interface UserInfo {
  name: string;
  roleName: string;
  [key: string]: any;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  name: string;
  roleName: string;
  permissions: string[];
}

export interface RefreshTokenResponseData {
  accessToken: string;
}

export type LoginApiResponse = ApiResponse<LoginResponseData>;
export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponseData | string>;


