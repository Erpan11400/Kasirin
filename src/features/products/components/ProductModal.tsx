import React, { useState } from 'react';
import { Package, X, RotateCw, ImagePlus, Check, ShieldCheck } from 'lucide-react';
import type { ProductItem, CategoryItem, ProductFormData } from '../../../types/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  editingProduct?: ProductItem | null;
  categories: CategoryItem[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
}) => {
  const [name, setName] = useState(() => editingProduct?.name ?? '');
  const [sku, setSku] = useState(() => editingProduct?.sku ?? '');
  const [category, setCategory] = useState(
    () => editingProduct?.category ?? (categories[0]?.name || 'Sembako')
  );
  const [price, setPrice] = useState<string>(
    () => (editingProduct?.price !== undefined ? editingProduct.price.toString() : '')
  );
  const [stock, setStock] = useState<string>(
    () => (editingProduct?.stock !== undefined ? editingProduct.stock.toString() : '')
  );
  const [image, setImage] = useState<string>(
    () => editingProduct?.image ?? ''
  );

  if (!isOpen) return null;

  const handleGenerateSku = () => {
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon isi nama produk!');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      alert('Mohon isi harga produk yang valid!');
      return;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      alert('Mohon isi jumlah stok yang valid!');
      return;
    }

    onSave({
      id: editingProduct ? editingProduct.id : undefined,
      name: name.trim(),
      sku: sku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category,
      price: numPrice,
      stock: numStock,
      unit: editingProduct ? editingProduct.unit : 'Pcs',
      image: image.trim() || editingProduct?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4fT0rrfssE6dvNYQwqV0n6WhGlEnpqn8v8OdZgg7UMm6RsDYCUq6WaviS3n_83vN-lznxPObCuf2oIvCyoKUOVwPwU4dXSyleeO_0ZmRMVBgssTPM-OdGCouEYl3Hso7a6ztrnxTXxxsh5pU6KtbkpF2J2mVfCjYPszEUViw7ql5Y71zExPHfOzNkT1m9ElZRHGYzK3K5jvWza8GyusluQUuH1xSnucNN58Vijz-QdS4-D4yNLqEV',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-surface-card rounded-2xl shadow-xl overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-bg flex items-center justify-between border-b border-border-subtle/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <p className="text-xs text-text-muted">
                Isi detail kelengkapan data inventaris toko Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Field: Nama Produk */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">
              Nama Produk <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kopi Hitam Bubuk 200g"
              className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field: SKU / Barcode */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                SKU / Kode Barcode
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-XXX-001"
                  className="w-full pl-3.5 pr-9 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary cursor-pointer p-1 transition-colors"
                  title="Generate SKU Acak"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Field: Kategori */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Kategori <span className="text-status-danger">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none cursor-pointer transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field: Harga Jual */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Harga Jual (Rp) <span className="text-status-danger">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted font-semibold">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="15000"
                  className="w-full pl-11 pr-3.5 py-2.5 bg-surface-bg rounded-lg text-sm font-bold text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all"
                />
              </div>
            </div>

            {/* Field: Stok Awal */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Jumlah Stok Saat Ini <span className="text-status-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="20"
                  className="w-full pl-3.5 pr-20 py-2.5 bg-surface-bg rounded-lg text-sm font-bold text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                  Satuan/Pcs
                </span>
              </div>
            </div>
          </div>

          {/* Field: Gambar Produk Dropzone */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">
              Foto Produk
            </label>
            <div
              onClick={() => {
                const url = window.prompt('Masukkan URL foto produk:', image);
                if (url !== null) setImage(url.trim());
              }}
              className="rounded-xl p-4 bg-surface-bg border border-dashed border-border-subtle flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high/60 transition-colors"
            >
              {image ? (
                <img
                  src={image}
                  alt="Preview Foto Produk"
                  className="w-16 h-16 rounded-lg object-cover shadow-xs"
                />
              ) : (
                <ImagePlus className="w-8 h-8 text-primary opacity-80" />
              )}
              <div className="text-center">
                <p className="text-sm font-semibold text-on-surface">
                  {image
                    ? 'Klik untuk mengganti tautan foto'
                    : 'Klik untuk unggah atau masukkan URL foto'}
                </p>
                <p className="text-xs text-text-muted">
                  Format PNG, JPG, atau WebP (Maks. 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary Preview */}
          <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-xs">
                Status ketersediaan akan otomatis diperbarui di layar kasir.
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-border-subtle/60 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-xs active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Produk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
