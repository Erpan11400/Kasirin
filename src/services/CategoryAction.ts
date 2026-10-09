import api, { type ApiResponse } from '../lib/api';
import type {
  BackendCategoryItem,
  CategoryItem,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types/products';

/**
 * Helper untuk menentukan emoji dan gaya warna badge berdasarkan nama kategori
 */
export const getCategoryEmojiAndStyle = (
  categoryName: string
): { emoji: string; bgClass: string; textClass: string } => {
  const lower = categoryName.toLowerCase();

  if (lower.includes('mie') || lower.includes('bakso') || lower.includes('noodle')) {
    return { emoji: '🍜', bgClass: 'bg-primary-fixed', textClass: 'text-primary' };
  }
  if (
    lower.includes('minum') ||
    lower.includes('kopi') ||
    lower.includes('teh') ||
    lower.includes('jus') ||
    lower.includes('drink') ||
    lower.includes('boba')
  ) {
    return { emoji: '☕', bgClass: 'bg-surface-container-highest', textClass: 'text-secondary' };
  }
  if (
    lower.includes('makan') ||
    lower.includes('snack') ||
    lower.includes('camilan') ||
    lower.includes('roti')
  ) {
    return { emoji: '🍿', bgClass: 'bg-secondary-container', textClass: 'text-secondary' };
  }
  if (
    lower.includes('sembako') ||
    lower.includes('beras') ||
    lower.includes('minyak') ||
    lower.includes('gula')
  ) {
    return { emoji: '🌾', bgClass: 'bg-primary-fixed', textClass: 'text-primary' };
  }
  if (
    lower.includes('bumbu') ||
    lower.includes('dapur') ||
    lower.includes('garam') ||
    lower.includes('saus')
  ) {
    return { emoji: '🧂', bgClass: 'bg-tertiary-fixed', textClass: 'text-tertiary' };
  }
  if (lower.includes('rokok') || lower.includes('tobacco')) {
    return { emoji: '🚬', bgClass: 'bg-surface-container-highest', textClass: 'text-on-surface' };
  }
  if (lower.includes('buah') || lower.includes('sayur') || lower.includes('fresh')) {
    return { emoji: '🥗', bgClass: 'bg-primary-fixed', textClass: 'text-primary' };
  }
  if (lower.includes('daging') || lower.includes('ayam') || lower.includes('ikan')) {
    return { emoji: '🍗', bgClass: 'bg-secondary-container', textClass: 'text-secondary' };
  }
  if (lower.includes('frozen')) {
    return { emoji: '🧊', bgClass: 'bg-surface-container-highest', textClass: 'text-secondary' };
  }

  return { emoji: '🏷️', bgClass: 'bg-surface-container-high', textClass: 'text-on-surface' };
};

/**
 * Mapper dari format BackendCategoryItem ke format CategoryItem Frontend
 */
export const mapBackendCategoryToCategoryItem = (
  backendCategory: BackendCategoryItem,
  customEmoji?: string
): CategoryItem => {
  const defaultStyle = getCategoryEmojiAndStyle(backendCategory.name || '');

  return {
    id: backendCategory._id,
    name: backendCategory.name,
    emoji: customEmoji || defaultStyle.emoji,
    bgClass: defaultStyle.bgClass,
    textClass: defaultStyle.textClass,
    createdAt: backendCategory.createdAt,
    updatedAt: backendCategory.updatedAt,
  };
};

export type { CreateCategoryPayload, UpdateCategoryPayload };

/**
 * Mengambil seluruh data kategori dari backend route `GET /categories`
 */
export const getCategories = async (): Promise<CategoryItem[]> => {
  try {
    const response = await api.get<BackendCategoryItem[]>('/categories');
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map((item) => mapBackendCategoryToCategoryItem(item));
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat daftar kategori dari backend:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat daftar kategori.'
    );
  }
};

/**
 * Menambahkan kategori baru ke backend route `POST /categories`
 */
export const createCategory = async (
  payload: CreateCategoryPayload,
  customEmoji?: string
): Promise<CategoryItem> => {
  try {
    const response = await api.post<any>('/categories', payload);
    const categoryData: BackendCategoryItem =
      response?.data?.category || response?.data || response;
    if (categoryData && (categoryData._id || categoryData.name || (categoryData as any).id)) {
      return mapBackendCategoryToCategoryItem(categoryData, customEmoji);
    }
    return {
      id: 'cat-' + Date.now(),
      name: payload.name,
      emoji: customEmoji || '🏷️',
    };
  } catch (error: any) {
    console.error('Error saat menambahkan kategori baru:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal menambahkan kategori.'
    );
  }
};

/**
 * Memperbarui kategori ke backend route `PUT /categories/:id`
 */
export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload,
  customEmoji?: string
): Promise<CategoryItem> => {
  try {
    const response = await api.put<any>(`/categories/${id}`, payload);
    const categoryData: BackendCategoryItem =
      response?.data?.category || response?.data || response;
    if (categoryData && (categoryData._id || categoryData.name || (categoryData as any).id)) {
      return mapBackendCategoryToCategoryItem(categoryData, customEmoji);
    }
    return {
      id,
      name: payload.name,
      emoji: customEmoji || '🏷️',
    };
  } catch (error: any) {
    console.error(`Error saat memperbarui kategori ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memperbarui kategori.'
    );
  }
};


/**
 * Menghapus kategori ke backend route `DELETE /categories/:id`
 */
export const deleteCategory = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response;
  } catch (error: any) {
    console.error(`Error saat menghapus kategori ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal menghapus kategori.'
    );
  }
};

