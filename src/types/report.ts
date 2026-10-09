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
  cashierName?: string;
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

export interface DailyReportTableProps {
  records: DailyRecord[];
}

export interface MonthlyReportViewProps {
  records: MonthlyRecord[];
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
}

export interface TransactionMatrixTableProps {
  transactions: TransactionRecord[];
  onViewReceipt: (record: TransactionRecord) => void;
}
