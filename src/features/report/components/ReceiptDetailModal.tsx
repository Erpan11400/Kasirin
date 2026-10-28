import React, { useState } from 'react';
import { Receipt, Printer, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThermalReceipt } from '../../../components/receipt/ThermalReceipt';
import { printThermalReceipt } from '../../../components/receipt/printReceipt';
import { useStore } from '../../../context/StoreContext';
import { downloadReceiptPdf } from '../../../services/exportService';
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

  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('80mm');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (!transaction) return null;

  const showTemporaryFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const formattedItems = transaction.items.map((item, idx) => ({
    id: `item-${idx}`,
    name: item.name,
    price: item.price,
    qty: item.qty,
    total: item.price * item.qty,
  }));

  const targetId = transaction.id || transaction.invoiceId;

  // Handler download PDF struk resmi dari backend
  const handleDownloadPdf = async () => {
    if (!targetId) {
      showTemporaryFeedback('error', 'ID Transaksi tidak ditemukan.');
      return;
    }

    try {
      setIsDownloading(true);
      await downloadReceiptPdf({
        transactionId: targetId,
        paperWidth,
        cashierName: transaction.cashierName || 'Kasir',
      });
      showTemporaryFeedback('success', `Struk PDF (${paperWidth}) berhasil diunduh.`);
    } catch (err: any) {
      console.error('Gagal unduh struk PDF:', err);
      showTemporaryFeedback('error', err?.message || 'Gagal mengunduh struk dari server.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handler cetak instan struk thermal via isolated iframe DOM
  const handlePrintReceipt = () => {
    try {
      setIsPrinting(true);
      const success = printThermalReceipt('report-receipt-detail', {
        paperWidth,
        documentTitle: `Struk_${transaction.invoiceId || 'KasirIn'}`,
        onAfterPrint: () => {
          setIsPrinting(false);
        },
      });

      if (success) {
        showTemporaryFeedback('success', `Dialog cetak thermal (${paperWidth}) dibuka.`);
      } else {
        showTemporaryFeedback('error', 'Gagal memicu pencetakan.');
        setIsPrinting(false);
      }
    } catch (err: any) {
      console.error('Error saat mencetak struk:', err);
      showTemporaryFeedback('error', 'Terjadi kesalahan saat mencetak struk.');
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="sm" className="p-0 overflow-hidden max-w-sm rounded-2xl">
        {/* Header */}
        <DialogHeader className="bg-surface-container-high px-4 py-3 border-b border-border-subtle rounded-none">
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

        {/* Paper Size Switcher Toolbar */}
        <div className="px-4 py-2 bg-surface-container border-b border-border-subtle flex items-center justify-between text-xs">
          <span className="text-text-muted font-medium">Ukuran Thermal:</span>
          <div className="inline-flex rounded-lg bg-surface-container-high p-0.5 border border-border-subtle">
            <button
              type="button"
              onClick={() => setPaperWidth('80mm')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                paperWidth === '80mm'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-on-surface'
              }`}
            >
              80mm (Standar)
            </button>
            <button
              type="button"
              onClick={() => setPaperWidth('58mm')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                paperWidth === '58mm'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-on-surface'
              }`}
            >
              58mm (Kecil)
            </button>
          </div>
        </div>

        {/* Notification Feedback Banner */}
        {feedback && (
          <div
            className={`px-4 py-2 text-xs flex items-center gap-2 border-b ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span className="flex-1 leading-snug">{feedback.message}</span>
          </div>
        )}

        {/* Thermal Receipt Body */}
        <DialogBody className="p-4 bg-slate-100/70 select-text max-h-[60vh] overflow-y-auto scrollbar-thin">
          <ThermalReceipt
            id="report-receipt-detail"
            store={store}
            items={formattedItems}
            total={transaction.total}
            paymentMethod={transaction.paymentMethod}
            cashGiven={transaction.paidAmount}
            change={transaction.changeAmount}
            invoiceNumber={transaction.invoiceId}
            cashierName={transaction.cashierName || 'Kasir'}
            date={transaction.dayDate || transaction.dateTime}
            paperWidth={paperWidth}
            showSerratedEdges={false}
            className="shadow-xs border-slate-200"
          />
        </DialogBody>

        {/* Footer Actions */}
        <DialogFooter className="p-3.5 bg-surface-card border-t border-border-subtle flex flex-row items-center gap-2 rounded-none">
          <Button
            onClick={handleDownloadPdf}
            type="button"
            variant="outline"
            size="default"
            disabled={isDownloading || isPrinting}
            leftIcon={
              isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )
            }
            className="flex-1 h-10 text-xs sm:text-sm font-semibold"
          >
            {isDownloading ? 'Mengunduh...' : 'Unduh PDF'}
          </Button>

          <Button
            onClick={handlePrintReceipt}
            type="button"
            variant="primary"
            size="default"
            disabled={isDownloading || isPrinting}
            leftIcon={
              isPrinting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )
            }
            className="flex-1 h-10 text-xs sm:text-sm font-semibold"
          >
            {isPrinting ? 'Mencetak...' : 'Cetak Struk'}
          </Button>

          <Button
            onClick={onClose}
            type="button"
            variant="ghost"
            size="default"
            disabled={isDownloading || isPrinting}
            className="px-3 h-10 text-xs text-text-muted hover:text-on-surface"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
