import React from 'react';
import { Barcode, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { ProductTableProps } from '../../../types/products';
import { formatRupiah } from '../../../lib/formatters';
import { Button } from '../../../components/ui/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';

export type { ProductTableProps };

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  totalFilteredCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / itemsPerPage));
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  const startEntry = totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalFilteredCount);

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
              <th className="py-3 px-4 min-w-[200px]">Nama Produk &amp; Kode</th>
              <th className="py-3 px-4 min-w-[140px]">Kategori</th>
              <th className="py-3 px-4 text-right min-w-[120px]">Harga Jual</th>
              <th className="py-3 px-4 text-center min-w-[140px]">Sisa Stok</th>
              <th className="py-3 px-4 min-w-[130px]">Terakhir Diperbarui</th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-on-surface">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-sm font-medium">Memuat katalog produk...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
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

                    {/* Nama & Kode Produk */}
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-semibold text-on-surface">
                        {product.name}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5 font-mono">
                        <Barcode className="w-3.5 h-3.5" />
                        <span>{product.code || '-'}</span>
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
      <div className="w-full px-4 py-3 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle rounded-b-xl">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>
            Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
            <strong className="text-on-surface font-semibold">{totalFilteredCount}</strong> produk
          </span>

          {/* Per Page Selector */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-border-subtle pl-3">
            <span className="text-[11px] text-text-muted shrink-0">Tampilkan:</span>
            <div className="w-20 relative">
              <Select
                value={String(itemsPerPage)}
                onValueChange={(val) => {
                  onItemsPerPageChange?.(Number(val));
                }}
              >
                <SelectTrigger size="sm" className="h-7 text-xs bg-white border-border-subtle rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top" align="start" className="min-w-[5rem] z-50">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pagination Page Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="h-8 w-8 rounded-lg"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;
            return (
              <Button
                key={pageNum}
                type="button"
                variant={isActive ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="h-8 min-w-[32px] px-2 text-xs font-semibold rounded-lg"
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="h-8 w-8 rounded-lg"
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
