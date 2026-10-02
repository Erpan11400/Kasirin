import React from 'react';
import { Pencil, PlusCircle } from 'lucide-react';
import type { CategoryItem } from '../../../types/products';

interface CategoryGridProps {
  categories: CategoryItem[];
  productCounts: Record<string, number>;
  onOpenAddCategory: () => void;
  onEditCategory: (category: CategoryItem) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  productCounts,
  onOpenAddCategory,
  onEditCategory,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-on-surface">
            Daftar Kategori Produk Toko
          </h3>
          <p className="text-xs text-text-muted">
            Kategorisasi memudahkan navigasi saat kasir bertransaksi cepat.
          </p>
        </div>
        <button
          onClick={onOpenAddCategory}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = productCounts[cat.name] || 0;
          return (
            <div
              key={cat.id}
              className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex items-start justify-between transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl ${
                    cat.bgClass || 'bg-surface-container-high'
                  } ${cat.textClass || 'text-on-surface'}`}
                >
                  {cat.emoji}
                </div>
                <div>
                  <h4 className="text-base font-bold text-on-surface">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    {count} Produk Terdaftar
                  </p>
                </div>
              </div>
              <button
                onClick={() => onEditCategory(cat)}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                title="Edit Kategori"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
