import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Store,
  ScanBarcode,
  Search,
  X,
  ChevronDown,
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
import { Toast } from './components/Toast';
import { formatRupiah } from '../../lib/formatters';

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
      sku: 'KOP-0192',
    },
    {
      id: 'gula',
      productId: 'gula',
      name: 'Gula Pasir 1kg',
      price: 16000,
      qty: 2,
      sku: 'GUL-0021',
    },
  ]);

  // Tender / Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [cashGiven, setCashGiven] = useState<number>(50000);

  // Modals & Feedback
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState<boolean>(false);
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

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'Semua Kategori' || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase().trim());
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
          id: 'item-' + Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          sku: product.sku,
        },
      ];
    });
    showToast(`${product.name} ditambahkan ke keranjang`);
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
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item dihapus dari keranjang');
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    if (window.confirm('Kosongkan semua item di keranjang belanja?')) {
      setCartItems([]);
      showToast('Keranjang telah dikosongkan');
    }
  };

  const handleResetTransaction = () => {
    setCartItems([
      {
        id: 'kopi',
        productId: 'kopi',
        name: 'Kopi Hitam 200g',
        price: 15000,
        qty: 1,
        sku: 'KOP-0192',
      },
      {
        id: 'gula',
        productId: 'gula',
        name: 'Gula Pasir 1kg',
        price: 16000,
        qty: 2,
        sku: 'GUL-0021',
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
      alert('Keranjang masih kosong. Pilih produk terlebih dahulu!');
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
            <button
              onClick={() => setIsBarcodeOpen(true)}
              className="h-10 px-3.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              type="button"
            >
              <ScanBarcode className="w-5 h-5" />
              <span className="hidden md:inline">Scanner Barcode</span>
            </button>
          </div>
        </div>

        {/* Main Dual Split-Pane POS Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Product Catalog (lg:col-span-7 xl:col-span-8) */}
          <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {/* Filter & Search Toolbar Card */}
            <div className="bg-surface-card rounded-xl p-4 shadow-sm border border-border-subtle/60 flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama produk atau scan barcode (F2)..."
                  type="text"
                  className="w-full h-11 pl-11 pr-10 rounded-lg bg-surface-bg text-on-surface placeholder:text-text-muted text-sm outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-on-surface cursor-pointer"
                    type="button"
                    title="Hapus pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Select Dropdown */}
              <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                <div className="relative w-full sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-11 appearance-none px-3.5 pr-9 rounded-lg bg-surface-bg text-on-surface text-sm ring-1 ring-border-subtle focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
                </div>

                {/* Quick Refresh Button */}
                <button
                  onClick={handleRefreshCatalog}
                  className="h-11 w-11 shrink-0 rounded-lg bg-surface-bg hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                  title="Perbarui Data Stok Produk"
                  type="button"
                >
                  <RotateCw
                    className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mt-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const label = cat === 'Semua Kategori' ? 'Semua' : cat;
                const count = categoryCounts[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 shadow-xs transition-all cursor-pointer ${isActive
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'bg-surface-card hover:bg-surface-container text-on-surface-variant'
                      }`}
                    type="button"
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Catalog Responsive Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-surface-card rounded-xl p-12 text-center text-text-muted shadow-sm flex flex-col items-center justify-center gap-2">
                <Search className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-base font-medium">Tidak ada produk yang sesuai</p>
                <p className="text-xs">Coba ubah kata kunci pencarian atau kategori filter</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua Kategori');
                  }}
                  className="mt-3 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm transition-colors cursor-pointer"
                  type="button"
                >
                  Reset Filter
                </button>
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
                <button
                  onClick={handleClearCart}
                  disabled={cartItems.length === 0}
                  className="text-xs text-status-danger hover:bg-error-container/40 disabled:opacity-40 disabled:hover:bg-transparent px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                  Kosongkan
                </button>
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
                  <button
                    onClick={() => setPaymentMethod('tunai')}
                    className={`h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${paymentMethod === 'tunai'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-bg hover:bg-surface-container text-on-surface-variant'
                      }`}
                    type="button"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Tunai</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${paymentMethod === 'qris'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-bg hover:bg-surface-container text-on-surface-variant'
                      }`}
                    type="button"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QRIS</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    className={`h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${paymentMethod === 'transfer'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-bg hover:bg-surface-container text-on-surface-variant'
                      }`}
                    type="button"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Transfer</span>
                  </button>
                </div>
              </div>

              {/* Cash Payment Tender Section (Shown when Tunai selected) */}
              {paymentMethod === 'tunai' && (
                <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <div>
                    <label
                      htmlFor="cashGivenInput"
                      className="block text-xs font-semibold text-on-surface-variant mb-1"
                    >
                      Nominal Diterima (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-text-muted">
                        Rp
                      </span>
                      <input
                        id="cashGivenInput"
                        value={cashGiven || ''}
                        onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                        type="number"
                        className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-card text-on-surface text-lg font-bold outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary text-right"
                      />
                    </div>
                  </div>

                  {/* Quick Denomination Chips */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCashGiven(totalBill)}
                      className="flex-1 h-9 rounded-lg bg-surface-card hover:bg-primary/10 hover:text-primary text-on-surface text-xs font-bold shadow-xs transition-all cursor-pointer"
                      type="button"
                    >
                      Uang Pas
                    </button>
                    <button
                      onClick={() => setCashGiven(50000)}
                      className="flex-1 h-9 rounded-lg bg-surface-card hover:bg-primary/10 hover:text-primary text-on-surface text-xs font-bold shadow-xs transition-all cursor-pointer"
                      type="button"
                    >
                      Rp 50.000
                    </button>
                    <button
                      onClick={() => setCashGiven(100000)}
                      className="flex-1 h-9 rounded-lg bg-surface-card hover:bg-primary/10 hover:text-primary text-on-surface text-xs font-bold shadow-xs transition-all cursor-pointer"
                      type="button"
                    >
                      Rp 100.000
                    </button>
                  </div>

                  {/* Kembalian Info Box */}
                  <div
                    className={`p-3 rounded-lg flex items-center justify-between ${change >= 0
                        ? 'bg-emerald-50 text-emerald-900'
                        : 'bg-red-50 text-status-danger'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <CircleDollarSign
                        className={`w-5 h-5 ${change >= 0 ? 'text-emerald-600' : 'text-status-danger'
                          }`}
                      />
                      <span className="text-sm font-semibold">Kembalian:</span>
                    </div>
                    <span
                      className={`text-lg font-bold ${change >= 0 ? 'text-emerald-700' : 'text-status-danger'
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
                <button
                  onClick={handleOpenReceipt}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-base font-bold flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all cursor-pointer"
                  type="button"
                >
                  <Receipt className="w-5 h-5" />
                  <span>BAYAR & CETAK STRUK</span>
                </button>
                <button
                  onClick={handleResetTransaction}
                  className="w-full h-10 rounded-xl bg-surface-bg hover:bg-surface-container text-on-surface-variant text-sm font-medium transition-colors cursor-pointer"
                  type="button"
                >
                  Batal / Reset Transaksi (ESC)
                </button>
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

      {/* Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
};
export default PosPage;
