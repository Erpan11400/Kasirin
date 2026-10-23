export interface ProductNameItem {
  _id: string;
  name: string;
  isActive?: boolean;
}

export interface BackendProductCategory {
  _id: string;
  name: string;
  isActive?: boolean;
}

export interface BackendProductItem {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: string | BackendProductCategory;
  code?: string;
  unit?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  code: string;
  categoryId?: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  isActive: boolean;
  createdAt?: string;
}

export interface BackendCategoryItem {
  _id: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  isActive: boolean;
  emoji?: string;
  bgClass?: string;
  textClass?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MainTab = 'produk' | 'kategori';
export type ProductStatusTab = 'active' | 'inactive';
export type CategoryStatusTab = 'active' | 'inactive';
export type StockFilter = '' | 'tersedia' | 'menipis' | 'habis';
export type SortOption = 'name-asc' | 'name-desc' | 'count-desc' | 'count-asc';

export interface ProductFormData {
  id?: string;
  name: string;
  code?: string;
  categoryId?: string;
  category: string;
  price: number;
  stock: number;
  unit?: string;
  image?: string;
  isActive?: boolean;
}

export interface CreateProductPayload {
  name: string;
  code?: string;
  price: number;
  stock: number;
  unit?: string;
  categoryId: string;
  imageUrl?: string;
}

export interface UpdateProductPayload {
  name?: string;
  code?: string;
  price?: number;
  stock?: number;
  unit?: string;
  categoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  isActive?: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface CategoryGridProps {
  categories: CategoryItem[];
  productCounts: Record<string, number>;
  onOpenAddCategory?: () => void;
  onEditCategory?: (category: CategoryItem) => void;
  onDeleteCategory?: (category: CategoryItem) => void;
  onToggleStatus?: (category: CategoryItem, isActive: boolean) => void;
  isInactive?: boolean;
  isLoading?: boolean;
}

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
  onToggleStatus?: (category: CategoryItem, isActive: boolean) => Promise<void> | void;
  editingCategory?: CategoryItem | null;
  isSubmitting?: boolean;
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void> | void;
  onToggleStatus?: (product: ProductItem, isActive: boolean) => Promise<void> | void;
  editingProduct?: ProductItem | null;
  categories: CategoryItem[];
  isSubmitting?: boolean;
}

export interface ProductTableProps {
  products: ProductItem[];
  totalFilteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  selectedIds: string[];
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectOne: (id: string) => void;
  onEdit?: (product: ProductItem) => void;
  onDelete?: (product: ProductItem) => void;
  onToggleStatus?: (product: ProductItem, isActive: boolean) => void;
  isInactiveTable?: boolean;
  isLoading?: boolean;
}

export interface StatsCardsProps {
  totalSku: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface BulkActionBannerProps {
  selectedCount: number;
  onBulkCategoryChange?: () => void;
  onBulkDelete?: () => void;
  onBulkToggleStatus?: () => void;
  bulkActionLabel?: string;
}
