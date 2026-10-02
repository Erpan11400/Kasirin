import React from 'react';
import { Receipt, X, Printer } from 'lucide-react';
import type { TransactionRecord } from '../../../types/report';
import { formatRupiah } from '../../../lib/formatters';

interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
}

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 bg-surface-container-low -mx-6 -mt-6 p-6 border-b border-border-subtle/60">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-on-surface">Detail Struk Digital</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-surface-card text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Simulation */}
        <div className="bg-surface-bg p-4 rounded-xl space-y-3 font-mono text-[13px] text-on-surface border border-border-subtle/60">
          <div className="text-center pb-2 border-b border-dashed border-border-subtle">
            <div className="font-bold text-[15px]">TOKO SEMBAKO JAYA</div>
            <div className="text-[11px] text-text-muted">Jl. Merdeka No. 45, Jakarta Selatan</div>
            <div className="text-[11px] text-text-muted">Telp: 0812-3456-7890</div>
          </div>

          <div className="flex justify-between text-xs pt-1">
            <span className="text-text-muted">Invoice:</span>
            <span className="font-bold text-primary">{transaction.invoiceId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Waktu:</span>
            <span>{transaction.dateTime}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Metode:</span>
            <span className="font-bold">{transaction.paymentMethod}</span>
          </div>

          <div className="py-2 space-y-1.5 bg-surface-card p-3 rounded-lg border border-border-subtle/40">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span>
                  {item.name} ({item.qty}x)
                </span>
                <span>{formatRupiah(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm font-bold pt-1 text-on-surface border-t border-dashed border-border-subtle">
            <span>TOTAL TRANSAKSI</span>
            <span className="text-primary text-base">{formatRupiah(transaction.total)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => window.print()}
            type="button"
            className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-variant transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
