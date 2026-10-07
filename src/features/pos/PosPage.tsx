import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Store,
  ScanBarcode,
  Search,
  X,
  RotateCw,
  ShoppingCart,
  Trash2,
  Banknote,
  QrCode,
  Building2,
  CircleDollarSign,
  Receipt,
} from 'lucide-react';
import type { Product, CartItem, PaymentMethod, ToastInfo } from '../../types/pos';
import { INITIAL_PRODUCTS, CATEGORIES } from './data/initialProducts';
import { ProductCard } from './components/ProductCard';
import { CartItemRow } from './components/CartItemRow';
import { ReceiptModal } from './components/ReceiptModal';
import { BarcodeModal } from './components/BarcodeModal';
import { formatRupiah } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Toast } from '../../components/ui/Toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../components/ui/Dialog';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/Select';

export const PosPage: React.FC = () => {
  // Catalog State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Cart State (Initialized with the 2 items from HTML)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'kopi',
      productId: 'kopi',
      name: 'Kopi Hitam 200g',
      price: 15000,
      qty: 1,
      code: 'KOP-0192',
    },
    {
      id: 'gula',
      productId: 'gula',
      name: 'Gula Pasir 1kg',
      price: 16000,
      qty: 2,
      code: 'GUL-0021',
    },
  ]);

  // Tender / Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [cashGiven, setCashGiven] = useState<number>(50000);

  // Modals & Feedback
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState<boolean>(false);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastInfo>({ show: false, message: '' });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2500);
  };

  // Keyboard Shortcuts (F2 for Search, Escape to Close Modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsReceiptOpen(false);
        setIsBarcodeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Semua Kategori': products.length,
      Sembako: 0,
      Minuman: 0,
      'Makanan Ringan': 0,
      'Bumbu Dapur': 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase().trim();
      const matchCategory =
        selectedCategory === 'Semua Kategori' || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(query) ||
        (product.code && product.code.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Financial calculations
  const totalItemsCount = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.qty, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0),
    [cartItems]
  );

  const tax = 0; // Pajak Restitusi (0%)
  const totalBill = subtotal + tax;
  const change = cashGiven - totalBill;

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          code: product.code,
        },
      ];
    });
    showToast(`"${product.name}" ditambahkan ke keranjang`);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      showToast(`"${itemToRemove.name}" dihapus dari keranjang`);
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    setIsClearCartModalOpen(true);
  };

  const handleConfirmClearCart = () => {
    setCartItems([]);
    setIsClearCartModalOpen(false);
    showToast('Keranjang belanja berhasil dikosongkan');
  };

  const handleResetTransaction = () => {
    setCartItems([
      {
        id: 'kopi',
        productId: 'kopi',
        name: 'Kopi Hitam 200g',
        price: 15000,
        qty: 1,
        code: 'KOP-0192',
      },
      {
        id: 'gula',
        productId: 'gula',
        name: 'Gula Pasir 1kg',
        price: 16000,
        qty: 2,
        code: 'GUL-0021',
      },
    ]);
    setCashGiven(50000);
    showToast('Transaksi baru siap dimulai');
  };

  const handleRefreshCatalog = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Data stok & katalog berhasil disinkronisasi');
    }, 500);
  };

  const handleOpenReceipt = () => {
    if (cartItems.length === 0) {
      showToast('Keranjang masih kosong. Pilih produk terlebih dahulu!');
      return;
    }
    setIsReceiptOpen(true);
  };

  const handlePrintReceipt = () => {
    showToast('Mencetak struk ke printer thermal USB (80mm)...');
    setTimeout(() => {
      setIsReceiptOpen(false);
      handleResetTransaction();
    }, 1200);
  };

  const handleQuickScanMock = () => {
    setIsBarcodeOpen(false);
    const beras = products.find((p) => p.id === 'beras');
    if (beras) {
      handleAddToCart(beras);
    }
  };

  return (
    <div className="w-full flex-1">
      {/* POS Master Terminal Container */}
      <div className="w-full px-4 lg:px-6 py-4 max-w-[1680px] mx-auto">
        {/* Top Utility & Shift Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-surface-card rounded-xl p-3.5 shadow-sm border border-border-subtle/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-on-surface">Kasir POS Terminal #01</h1>
                <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Shift Aktif
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Kasir Bertugas: <strong className="text-on-surface font-semibold">Bu Dewi</strong> • Sesi: Pagi (07:00 - 15:30 WIB)
              </p>
            </div>
          </div>

          {/* Quick stats pill */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-surface-container-low">
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">Total Penjualan Shift Ini</span>
                <span className="text-base font-bold text-primary">Rp 1.482.500</span>
              </div>
              <span className="w-px h-6 bg-border-subtle"></span>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted">Transaksi Selesai</span>
                <span className="text-base font-bold text-on-surface">38 Struk</span>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsBarcodeOpen(true)}
              leftIcon={<ScanBarcode className="w-5 h-5" />}
              className="h-10 px-3.5 rounded-lg"
            >
              <span className="hidden md:inline">Scanner Barcode</span>
            </Button>
          </div>
        </div>

        {/* Main Dual Split-Pane POS Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Product Catalog (lg:col-span-7 xl:col-span-8) */}
          <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {/* Filter & Search Toolbar Card */}
            <div className="bg-surface-card rounded-xl p-4 shadow-sm border border-border-subtle/60 flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar with TextField */}
              <div className="flex-1 w-full">
                <TextField
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama produk atau scan barcode (F2)..."
                  leftIcon={<Search className="w-5 h-5 text-text-muted" />}
                  rightElement={
                    searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-text-muted hover:text-on-surface cursor-pointer p-1"
                        type="button"
                        title="Hapus pencarian"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : null
                  }
                  className="bg-surface-bg border-border-subtle h-11"
                  containerClassName="w-full"
                />
              </div>

              {/* Category Select Dropdown */}
              <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                <div className="w-full sm:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 bg-surface-bg border-border-subtle rounded-lg text-sm text-on-surface hover:bg-surface-bg focus-visible:border-primary focus-visible:ring-primary/20">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Refresh Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleRefreshCatalog}
                  className="h-11 w-11 shrink-0 rounded-lg bg-surface-bg hover:bg-surface-container-high"
                  title="Perbarui Data Stok Produk"
                >
                  <RotateCw
                    className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </Button>
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mt-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const label = cat === 'Semua Kategori' ? 'Semua' : cat;
                const count = categoryCounts[cat] ?? 0;
                return (
                  <Button
                    key={cat}
                    variant={isActive ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 shadow-xs ${
                      !isActive && 'bg-surface-card hover:bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {label} ({count})
                  </Button>
                );
              })}
            </div>

            {/* Catalog Responsive Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-surface-card rounded-xl p-12 text-center text-text-muted shadow-sm flex flex-col items-center justify-center gap-2">
                <Search className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-base font-medium">Tidak ada produk yang sesuai</p>
                <p className="text-xs">Coba ubah kata kunci pencarian atau kategori filter</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua Kategori');
                  }}
                  className="mt-3 px-4 py-2 rounded-lg"
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: Order Cart & Cashier Tender (lg:col-span-5 xl:col-span-4) */}
          <aside className="lg:col-span-5 xl:col-span-4 sticky top-20 flex flex-col gap-4">
            {/* Shopping Cart Panel */}
            <div className="bg-surface-card rounded-2xl shadow-md p-5 flex flex-col border border-border-subtle/60">
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-on-surface">Keranjang Belanja</h2>
                  <span className="text-[11px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                    {totalItemsCount} Item
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={cartItems.length === 0}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-xs text-status-danger hover:bg-error-container/40 hover:text-status-danger px-2.5 py-1 rounded-lg h-auto"
                >
                  Kosongkan
                </Button>
              </div>

              {/* Active Cart Item List */}
              <div className="py-3 flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center text-text-muted">
                    <ShoppingCart className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm font-medium">Keranjang belanja kosong</p>
                    <span className="text-xs">Pilih produk di katalog untuk menambahkan</span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemoveItem}
                    />
                  ))
                )}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-3 border-t border-border-subtle flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-on-surface-variant text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant text-sm">
                  <span>Pajak Restitusi (0%)</span>
                  <span className="font-semibold text-on-surface">Rp 0</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-border-subtle">
                  <span className="text-lg font-bold text-on-surface">Total Tagihan</span>
                  <span className="text-3xl font-bold text-primary tracking-tight">
                    {formatRupiah(totalBill)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mt-4 pt-3 border-t border-border-subtle">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentMethod === 'tunai' ? 'primary' : 'secondary'}
                    onClick={() => setPaymentMethod('tunai')}
                    leftIcon={<Banknote className="w-4 h-4" />}
                    className="h-11 text-sm font-semibold rounded-lg"
                  >
                    Tunai
                  </Button>
                  <Button
                    variant={paymentMethod === 'qris' ? 'primary' : 'secondary'}
                    onClick={() => setPaymentMethod('qris')}
                    leftIcon={<QrCode className="w-4 h-4" />}
                    className="h-11 text-sm font-semibold rounded-lg"
                  >
                    QRIS
                  </Button>
                  <Button
                    variant={paymentMethod === 'transfer' ? 'primary' : 'secondary'}
                    onClick={() => setPaymentMethod('transfer')}
                    leftIcon={<Building2 className="w-4 h-4" />}
                    className="h-11 text-sm font-semibold rounded-lg"
                  >
                    Transfer
                  </Button>
                </div>
              </div>

              {/* Cash Payment Tender Section (Shown when Tunai selected) */}
              {paymentMethod === 'tunai' && (
                <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <div>
                    <TextField
                      id="cashGivenInput"
                      label="Nominal Diterima (Rp)"
                      type="number"
                      value={cashGiven || ''}
                      onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                      leftIcon={<span className="text-sm font-bold text-text-muted">Rp</span>}
                      className="bg-surface-card border-border-subtle text-right text-lg font-bold h-11"
                    />
                  </div>

                  {/* Quick Denomination Chips */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCashGiven(totalBill)}
                      className="flex-1 h-9 rounded-lg bg-surface-card hover:bg-primary/10 hover:text-primary text-xs font-bold"
                    >
                      Uang Pas
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCashGiven(50000)}
                      className="flex-1 h-9 rounded-lg bg-surface-card hover:bg-primary/10 hover:text-primary text-xs font-bold"
                    >
                      Rp 50.000
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCashGiven(100000)}
                      className="flex-1 h-9 rounded-lg bg-surface-card hover:bg-primary/10 hover:text-primary text-xs font-bold"
                    >
                      Rp 100.000
                    </Button>
                  </div>

                  {/* Kembalian Info Box */}
                  <div
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      change >= 0
                        ? 'bg-emerald-50 text-emerald-900'
                        : 'bg-red-50 text-status-danger'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CircleDollarSign
                        className={`w-5 h-5 ${
                          change >= 0 ? 'text-emerald-600' : 'text-status-danger'
                        }`}
                      />
                      <span className="text-sm font-semibold">Kembalian:</span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        change >= 0 ? 'text-emerald-700' : 'text-status-danger'
                      }`}
                    >
                      {change >= 0
                        ? formatRupiah(change)
                        : `Kurang ${formatRupiah(Math.abs(change))}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenReceipt}
                  leftIcon={<Receipt className="w-5 h-5" />}
                  className="w-full h-12 text-base font-bold shadow-md"
                >
                  BAYAR & CETAK STRUK
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResetTransaction}
                  className="w-full h-10 text-on-surface-variant text-sm font-medium hover:bg-surface-container"
                >
                  Batal / Reset Transaksi (ESC)
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* MODAL: Thermal Receipt Struk Kasir (80mm preview) */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        tax={tax}
        total={totalBill}
        cashGiven={cashGiven}
        change={change}
        paymentMethod={paymentMethod}
        onPrint={handlePrintReceipt}
      />

      {/* MODAL: Barcode Scanner Simulation */}
      <BarcodeModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onScanMock={handleQuickScanMock}
      />

      {/* DIALOG: Konfirmasi Kosongkan Keranjang */}
      <Dialog open={isClearCartModalOpen} onOpenChange={setIsClearCartModalOpen}>
        <DialogContent size="sm" className="rounded-2xl border border-border-subtle overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b border-border-subtle bg-red-50/50">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-600">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span>Kosongkan Keranjang?</span>
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="p-5">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin menghapus seluruh <strong className="text-on-surface font-bold">{totalItemsCount} item</strong> dari keranjang belanja?
            </p>
          </DialogBody>
          <DialogFooter className="px-5 py-3.5 bg-surface-container-high/40 border-t border-border-subtle flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearCartModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClearCart}
            >
              Ya, Kosongkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default PosPage;
