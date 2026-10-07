import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../../types/pos';
import { formatRupiah } from '../../../lib/formatters';
import { Button } from '../../../components/ui/Button';

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
        <div className="flex items-center bg-surface-card rounded-lg p-0.5 shadow-xs border border-border-subtle">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQty(item.id, -1)}
            className="w-7 h-7 p-0 rounded text-on-surface hover:bg-surface-container active:scale-95"
            aria-label="Kurangi jumlah"
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="w-7 text-center text-sm font-bold text-on-surface">
            {item.qty}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQty(item.id, 1)}
            className="w-7 h-7 p-0 rounded text-on-surface hover:bg-surface-container active:scale-95"
            aria-label="Tambah jumlah"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 p-0 rounded-lg text-text-muted hover:text-status-danger hover:bg-red-50"
          title="Hapus item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
