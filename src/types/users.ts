export type UserRole = string;
export type UserStatus = 'Aktif' | 'Nonaktif';

export interface BackendUserItem {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  username?: string;
  roleId: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  lastLogin: string;
  registeredDate: string;
  avatarUrl: string;
  isVerifiedAdmin?: boolean;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionActions {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface RolePermissions {
  categories: PermissionActions;
  products: PermissionActions;
  store: PermissionActions;
  transactions: PermissionActions;
  roles: PermissionActions;
  users: PermissionActions;
}

export interface BackendRoleItem {
  _id: string;
  name: string;
  description?: string | null;
  isSystemRole: boolean;
  permissions: RolePermissions;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface RoleItem {
  id: string;
  name: string;
  description?: string;
  type: 'system' | 'active';
  isSystemRole: boolean;
  userCount: number;
  iconName: string;
  permissions: RolePermissions;
  createdAt?: string;
  updatedAt?: string;
}
