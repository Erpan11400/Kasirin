import React from 'react';
import {
  Calendar,
  Search,
  SlidersHorizontal,
  Printer,
  FileSpreadsheet,
  Loader2,
  Eye,
  EyeOff,
  CreditCard,
  Banknote,
  QrCode,
  Building2,
} from 'lucide-react';
import type { PaymentFilter, ReportToolbarProps } from '../../../types/report';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';

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
  showInactiveProducts = false,
  onToggleInactiveProducts,
  inactiveProductsCount = 0,
}) => {
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
          <div className="w-44 sm:w-52">
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

        {/* Payment Method Filter Dropdown */}
        {!isMonthly && (
          <div className="w-40 sm:w-44">
            <Select
              value={selectedPayment}
              onValueChange={(val) => onPaymentChange(val as PaymentFilter)}
            >
              <SelectTrigger
                size="default"
                className="h-10 bg-surface-bg border-border-subtle/40 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container-high/40 transition-colors"
                title="Pilih Filter Metode Pembayaran"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <CreditCard className="w-3.5 h-3.5 text-text-muted shrink-0" />
                  <span className="text-text-muted font-normal text-xs">Metode:</span>
                  <SelectValue placeholder="Metode" />
                </div>
              </SelectTrigger>
              <SelectContent side="bottom" align="start" className="min-w-[11rem] z-50">
                <SelectItem value="Semua">
                  <span className="font-medium">Semua Metode</span>
                </SelectItem>
                <SelectItem value="Tunai">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>Tunai</span>
                  </div>
                </SelectItem>
                <SelectItem value="QRIS">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>QRIS</span>
                  </div>
                </SelectItem>
                <SelectItem value="Transfer">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tombol Pintar: Toggle Tampilkan / Sembunyikan Produk Nonaktif */}
        {inactiveProductsCount > 0 && (
          <Button
            type="button"
            variant={showInactiveProducts ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleInactiveProducts}
            leftIcon={
              showInactiveProducts ? (
                <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Eye className="w-4 h-4 text-text-muted" />
              )
            }
            className={`h-10 text-xs px-3 rounded-lg border transition-all ${
              showInactiveProducts
                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20 font-semibold'
                : 'bg-surface-bg hover:bg-surface-container-high border-border-subtle/40 text-text-muted hover:text-on-surface font-medium'
            }`}
            title={
              showInactiveProducts
                ? `Klik untuk menyembunyikan ${inactiveProductsCount} produk nonaktif dari matriks laporan`
                : `Klik untuk menampilkan ${inactiveProductsCount} produk nonaktif yang tersimpan dalam riwayat`
            }
          >
            <span>{showInactiveProducts ? 'Sembunyikan Nonaktif' : 'Produk Nonaktif'}</span>
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                showInactiveProducts
                  ? 'bg-amber-500 text-white dark:bg-amber-600'
                  : 'bg-surface-container-highest text-text-muted'
              }`}
            >
              {inactiveProductsCount}
            </span>
          </Button>
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
