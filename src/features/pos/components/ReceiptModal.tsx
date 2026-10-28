import React, { useState } from 'react';
import { Receipt, X, Printer, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { ThermalReceipt } from '../../../components/receipt/ThermalReceipt';
import { printThermalReceipt } from '../../../components/receipt/printReceipt';
import { useStore } from '../../../context/StoreContext';
import { useAuth } from '../../../context/AuthContext';
import { downloadReceiptPdf } from '../../../services/exportService';
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
  invoiceNumber = '-',
  transactionId,
}) => {
  const { store } = useStore();
  const { user } = useAuth();

  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('80mm');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

  const targetId = transactionId || (invoiceNumber !== '-' ? invoiceNumber : '');

  const showTemporaryFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Handler download PDF struk resmi dari backend Puppeteer
  const handleDownloadPdf = async () => {
    if (!targetId) {
      showTemporaryFeedback('error', 'ID Transaksi belum tersedia untuk mengunduh struk.');
      return;
    }

    try {
      setIsDownloading(true);
      await downloadReceiptPdf({
        transactionId: targetId,
        paperWidth,
        cashierName: user?.name || 'Kasir',
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
      const success = printThermalReceipt('pos-thermal-receipt', {
        paperWidth,
        documentTitle: `Struk_${invoiceNumber || 'KasirIn'}`,
        onAfterPrint: () => {
          setIsPrinting(false);
        },
      });

      if (success) {
        showTemporaryFeedback('success', `Dialog cetak thermal (${paperWidth}) dibuka.`);
        if (onPrint) onPrint();
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

        {/* Thermal Receipt Paper Container */}
        <div className="p-4 sm:p-5 bg-slate-100/70 select-text max-h-[60vh] overflow-y-auto scrollbar-thin">
          <ThermalReceipt
            id="pos-thermal-receipt"
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
            paperWidth={paperWidth}
            showSerratedEdges={false}
            className="shadow-xs border-slate-200"
          />
        </div>

        {/* Footer actions */}
        <DialogFooter className="p-3.5 bg-surface-card border-t border-border-subtle flex flex-row items-center gap-2 rounded-none">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
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
            variant="primary"
            onClick={handlePrintReceipt}
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
            variant="ghost"
            onClick={onClose}
            disabled={isDownloading || isPrinting}
            className="px-3 h-10 text-xs text-text-muted hover:text-on-surface"
          >
            Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
