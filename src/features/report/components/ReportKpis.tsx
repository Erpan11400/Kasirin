import React from 'react';
import { Banknote, TrendingUp, Receipt, Flame, ShoppingCart, ArrowUp } from 'lucide-react';

export const ReportKpis: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Pendapatan */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute right-0 top-0 w-24 h-24 bg-primary-container opacity-10 rounded-bl-full pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Total Pendapatan (Bulan Ini)</span>
          <span className="w-8 h-8 rounded-lg bg-primary-container/15 text-primary flex items-center justify-center">
            <Banknote className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold text-on-surface tracking-tight">
            Rp 4.298.000
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center gap-0.5 text-primary text-[11px] font-bold bg-secondary-container/50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5" /> +14%
            </span>
            <span className="text-xs text-text-muted">dibandingkan bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Transaksi */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Total Transaksi Selesai</span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold text-on-surface tracking-tight">
            142 <span className="text-base font-normal text-text-muted">Trx</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center text-secondary text-[11px] font-bold bg-surface-container-high px-1.5 py-0.5 rounded">
              100% Sukses
            </span>
            <span className="text-xs text-text-muted">0 Pembatalan / Refund</span>
          </div>
        </div>
      </div>

      {/* Card 3: Produk Terlaris */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Produk Terlaris</span>
          <span className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div
            className="text-lg font-bold text-on-surface truncate"
            title="Kopi Hitam 200g"
          >
            Kopi Hitam 200g
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-bold bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded-full">
              85 pcs terjual
            </span>
            <span className="text-xs text-text-muted">Kontribusi 29,6%</span>
          </div>
        </div>
      </div>

      {/* Card 4: Nilai Rata-rata Belanja (AOV) */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Rata-rata Nilai Belanja (AOV)</span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold text-on-surface tracking-tight">
            Rp 30.260
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center gap-0.5 text-primary text-[11px] font-bold bg-surface-container-high px-1.5 py-0.5 rounded">
              <ArrowUp className="w-3.5 h-3.5" /> +3.8%
            </span>
            <span className="text-xs text-text-muted">Per struk pembayaran</span>
          </div>
        </div>
      </div>
    </div>
  );
};
