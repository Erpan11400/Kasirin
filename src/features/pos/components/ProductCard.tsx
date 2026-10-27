import React from 'react';
import { Plus, Barcode } from 'lucide-react';
import type { ProductCardProps } from '../../../types/pos';
import { formatRupiah } from '../../../lib/formatters';
import { Button } from '../../../components/ui/Button';

export type { ProductCardProps };

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && (product.isLowStock || product.stock <= 5);

  const handleClickCard = () => {
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <article
      onClick={handleClickCard}
      className={`group bg-surface-card rounded-xl p-3.5 shadow-xs border transition-all duration-200 flex flex-col justify-between select-none ${
        isOutOfStock
          ? 'opacity-65 border-border-subtle bg-surface-container/20 cursor-not-allowed'
          : isLowStock
          ? 'border-amber-300/80 hover:border-amber-400 hover:shadow-md cursor-pointer active:scale-[0.99]'
          : 'border-border-subtle hover:border-primary/50 hover:shadow-md cursor-pointer active:scale-[0.99]'
      }`}
    >
      {/* Header Badges: Category & Stock Status */}
      <div className="flex items-start justify-between gap-1.5 mb-2">
        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/15 truncate max-w-[120px]">
          {product.category || 'Umum'}
        </span>

        {isOutOfStock ? (
          <span className="text-[10px] font-bold text-status-danger bg-status-danger/10 px-2 py-0.5 rounded-md border border-status-danger/20 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-danger"></span>
            Habis
          </span>
        ) : isLowStock ? (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/25 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Sisa {product.stock} {product.unit || ''}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/25 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Stok: {product.stock} {product.unit || ''}
          </span>
        )}
      </div>

      {/* Info: Product Name & Code */}
      <div className="flex-1 flex flex-col justify-start my-1">
        <h3
          className="text-sm font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]"
          title={product.name}
        >
          {product.name}
        </h3>
        <div className="text-[11px] text-text-muted flex items-center gap-1 font-mono mt-1">
          <Barcode className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span className="truncate">{product.code || '-'}</span>
        </div>
      </div>

      {/* Footer: Price & Add Button */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-border-subtle/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Harga</span>
          <span className="text-sm sm:text-base font-extrabold text-primary">
            {formatRupiah(product.price)}
          </span>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="h-8 w-8 p-0 rounded-lg shrink-0 shadow-xs group-hover:scale-105 active:scale-95 transition-transform"
          title={isOutOfStock ? 'Stok produk habis' : 'Tambah ke keranjang'}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </article>
  );
};
