import type { UserItem, RoleItem } from '../../../types/users';

export const INITIAL_USERS: UserItem[] = [
  {
    id: '6ab8c4a58815a82ac1c9b250',
    name: 'Administrator',
    email: 'admin@kasirin.com',
    username: '@admin',
    roleId: '6ab8c4a58815a82ac1c9b24f',
    role: 'Admin',
    status: 'Aktif',
    isActive: true,
    lastLogin: 'Hari ini, 09:29 WIB',
    registeredDate: '01/08/2026',
    isVerifiedAdmin: true,
    isOnline: true,
    avatarUrl:
      'https://ui-avatars.com/api/?name=Administrator&background=006948&color=ffffff&bold=true',
  },
  {
    id: '6ab8c4a58815a82ac1c9b251',
    name: 'Budi Santoso',
    email: 'budi@kasirin.com',
    username: '@budi_kasir',
    roleId: '6ac2789925a9f087c69ed215',
    role: 'Kasir',
    status: 'Aktif',
    isActive: true,
    lastLogin: 'Hari ini, 09:15 WIB',
    registeredDate: '01/09/2026',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Budi+Santoso&background=006948&color=ffffff&bold=true',
  },
];

export const INITIAL_ROLES: RoleItem[] = [
  {
    id: '6ab8c4a58815a82ac1c9b24f',
    name: 'Admin',
    description: 'Akses penuh ke semua fitur dan pengaturan sistem kasir',
    type: 'system',
    isSystemRole: true,
    userCount: 1,
    iconName: 'admin',
    permissions: {
      categories: { view: true, create: true, update: true, delete: true },
      products: { view: true, create: true, update: true, delete: true },
      store: { view: true, create: true, update: true, delete: true },
      transactions: { view: true, create: true, update: true, delete: true },
      roles: { view: true, create: true, update: true, delete: true },
      users: { view: true, create: true, update: true, delete: true },
    },
  },
  {
    id: '6ac2789925a9f087c69ed215',
    name: 'Kasir',
    description: 'Akses transaksi kasir POS dan melihat daftar katalog produk',
    type: 'active',
    isSystemRole: false,
    userCount: 1,
    iconName: 'pos',
    permissions: {
      categories: { view: true, create: false, update: false, delete: false },
      products: { view: true, create: false, update: false, delete: false },
      store: { view: false, create: false, update: false, delete: false },
      transactions: { view: true, create: true, update: true, delete: false },
      roles: { view: false, create: false, update: false, delete: false },
      users: { view: false, create: false, update: false, delete: false },
    },
  },
];
