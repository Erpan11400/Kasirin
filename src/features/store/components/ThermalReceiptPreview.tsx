import React from 'react';
import { Eye, Printer } from 'lucide-react';
import type { StoreProfileData } from '../../../types/store';

interface ThermalReceiptPreviewProps {
  data: StoreProfileData;
}

export const ThermalReceiptPreview: React.FC<ThermalReceiptPreviewProps> = ({ data }) => {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-4">
      {/* Card Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-on-surface font-semibold text-sm">
          <Eye className="w-5 h-5 text-secondary" />
          <span>Pratinjau Live Struk Kasir</span>
        </div>
        <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded text-xs font-bold text-on-surface-variant">
          <span>Ukuran: 58mm Thermal</span>
        </div>
      </div>

      {/* Paper Simulation Card */}
      <div className="relative bg-[#FFFDF9] text-[#1E293B] rounded-lg shadow-md p-6 sm:p-7 flex flex-col font-mono text-[13px] leading-relaxed transition-all border border-amber-100/50">
        {/* Top Serrated Edge Decoration (Inline SVG) */}
        <div className="absolute -top-2.5 left-0 right-0 h-3 overflow-hidden">
          <svg
            className="w-full h-full text-[#FFFDF9] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 200 10"
          >
            <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 105,0 110,10 115,0 120,10 125,0 130,10 135,0 140,10 145,0 150,10 155,0 160,10 165,0 170,10 175,0 180,10 185,0 190,10 195,0 200,10" />
          </svg>
        </div>

        {/* Struk Header (Live updated from form) */}
        <div className="flex flex-col items-center text-center gap-1 pb-4">
          <div className="w-12 h-12 mb-1 flex items-center justify-center">
            <img
              alt="Logo Toko Preview"
              className="w-full h-full object-contain filter grayscale contrast-125"
              src={data.logoUrl}
            />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-black uppercase">
            {data.storeName.trim() || 'NAMA TOKO ANDA'}
          </span>
          <span className="text-[11px] text-slate-500 font-sans tracking-wide uppercase">
            {data.category.trim() || 'KATEGORI USAHA'}
          </span>
          <span className="text-[11px] text-slate-600 px-2 mt-1 leading-snug">
            {data.address.trim() || 'Alamat Toko'}
          </span>
          <span className="text-[11px] font-semibold text-slate-700 mt-0.5">
            WhatsApp: {data.phone.trim() || '-'}
          </span>
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-slate-300 my-2"></div>

        {/* Transaction Meta */}
        <div className="flex justify-between text-[11px] text-slate-600 py-1">
          <span>No: #TRX-20231024-0042</span>
          <span>Kasir: Sari Dewi</span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-600 pb-2">
          <span>Tgl: 24/10/2023 09:41</span>
          <span>Kassa: 01</span>
        </div>

        <div className="border-b border-dashed border-slate-300 my-1"></div>

        {/* Sample Items List */}
        <div className="flex flex-col gap-2 py-2 text-[12px]">
          <div className="flex flex-col">
            <div className="flex justify-between font-semibold">
              <span>Beras Pandan Wangi 5kg</span>
              <span>Rp 68.000</span>
            </div>
            <div className="text-[11px] text-slate-500">1 x Rp 68.000</div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between font-semibold">
              <span>Minyak Goreng Sania 2L</span>
              <span>Rp 34.500</span>
            </div>
            <div className="text-[11px] text-slate-500">1 x Rp 34.500</div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between font-semibold">
              <span>Gula Pasir Gulaku 1kg</span>
              <span>Rp 33.000</span>
            </div>
            <div className="text-[11px] text-slate-500">2 x Rp 16.500</div>
          </div>
        </div>

        <div className="border-b border-dashed border-slate-300 my-1"></div>

        {/* Total Calculation */}
        <div className="flex flex-col gap-1 py-2 text-[12px]">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>Rp 135.500</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Diskon Member</span>
            <span className="text-status-danger">-Rp 5.500</span>
          </div>
          <div className="flex justify-between font-bold text-[14px] text-black pt-1">
            <span>TOTAL</span>
            <span>Rp 130.000</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-600 pt-1">
            <span>Bayar (Tunai)</span>
            <span>Rp 150.000</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>Kembali</span>
            <span>Rp 20.000</span>
          </div>
        </div>

        <div className="border-b border-dashed border-slate-300 my-2"></div>

        {/* QRIS Section (Conditional by Toggle) */}
        {data.showQris && (
          <div className="flex flex-col items-center py-2 gap-1.5 transition-all">
            <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">
              QRIS STANDAR PEMBAYARAN NASIONAL
            </span>
            <div className="p-2 bg-white rounded shadow-inner border border-slate-200">
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
            <span className="text-[9px] text-slate-500 text-center">
              NMID: ID102003892019 • {data.storeName.trim() || 'Toko Sembako Jaya'}
            </span>
          </div>
        )}

        {/* Struk Footer Note (Live updated) */}
        <div className="text-center pt-2 text-[11px] text-slate-700 leading-snug">
          <p>{data.footerNote.trim() || 'Terima kasih atas kunjungan Anda!'}</p>
        </div>

        {/* Bottom Serrated Edge Decoration (Inline SVG) */}
        <div className="absolute -bottom-2.5 left-0 right-0 h-3 overflow-hidden">
          <svg
            className="w-full h-full text-[#FFFDF9] fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 200 10"
          >
            <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 105,10 110,0 115,10 120,0 125,10 130,0 135,10 140,0 145,10 150,0 155,10 160,0 165,10 170,0 175,10 180,0 185,10 190,0 195,10 200,0" />
          </svg>
        </div>
      </div>

      {/* Helper hint under struk */}
      <div className="flex items-center gap-2 text-text-muted px-2 pt-1">
        <Printer className="w-4 h-4 shrink-0" />
        <span className="text-xs">
          Format struk kompatibel dengan printer Bluetooth 58mm/80mm ESC/POS.
        </span>
      </div>
    </div>
  );
};
