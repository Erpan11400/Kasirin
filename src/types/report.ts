export type ReportTab = 'transaksi' | 'harian' | 'bulanan';

export type PaymentFilter = 'Semua' | 'Tunai' | 'QRIS' | 'Transfer';

export interface TransactionItemDetail {
  name: string;
  qty: number;
  price: number;
}

export interface TransactionRecord {
  id: string;
  invoiceId: string;
  dateTime: string;
  coffeeQty: number;
  sugarQty: number;
  oilQty: number;
  riceQty: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer' | 'Transfer Bank';
  total: number;
  items: TransactionItemDetail[];
}

export interface DailyRecord {
  id: string;
  dayDate: string;
  trxCount: number;
  coffeeQty: number;
  sugarQty: number;
  oilQty: number;
  riceQty: number;
  dominantMethod: {
    percentage: number;
    type: 'Tunai' | 'QRIS' | 'Transfer';
  };
  totalRevenue: number;
}

export interface MonthlyRecord {
  id: string;
  period: string;
  isCurrent?: boolean;
  trxCount: number;
  coffeeQty: number;
  sugarQty: number;
  oilQty: number;
  riceQty: number;
  grossRevenue: number;
  auditStatus: 'Aktif Berjalan' | 'Audit Selesai';
}
