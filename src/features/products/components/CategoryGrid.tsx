import React, { useState, useMemo } from 'react';
import { Pencil, PlusCircle, Trash2, Loader2, Tag, Search, ArrowUpDown, X } from 'lucide-react';
import type { CategoryGridProps, SortOption } from '../../../types/products';
import { Button } from '../../../components/ui/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';

export type { CategoryGridProps, SortOption };

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  productCounts,
  onOpenAddCategory,
  onEditCategory,
  onDeleteCategory,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Filter & Sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let result = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    result.sort((a, b) => {
      const countA = productCounts[a.name] || 0;
      const countB = productCounts[b.name] || 0;

      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'count-desc':
          return countB - countA;
        case 'count-asc':
          return countA - countB;
        default:
          return 0;
      }
    });

    return result;
  }, [categories, searchQuery, sortBy, productCounts]);

  return (
    <div className="space-y-4">
      {/* Unified Search, Filter, & Action Toolbar */}
      <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kategori berdasarkan nama..."
              className="w-full pl-10 pr-9 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-on-surface p-0.5 rounded cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown using UI Select Component */}
          <div className="min-w-[190px]">
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortOption)}
            >
              <SelectTrigger
                size="default"
                className="bg-surface-bg border-border-subtle rounded-lg text-sm text-on-surface h-[42px]"
              >
                <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="w-4 h-4 text-text-muted shrink-0" />
                  <SelectValue placeholder="Urutkan Kategori" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nama (A - Z)</SelectItem>
                <SelectItem value="name-desc">Nama (Z - A)</SelectItem>
                <SelectItem value="count-desc">Produk Terbanyak</SelectItem>
                <SelectItem value="count-asc">Produk Tersedikit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Count Badge */}
          <span className="hidden lg:inline-flex items-center text-xs text-text-muted font-medium whitespace-nowrap bg-surface-bg px-3 py-2.5 rounded-lg border border-border-subtle/60">
            <strong className="text-on-surface mr-1">{filteredAndSortedCategories.length}</strong> dari{' '}
            {categories.length} kategori
          </span>
        </div>


        {/* Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={onOpenAddCategory}
            variant="primary"
            className="w-full sm:w-auto gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </Button>
        </div>
      </div>


      {/* Grid Content */}
      {isLoading ? (
        <div className="bg-surface-card p-12 rounded-xl border border-border-subtle/60 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-text-muted">Memuat data kategori...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-surface-card p-12 rounded-xl border border-border-subtle/60 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-text-muted">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-on-surface">Belum ada kategori</h4>
            <p className="text-xs text-text-muted mt-1">
              Tambahkan kategori baru untuk mulai mengelompokkan produk Anda.
            </p>
          </div>
          <Button
            onClick={onOpenAddCategory}
            variant="primary"
            className="mt-2 gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </Button>
        </div>
      ) : filteredAndSortedCategories.length === 0 ? (
        <div className="bg-surface-card p-10 rounded-xl border border-border-subtle/60 flex flex-col items-center justify-center gap-2 text-center">
          <Search className="w-8 h-8 text-text-muted/60" />
          <h4 className="text-sm font-bold text-on-surface">Kategori Tidak Ditemukan</h4>
          <p className="text-xs text-text-muted">
            Tidak ada kategori yang cocok dengan kata kunci "{searchQuery}".
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="mt-2"
          >
            Reset Pencarian
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedCategories.map((cat) => {
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
                    {cat.emoji || '🏷️'}
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCategory(cat)}
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                    title="Edit Kategori"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {onDeleteCategory && (
                    <button
                      onClick={() => onDeleteCategory(cat)}
                      type="button"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-error/10 hover:text-status-danger transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


