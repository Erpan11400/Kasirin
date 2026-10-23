import React, { useState, useMemo, useEffect } from 'react';
import { Receipt, CalendarDays, CalendarRange } from 'lucide-react';
import type {
  ReportTab,
  PaymentFilter,
  TransactionRecord,
  DailyRecord,
  MonthlyRecord,
  ExportRawDataExcelParams,
} from '../../types/report';
import type { ProductNameItem } from '../../types/products';
import { getProductNames } from '../../services/ProductAction';
import {
  getTransactions,
  getDailyTransactions,
  getMonthlyTransactions,
} from '../../services/TransactionAction';
import { exportRawDataExcel } from '../../services/exportService';
import { Toast, type ToastType } from '../../components/ui/Toast';
import { ReportHeader } from './components/ReportHeader';
import { ReportKpis } from './components/ReportKpis';
import { ReportToolbar } from './components/ReportToolbar';
import { TransactionMatrixTable } from './components/TransactionMatrixTable';
import { DailyReportTable } from './components/DailyReportTable';
import { MonthlyReportView } from './components/MonthlyReportView';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';
import { DateRangeModal } from './components/DateRangeModal';
import { ReportPrintModal } from './components/ReportPrintModal';

// Helper to get today's date formatted as DD/MM/YYYY
const getTodayFormatted = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

