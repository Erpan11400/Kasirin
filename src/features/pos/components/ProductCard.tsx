import React from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '../../../types/pos';
import { formatRupiah } from '../../../lib/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <article
      className={`group bg-surface-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative ${product.isLowStock ? 'ring-1 ring-amber-300' : ''
        }`}
    >
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={product.imageAlt}
          src={product.image}
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[11px] leading-[14px] font-bold bg-surface-card/95 text-primary px-2 py-0.5 rounded shadow-sm">
            {product.category}
          </span>
        </div>

        {product.isLowStock ? (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <span className="text-[11px] leading-[14px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded shadow-sm font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Stok: {product.stock}
            </span>
            <span className="text-[11px] leading-[14px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm">
              Stok Menipis
            </span>
          </div>
        ) : (
          <span className="absolute top-2 right-2 text-[11px] leading-[14px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Stok: {product.stock}
          </span>
        )}
      </div>

      {/* Info & Add Button */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-semibold text-on-surface line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">SKU: {product.sku}</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">
            {formatRupiah(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="w-9 h-9 rounded-lg bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Tambah ke keranjang"
            type="button"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};
