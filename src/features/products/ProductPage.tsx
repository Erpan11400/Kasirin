import React, { useState, useMemo, useCallback } from 'react';
import {
  Package,
  Tags,
  Search,
  ChevronDown,
  PlusCircle,
  CheckCircle2,
  Info,
  AlertCircle,
} from 'lucide-react';
import type {
  ProductItem,
  CategoryItem,
  MainTab,
  StockFilter,
  ProductFormData,
  ToastMessage,
} from '../../types/products';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/initialProductList';
import { StatsCards } from './components/StatsCards';
import { ProductTable } from './components/ProductTable';
import { BulkActionBanner } from './components/BulkActionBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductModal } from './components/ProductModal';
import { CategoryModal } from './components/CategoryModal';

export const ProductPage: React.FC = () => {
  // Main Data State
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);

  // Tab & Filters State
  const [activeTab, setActiveTab] = useState<MainTab>('produk');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Toast Notification State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = 'toast-' + Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  // Computed Stats
  const totalSku = products.length;
  const inStockCount = useMemo(
    () => products.filter((p) => p.stock > 5).length,
    [products]
  );
  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 5).length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stock === 0).length,
    [products]
  );

  // Product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        categoryFilter === '' || p.category === categoryFilter;
      let matchesStock = true;
      if (stockFilter === 'tersedia') matchesStock = p.stock > 5;
      else if (stockFilter === 'menipis') matchesStock = p.stock > 0 && p.stock <= 5;
      else if (stockFilter === 'habis') matchesStock = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset pagination if filtered length changes
  const handleFilterChange = (
    updater: () => void
  ) => {
    updater();
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Bulk Selection
  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk yang dipilih?`
      )
    ) {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      showToast(`${selectedIds.length} produk telah dihapus`, 'info');
      setSelectedIds([]);
    }
  };

  const handleBulkCategoryChange = () => {
    if (selectedIds.length === 0) return;
    const newCat = window.prompt(
      `Pilih kategori baru untuk ${selectedIds.length} produk terpilih:\n${categories
        .map((c) => c.name)
        .join(', ')}`,
      categories[0]?.name
    );
    if (newCat && categories.some((c) => c.name.toLowerCase() === newCat.trim().toLowerCase())) {
      const targetCat = categories.find(
        (c) => c.name.toLowerCase() === newCat.trim().toLowerCase()
      )!.name;
      setProducts((prev) =>
        prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, category: targetCat } : p
        )
      );
      showToast(
        `Kategori ${selectedIds.length} produk diubah menjadi "${targetCat}"`,
        'success'
      );
      setSelectedIds([]);
    }
  };

  // Product CRUD
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: ProductItem) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('id-ID', {
      month: 'short',
    })} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (formData.id) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === formData.id
            ? {
                ...p,
                name: formData.name,
                sku: formData.sku,
                category: formData.category,
                price: formData.price,
                stock: formData.stock,
                unit: formData.unit,
                image: formData.image || p.image,
                updatedAt: formattedDate,
              }
            : p
        )
      );
      showToast(`Produk "${formData.name}" berhasil diperbarui!`, 'success');
    } else {
      // Create
      const newProduct: ProductItem = {
        id: 'prod-' + Date.now(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        unit: formData.unit || 'Pcs',
        updatedAt: formattedDate,
        image:
          formData.image ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB4fT0rrfssE6dvNYQwqV0n6WhGlEnpqn8v8OdZgg7UMm6RsDYCUq6WaviS3n_83vN-lznxPObCuf2oIvCyoKUOVwPwU4dXSyleeO_0ZmRMVBgssTPM-OdGCouEYl3Hso7a6ztrnxTXxxsh5pU6KtbkpF2J2mVfCjYPszEUViw7ql5Y71zExPHfOzNkT1m9ElZRHGYzK3K5jvWza8GyusluQUuH1xSnucNN58Vijz-QdS4-D4yNLqEV',
        imageAlt: formData.name,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Produk "${formData.name}" berhasil ditambahkan!`, 'success');
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (product: ProductItem) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus produk "${product.name}" dari katalog?`
      )
    ) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setSelectedIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Produk "${product.name}" telah dihapus`, 'info');
    }
  };

  // Category CRUD
  const handleOpenAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string, emoji: string) => {
    const exists = categories.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      alert(`Kategori "${name}" sudah ada!`);
      return;
    }
    const newCategory: CategoryItem = {
      id: 'cat-' + Date.now(),
      name,
      emoji,
      bgClass: 'bg-surface-container-highest',
      textClass: 'text-on-surface',
    };
    setCategories((prev) => [...prev, newCategory]);
    setIsCategoryModalOpen(false);
    showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
  };

  const handleEditCategory = (cat: CategoryItem) => {
    const newName = window.prompt('Ubah nama kategori:', cat.name);
    if (!newName || !newName.trim()) return;
    const newEmoji = window.prompt('Ubah emoji kategori:', cat.emoji) || cat.emoji;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === cat.id ? { ...c, name: newName.trim(), emoji: newEmoji.trim() } : c
      )
    );
    // Update products using this category
    setProducts((prev) =>
      prev.map((p) =>
        p.category === cat.name ? { ...p, category: newName.trim() } : p
      )
    );
    showToast(`Kategori "${newName}" berhasil diperbarui!`, 'success');
  };

  return (
    <div className="w-full flex-1">
      <div className="w-full px-4 lg:px-6 py-6 max-w-[1680px] mx-auto space-y-6">
        {/* Top Bar / Sub-Header & Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-on-surface">
                📦 Manajemen Produk &amp; Kategori
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              Kelola katalog persediaan, harga jual, dan kategori produk toko.
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-surface-container-high self-start lg:self-auto shadow-xs">
            <button
              onClick={() => setActiveTab('produk')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'produk'
                  ? 'bg-surface-card text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Daftar Produk</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'produk'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kategori')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'kategori'
                  ? 'bg-surface-card text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>Daftar Kategori</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'kategori'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {categories.length}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Stats Metric Cards */}
        <StatsCards
          totalSku={totalSku}
          inStockCount={inStockCount}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
        />

        {/* Section: Daftar Produk */}
        {activeTab === 'produk' && (
          <div className="space-y-4">
            {/* Action Toolbar */}
            <div className="bg-surface-card p-4 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1">
                {/* Search input */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      handleFilterChange(() => setSearchQuery(e.target.value))
                    }
                    placeholder="Cari produk berdasarkan nama atau SKU..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card transition-all"
                  />
                </div>

                {/* Filter Kategori */}
                <div className="relative min-w-[170px]">
                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      handleFilterChange(() => setCategoryFilter(e.target.value))
                    }
                    className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none cursor-pointer transition-all"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                </div>

                {/* Filter Status Stok */}
                <div className="relative min-w-[160px]">
                  <select
                    value={stockFilter}
                    onChange={(e) =>
                      handleFilterChange(() =>
                        setStockFilter(e.target.value as StockFilter)
                      )
                    }
                    className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none cursor-pointer transition-all"
                  >
                    <option value="">Semua Status</option>
                    <option value="tersedia">Tersedia</option>
                    <option value="menipis">Stok Menipis (≤5)</option>
                    <option value="habis">Habis (0)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* <button
                  onClick={handleOpenAddCategory}
                  type="button"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-primary bg-primary-fixed/40 hover:bg-primary-fixed transition-colors active:scale-[0.98] cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Kategori</span>
                </button> */}
                <button
                  onClick={handleOpenCreateProduct}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Tambah Produk</span>
                </button>
              </div>
            </div>

            {/* Bulk Selection Banner */}
            <BulkActionBanner
              selectedCount={selectedIds.length}
              onBulkCategoryChange={handleBulkCategoryChange}
              onBulkDelete={handleBulkDelete}
            />

            {/* Data Table */}
            <ProductTable
              products={paginatedProducts}
              totalFilteredCount={filteredProducts.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              selectedIds={selectedIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectOne={handleToggleSelectOne}
              onEdit={handleOpenEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {/* Section: Daftar Kategori */}
        {activeTab === 'kategori' && (
          <CategoryGrid
            categories={categories}
            productCounts={productCounts}
            onOpenAddCategory={handleOpenAddCategory}
            onEditCategory={handleEditCategory}
          />
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <ProductModal
          key={editingProduct ? editingProduct.id : 'new-product'}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
          categories={categories}
        />
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 pointer-events-auto transition-all transform duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-primary text-on-primary'
                : toast.type === 'info'
                ? 'bg-status-danger text-on-error'
                : 'bg-status-stock-low text-on-primary'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductPage;