export const ReportPage: React.FC = () => {
  // Active Tab State (Laporan Harian is active by default as shown in screenshot)
  const [activeTab, setActiveTab] = useState<ReportTab>('transaksi');

  // Filter States (Default: Hari Ini)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentFilter>('Semua');
  const [startDate, setStartDate] = useState(getTodayFormatted);
  const [endDate, setEndDate] = useState(getTodayFormatted);

  // Products State (diambil dari /products/names)
  const [products, setProducts] = useState<ProductNameItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [showInactiveProducts, setShowInactiveProducts] = useState<boolean>(false);

  // Pisahkan produk aktif & nonaktif
  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive !== false),
    [products]
  );
  const inactiveProducts = useMemo(
    () => products.filter((p) => p.isActive === false),
    [products]
  );
  const visibleProducts = useMemo(
    () => (showInactiveProducts ? products : activeProducts),
    [showInactiveProducts, products, activeProducts]
  );

  // Data States
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [isLoadingDaily, setIsLoadingDaily] = useState<boolean>(false);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState<boolean>(false);

  // Fetch daftar produk dari endpoint GET /products/names
  useEffect(() => {
    let isMounted = true;
    const fetchProductNames = async () => {
      try {
        setIsLoadingProducts(true);
        const data = await getProductNames();
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Gagal memuat daftar nama produk dari backend:', err);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchProductNames();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch riwayat transaksi dari backend GET /transactions dengan filter tanggal
  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true);
        const data = await getTransactions({ startDate, endDate });
        if (isMounted && Array.isArray(data)) {
          const mapped: TransactionRecord[] = data.map((t) => {
            const rawMethod = (t.paymentMethod || '').toLowerCase();
            const paymentMethod: 'Tunai' | 'QRIS' | 'Transfer' =
              rawMethod === 'cash' || rawMethod === 'tunai'
                ? 'Tunai'
                : rawMethod === 'qris'
                ? 'QRIS'
                : 'Transfer';

            const displayDateTime = t.dayDate || '-';

            return {
              id: t._id,
              invoiceId: t.invoiceNumber,
              dateTime: displayDateTime,
              dayDate: t.dayDate,
              paymentMethod,
              total: t.totalAmount,
              paidAmount: t.paidAmount,
              changeAmount: t.changeAmount,
              cashierName:
                typeof t.cashierId === 'object' && t.cashierId !== null
                  ? t.cashierId.name
                  : 'Kasir',
              items: (t.items || []).map((item) => ({
                productId: item.productId,
                name: item.productName,
                qty: item.quantity,
                price: item.price,
              })),
            };
          });
          setTransactions(mapped);
        } else if (isMounted) {
          setTransactions([]);
        }
      } catch (err) {
        console.error('Gagal memuat riwayat transaksi backend:', err);
      } finally {
        if (isMounted) {
          setIsLoadingTransactions(false);
        }
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  // Fetch rekap harian transaksi dari backend GET /transactions/daily dengan filter tanggal
  useEffect(() => {
    let isMounted = true;
    const fetchDaily = async () => {
      try {
        setIsLoadingDaily(true);
        const data = await getDailyTransactions({ startDate, endDate });
        if (isMounted && Array.isArray(data)) {
          setDailyRecords(data);
        } else if (isMounted) {
          setDailyRecords([]);
        }
      } catch (err) {
        console.error('Gagal memuat rekap harian transaksi backend:', err);
      } finally {
        if (isMounted) {
          setIsLoadingDaily(false);
        }
      }
    };

    fetchDaily();
    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  // Fetch rekap bulanan transaksi dari backend GET /transactions/monthly
  useEffect(() => {
    let isMounted = true;
    const fetchMonthly = async () => {
      try {
        setIsLoadingMonthly(true);
        const data = await getMonthlyTransactions();
        if (isMounted && Array.isArray(data)) {
          setMonthlyRecords(data);
        } else if (isMounted) {
          setMonthlyRecords([]);
        }
      } catch (err) {
        console.error('Gagal memuat rekap bulanan transaksi backend:', err);
      } finally {
        if (isMounted) {
          setIsLoadingMonthly(false);
        }
      }
    };

    fetchMonthly();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal & Export States
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
    title?: string;
  } | null>(null);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.invoiceId.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        t.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        t.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );

      const matchPayment =
        selectedPayment === 'Semua' ||
        (selectedPayment === 'Transfer'
          ? t.paymentMethod.startsWith('Transfer')
          : t.paymentMethod === selectedPayment);

      return matchSearch && matchPayment;
    });
  }, [transactions, searchQuery, selectedPayment]);

  // Filtered Daily Records
  const filteredDailyRecords = useMemo(() => {
    return dailyRecords.filter((d) => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        d.dayDate.toLowerCase().includes(query) ||
        (d.dominantMethod?.type || '').toLowerCase().includes(query) ||
        (Array.isArray(d.productSales)
          ? d.productSales.some((p) => p.productName.toLowerCase().includes(query))
          : false);

      const matchPayment =
        selectedPayment === 'Semua' ||
        (selectedPayment === 'Transfer'
          ? d.dominantMethod?.type?.startsWith('Transfer')
          : d.dominantMethod?.type === selectedPayment);

      return matchSearch && matchPayment;
    });
  }, [dailyRecords, searchQuery, selectedPayment]);

  // Filtered Monthly Records (mendukung filter pencarian nama produk atau periode bulan)
  const filteredMonthlyRecords = useMemo(() => {
    return monthlyRecords.filter((m) => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        m.period.toLowerCase().includes(query) ||
        (Array.isArray(m.productSales)
          ? m.productSales.some((p) => p.productName.toLowerCase().includes(query))
          : false);

      return matchSearch;
    });
  }, [monthlyRecords, searchQuery]);

  const handleOpenReceipt = (trx: TransactionRecord) => {
    setSelectedTransaction(trx);
    setIsReceiptModalOpen(true);
  };

  /**
   * Handler ekspor data mentah transaksi ke format spreadsheet Excel (.xlsx)
   * Menggunakan filter tanggal & metode bayar yang aktif di halaman
   */
  const handleExportExcel = async () => {
    if (isExportingExcel) return;

    try {
      setIsExportingExcel(true);

      const params: ExportRawDataExcelParams = {
        paymentMethod: selectedPayment,
      };

      // Hanya sertakan startDate dan endDate jika bukan tab bulanan
      if (activeTab !== 'bulanan') {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const result = await exportRawDataExcel(params);

      setToast({
        show: true,
        type: 'success',
        title: 'Ekspor Berhasil',
        message: `File Excel "${result.filename}" berhasil digenerate dan diunduh.`,
      });
    } catch (err: any) {
      console.error('Gagal mengekspor data Excel:', err);
      setToast({
        show: true,
        type: 'error',
        title: 'Gagal Ekspor Excel',
        message:
          err.message ||
          'Terjadi kesalahan saat memproses ekspor data mentah ke Excel.',
      });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleDateRangeClick = () => {
    setIsDateRangeModalOpen(true);
  };

  const handleApplyDateRange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  return (
    <div className="w-full flex-1">
      <div className="w-full px-4 md:px-6 py-6 space-y-6 max-w-[1680px] mx-auto">
        {/* 1. Header Halaman */}
        <ReportHeader />

        {/* 2. Navigasi 3 Sub-Menu / Tab Utama */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          <div
            className="flex items-center gap-2 p-1.5 bg-surface-container-high rounded-xl shrink-0"
            role="tablist"
          >
            <button
              onClick={() => setActiveTab('transaksi')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${activeTab === 'transaksi'
                ? 'bg-surface-card text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Setiap Transaksi</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'transaksi'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-highest text-on-surface'
                  }`}
              >
                {transactions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('harian')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${activeTab === 'harian'
                ? 'bg-surface-card text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Laporan Harian</span>
            </button>

            <button
              onClick={() => setActiveTab('bulanan')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${activeTab === 'bulanan'
                ? 'bg-surface-card text-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
            >
              <CalendarRange className="w-4 h-4" />
              <span>Laporan Bulanan</span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-text-muted text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span>Mode Audit Finansial Aktif</span>
          </div>
        </div>

        {/* 3. Kartu Ringkasan Metrik (KPI Metric Cards) */}
        <ReportKpis />

        {/* 4. Filter Toolbar */}
        <ReportToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPayment={selectedPayment}
          onPaymentChange={setSelectedPayment}
          startDate={startDate}
          endDate={endDate}
          onDateRangeClick={handleDateRangeClick}
          onExport={handleExportExcel}
          onPrint={() => setIsPrintModalOpen(true)}
          activeTab={activeTab}
          isExportingExcel={isExportingExcel}
          showInactiveProducts={showInactiveProducts}
          onToggleInactiveProducts={() => setShowInactiveProducts((prev) => !prev)}
          inactiveProductsCount={inactiveProducts.length}
        />

        {/* 5. Tab Views */}
        {activeTab === 'transaksi' && (
          <TransactionMatrixTable
            transactions={filteredTransactions}
            onViewReceipt={handleOpenReceipt}
            products={visibleProducts}
            isLoading={isLoadingProducts || isLoadingTransactions}
          />
        )}

        {activeTab === 'harian' && (
          <DailyReportTable
            records={filteredDailyRecords}
            products={visibleProducts}
            isLoading={isLoadingProducts || isLoadingDaily}
          />
        )}

        {activeTab === 'bulanan' && (
          <MonthlyReportView
            records={filteredMonthlyRecords}
            products={visibleProducts}
            isLoading={isLoadingProducts || isLoadingMonthly}
          />
        )}
      </div>

      {/* Detail Struk Digital Modal */}
      <ReceiptDetailModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTransaction}
      />

      {/* Date Range Picker Modal */}
      <DateRangeModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onApply={handleApplyDateRange}
      />

      {/* Pratinjau & Cetak / Download PDF Modal */}
      <ReportPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        activeTab={activeTab}
        startDate={startDate}
        endDate={endDate}
        transactions={filteredTransactions}
        dailyRecords={filteredDailyRecords}
        monthlyRecords={filteredMonthlyRecords}
        products={visibleProducts}
        selectedPayment={selectedPayment}
        searchQuery={searchQuery}
      />

      {/* Toast Notifikasi Feedback Ekspor Data Mentah Excel */}
      <Toast
        show={toast?.show}
        title={toast?.title}
        message={toast?.message}
        type={toast?.type}
        duration={4500}
        position="top-right"
        onClose={() => setToast(null)}
      />
    </div>
  );
};
export default ReportPage;
