import React from 'react';
import { Barcode, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductItem } from '../../../types/products';
import { formatRupiah } from '../../../lib/formatters';

interface ProductTableProps {
  products: ProductItem[];
  totalFilteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  selectedIds: string[];
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectOne: (id: string) => void;
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  totalFilteredCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onEdit,
  onDelete,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / itemsPerPage));
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalFilteredCount);

  return (
    <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface-bg text-text-muted text-xs uppercase tracking-wider border-b border-border-subtle/60">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 w-16">Foto</th>
              <th className="py-3 px-4 min-w-[200px]">Nama Produk &amp; SKU</th>
              <th className="py-3 px-4 min-w-[140px]">Kategori</th>
              <th className="py-3 px-4 text-right min-w-[120px]">Harga Jual</th>
              <th className="py-3 px-4 text-center min-w-[140px]">Sisa Stok</th>
              <th className="py-3 px-4 min-w-[130px]">Terakhir Diperbarui</th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-on-surface">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-text-muted">
                  Tidak ada produk yang ditemukan.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= 5;

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors group hover:bg-surface-bg/80 ${isLowStock ? 'bg-tertiary-fixed/10' : ''
                      } ${isOutOfStock ? 'opacity-65' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectOne(product.id)}
                        className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Foto */}
                    <td className="py-3.5 px-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shadow-xs flex items-center justify-center relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-on-surface/50 flex items-center justify-center">
                            <span className="text-[9px] text-on-error bg-status-danger px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                              HABIS
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Nama & SKU */}
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-semibold text-on-surface">
                        {product.name}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5 font-mono">
                        <Barcode className="w-3.5 h-3.5" />
                        <span>{product.sku}</span>
                      </div>
                    </td>

                    {/* Kategori Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${product.category === 'Sembako'
                            ? 'bg-primary-fixed text-on-primary-fixed-variant'
                            : product.category === 'Bumbu & Dapur'
                              ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                              : 'bg-surface-container-highest text-on-surface'
                          }`}
                      >
                        {product.category}
                      </span>
                    </td>

                    {/* Harga Jual */}
                    <td className="py-3.5 px-4 text-right text-sm font-bold text-on-surface">
                      {formatRupiah(product.price)}
                    </td>

                    {/* Sisa Stok */}
                    <td className="py-3.5 px-4 text-center">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-error-container text-error">
                          <span className="w-2 h-2 rounded-full bg-status-danger"></span>
                          0 {product.unit} (Habis)
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-tertiary-fixed text-tertiary">
                          <span className="w-2 h-2 rounded-full bg-status-stock-low animate-pulse"></span>
                          {product.stock} {product.unit} (Menipis)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container/40 text-on-secondary-container">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          {product.stock} {product.unit}
                        </span>
                      )}
                    </td>

                    {/* Terakhir Diperbarui */}
                    <td className="py-3.5 px-4 text-xs text-text-muted whitespace-nowrap">
                      {product.updatedAt}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(product)}
                          type="button"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
                          title="Edit Produk"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          type="button"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-error-container/40 hover:bg-error-container text-error transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer: Pagination & Counter */}
      <div className="p-4 bg-surface-bg/60 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-text-muted">
          Menampilkan{' '}
          <span className="font-semibold text-on-surface">
            {totalFilteredCount === 0 ? 0 : `${startIndex} - ${endIndex}`}
          </span>{' '}
          dari <span className="font-semibold text-on-surface">{totalFilteredCount}</span>{' '}
          total produk
        </div>

        {/* Pagination Buttons */}
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted bg-surface-card hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:hover:bg-surface-card cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              type="button"
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${currentPage === pageNum
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-card text-on-surface hover:bg-surface-container-high'
                }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface bg-surface-card hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:hover:bg-surface-card cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
