import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Package,
  Tags,
  Search,
  PlusCircle,
  Archive,
  CheckCircle,
} from 'lucide-react';
import type {
  ProductItem,
  CategoryItem,
  MainTab,
  ProductStatusTab,
  CategoryStatusTab,
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
  toggleCategoryStatus,
} from '../../services/CategoryAction';
import {
  getProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
} from '../../services/ProductAction';
import { Toast, type ToastType } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/Select';

export const ProductPage: React.FC = () => {
  // Authorization
  const { hasPermission } = useAuth();
  const canViewProducts = hasPermission('products:view');
  const canCreateProduct = hasPermission('products:create');
  const canUpdateProduct = hasPermission('products:update');
  const canViewCategories = hasPermission('categories:view');
  const canCreateCategory = hasPermission('categories:create');
  const canUpdateCategory = hasPermission('categories:update');

  // Main Data State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState<boolean>(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState<boolean>(false);

  // Tab & Sub-tab States
  const [activeTab, setActiveTab] = useState<MainTab>(
    !canViewProducts && canViewCategories ? 'kategori' : 'produk'
  );
  const [productStatusTab, setProductStatusTab] = useState<ProductStatusTab>('active');
  const [categoryStatusTab, setCategoryStatusTab] = useState<CategoryStatusTab>('active');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

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

  // Split Active vs Inactive Items
  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive !== false),
    [products]
  );
  const inactiveProducts = useMemo(
    () => products.filter((p) => p.isActive === false),
    [products]
  );

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive !== false),
    [categories]
  );
  const inactiveCategories = useMemo(
    () => categories.filter((c) => c.isActive === false),
    [categories]
  );

  // Computed Stats (based on active products)
  const totalSku = activeProducts.length;
  const inStockCount = useMemo(
    () => activeProducts.filter((p) => p.stock > 5).length,
    [activeProducts]
  );
  const lowStockCount = useMemo(
    () => activeProducts.filter((p) => p.stock > 0 && p.stock <= 5).length,
    [activeProducts]
  );
  const outOfStockCount = useMemo(
    () => activeProducts.filter((p) => p.stock === 0).length,
    [activeProducts]
  );

  // Product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Current Products according to productStatusTab
  const currentProductPool = productStatusTab === 'active' ? activeProducts : inactiveProducts;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return currentProductPool.filter((p) => {
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
  }, [currentProductPool, searchQuery, categoryFilter, stockFilter]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset pagination if filtered length changes
  const handleFilterChange = (updater: () => void) => {
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

  const handleBulkToggleStatus = async () => {
    if (selectedIds.length === 0) return;
    const isActivating = productStatusTab === 'inactive';
    const actionText = isActivating ? 'mengaktifkan kembali' : 'menonaktifkan';

    if (
      window.confirm(
        `Apakah Anda yakin ingin ${actionText} ${selectedIds.length} produk yang dipilih?`
      )
    ) {
      try {
        setIsProductsLoading(true);
        await Promise.all(
          selectedIds.map((id) => toggleProductStatus(id, isActivating, categories))
        );
        showToast(
          `${selectedIds.length} produk berhasil ${
            isActivating ? 'diaktifkan kembali' : 'dinonaktifkan'
          }!`,
          'success'
        );
        setSelectedIds([]);
        await fetchProductsData();
      } catch (error: any) {
        console.error('Error saat mengubah status produk massal:', error);
        showToast(error.message || 'Gagal mengubah status produk massal.', 'error');
      } finally {
        setIsProductsLoading(false);
      }
    }
  };

  const handleBulkCategoryChange = async () => {
    if (selectedIds.length === 0) return;
    const newCat = window.prompt(
      `Pilih kategori baru untuk ${selectedIds.length} produk terpilih:\n${activeCategories
        .map((c) => c.name)
        .join(', ')}`,
      activeCategories[0]?.name
    );
    if (newCat && categories.some((c) => c.name.toLowerCase() === newCat.trim().toLowerCase())) {
      const targetCat = categories.find(
        (c) => c.name.toLowerCase() === newCat.trim().toLowerCase()
      )!;

      try {
        setIsProductsLoading(true);
        await Promise.all(
          selectedIds.map((id) =>
            updateProduct(id, { categoryId: targetCat.id }, categories)
          )
        );
        showToast(
          `Kategori ${selectedIds.length} produk diubah menjadi "${targetCat.name}"`,
          'success'
        );
        setSelectedIds([]);
        await fetchProductsData();
      } catch (error: any) {
        console.error('Error update kategori massal:', error);
        showToast(error.message || 'Gagal mengubah kategori massal.', 'error');
      } finally {
        setIsProductsLoading(false);
      }
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
            isActive: formData.isActive,
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

  const handleToggleProductStatus = async (product: ProductItem, newStatus: boolean) => {
    try {
      setIsSubmittingProduct(true);
      await toggleProductStatus(product.id, newStatus, categories);
      showToast(
        `Produk "${product.name}" berhasil ${newStatus ? 'diaktifkan kembali' : 'dinonaktifkan'}!`,
        'success'
      );
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await fetchProductsData();
    } catch (error: any) {
      console.error('Error saat mengubah status produk:', error);
      showToast(error.message || 'Gagal mengubah status produk.', 'error');
    } finally {
      setIsSubmittingProduct(false);
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

  const handleSaveCategory = async (name: string) => {
    try {
      setIsSubmittingCategory(true);
      if (editingCategory) {
        // Edit existing category via API
        await updateCategory(editingCategory.id, { name });
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
        await createCategory({ name });
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

  const handleToggleCategoryStatus = async (category: CategoryItem, newStatus: boolean) => {
    try {
      setIsSubmittingCategory(true);
      await toggleCategoryStatus(category.id, newStatus);
      showToast(
        `Kategori "${category.name}" berhasil ${
          newStatus ? 'diaktifkan kembali' : 'dinonaktifkan'
        }!`,
        'success'
      );
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await fetchCategoriesData();
    } catch (error: any) {
      console.error('Error saat mengubah status kategori:', error);
      showToast(error.message || 'Gagal mengubah status kategori.', 'error');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  return (
    <div className="w-full flex-1">
      <div className="w-full px-4 lg:px-6 py-6 max-w-[1680px] mx-auto space-y-6">
        {/* Top Bar / Sub-Header & Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-surface-container-lowest p-4 sm:p-6 rounded-xl shadow-sm border border-border-subtle/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
                📦 Manajemen Produk &amp; Kategori
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              Kelola katalog persediaan, harga jual, dan kategori produk toko.
            </p>
          </div>

          {/* Segmented Tab Switcher (Produk / Kategori) */}
          <div className="inline-flex p-1 rounded-xl bg-surface-container-high self-start lg:self-auto shadow-xs">
            {canViewProducts && (
              <button
                onClick={() => {
                  setActiveTab('produk');
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
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
            )}

            {canViewCategories && (
              <button
                onClick={() => {
                  setActiveTab('kategori');
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
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
            )}
          </div>
        </div>

        {/* Quick Stats Metric Cards */}
        <StatsCards
          totalSku={totalSku}
          inStockCount={inStockCount}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
        />

        {/* ========================================================= */}
        {/* SECTION: PRODUK                                          */}
        {/* ========================================================= */}
        {activeTab === 'produk' && canViewProducts && (
          <div className="space-y-4">
            {/* Sub-tab: Aktif vs Nonaktif */}
            <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2">
              <div className="inline-flex p-1 rounded-lg bg-surface-container-high/60 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setProductStatusTab('active');
                    setCurrentPage(1);
                    setSelectedIds([]);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    productStatusTab === 'active'
                      ? 'bg-surface-card text-primary shadow-xs'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Produk Aktif</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-primary/10 text-primary">
                    {activeProducts.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProductStatusTab('inactive');
                    setCurrentPage(1);
                    setSelectedIds([]);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    productStatusTab === 'inactive'
                      ? 'bg-surface-card text-on-surface shadow-xs'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  <span>Produk Nonaktif</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-surface-container-highest text-text-muted">
                    {inactiveProducts.length}
                  </span>
                </button>
              </div>

              {productStatusTab === 'inactive' && (
                <span className="text-xs text-text-muted hidden sm:inline">
                  Tabel produk yang dinonaktifkan dari katalog penjualan.
                </span>
              )}
            </div>

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
                    placeholder={`Cari produk ${
                      productStatusTab === 'inactive' ? 'non-aktif ' : ''
                    }berdasarkan nama, kode, atau SKU...`}
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

              {/* Action Buttons (hanya untuk tab produk aktif) */}
              {productStatusTab === 'active' && canCreateProduct && (
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleOpenCreateProduct}
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Tambah Produk</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Selection Banner */}
            <BulkActionBanner
              selectedCount={selectedIds.length}
              onBulkCategoryChange={canUpdateProduct ? handleBulkCategoryChange : undefined}
              onBulkToggleStatus={canUpdateProduct ? handleBulkToggleStatus : undefined}
              bulkActionLabel={
                productStatusTab === 'active'
                  ? 'Nonaktifkan Terpilih'
                  : 'Aktifkan Terpilih'
              }
            />

            {/* Data Table (Terpisah untuk Aktif & Nonaktif) */}
            <ProductTable
              key={productStatusTab}
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
              onEdit={canUpdateProduct ? handleOpenEditProduct : undefined}
              onToggleStatus={
                canUpdateProduct
                  ? (prod, targetStatus) => handleToggleProductStatus(prod, targetStatus)
                  : undefined
              }
              isInactiveTable={productStatusTab === 'inactive'}
              isLoading={isProductsLoading}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION: KATEGORI                                         */}
        {/* ========================================================= */}
        {activeTab === 'kategori' && canViewCategories && (
          <div className="space-y-4">
            {/* Sub-tab: Kategori Aktif vs Nonaktif */}
            <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2">
              <div className="inline-flex p-1 rounded-lg bg-surface-container-high/60 gap-1">
                <button
                  type="button"
                  onClick={() => setCategoryStatusTab('active')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    categoryStatusTab === 'active'
                      ? 'bg-surface-card text-primary shadow-xs'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Kategori Aktif</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-primary/10 text-primary">
                    {activeCategories.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryStatusTab('inactive')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    categoryStatusTab === 'inactive'
                      ? 'bg-surface-card text-on-surface shadow-xs'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  <span>Kategori Nonaktif</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-surface-container-highest text-text-muted">
                    {inactiveCategories.length}
                  </span>
                </button>
              </div>

              {categoryStatusTab === 'inactive' && (
                <span className="text-xs text-text-muted hidden sm:inline">
                  Daftar kategori yang dinonaktifkan.
                </span>
              )}
            </div>

            {/* Content: Kategori Aktif / Nonaktif (Keduanya menggunakan Grid) */}
            <CategoryGrid
              key={categoryStatusTab}
              categories={categoryStatusTab === 'active' ? activeCategories : inactiveCategories}
              productCounts={productCounts}
              onOpenAddCategory={
                categoryStatusTab === 'active' && canCreateCategory
                  ? handleOpenAddCategory
                  : undefined
              }
              onEditCategory={canUpdateCategory ? handleEditCategory : undefined}
              onToggleStatus={
                canUpdateCategory
                  ? (cat, newStatus) => handleToggleCategoryStatus(cat, newStatus)
                  : undefined
              }
              isInactive={categoryStatusTab === 'inactive'}
              isLoading={isCategoriesLoading}
            />
          </div>
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
          onToggleStatus={
            canUpdateProduct
              ? (prod, newStatus) => handleToggleProductStatus(prod, newStatus)
              : undefined
          }
          editingProduct={editingProduct}
          categories={activeCategories}
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
          onToggleStatus={
            canUpdateCategory
              ? (cat, newStatus) => handleToggleCategoryStatus(cat, newStatus)
              : undefined
          }
          editingCategory={editingCategory}
          isSubmitting={isSubmittingCategory}
        />
      )}

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
