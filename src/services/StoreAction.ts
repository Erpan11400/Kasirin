import api from '../lib/api';
import type { BackendStoreItem, StoreProfileData, UpdateStorePayload } from '../types/store';

export const EMPTY_STORE_DATA: StoreProfileData = {
  storeName: '',
  category: '',
  phone: '',
  address: '',
  footerNote: '',
  showQris: false,
  logoUrl: '',
};

/**
 * Helper untuk memetakan BackendStoreItem ke format StoreProfileData Frontend
 */
export const mapBackendStoreToStoreProfileData = (
  backendStore?: BackendStoreItem | null
): StoreProfileData => {
  if (!backendStore) return EMPTY_STORE_DATA;

  return {
    id: backendStore._id,
    storeName: backendStore.name || '',
    category: backendStore.businessCategory ?? backendStore.category ?? '',
    phone: backendStore.phone ?? '',
    address: backendStore.address ?? '',
    footerNote: backendStore.footerNote ?? '',
    showQris: typeof backendStore.showQris === 'boolean' ? backendStore.showQris : false,
    logoUrl: backendStore.imageUrl || backendStore.logoUrl || backendStore.logo || '',
  };
};

/**
 * Mengambil informasi toko dari backend route `GET /store`
 */
export const getStoreProfile = async (): Promise<StoreProfileData> => {
  try {
    const response = await api.get<BackendStoreItem | BackendStoreItem[]>('/store');

    if (response && response.data) {
      const storeItem = Array.isArray(response.data) ? response.data[0] : response.data;
      if (storeItem) {
        return mapBackendStoreToStoreProfileData(storeItem);
      }
    }
    return EMPTY_STORE_DATA;
  } catch (error: any) {
    console.error('Gagal memuat profil toko dari backend:', error);
    throw error;
  }
};

/**
 * Memperbarui profil toko ke backend route `PUT /store` atau `PUT /store/:id`
 */
export const updateStoreProfile = async (
  data: StoreProfileData
): Promise<StoreProfileData> => {
  try {
    const payload: UpdateStorePayload = {
      name: data.storeName,
      businessCategory: data.category,
      phone: data.phone,
      address: data.address,
      footerNote: data.footerNote,
      showQris: data.showQris,
    };

    if (data.logoUrl) {
      payload.imageUrl = data.logoUrl;
    }

    const endpoint = data.id ? `/store/${data.id}` : '/store';
    const response = await api.put<BackendStoreItem>(endpoint, payload);

    if (response && response.data) {
      return mapBackendStoreToStoreProfileData(response.data);
    }

    return data;
  } catch (error: any) {
    console.error('Error saat memperbarui profil toko:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal menyimpan pengaturan profil toko.'
    );
  }
};
