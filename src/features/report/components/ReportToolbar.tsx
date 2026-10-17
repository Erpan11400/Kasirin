import React from 'react';
import {
  Calendar,
  Search,
  SlidersHorizontal,
  Printer,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import type { PaymentFilter, ReportToolbarProps } from '../../../types/report';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';

export type { ReportToolbarProps };

export const ReportToolbar: React.FC<ReportToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedPayment,
  onPaymentChange,
  startDate,
  endDate,
  onDateRangeClick,
  onExport,
  onPrint,
  activeTab = 'transaksi',
  isExportingExcel = false,
}) => {
  const paymentOptions: PaymentFilter[] = ['Semua', 'Tunai', 'QRIS', 'Transfer'];
  const isMonthly = activeTab === 'bulanan';
  const isDaily = activeTab === 'harian';

  return (
    <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Filter (Hidden on Monthly Tab) */}
        {!isMonthly && (
          <div className="h-10 flex items-center bg-surface-bg px-3 rounded-lg gap-2 border border-border-subtle/40">
            <Calendar className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-xs font-semibold text-text-muted shrink-0">Rentang:</span>
            <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded shadow-xs text-on-surface text-[13px] font-bold border border-border-subtle/40">
              {startDate}
            </div>
            <span className="text-xs text-text-muted">s/d</span>
            <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded shadow-xs text-on-surface text-[13px] font-bold border border-border-subtle/40">
              {endDate}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onDateRangeClick}
              className="h-7 w-7 text-primary hover:text-on-primary hover:bg-primary rounded-md shadow-xs ml-0.5"
              title="Pilih Rentang Tanggal"
              aria-label="Pilih Rentang Tanggal"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Search input with TextField UI Component (Hidden on Monthly Tab) */}
        {!isMonthly && !isDaily && (
          <div className="flex-1 min-w-[220px] max-w-sm">
            <TextField
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari No Invoice / Pelanggan..."
              leftIcon={<Search className="w-4 h-4 text-text-muted" />}
              className="h-10 text-sm rounded-lg bg-surface-bg border-border-subtle/40"
              containerClassName="w-full"
            />
          </div>
        )}

        {/* Quick filter payment chips using Button Component */}
        {!isMonthly && (
          <div className="h-10 flex items-center gap-1 bg-surface-bg px-2 rounded-lg border border-border-subtle/40">
            <span className="text-xs text-text-muted pr-1 font-medium shrink-0">Metode:</span>
            {paymentOptions.map((opt) => {
              const isSelected = selectedPayment === opt;
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={isSelected ? 'primary' : 'ghost'}
                  size="xs"
                  onClick={() => onPaymentChange(opt)}
                  className={`text-xs h-7 px-2.5 rounded-md transition-all ${isSelected
                    ? 'font-semibold shadow-xs'
                    : 'text-text-muted hover:text-on-surface hover:bg-surface-card font-medium'
                    }`}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        )}

      </div>

      {/* Action Buttons (Export Raw Data Excel & Print/PDF) */}
      <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
        <Button
          onClick={onExport}
          type="button"
          variant="outline"
          size="sm"
          disabled={isExportingExcel}
          leftIcon={
            isExportingExcel ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            )
          }
          className="h-10 bg-surface-bg hover:bg-surface-container-high border-border-subtle/60 text-xs font-semibold"
          title="Export seluruh data mentah transaksi ke format spreadsheet Excel (.xlsx)"
        >
          {isExportingExcel ? 'Mengekspor Excel...' : 'Export Data Mentah (Excel)'}
        </Button>
        <Button
          onClick={onPrint}
          type="button"
          variant="primary"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          className="h-10 shadow-xs font-semibold"
          title="Cetak atau Unduh Dokumen Laporan sebagai PDF"
        >
          Cetak / Unduh PDF
        </Button>
      </div>
    </div>
  );
};
