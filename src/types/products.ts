export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  bgClass?: string;
  textClass?: string;
}

export type MainTab = 'produk' | 'kategori';
export type StockFilter = '' | 'tersedia' | 'menipis' | 'habis';

export interface ProductFormData {
  id?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
