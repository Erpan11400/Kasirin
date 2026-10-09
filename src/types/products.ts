export interface BackendProductCategory {
  _id: string;
  name: string;
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
  createdAt?: string;
}

export interface BackendCategoryItem {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  bgClass?: string;
  textClass?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MainTab = 'produk' | 'kategori';
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
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface CategoryGridProps {
  categories: CategoryItem[];
  productCounts: Record<string, number>;
  onOpenAddCategory: () => void;
  onEditCategory: (category: CategoryItem) => void;
  onDeleteCategory?: (category: CategoryItem) => void;
  isLoading?: boolean;
}

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string) => Promise<void> | void;
  editingCategory?: CategoryItem | null;
  isSubmitting?: boolean;
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void> | void;
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
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
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
  onBulkCategoryChange: () => void;
  onBulkDelete: () => void;
}
