import React from 'react';
import { Receipt, Printer } from 'lucide-react';
import { ThermalReceipt } from '../../../components/receipt/ThermalReceipt';
import { useStore } from '../../../context/StoreContext';
import type { ReceiptDetailModalProps } from '../../../types/report';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';

export type { ReceiptDetailModalProps };

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { store } = useStore();

  if (!transaction) return null;

  const formattedItems = transaction.items.map((item, idx) => ({
    id: `item-${idx}`,
    name: item.name,
    price: item.price,
    qty: item.qty,
    total: item.price * item.qty,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="sm" className="p-0 overflow-hidden max-w-sm">
        {/* Header */}
        <DialogHeader className="bg-surface-container-high px-4 py-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <div>
              <DialogTitle className="text-sm font-bold text-on-surface">
                Detail Struk Digital
              </DialogTitle>
              <DialogDescription className="text-[11px] text-text-muted sr-only">
                Tampilan struk digital transaksi {transaction.invoiceId}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Thermal Receipt Body */}
        <DialogBody className="p-4 bg-amber-50/40 select-text max-h-[65vh] overflow-y-auto scrollbar-thin">
          <ThermalReceipt
            store={store}
            items={formattedItems}
            total={transaction.total}
            paymentMethod={transaction.paymentMethod}
            cashGiven={transaction.paidAmount}
            change={transaction.changeAmount}
            invoiceNumber={transaction.invoiceId}
            cashierName={transaction.cashierName || 'Kasir'}
            date={transaction.dayDate || transaction.dateTime}
            paperWidth="58mm"
            showSerratedEdges={false}
            className="shadow-xs border-amber-200/60"
          />
        </DialogBody>

        {/* Footer Actions */}
        <DialogFooter className="p-4 bg-surface-card border-t border-border-subtle flex flex-row items-center gap-2">
          <Button
            onClick={() => window.print()}
            type="button"
            variant="primary"
            size="default"
            leftIcon={<Printer className="w-4 h-4" />}
            className="flex-1"
          >
            Cetak Struk
          </Button>
          <Button
            onClick={onClose}
            type="button"
            variant="secondary"
            size="default"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
