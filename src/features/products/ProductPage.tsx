import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Package,
  Tags,
  Search,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import type {
  ProductItem,
  CategoryItem,
  MainTab,
  StockFilter,
  ProductFormData,
} from '../../types/products';
import { StatsCards } from './components/StatsCards';
import { ProductTable } from './components/ProductTable';
import { BulkActionBanner } from './components/BulkActionBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductModal } from './components/ProductModal';
import { CategoryModal } from './components/CategoryModal';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/CategoryAction';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/ProductAction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Toast, type ToastType } from '../../components/ui/Toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/Select';


export const ProductPage: React.FC = () => {
  // Main Data State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState<boolean>(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState<boolean>(false);

  // Tab & Filters State
  const [activeTab, setActiveTab] = useState<MainTab>('produk');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<boolean>(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState<boolean>(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
    },
    []
  );

  // Fetch categories from backend
  const fetchCategoriesData = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const data = await getCategories();
      setCategories(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Gagal mengambil kategori:', error);
      showToast(error.message || 'Gagal memuat kategori dari backend', 'error');
      return [];
    } finally {
      setIsCategoriesLoading(false);
    }
  }, [showToast]);

  // Fetch products from backend
  const fetchProductsData = useCallback(
    async (cats?: CategoryItem[]) => {
      try {
        setIsProductsLoading(true);
        const activeCategories = cats ?? categories;
        const data = await getProducts(activeCategories);
        setProducts(data || []);
      } catch (error: any) {
        console.error('Gagal mengambil produk:', error);
        showToast(error.message || 'Gagal memuat daftar produk dari backend', 'error');
      } finally {
        setIsProductsLoading(false);
      }
    },
    [categories, showToast]
  );

  useEffect(() => {
    const initData = async () => {
      const cats = await fetchCategoriesData();
      await fetchProductsData(cats);
    };
    initData();
  }, []);

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
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        (p.code && p.code.toLowerCase().includes(query));
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

  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      setIsSubmittingProduct(true);
      const productCode = formData.code;
      if (formData.id) {
        // Edit product
        await updateProduct(
          formData.id,
          {
            name: formData.name,
            code: productCode,
            categoryId: formData.categoryId,
            price: formData.price,
            stock: formData.stock,
            unit: formData.unit,
            imageUrl: formData.image,
          },
          categories
        );
        showToast(`Produk "${formData.name}" berhasil diperbarui!`, 'success');
      } else {
        // Create product
        await createProduct(
          {
            name: formData.name,
            code: productCode,
            categoryId: formData.categoryId || (categories[0]?.id ?? ''),
            price: formData.price,
            stock: formData.stock,
            unit: formData.unit,
            imageUrl: formData.image,
          },
          categories
        );
        showToast(`Produk "${formData.name}" berhasil ditambahkan!`, 'success');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await fetchProductsData();
    } catch (error: any) {
      console.error('Error saat menyimpan produk:', error);
      showToast(error.message || 'Gagal menyimpan produk.', 'error');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = (product: ProductItem) => {
    setProductToDelete(product);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeletingProduct(true);
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setSelectedIds((prev) => prev.filter((id) => id !== productToDelete.id));
      await fetchProductsData();
      showToast(`Produk "${productToDelete.name}" telah dihapus`, 'info');
    } catch (error: any) {
      console.error('Error saat menghapus produk:', error);
      showToast(error.message || 'Gagal menghapus produk.', 'error');
    } finally {
      setIsDeletingProduct(false);
    }
  };


  // Category CRUD
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string, emoji: string) => {
    try {
      setIsSubmittingCategory(true);
      if (editingCategory) {
        // Edit existing category via API
        await updateCategory(editingCategory.id, { name }, emoji);
        // Update product category names in memory if changed
        if (editingCategory.name !== name) {
          setProducts((prev) =>
            prev.map((p) =>
              p.category === editingCategory.name ? { ...p, category: name } : p
            )
          );
        }
        showToast(`Kategori "${name}" berhasil diperbarui!`, 'success');
      } else {
        // Create new category via API
        await createCategory({ name }, emoji);
        showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await fetchCategoriesData();
    } catch (error: any) {
      console.error('Error saat menyimpan kategori:', error);
      showToast(error.message || 'Gagal menyimpan kategori.', 'error');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = (cat: CategoryItem) => {
    setCategoryToDelete(cat);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeletingCategory(true);
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      await fetchCategoriesData();
      showToast(`Kategori "${categoryToDelete.name}" berhasil dihapus`, 'info');
    } catch (error: any) {
      console.error('Error saat menghapus kategori:', error);
      showToast(error.message || 'Gagal menghapus kategori.', 'error');
    } finally {
      setIsDeletingCategory(false);
    }
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
                    placeholder="Cari produk berdasarkan nama, kode, atau SKU..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card transition-all"
                  />
                </div>

                {/* Filter Kategori */}
                <div className="min-w-[170px]">
                  <Select
                    value={categoryFilter || 'all'}
                    onValueChange={(val) =>
                      handleFilterChange(() =>
                        setCategoryFilter(val === 'all' ? '' : val)
                      )
                    }
                  >
                    <SelectTrigger
                      size="default"
                      className="bg-surface-bg border-border-subtle rounded-lg text-sm text-on-surface h-[42px]"
                    >
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Status Stok */}
                <div className="min-w-[160px]">
                  <Select
                    value={stockFilter || 'all'}
                    onValueChange={(val) =>
                      handleFilterChange(() =>
                        setStockFilter(val === 'all' ? '' : (val as StockFilter))
                      )
                    }
                  >
                    <SelectTrigger
                      size="default"
                      className="bg-surface-bg border-border-subtle rounded-lg text-sm text-on-surface h-[42px]"
                    >
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="tersedia">Tersedia</SelectItem>
                      <SelectItem value="menipis">Stok Menipis (≤5)</SelectItem>
                      <SelectItem value="habis">Habis (0)</SelectItem>
                    </SelectContent>
                  </Select>
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
              onItemsPerPageChange={(limit) => {
                setItemsPerPage(limit);
                setCurrentPage(1);
              }}
              selectedIds={selectedIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectOne={handleToggleSelectOne}
              onEdit={handleOpenEditProduct}
              onDelete={handleDeleteProduct}
              isLoading={isProductsLoading}
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
            onDeleteCategory={handleDeleteCategory}
            isLoading={isCategoriesLoading}
          />
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <ProductModal
          key={editingProduct ? editingProduct.id : 'new-product'}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
          categories={categories}
          isSubmitting={isSubmittingProduct}
        />
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <CategoryModal
          key={editingCategory ? editingCategory.id : 'new-category'}
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          editingCategory={editingCategory}
          isSubmitting={isSubmittingCategory}
        />
      )}

      {/* Delete Product Confirmation Dialog */}
      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && !isDeletingProduct && setProductToDelete(null)}
      >
        <DialogContent size="sm" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center text-status-danger shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-base font-bold text-on-surface">
                Hapus Produk
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Tindakan ini akan menghapus produk dari katalog inventaris toko.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogBody className="p-6">
            <p className="text-sm text-on-surface leading-relaxed">
              Apakah Anda yakin ingin menghapus produk{' '}
              <span className="font-bold text-on-surface">"{productToDelete?.name}"</span>?
            </p>
          </DialogBody>
          <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingProduct}
              onClick={() => setProductToDelete(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeletingProduct}
              onClick={handleConfirmDeleteProduct}
              className="gap-2"
            >
              <span>Hapus Produk</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && !isDeletingCategory && setCategoryToDelete(null)}
      >
        <DialogContent size="sm" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center text-status-danger shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-base font-bold text-on-surface">
                Hapus Kategori
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Tindakan ini akan menghapus kategori dari katalog.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogBody className="p-6">
            <p className="text-sm text-on-surface leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori{' '}
              <span className="font-bold text-on-surface">"{categoryToDelete?.name}"</span>?
            </p>
          </DialogBody>
          <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingCategory}
              onClick={() => setCategoryToDelete(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeletingCategory}
              onClick={handleConfirmDeleteCategory}
              className="gap-2"
            >
              <span>Hapus Kategori</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standard Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
          position="bottom-right"
        />
      )}

    </div>
  );
};
export default ProductPage;

