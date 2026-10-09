import api, { type ApiResponse } from '../lib/api';
import type {
  BackendRoleItem,
  RoleItem,
  RolePermissions,
  CreateRolePayload,
  UpdateRolePayload,
} from '../types/users';

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  categories: { view: false, create: false, update: false, delete: false },
  products: { view: false, create: false, update: false, delete: false },
  store: { view: false, create: false, update: false, delete: false },
  transactions: { view: false, create: false, update: false, delete: false },
  roles: { view: false, create: false, update: false, delete: false },
  users: { view: false, create: false, update: false, delete: false },
};

/**
 * Helper untuk menentukan icon role berdasarkan namanya
 */
export const getRoleIconName = (roleName: string): string => {
  const lower = roleName.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('kasir') || lower.includes('pos') || lower.includes('transaksi')) return 'pos';
  if (lower.includes('manajer') || lower.includes('toko') || lower.includes('store')) return 'store';
  return 'custom';
};

/**
 * Mapper dari format BackendRoleItem ke RoleItem Frontend
 */
export const mapBackendRoleToRoleItem = (
  backendRole: BackendRoleItem,
  userCount = 0
): RoleItem => {
  // Merge dengan default permissions agar semua key (categories, products, store, transactions, roles, users) selalu ada
  const mergedPermissions: RolePermissions = {
    categories: { ...DEFAULT_ROLE_PERMISSIONS.categories, ...(backendRole.permissions?.categories || {}) },
    products: { ...DEFAULT_ROLE_PERMISSIONS.products, ...(backendRole.permissions?.products || {}) },
    store: { ...DEFAULT_ROLE_PERMISSIONS.store, ...(backendRole.permissions?.store || {}) },
    transactions: { ...DEFAULT_ROLE_PERMISSIONS.transactions, ...(backendRole.permissions?.transactions || {}) },
    roles: { ...DEFAULT_ROLE_PERMISSIONS.roles, ...(backendRole.permissions?.roles || {}) },
    users: { ...DEFAULT_ROLE_PERMISSIONS.users, ...(backendRole.permissions?.users || {}) },
  };

  return {
    id: backendRole._id,
    name: backendRole.name,
    description: backendRole.description || (backendRole.isSystemRole ? 'Peran bawaan sistem dengan akses penuh' : ''),
    type: backendRole.isSystemRole ? 'system' : 'active',
    isSystemRole: Boolean(backendRole.isSystemRole),
    userCount: userCount,
    iconName: getRoleIconName(backendRole.name),
    permissions: mergedPermissions,
    createdAt: backendRole.createdAt,
    updatedAt: backendRole.updatedAt,
  };
};

// export type { CreateRolePayload, UpdateRolePayload };

/**
 * Mengambil seluruh data role dari backend route `GET /roles`
 */
export const getRoles = async (): Promise<RoleItem[]> => {
  try {
    const response = await api.get<BackendRoleItem[]>('/roles');
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map((item) => mapBackendRoleToRoleItem(item));
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat daftar role dari backend:', error);
    throw new Error(error?.response?.data?.message || error?.message || 'Gagal memuat daftar role.');
  }
};

/**
 * Membuat role baru ke backend route `POST /roles`
 */
export const createRole = async (payload: CreateRolePayload): Promise<RoleItem> => {
  try {
    const response = await api.post<BackendRoleItem>('/roles', payload);
    if (response && response.data) {
      return mapBackendRoleToRoleItem(response.data);
    }
    throw new Error(response?.message || 'Gagal membuat role.');
  } catch (error: any) {
    console.error('Error saat membuat role baru:', error);
    throw new Error(error?.response?.data?.message || error?.message || 'Gagal membuat role.');
  }
};

/**
 * Memperbarui role ke backend route `PUT /roles/:id`
 */
export const updateRole = async (id: string, payload: UpdateRolePayload): Promise<RoleItem> => {
  try {
    const response = await api.put<BackendRoleItem>(`/roles/${id}`, payload);
    if (response && response.data) {
      return mapBackendRoleToRoleItem(response.data);
    }
    throw new Error(response?.message || 'Gagal memperbarui role.');
  } catch (error: any) {
    console.error(`Error saat memperbarui role ${id}:`, error);
    throw new Error(error?.response?.data?.message || error?.message || 'Gagal memperbarui role.');
  }
};

/**
 * Menghapus role ke backend route `DELETE /roles/:id`
 */
export const deleteRole = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete(`/roles/${id}`);
    return response;
  } catch (error: any) {
    console.error(`Error saat menghapus role ${id}:`, error);
    throw new Error(error?.response?.data?.message || error?.message || 'Gagal menghapus role.');
  }
};
