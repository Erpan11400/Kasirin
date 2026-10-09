import React from 'react';
import { Receipt, X, Printer } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { ThermalReceipt } from '../../../components/receipt/ThermalReceipt';
import { useStore } from '../../../context/StoreContext';
import { useAuth } from '../../../context/AuthContext';
import type { ReceiptModalProps, PaymentMethod } from '../../../types/pos';

export type { ReceiptModalProps };

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
  invoiceNumber = 'INV-20261007-001',
}) => {
  const { store } = useStore();
  const { user } = useAuth();

  const paymentLabelMap: Record<PaymentMethod, string> = {
    tunai: 'Tunai',
    qris: 'QRIS',
    transfer: 'Transfer',
  };

  const formattedItems = cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    qty: item.qty,
    total: item.price * item.qty,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        size="sm"
        showCloseButton={false}
        className="max-w-sm rounded-2xl overflow-hidden p-0 gap-0 border border-border-subtle"
      >
        {/* Top bar header */}
        <DialogHeader className="bg-surface-container-high px-4 py-3 flex flex-row items-center justify-between border-b border-border-subtle rounded-none">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-on-surface">
            <Receipt className="w-5 h-5 text-primary" />
            <span>Pratinjau Struk Kasir</span>
          </DialogTitle>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-text-muted hover:text-on-surface hover:bg-surface-card flex items-center justify-center transition-colors cursor-pointer outline-none"
            type="button"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        {/* Thermal Receipt Paper Container */}
        <div className="p-4 sm:p-5 bg-amber-50/40 select-text max-h-[65vh] overflow-y-auto scrollbar-thin">
          <ThermalReceipt
            store={store}
            items={formattedItems}
            subtotal={subtotal}
            tax={tax}
            total={total}
            paymentMethod={paymentLabelMap[paymentMethod] || paymentMethod}
            cashGiven={paymentMethod === 'tunai' ? cashGiven : total}
            change={paymentMethod === 'tunai' ? change : 0}
            invoiceNumber={invoiceNumber}
            cashierName={user?.name || 'Kasir'}
            paperWidth="58mm"
            showSerratedEdges={false}
            className="shadow-xs border-amber-200/60"
          />
        </div>

        {/* Footer actions */}
        <DialogFooter className="p-4 bg-surface-card border-t border-border-subtle flex items-center gap-2 rounded-none">
          <Button
            variant="primary"
            onClick={onPrint}
            leftIcon={<Printer className="w-5 h-5" />}
            className="flex-1 h-11"
          >
            Cetak Struk
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-4 h-11"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
