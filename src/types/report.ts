import type { ProductNameItem } from './products';

export type ReportTab = 'transaksi' | 'harian' | 'bulanan';

export type PaymentFilter = 'Semua' | 'Tunai' | 'QRIS' | 'Transfer';

export interface TransactionItemDetail {
  productId?: string;
  name: string;
  qty: number;
  price: number;
}

export interface TransactionRecord {
  id: string;
  invoiceId: string;
  dateTime: string;
  dayDate?: string;
  coffeeQty?: number;
  sugarQty?: number;
  oilQty?: number;
  riceQty?: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer' | 'Transfer Bank';
  total: number;
  paidAmount?: number;
  changeAmount?: number;
  cashierName?: string;
  items: TransactionItemDetail[];
}

export interface ProductSaleRecord {
  qty: number;
  price?: number;
}

export interface DailyProductSale {
  productId: string;
  productName: string;
  quantity: number;
  price?: number;
}

export interface DailyRecord {
  id: string;
  dayDate: string;
  trxCount: number;
  coffeeQty?: number;
  sugarQty?: number;
  oilQty?: number;
  riceQty?: number;
  productSales?: Record<string, ProductSaleRecord> | DailyProductSale[];
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
  coffeeQty?: number;
  sugarQty?: number;
  oilQty?: number;
  riceQty?: number;
  productSales?: Record<string, ProductSaleRecord> | DailyProductSale[];
  grossRevenue: number;
  auditStatus?: 'Aktif Berjalan' | 'Audit Selesai';
}

export interface DailyReportTableProps {
  records: DailyRecord[];
  products?: ProductNameItem[];
  isLoading?: boolean;
}

export interface MonthlyReportViewProps {
  records: MonthlyRecord[];
  products?: ProductNameItem[];
  isLoading?: boolean;
}

export interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
}

export interface ReportToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPayment: PaymentFilter;
  onPaymentChange: (pay: PaymentFilter) => void;
  startDate: string;
  endDate: string;
  onDateRangeClick: () => void;
  onExport: () => void;
  onPrint: () => void;
  activeTab?: ReportTab;
}

export interface TransactionMatrixTableProps {
  transactions: TransactionRecord[];
  onViewReceipt: (record: TransactionRecord) => void;
  products?: ProductNameItem[];
  isLoading?: boolean;
}

export interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  onApply: (startDate: string, endDate: string) => void;
}

export interface ReportPrintOptions {
  orientation?: 'portrait' | 'landscape';
  showKpis?: boolean;
  showSignatures?: boolean;
  customNotes?: string;
  documentNumber?: string;
  cashierName?: string;
  approverName?: string;
}

export interface ReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ReportTab;
  startDate: string;
  endDate: string;
  transactions: TransactionRecord[];
  dailyRecords: DailyRecord[];
  monthlyRecords: MonthlyRecord[];
  products: ProductNameItem[];
  selectedPayment: PaymentFilter;
  searchQuery?: string;
}

