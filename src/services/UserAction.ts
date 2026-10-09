import api, { type ApiResponse } from '../lib/api';
import type {
  BackendUserItem,
  UserItem,
  RoleItem,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/users';
import { formatLastLogin, formatDate } from '../lib/formatters';

export type { CreateUserPayload, UpdateUserPayload };

/**
 * Helper untuk memetakan BackendUserItem ke format UserItem Frontend
 */
export const mapBackendUserToUserItem = (
  backendUser: BackendUserItem,
  roles: RoleItem[] = []
): UserItem => {
  const matchedRole = roles.find((r) => r.id === backendUser.roleId);
  const roleName = matchedRole?.name || (backendUser.roleId ? 'Kasir' : 'Pengguna');
  const isPrimaryAdmin =
    roleName.toLowerCase() === 'admin' || roleName.toLowerCase() === 'administrator';

  const regDate = backendUser.createdAt ? formatDate(backendUser.createdAt) : '01/09/2026';

  const username = backendUser.email
    ? `@${backendUser.email.split('@')[0]}`
    : `@${backendUser.name.toLowerCase().replace(/\s+/g, '_')}`;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    backendUser.name || 'User'
  )}&background=006948&color=ffffff&bold=true`;

  const formattedLastLogin = formatLastLogin(backendUser.lastLogin);

  return {
    id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    username,
    roleId: backendUser.roleId,
    role: roleName,
    status: backendUser.isActive ? 'Aktif' : 'Nonaktif',
    isActive: Boolean(backendUser.isActive),
    lastLogin: formattedLastLogin,
    registeredDate: regDate,
    avatarUrl,
    isVerifiedAdmin: isPrimaryAdmin,
    isOnline: Boolean(backendUser.isActive && backendUser.lastLogin),
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
  };
};

/**
 * Mengambil seluruh data user dari backend route `GET /users`
 */
export const getUsers = async (roles: RoleItem[] = []): Promise<UserItem[]> => {
  try {
    const response = await api.get<BackendUserItem[]>('/users');
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map((item) => mapBackendUserToUserItem(item, roles));
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat daftar pengguna dari backend:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat daftar pengguna.'
    );
  }
};

/**
 * Membuat user baru ke backend route `POST /users`
 */
export const createUser = async (
  payload: CreateUserPayload,
  roles: RoleItem[] = []
): Promise<UserItem> => {
  try {
    const response = await api.post<BackendUserItem>('/users', payload);
    if (response && response.data) {
      return mapBackendUserToUserItem(response.data, roles);
    }
    throw new Error(response?.message || 'Gagal membuat pengguna baru.');
  } catch (error: any) {
    console.error('Error saat membuat pengguna baru:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal membuat pengguna baru.'
    );
  }
};

/**
 * Memperbarui data user ke backend route `PUT /users/:id`
 */
export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
  roles: RoleItem[] = []
): Promise<UserItem> => {
  try {
    const response = await api.put<BackendUserItem>(`/users/${id}`, payload);
    if (response && response.data) {
      return mapBackendUserToUserItem(response.data, roles);
    }
    throw new Error(response?.message || 'Gagal memperbarui pengguna.');
  } catch (error: any) {
    console.error(`Error saat memperbarui pengguna ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memperbarui pengguna.'
    );
  }
};

/**
 * Menghapus user ke backend route `DELETE /users/:id`
 */
export const deleteUser = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response;
  } catch (error: any) {
    console.error(`Error saat menghapus pengguna ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal menghapus pengguna.'
    );
  }
};
