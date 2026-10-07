export interface BackendProductCategory {
  _id: string;
  name: string;
}

export interface BackendProductItem {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: string | BackendProductCategory;
  code?: string;
  unit?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  code: string;
  categoryId?: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  createdAt?: string;
}

export interface BackendCategoryItem {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  bgClass?: string;
  textClass?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MainTab = 'produk' | 'kategori';
export type StockFilter = '' | 'tersedia' | 'menipis' | 'habis';

export interface ProductFormData {
  id?: string;
  name: string;
  code?: string;
  categoryId?: string;
  category: string;
  price: number;
  stock: number;
  unit?: string;
  image?: string;
}

export interface CreateProductPayload {
  name: string;
  code?: string;
  price: number;
  stock: number;
  unit?: string;
  categoryId: string;
  imageUrl?: string;
}

export interface UpdateProductPayload {
  name?: string;
  code?: string;
  price?: number;
  stock?: number;
  unit?: string;
  categoryId?: string;
  imageUrl?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
