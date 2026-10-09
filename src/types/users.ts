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

export interface ModuleConfig {
  key: keyof RolePermissions;
  title: string;
  icon: string;
  description: string;
  labels: {
    view: { title: string; desc: string };
    create: { title: string; desc: string };
    update: { title: string; desc: string };
    delete: { title: string; desc: string };
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  roleId: string;
  password?: string;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  roleId?: string;
  password?: string;
  isActive?: boolean;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions: RolePermissions;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  isSystemRole?: boolean;
  permissions?: RolePermissions;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserItem | null;
  roles: RoleItem[];
  onSave: (data: {
    id?: string;
    name: string;
    email: string;
    roleId: string;
    password?: string;
    isActive?: boolean;
  }) => void;
}

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleItem | null;
  onSave: (data: {
    name: string;
    description?: string;
    permissions: RolePermissions;
    id?: string;
  }) => void;
}

export interface UserListTabProps {
  users: UserItem[];
  roles: RoleItem[];
  onOpenAddModal: () => void;
  onOpenEditModal: (user: UserItem) => void;
  onToggleUserStatus: (user: UserItem) => void;
}

export interface RoleSettingsTabProps {
  roles: RoleItem[];
  selectedRoleId?: string;
  onSelectRole?: (roleId: string) => void;
  onOpenAddRoleModal: () => void;
  onOpenEditRoleModal: (role: RoleItem) => void;
  onUpdateRolePermissions?: (roleId: string, permissions: RoleItem['permissions']) => void;
  onDeleteRole: (roleId: string) => void;
  showToast?: (msg: string) => void;
}
