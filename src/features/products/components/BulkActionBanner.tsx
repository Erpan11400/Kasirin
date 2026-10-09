import React from 'react';
import { CheckSquare } from 'lucide-react';
interface BulkActionBannerProps {
  selectedCount: number;
  onBulkCategoryChange: () => void;
  onBulkDelete: () => void;
}

export const BulkActionBanner: React.FC<BulkActionBannerProps> = ({
  selectedCount,
  onBulkCategoryChange,
  onBulkDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-surface-container-high px-4 py-2.5 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
      <div className="flex items-center gap-2 text-on-surface">
        <CheckSquare className="w-5 h-5 text-primary" />
        <span className="text-sm">
          <span className="font-bold text-primary">{selectedCount}</span> produk terpilih
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onBulkCategoryChange}
          type="button"
          className="px-3 py-1.5 rounded-lg bg-surface-card text-on-surface text-xs font-semibold hover:bg-surface-bright shadow-xs transition-colors cursor-pointer"
        >
          Ubah Kategori Massal
        </button>
        <button
          onClick={onBulkDelete}
          type="button"
          className="px-3 py-1.5 rounded-lg bg-error-container text-error text-xs font-semibold hover:bg-status-danger hover:text-on-error transition-colors cursor-pointer"
        >
          Hapus Terpilih
        </button>
      </div>
    </div>
  );
};
