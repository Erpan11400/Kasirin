import React from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export const ReportHeader: React.FC = () => {
  const { store } = useStore();
  const currentMonthYear = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface-container-lowest p-4 sm:p-6 rounded-xl shadow-sm border border-border-subtle/70">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
            Laporan Penjualan &amp; Keuangan
          </h1>
        </div>
        <p className="text-sm text-text-muted">
          Rekapitulasi penjualan produk, tren omset harian &amp; bulanan{store.storeName ? ` ${store.storeName}` : ''}
        </p>
      </div>

      {/* Quick Action Right Pill */}
      <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-subtle/40">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-xs text-on-surface-variant font-medium">
          Buku Kas Tersinkronisasi • {currentMonthYear}
        </span>
      </div>
    </div>
  );
};
