export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  code?: string;
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
  code?: string;
}

export type PaymentMethod = 'tunai' | 'qris' | 'transfer';

export interface ToastInfo {
  show: boolean;
  message: string;
}
