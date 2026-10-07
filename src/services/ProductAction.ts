import api, { type ApiResponse } from '../lib/api';
import type {
  BackendProductItem,
  ProductItem,
  CategoryItem,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/products';
import { formatDateTimeShort } from '../lib/formatters';

export type { CreateProductPayload, UpdateProductPayload };

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';

/**
 * Mapper dari format BackendProductItem ke format ProductItem Frontend
 */
export const mapBackendProductToProductItem = (
  backendProduct: BackendProductItem,
  categories: CategoryItem[] = []
): ProductItem => {
  let categoryName = 'Tanpa Kategori';
  let categoryIdStr = '';

  if (backendProduct.categoryId) {
    if (typeof backendProduct.categoryId === 'object' && backendProduct.categoryId !== null) {
      categoryName = backendProduct.categoryId.name || 'Tanpa Kategori';
      categoryIdStr = backendProduct.categoryId._id || '';
    } else if (typeof backendProduct.categoryId === 'string') {
      categoryIdStr = backendProduct.categoryId;
      const matched = categories.find((c) => c.id === backendProduct.categoryId);
      if (matched) {
        categoryName = matched.name;
      }
    }
  }

  const productCode =
    backendProduct.code ||
    (backendProduct._id
      ? `PRD-${backendProduct._id.slice(-6).toUpperCase()}`
      : `PRD-${Math.floor(1000 + Math.random() * 9000)}`);

  const updatedDateFormatted = backendProduct.updatedAt
    ? formatDateTimeShort(backendProduct.updatedAt)
    : backendProduct.createdAt
    ? formatDateTimeShort(backendProduct.createdAt)
    : formatDateTimeShort(new Date());

  return {
    id: backendProduct._id,
    name: backendProduct.name,
    code: productCode,
    categoryId: categoryIdStr,
    category: categoryName,
    price: Number(backendProduct.price) || 0,
    stock: Number(backendProduct.stock) || 0,
    unit: backendProduct.unit || 'Pcs',
    updatedAt: updatedDateFormatted,
    image: backendProduct.imageUrl || DEFAULT_PRODUCT_IMAGE,
    imageAlt: backendProduct.name || 'Foto Produk',
    createdAt: backendProduct.createdAt,
  };
};

/**
 * Mengambil seluruh data produk dari backend route `GET /products`
 */
export const getProducts = async (
  categories: CategoryItem[] = []
): Promise<ProductItem[]> => {
  try {
    const response = await api.get<BackendProductItem[]>('/products');
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map((item) =>
        mapBackendProductToProductItem(item, categories)
      );
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat daftar produk dari backend:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat daftar produk.'
    );
  }
};

/**
 * Membuat produk baru ke backend route `POST /products`
 */
export const createProduct = async (
  payload: CreateProductPayload,
  categories: CategoryItem[] = []
): Promise<ProductItem> => {
  try {
    const body = {
      name: payload.name,
      code: payload.code || `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      price: payload.price,
      stock: payload.stock,
      unit: payload.unit || 'Pcs',
      categoryId: payload.categoryId,
      imageUrl: payload.imageUrl || '',
    };
    const response = await api.post<any>('/products', body);
    const productData: BackendProductItem =
      response?.data?.product || response?.data || response;
    if (productData && (productData._id || productData.name)) {
      return mapBackendProductToProductItem(productData, categories);
    }
    return {
      id: 'prod-' + Date.now(),
      name: body.name,
      code: body.code,
      categoryId: body.categoryId,
      category: categories.find((c) => c.id === body.categoryId)?.name || 'Umum',
      price: body.price,
      stock: body.stock,
      unit: body.unit,
      updatedAt: formatDateTimeShort(new Date()),
      image: body.imageUrl || DEFAULT_PRODUCT_IMAGE,
      imageAlt: body.name,
    };
  } catch (error: any) {
    console.error('Error saat menambahkan produk baru:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal menambahkan produk baru.'
    );
  }
};

/**
 * Memperbarui produk ke backend route `PUT /products/:id`
 */
export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
  categories: CategoryItem[] = []
): Promise<ProductItem> => {
  try {
    const body: Record<string, any> = {};
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.code !== undefined) body.code = payload.code;
    if (payload.price !== undefined) body.price = payload.price;
    if (payload.stock !== undefined) body.stock = payload.stock;
    if (payload.unit !== undefined) body.unit = payload.unit;
    if (payload.categoryId !== undefined) body.categoryId = payload.categoryId;
    if (payload.imageUrl !== undefined) body.imageUrl = payload.imageUrl;

    const response = await api.put<any>(`/products/${id}`, body);
    const productData: BackendProductItem =
      response?.data?.product || response?.data || response;
    if (productData && (productData._id || productData.name)) {
      return mapBackendProductToProductItem(productData, categories);
    }
    return {
      id,
      name: payload.name || '',
      code: payload.code || '',
      categoryId: payload.categoryId,
      category: categories.find((c) => c.id === payload.categoryId)?.name || 'Umum',
      price: payload.price || 0,
      stock: payload.stock || 0,
      unit: payload.unit || 'Pcs',
      updatedAt: formatDateTimeShort(new Date()),
      image: payload.imageUrl || DEFAULT_PRODUCT_IMAGE,
      imageAlt: payload.name || 'Produk',
    };
  } catch (error: any) {
    console.error(`Error saat memperbarui produk ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memperbarui produk.'
    );
  }
};

/**
 * Menghapus produk ke backend route `DELETE /products/:id`
 */
export const deleteProduct = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response;
  } catch (error: any) {
    console.error(`Error saat menghapus produk ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal menghapus produk.'
    );
  }
};
