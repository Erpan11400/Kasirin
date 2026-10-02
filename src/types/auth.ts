import type { ApiResponse } from '../lib/api';
import type { PermissionActions } from './users';

export type { PermissionActions };

export type PermissionModule =
  | 'categories'
  | 'products'
  | 'store'
  | 'transactions'
  | 'roles'
  | 'users'
  | string;

export type PermissionsMap = {
  [module in PermissionModule]?: PermissionActions;
};

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
  permissions: PermissionsMap;
}

export type LoginApiResponse = ApiResponse<LoginResponseData>;
