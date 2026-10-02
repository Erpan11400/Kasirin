import React, { useState, useMemo } from 'react';
import { Receipt, CalendarDays, CalendarRange } from 'lucide-react';
import type {
  ReportTab,
  PaymentFilter,
  TransactionRecord,
  DailyRecord,
  MonthlyRecord,
} from '../../types/report';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_DAILY_RECORDS,
  INITIAL_MONTHLY_RECORDS,
} from './data/initialReportData';
import { ReportHeader } from './components/ReportHeader';
import { ReportKpis } from './components/ReportKpis';
import { ReportToolbar } from './components/ReportToolbar';
import { TransactionMatrixTable } from './components/TransactionMatrixTable';
import { DailyReportTable } from './components/DailyReportTable';
import { MonthlyReportView } from './components/MonthlyReportView';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';

export const ReportPage: React.FC = () => {
  // Active Tab State (Laporan Harian is active by default as shown in screenshot)
  const [activeTab, setActiveTab] = useState<ReportTab>('transaksi');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentFilter>('Semua');
  const [startDate, setStartDate] = useState('01/09/2026');
  const [endDate, setEndDate] = useState('05/09/2026');

  // Data States
  const [transactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [dailyRecords] = useState<DailyRecord[]>(INITIAL_DAILY_RECORDS);
  const [monthlyRecords] = useState<MonthlyRecord[]>(INITIAL_MONTHLY_RECORDS);

  // Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);

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
      const matchSearch =
        d.dayDate.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        d.dominantMethod.type.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchPayment =
        selectedPayment === 'Semua' || d.dominantMethod.type === selectedPayment;

      return matchSearch && matchPayment;
    });
  }, [dailyRecords, searchQuery, selectedPayment]);

  const handleOpenReceipt = (trx: TransactionRecord) => {
    setSelectedTransaction(trx);
    setIsReceiptModalOpen(true);
  };

  const handleExportAction = () => {
    alert(
      `Mengekspor data transaksi periode ${startDate} - ${endDate} ke format CSV/Excel...`
    );
  };

  const handleDateRangeClick = () => {
    const newStart = window.prompt('Masukkan tanggal awal (DD/MM/YYYY):', startDate);
    if (newStart) setStartDate(newStart);
    const newEnd = window.prompt('Masukkan tanggal akhir (DD/MM/YYYY):', endDate);
    if (newEnd) setEndDate(newEnd);
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
                142
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
          onExport={handleExportAction}
          onPrint={() => window.print()}
        />

        {/* 5. Tab Views */}
        {activeTab === 'transaksi' && (
          <TransactionMatrixTable
            transactions={filteredTransactions}
            onViewReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'harian' && (
          <DailyReportTable records={filteredDailyRecords} />
        )}

        {activeTab === 'bulanan' && (
          <MonthlyReportView records={monthlyRecords} />
        )}
      </div>

      {/* Detail Struk Digital Modal */}
      <ReceiptDetailModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
export default ReportPage;
