import type { LoginResponseData, UserInfo } from '../types/auth';

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  PERMISSION: 'permission',
} as const;

/**
 * Menyimpan seluruh data otentikasi ke Local Storage terpisah sesuai spesifikasi backend
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

  // 4. Simpan Permissions (Array of strings, e.g. ["categories:view", "categories:create", ...])
  if (data.permissions) {
    localStorage.setItem(AUTH_KEYS.PERMISSION, JSON.stringify(data.permissions));
  }
};

/**
 * Menyimpan atau memperbarui Access Token di Local Storage
 */
export const setAccessToken = (token: string): void => {
  if (!token) return;
  localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);
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
 * Mengambil list Permissions (string[]) yang sudah diparsing dari Local Storage
 */
export const getPermissions = (): string[] => {
  const permStr = localStorage.getItem(AUTH_KEYS.PERMISSION);
  if (!permStr) return [];
  try {
    const parsed = JSON.parse(permStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error parsing permissions from localStorage', err);
    return [];
  }
};

/**
 * Helper untuk memeriksa hak akses modul dan aksi tertentu
 * Contoh:
 *   hasPermission('categories:view') -> true/false
 *   hasPermission('categories', 'create') -> true/false
 */
export const hasPermission = (
  moduleOrPermission: string,
  action?: string
): boolean => {
  const permissions = getPermissions();
  if (!permissions || permissions.length === 0) return false;

  const permissionKey = action ? `${moduleOrPermission}:${action}` : moduleOrPermission;
  return permissions.includes(permissionKey);
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
 * Memeriksa apakah token JWT sudah kadaluarsa (expired)
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      // Jika bukan format 3 part JWT, jangan anggap expired
      return false;
    }

    // Normalisasi base64url ke standard base64 dengan padding '='
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const payloadStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(payloadStr);
    if (typeof payload.exp === 'number') {
      // payload.exp dalam satuan detik, bandingkan dengan Date.now() dalam milidetik
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch (err) {
    console.error('Error saat memeriksa expired token:', err);
    return false;
  }
};

/**
 * Memeriksa apakah user sedang dalam sesi login yang valid
 * Sesi dianggap valid jika accessToken belum expired ATAU refreshToken masih ada dan valid
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // Jika kedua token tidak ada, berarti belum login
  if (!accessToken && !refreshToken) return false;

  // Jika accessToken masih valid
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  // Jika accessToken expired, periksa apakah refreshToken masih valid
  if (refreshToken && !isTokenExpired(refreshToken)) {
    return true;
  }

  return false;
};
