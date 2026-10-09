import React from 'react';
import { Receipt, X, Printer } from 'lucide-react';

import { ThermalReceipt } from '../../../components/receipt/ThermalReceipt';
import { useStore } from '../../../context/StoreContext';
import type { ReceiptDetailModalProps } from '../../../types/report';

export type { ReceiptDetailModalProps };

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { store } = useStore();

  if (!isOpen || !transaction) return null;

  const formattedItems = transaction.items.map((item, idx) => ({
    id: `item-${idx}`,
    name: item.name,
    price: item.price,
    qty: item.qty,
    total: item.price * item.qty,
  }));

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-0 space-y-0 animate-in fade-in zoom-in-95 duration-200 border border-border-subtle">
        {/* Header */}
        <div className="flex items-center justify-between bg-surface-container-high px-4 py-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-on-surface">Detail Struk Digital</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-lg text-text-muted hover:text-on-surface hover:bg-surface-card flex items-center justify-center transition-colors cursor-pointer outline-none"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Receipt Body */}
        <div className="p-4 bg-amber-50/40 select-text max-h-[65vh] overflow-y-auto scrollbar-thin">
          <ThermalReceipt
            store={store}
            items={formattedItems}
            total={transaction.total}
            paymentMethod={transaction.paymentMethod}
            invoiceNumber={transaction.invoiceId}
            cashierName={transaction.cashierName || 'Kasir'}
            date={transaction.dateTime}
            paperWidth="58mm"
            showSerratedEdges={false}
            className="shadow-xs border-amber-200/60"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-card border-t border-border-subtle flex items-center gap-2">
          <button
            onClick={() => window.print()}
            type="button"
            className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-4 h-10 rounded-lg bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-variant transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
