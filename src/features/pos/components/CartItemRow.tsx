import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../../types/pos';
import { formatRupiah } from '../../../lib/formatters';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQty,
  onRemove,
}) => {
  const itemTotal = item.price * item.qty;

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-bg hover:bg-surface-container-low transition-colors">
      <div className="flex-1 min-w-0 pr-2">
        <div className="text-sm font-semibold text-on-surface truncate">
          {item.name}
        </div>
        <div className="text-xs text-text-muted">
          {formatRupiah(item.price)} × {item.qty} ={' '}
          <span className="font-semibold text-on-surface">
            {formatRupiah(itemTotal)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Stepper controls */}
        <div className="flex items-center bg-surface-card rounded-lg p-0.5 shadow-sm border border-border-subtle">
          <button
            onClick={() => onUpdateQty(item.id, -1)}
            className="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
            type="button"
            aria-label="Kurangi jumlah"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-7 text-center text-base font-bold text-on-surface">
            {item.qty}
          </span>
          <button
            onClick={() => onUpdateQty(item.id, 1)}
            className="w-7 h-7 rounded flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
            type="button"
            aria-label="Tambah jumlah"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-lg text-text-muted hover:text-status-danger hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
          type="button"
          title="Hapus item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
