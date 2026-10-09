import React from 'react';
import { Plus } from 'lucide-react';
import type { ProductCardProps } from '../../../types/pos';
import { formatRupiah } from '../../../lib/formatters';
import { Button } from '../../../components/ui/Button';
import { DEFAULT_PRODUCT_IMAGE } from '../../../services/ProductAction';

export type { ProductCardProps };

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && (product.isLowStock || product.stock <= 5);

  return (
    <article
      className={`group bg-surface-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative ${
        isOutOfStock
          ? 'opacity-70 ring-1 ring-border-subtle'
          : isLowStock
          ? 'ring-1 ring-amber-300'
          : ''
      }`}
    >
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
        <img
          className={`w-full h-full object-cover transition-transform duration-300 ${
            !isOutOfStock ? 'group-hover:scale-105' : 'grayscale'
          }`}
          alt={product.imageAlt || product.name}
          src={product.image || DEFAULT_PRODUCT_IMAGE}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
          }}
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[11px] leading-[14px] font-bold bg-surface-card/95 text-primary px-2 py-0.5 rounded shadow-sm">
            {product.category || 'Umum'}
          </span>
        </div>

        {isOutOfStock ? (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <span className="text-[11px] leading-[14px] bg-red-100 text-status-danger px-2 py-0.5 rounded shadow-sm font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-danger"></span>
              Stok Habis
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <span className="text-[11px] leading-[14px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded shadow-sm font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Stok: {product.stock} {product.unit || ''}
            </span>
            <span className="text-[11px] leading-[14px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm">
              Stok Menipis
            </span>
          </div>
        ) : (
          <span className="absolute top-2 right-2 text-[11px] leading-[14px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Stok: {product.stock} {product.unit || ''}
          </span>
        )}
      </div>

      {/* Info & Add Button */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-semibold text-on-surface line-clamp-2" title={product.name}>
            {product.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Kode: {product.code || '-'}</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">
            {formatRupiah(product.price)}
          </span>
          <Button
            variant="primary"
            size="sm"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className="h-9 w-9 p-0 rounded-lg shrink-0"
            title={isOutOfStock ? 'Stok produk habis' : 'Tambah ke keranjang'}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </article>
  );
};
