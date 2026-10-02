import type { LoginResponseData, PermissionsMap, UserInfo, PermissionModule, PermissionActions } from '../types/auth';

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  PERMISSION: 'permission',
} as const;

/**
 * Menyimpan seluruh data otentikasi ke Local Storage terpisah sesuai spesifikasi
 */
export const saveAuthSession = (data: LoginResponseData): void => {
  if (!data) return;

  // 1. Simpan Access Token
  if (data.accessToken) {
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.accessToken);
  }

  // 2. Simpan Refresh Token
  if (data.refreshToken) {
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
  }

  // 3. Simpan User Info (Name, RoleName, dsb)
  const userInfo: UserInfo = {
    name: data.name,
    roleName: data.roleName,
  };
  localStorage.setItem(AUTH_KEYS.USER_INFO, JSON.stringify(userInfo));

  // 4. Simpan Permissions
  if (data.permissions) {
    localStorage.setItem(AUTH_KEYS.PERMISSION, JSON.stringify(data.permissions));
  }
};

/**
 * Mengambil Access Token dari Local Storage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN) || localStorage.getItem('token');
};

/**
 * Mengambil Refresh Token dari Local Storage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
};

/**
 * Mengambil User Info (name, roleName) yang sudah diparsing
 */
export const getUserInfo = (): UserInfo | null => {
  const userStr = localStorage.getItem(AUTH_KEYS.USER_INFO);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as UserInfo;
  } catch (err) {
    console.error('Error parsing userInfo from localStorage', err);
    return null;
  }
};

/**
 * Mengambil Permissions map yang sudah diparsing
 */
export const getPermissions = (): PermissionsMap | null => {
  const permStr = localStorage.getItem(AUTH_KEYS.PERMISSION);
  if (!permStr) return null;
  try {
    return JSON.parse(permStr) as PermissionsMap;
  } catch (err) {
    console.error('Error parsing permissions from localStorage', err);
    return null;
  }
};

/**
 * Helper untuk memeriksa hak akses modul dan aksi tertentu
 * Contoh: hasPermission('products', 'delete') -> true/false
 */
export const hasPermission = (
  moduleName: PermissionModule,
  action: keyof PermissionActions = 'view'
): boolean => {
  const permissions = getPermissions();
  if (!permissions) return false;

  const modulePerms = permissions[moduleName];
  if (!modulePerms) return false;

  return Boolean(modulePerms[action]);
};

/**
 * Menghapus seluruh sesi autentikasi dari Local Storage (Logout)
 */
export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER_INFO);
  localStorage.removeItem(AUTH_KEYS.PERMISSION);
  localStorage.removeItem('token'); // Menghapus key lama jika ada
};

/**
 * Memeriksa apakah user sedang dalam sesi login yang valid
 */
export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};
