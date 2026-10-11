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
  dayDate: string;
  __v?: number;
}

export interface TransactionKpiRevenue {
  total: number;
  lastMonth: number;
  difference: number;
  growthPercentage: number;
}

export interface TransactionKpiTransactions {
  total: number;
  lastMonth: number;
  difference: number;
  growthPercentage: number;
  period: string;
}

export interface TransactionKpiTopProduct {
  id: string;
  name: string;
  soldCount: number;
  totalItemsSold: number;
}

export interface TransactionKpiAov {
  currentAverage: number;
  difference: number;
}

export interface TransactionKpiData {
  revenue: TransactionKpiRevenue;
  transactions: TransactionKpiTransactions;
  topProduct: TransactionKpiTopProduct | null;
  aov: TransactionKpiAov;
}

export interface GetTransactionsFilter {
  startDate?: string | Date;
  endDate?: string | Date;
}

export type GetTransactionsParams = GetTransactionsFilter;
