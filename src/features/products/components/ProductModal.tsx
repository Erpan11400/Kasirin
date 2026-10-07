import React, { useState, useEffect } from 'react';
import { Package, RotateCw, ImagePlus } from 'lucide-react';
import type { ProductItem, CategoryItem, ProductFormData } from '../../../types/products';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void> | void;
  editingProduct?: ProductItem | null;
  categories: CategoryItem[];
  isSubmitting?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [unit, setUnit] = useState('Pcs');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setCode(editingProduct.code || '');
      // Find categoryId
      const matchedCat = categories.find(
        (c) =>
          c.id === editingProduct.categoryId ||
          c.name.toLowerCase() === editingProduct.category.toLowerCase()
      );
      setSelectedCategoryId(matchedCat?.id || editingProduct.categoryId || (categories[0]?.id ?? ''));
      setPrice(editingProduct.price !== undefined ? editingProduct.price.toString() : '');
      setStock(editingProduct.stock !== undefined ? editingProduct.stock.toString() : '');
      setUnit(editingProduct.unit || 'Pcs');
      setImageUrl(editingProduct.image || '');
    } else {
      setName('');
      setCode(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
      setSelectedCategoryId(categories[0]?.id || '');
      setPrice('');
      setStock('0');
      setUnit('Pcs');
      setImageUrl('');
    }
  }, [editingProduct, categories, isOpen]);

  const handleGenerateCode = () => {
    setCode(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      return;
    }

    const matchedCategory = categories.find((c) => c.id === selectedCategoryId);
    const categoryName = matchedCategory ? matchedCategory.name : 'Umum';
    const codeValue = code.trim();

    await onSave({
      id: editingProduct ? editingProduct.id : undefined,
      name: name.trim(),
      code: codeValue,
      categoryId: selectedCategoryId,
      category: categoryName,
      price: numPrice,
      stock: numStock,
      unit: unit.trim() || 'Pcs',
      image: imageUrl.trim(),
    });
  };

  const isEdit = Boolean(editingProduct);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent size="2xl" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <DialogTitle className="text-base sm:text-lg font-bold text-on-surface">
              {isEdit ? 'Edit Data Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              {isEdit
                ? 'Perbarui informasi harga, stok, atau kategori produk.'
                : 'Lengkapi formulir untuk menambahkan produk baru ke katalog toko.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="p-6 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
            {/* Field: Nama Produk */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Nama Produk <span className="text-status-danger">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Mie Ayam Komplit"
                className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field: Kategori */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Kategori <span className="text-status-danger">*</span>
                </label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    size="default"
                    className="bg-surface-bg border-border-subtle rounded-lg text-sm text-on-surface h-[42px]"
                  >
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.emoji || '🏷️'} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field: Kode Produk */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Kode Produk
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="PRD-001"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleGenerateCode}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary cursor-pointer p-1 transition-colors disabled:opacity-50"
                    title="Generate Kode Acak"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Field: Harga Jual */}
              <div className="sm:col-span-5">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Harga Jual (Rp) <span className="text-status-danger">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted font-semibold">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    disabled={isSubmitting}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18000"
                    className="w-full pl-11 pr-3.5 py-2.5 bg-surface-bg rounded-lg text-sm font-bold text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Field: Stok */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Stok <span className="text-status-danger">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  disabled={isSubmitting}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm font-bold text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                />
              </div>

              {/* Field: Satuan (Unit) */}
              <div className="sm:col-span-4">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Satuan (Unit)
                </label>
                <input
                  type="text"
                  list="unit-options"
                  disabled={isSubmitting}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Pcs"
                  className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                />
                <datalist id="unit-options">
                  <option value="Pcs" />
                  <option value="Kg" />
                  <option value="Gram" />
                  <option value="Botol" />
                  <option value="Kaleng" />
                  <option value="Sak" />
                  <option value="Cup" />
                  <option value="Kotak" />
                  <option value="Renceng" />
                  <option value="Bungkus" />
                  <option value="Liter" />
                </datalist>
              </div>
            </div>

            {/* Field: URL Foto Produk */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Tautan URL Foto Produk
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  disabled={isSubmitting}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/foto-produk.jpg"
                  className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                />
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-border-subtle shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-text-muted shrink-0">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              <span>{isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
