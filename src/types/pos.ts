export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
  image: string;
  imageAlt: string;
  isLowStock?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  sku?: string;
}

export type PaymentMethod = 'tunai' | 'qris' | 'transfer';

export interface ToastInfo {
  show: boolean;
  message: string;
}
