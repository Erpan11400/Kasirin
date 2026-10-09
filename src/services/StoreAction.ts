import api from '../lib/api';
import type { BackendStoreItem, StoreProfileData, UpdateStorePayload } from '../types/store';
import { DEFAULT_STORE_DATA } from '../features/store/data/initialStoreData';

/**
 * Helper untuk memetakan BackendStoreItem ke format StoreProfileData Frontend
 */
export const mapBackendStoreToStoreProfileData = (
  backendStore?: BackendStoreItem | null
): StoreProfileData => {
  if (!backendStore) return DEFAULT_STORE_DATA;

  return {
    id: backendStore._id,
    storeName: backendStore.name || DEFAULT_STORE_DATA.storeName,
    category:
      backendStore.businessCategory ?? backendStore.category ?? DEFAULT_STORE_DATA.category,
    phone: backendStore.phone ?? DEFAULT_STORE_DATA.phone,
    address: backendStore.address ?? DEFAULT_STORE_DATA.address,
    footerNote: backendStore.footerNote ?? DEFAULT_STORE_DATA.footerNote,
    showQris:
      typeof backendStore.showQris === 'boolean'
        ? backendStore.showQris
        : DEFAULT_STORE_DATA.showQris,
    logoUrl:
      backendStore.imageUrl ||
      backendStore.logoUrl ||
      backendStore.logo ||
      DEFAULT_STORE_DATA.logoUrl,
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
    return DEFAULT_STORE_DATA;
  } catch (error: any) {
    console.warn('Gagal memuat profil toko dari backend, menggunakan data default/cache:', error);
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
      imageUrl: data.logoUrl,
      footerNote: data.footerNote,
      showQris: data.showQris,
    };

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
