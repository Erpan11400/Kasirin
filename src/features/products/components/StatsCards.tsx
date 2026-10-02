import React from 'react';
import { QrCode, CheckCircle2, AlertTriangle, Ban } from 'lucide-react';

interface StatsCardsProps {
  totalSku: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalSku,
  inStockCount,
  lowStockCount,
  outOfStockCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total SKU Card */}
      <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">Total SKU Produk</p>
          <p className="text-2xl font-bold text-on-surface mt-1">{totalSku}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
          <QrCode className="w-5 h-5" />
        </div>
      </div>

      {/* In Stock Card */}
      <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">Stok Tersedia</p>
          <p className="text-2xl font-bold text-secondary mt-1">{inStockCount}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-secondary-container/50 text-secondary flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Low Stock Card */}
      <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">Stok Menipis (≤5)</p>
          <p className="text-2xl font-bold text-status-stock-low mt-1">{lowStockCount}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Out of Stock Card */}
      <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">Stok Habis</p>
          <p className="text-2xl font-bold text-status-danger mt-1">{outOfStockCount}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-error-container text-error flex items-center justify-center">
          <Ban className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
