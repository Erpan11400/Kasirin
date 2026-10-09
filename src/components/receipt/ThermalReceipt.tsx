import React from 'react';
import type { StoreProfileData } from '../../types/store';
import { formatRupiah } from '../../lib/formatters';

export interface ReceiptItem {
  id?: string;
  name: string;
  price: number;
  qty: number;
  total?: number;
}

export interface ThermalReceiptProps {
  store: StoreProfileData;
  items?: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  paymentMethod?: string;
  cashGiven?: number;
  change?: number;
  invoiceNumber?: string;
  cashierName?: string;
  date?: string;
  paperWidth?: '58mm' | '80mm';
  showSerratedEdges?: boolean;
  className?: string;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  store,
  items = [],
  subtotal,
  tax = 0,
  total,
  paymentMethod = 'Tunai',
  cashGiven,
  change,
  invoiceNumber = 'INV-20261007-001',
  cashierName = 'Kasir Utama',
  date,
  paperWidth = '58mm',
  showSerratedEdges = true,
  className = '',
}) => {
  // Hitung subtotal dan total default jika tidak dipass
  const computedSubtotal =
    subtotal !== undefined
      ? subtotal
      : items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const computedTotal = total !== undefined ? total : computedSubtotal + tax;

  const displayDate =
    date ||
    new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div
      className={`relative bg-[#FFFDF9] text-[#1E293B] rounded-lg shadow-md p-6 sm:p-7 flex flex-col font-mono text-[13px] leading-relaxed transition-all border border-amber-100/50 print:border-none print:shadow-none print:p-0 ${
        paperWidth === '80mm' ? 'max-w-[380px]' : 'max-w-[320px]'
      } w-full mx-auto ${className}`}
    >
      {/* Top Serrated Edge Decoration */}
      {showSerratedEdges && (
        <div className="absolute -top-2.5 left-0 right-0 h-3 overflow-hidden print:hidden">
          <svg
            className="w-full h-full text-[#FFFDF9] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 200 10"
          >
            <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 105,0 110,10 115,0 120,10 125,0 130,10 135,0 140,10 145,0 150,10 155,0 160,10 165,0 170,10 175,0 180,10 185,0 190,10 195,0 200,10" />
          </svg>
        </div>
      )}

      {/* 1. Header Toko */}
      <div className="flex flex-col items-center text-center gap-1 pb-3">
        {store.logoUrl && (
          <div className="w-12 h-12 mb-1 flex items-center justify-center">
            <img
              alt="Logo Toko"
              className="w-full h-full object-contain filter grayscale contrast-125"
              src={store.logoUrl}
            />
          </div>
        )}
        <span className="font-bold text-[15px] tracking-tight text-black uppercase">
          {store.storeName?.trim() || 'NAMA TOKO'}
        </span>
        {store.category && (
          <span className="text-[11px] text-slate-500 font-sans tracking-wide uppercase">
            {store.category.trim()}
          </span>
        )}
        {store.address && (
          <span className="text-[11px] text-slate-600 px-1 mt-0.5 leading-snug">
            {store.address.trim()}
          </span>
        )}
        {store.phone && (
          <span className="text-[11px] font-semibold text-slate-700 mt-0.5">
            Telp / WA: {store.phone.trim()}
          </span>
        )}
      </div>

      {/* Dashed Separator */}
      <div className="border-b border-dashed border-slate-300 my-1.5"></div>

      {/* 2. Meta Transaksi */}
      <div className="text-[11px] text-slate-600 space-y-0.5 py-1">
        <div className="flex justify-between">
          <span>No: {invoiceNumber}</span>
          <span>Kasir: {cashierName}</span>
        </div>
        <div className="flex justify-between">
          <span>Tgl: {displayDate}</span>
          <span>Metode: {paymentMethod}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-slate-300 my-1.5"></div>

      {/* 3. Daftar Item */}
      <div className="flex flex-col gap-2 py-1 text-[12px]">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="flex flex-col">
            <div className="flex justify-between font-semibold text-slate-900">
              <span className="truncate pr-2">{item.name}</span>
              <span className="shrink-0">
                {formatRupiah(item.total !== undefined ? item.total : item.price * item.qty)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {item.qty} x {formatRupiah(item.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-dashed border-slate-300 my-1.5"></div>

      {/* 4. Perhitungan Total & Pembayaran */}
      <div className="flex flex-col gap-1 py-1.5 text-[12px]">
        {tax > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Pajak</span>
            <span>{formatRupiah(tax)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-[14px] text-black">
          <span>TOTAL</span>
          <span>{formatRupiah(computedTotal)}</span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-600 pt-1">
          <span>Bayar ({paymentMethod})</span>
          <span>
            {cashGiven !== undefined ? formatRupiah(cashGiven) : formatRupiah(computedTotal)}
          </span>
        </div>
        {change !== undefined && (
          <div className="flex justify-between text-[11px] font-semibold text-emerald-800">
            <span>Kembali</span>
            <span>{formatRupiah(Math.max(0, change))}</span>
          </div>
        )}
      </div>

      <div className="border-b border-dashed border-slate-300 my-1.5"></div>

      {/* 5. QRIS Section (Kondisional dari Store Setting) */}
      {store.showQris && (
        <div className="flex flex-col items-center py-2 gap-1.5 transition-all">
          <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">
            QRIS STANDAR PEMBAYARAN
          </span>
          <div className="p-2 bg-white rounded shadow-xs border border-slate-200">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 100 100">
              <rect fill="#000" height="30" width="30" x="0" y="0"></rect>
              <rect fill="#fff" height="20" width="20" x="5" y="5"></rect>
              <rect fill="#000" height="10" width="10" x="10" y="10"></rect>
              <rect fill="#000" height="30" width="30" x="70" y="0"></rect>
              <rect fill="#fff" height="20" width="20" x="75" y="5"></rect>
              <rect fill="#000" height="10" width="10" x="80" y="10"></rect>
              <rect fill="#000" height="30" width="30" x="0" y="70"></rect>
              <rect fill="#fff" height="20" width="20" x="5" y="75"></rect>
              <rect fill="#000" height="10" width="10" x="10" y="80"></rect>
              <rect fill="#000" height="8" width="8" x="40" y="10"></rect>
              <rect fill="#000" height="8" width="8" x="52" y="10"></rect>
              <rect fill="#000" height="6" width="12" x="45" y="24"></rect>
              <rect fill="#000" height="15" width="8" x="10" y="45"></rect>
              <rect fill="#000" height="10" width="10" x="25" y="45"></rect>
              <rect fill="#000" height="16" width="16" x="42" y="42"></rect>
              <rect fill="#fff" height="4" width="4" x="48" y="48"></rect>
              <rect fill="#000" height="12" width="10" x="68" y="45"></rect>
              <rect fill="#000" height="8" width="10" x="85" y="45"></rect>
              <rect fill="#000" height="10" width="8" x="40" y="70"></rect>
              <rect fill="#000" height="8" width="12" x="55" y="75"></rect>
              <rect fill="#000" height="8" width="20" x="75" y="70"></rect>
              <rect fill="#000" height="10" width="10" x="85" y="85"></rect>
            </svg>
          </div>
          <span className="text-[9px] text-slate-500 text-center truncate max-w-full">
            {store.storeName?.trim() || 'KasirIn Store'}
          </span>
        </div>
      )}

      {/* 6. Footer Note (Kondisional dari Store Setting) */}
      {store.footerNote && (
        <div className="text-center pt-2 text-[11px] text-slate-700 leading-snug">
          <p>{store.footerNote.trim()}</p>
        </div>
      )}

      {/* Simulated Barcode at bottom */}
      <div className="pt-2 flex justify-center">
        <div className="flex items-center gap-[2px] h-6 px-2 bg-white rounded border border-slate-200">
          <span className="w-[2px] h-5 bg-slate-900"></span>
          <span className="w-[1px] h-5 bg-slate-900"></span>
          <span className="w-[3px] h-5 bg-slate-900"></span>
          <span className="w-[1px] h-5 bg-slate-900"></span>
          <span className="w-[4px] h-5 bg-slate-900"></span>
          <span className="w-[2px] h-5 bg-slate-900"></span>
          <span className="w-[1px] h-5 bg-slate-900"></span>
          <span className="w-[3px] h-5 bg-slate-900"></span>
          <span className="w-[2px] h-5 bg-slate-900"></span>
          <span className="w-[1px] h-5 bg-slate-900"></span>
          <span className="w-[4px] h-5 bg-slate-900"></span>
          <span className="w-[2px] h-5 bg-slate-900"></span>
        </div>
      </div>

      {/* Bottom Serrated Edge Decoration */}
      {showSerratedEdges && (
        <div className="absolute -bottom-2.5 left-0 right-0 h-3 overflow-hidden print:hidden">
          <svg
            className="w-full h-full text-[#FFFDF9] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 200 10"
          >
            <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 105,10 110,0 115,10 120,0 125,10 130,0 135,10 140,0 145,10 150,0 155,10 160,0 165,10 170,0 175,10 180,0 185,10 190,0 195,10 200,0" />
          </svg>
        </div>
      )}
    </div>
  );
};
