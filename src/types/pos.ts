export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  code?: string;
  stock: number;
  unit?: string;
  image: string;
  imageAlt: string;
  isLowStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanMock: () => void;
  mockProductName?: string;
}

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  cashGiven: number;
  change: number;
  paymentMethod: PaymentMethod;
  onPrint: () => void;
  invoiceNumber?: string;
}
