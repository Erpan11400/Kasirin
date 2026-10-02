import React from 'react';
import { Receipt, X, Printer } from 'lucide-react';
import type { CartItem, PaymentMethod } from '../../../types/pos';
import { formatRupiah } from '../../../lib/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  cashGiven: number;
  change: number;
  paymentMethod: PaymentMethod;
  onPrint: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  tax,
  total,
  cashGiven,
  change,
  paymentMethod,
  onPrint,
}) => {
  if (!isOpen) return null;

  const paymentLabelMap: Record<PaymentMethod, string> = {
    tunai: 'Tunai',
    qris: 'QRIS',
    transfer: 'Transfer',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-surface-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">
              Pratinjau Struk Kasir (80mm)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-text-muted hover:text-on-surface hover:bg-surface-card flex items-center justify-center transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Receipt Paper */}
        <div className="p-6 font-mono text-[13px] leading-relaxed text-slate-800 bg-amber-50/40 select-text max-h-[70vh] overflow-y-auto">
          {/* Store Info */}
          <div className="text-center">
            <div className="font-bold text-[16px] tracking-wide text-slate-900">
              TOKO SEMBAKO JAYA
            </div>
            <div className="text-[11px] text-slate-600">Jl. Merdeka No. 123, Jakarta Pusat</div>
            <div className="text-[11px] text-slate-600">Telp: 0812-3456-7890</div>
          </div>

          <div className="my-3 border-b border-dashed border-slate-300"></div>

          {/* Meta Info */}
          <div className="text-[11px] space-y-0.5 text-slate-600">
            <div className="flex justify-between">
              <span>No. Invoice</span>
              <span className="font-semibold text-slate-800">INV-20260905-001</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal</span>
              <span>05/09/2026 15:10</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir</span>
              <span>Bu Dewi (T-01)</span>
            </div>
          </div>

          <div className="my-3 border-b border-dashed border-slate-300"></div>

          {/* Items */}
          <div className="space-y-1.5">
            {cartItems.map((item) => (
              <div key={item.id}>
                <div className="font-semibold text-slate-900">{item.name}</div>
                <div className="flex justify-between text-[12px] text-slate-600">
                  <span>
                    {item.qty} x {formatRupiah(item.price)}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatRupiah(item.price * item.qty)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="my-3 border-b border-dashed border-slate-300"></div>

          {/* Calculations */}
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (0%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-[14px] text-slate-950 pt-1 border-t border-dashed border-slate-300">
              <span>TOTAL TAGIHAN</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Bayar ({paymentLabelMap[paymentMethod]})</span>
              <span>
                {paymentMethod === 'tunai'
                  ? formatRupiah(cashGiven)
                  : formatRupiah(total)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-800">
              <span>Kembali</span>
              <span>
                {paymentMethod === 'tunai'
                  ? formatRupiah(Math.max(0, change))
                  : 'Rp 0'}
              </span>
            </div>
          </div>

          <div className="my-4 border-b border-dashed border-slate-300"></div>

          {/* Footer Note & Simulated Barcode */}
          <div className="text-center space-y-1">
            <p className="font-bold text-[12px] text-slate-900">
              Terima Kasih Telah Berbelanja!
            </p>
            <p className="text-[10px] text-slate-500">
              Barang yang sudah dibeli tidak dapat ditukar kecuali ada perjanjian.
            </p>
            <div className="pt-2 flex justify-center">
              <div className="flex items-center gap-[2px] h-8 px-2 bg-white rounded border border-slate-200">
                <span className="w-[2px] h-6 bg-slate-900"></span>
                <span className="w-[1px] h-6 bg-slate-900"></span>
                <span className="w-[3px] h-6 bg-slate-900"></span>
                <span className="w-[1px] h-6 bg-slate-900"></span>
                <span className="w-[4px] h-6 bg-slate-900"></span>
                <span className="w-[2px] h-6 bg-slate-900"></span>
                <span className="w-[1px] h-6 bg-slate-900"></span>
                <span className="w-[3px] h-6 bg-slate-900"></span>
                <span className="w-[2px] h-6 bg-slate-900"></span>
                <span className="w-[1px] h-6 bg-slate-900"></span>
                <span className="w-[4px] h-6 bg-slate-900"></span>
                <span className="w-[2px] h-6 bg-slate-900"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-surface-card border-t border-border-subtle flex items-center gap-2">
          <button
            onClick={onPrint}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            type="button"
          >
            <Printer className="w-5 h-5" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm transition-colors cursor-pointer"
            type="button"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
