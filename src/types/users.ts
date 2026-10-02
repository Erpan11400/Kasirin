export type UserRole = string;
export type UserStatus = 'Aktif' | 'Nonaktif';

export interface UserItem {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  registeredDate: string;
  avatarUrl: string;
  isVerifiedAdmin?: boolean;
  isOnline?: boolean;
}

export interface PermissionActions {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface RoleItem {
  id: string;
  name: string;
  type: 'system' | 'active';
  userCount: number;
  description: string;
  iconName: 'admin' | 'pos' | 'transaksi' | 'store' | 'custom' | string;
  permissions: {
    transaksi: PermissionActions;
    produk: PermissionActions;
    laporan: PermissionActions;
    pengaturan: PermissionActions;
  };
}
