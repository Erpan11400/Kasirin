import React from 'react';
import { Eye, Printer } from 'lucide-react';
import type { StoreProfileData } from '../../../types/store';
import { ThermalReceipt } from '../../../components/receipt/ThermalReceipt';

interface ThermalReceiptPreviewProps {
  data: StoreProfileData;
}

const PREVIEW_SAMPLE_ITEMS = [
  { id: '1', name: 'Beras Pandan Wangi 5kg', price: 68000, qty: 1, total: 68000 },
  { id: '2', name: 'Minyak Goreng Sania 2L', price: 34500, qty: 1, total: 34500 },
  { id: '3', name: 'Gula Pasir Gulaku 1kg', price: 16500, qty: 2, total: 33000 },
];

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

      {/* Reusable Thermal Receipt Component */}
      <ThermalReceipt
        store={data}
        items={PREVIEW_SAMPLE_ITEMS}
        subtotal={135500}
        total={135500}
        paymentMethod="Tunai"
        cashGiven={150000}
        change={14500}
        invoiceNumber="#TRX-20231024-0042"
        cashierName="Sari Dewi"
        date="24/10/2023 09:41"
        paperWidth="58mm"
      />

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
