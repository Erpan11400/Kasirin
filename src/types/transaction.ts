export interface CreateTransactionItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateTransactionPayload {
  paymentMethod: 'cash' | 'qris' | 'transfer';
  paidAmount: number;
  items: CreateTransactionItemPayload[];
}

export interface BackendTransactionItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  _id?: string;
}

export interface BackendTransactionCashier {
  _id: string;
  name: string;
  email: string;
}

export interface BackendTransactionResponse {
  _id: string;
  invoiceNumber: string;
  items: BackendTransactionItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'qris' | 'transfer';
  paidAmount: number;
  changeAmount: number;
  cashierId: BackendTransactionCashier | string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
