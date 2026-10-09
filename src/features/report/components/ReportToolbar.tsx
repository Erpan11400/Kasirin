import React from 'react';
import { Calendar, Search, SlidersHorizontal, Download, Printer } from 'lucide-react';
import type { PaymentFilter, ReportToolbarProps } from '../../../types/report';

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
}) => {
  const paymentOptions: PaymentFilter[] = ['Semua', 'Tunai', 'QRIS', 'Transfer'];

  return (
    <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Filter */}
        <div className="flex items-center bg-surface-bg px-3 py-2 rounded-lg gap-2 border border-border-subtle/40">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-semibold text-text-muted">Rentang:</span>
          <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded shadow-xs text-on-surface text-[13px] font-bold border border-border-subtle/40">
            {startDate}
          </div>
          <span className="text-xs text-text-muted">s/d</span>
          <div className="flex items-center gap-1.5 bg-surface-card px-2.5 py-1 rounded shadow-xs text-on-surface text-[13px] font-bold border border-border-subtle/40">
            {endDate}
          </div>
          <button
            onClick={onDateRangeClick}
            type="button"
            className="ml-1 text-primary hover:bg-surface-container-high p-1 rounded transition-colors cursor-pointer"
            title="Pilih Kalender"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari No Invoice / Pelanggan..."
            className="w-full pl-9 pr-4 py-2 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Quick filter payment chips */}
        <div className="hidden sm:flex items-center gap-1.5 bg-surface-bg p-1 rounded-lg border border-border-subtle/40">
          {paymentOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onPaymentChange(opt)}
              type="button"
              className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                selectedPayment === opt
                  ? 'bg-surface-card shadow-xs text-on-surface font-semibold'
                  : 'text-text-muted hover:text-on-surface font-medium'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons (Export & Print) */}
      <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
        <button
          onClick={onExport}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-bg text-on-surface hover:bg-surface-container-high border border-border-subtle/60 transition-colors text-sm font-semibold cursor-pointer"
        >
          <Download className="w-4 h-4 text-secondary" />
          <span>Export Excel / CSV</span>
        </button>
        <button
          onClick={onPrint}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all active:scale-[0.98] shadow-xs text-sm font-semibold cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Rekap</span>
        </button>
      </div>
    </div>
  );
};
