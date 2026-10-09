import React from 'react';
import { ScanBarcode, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import type { BarcodeModalProps } from '../../../types/pos';

export type { BarcodeModalProps };

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  isOpen,
  onClose,
  onScanMock,
  mockProductName = 'Produk',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        size="md"
        showCloseButton={false}
        className="rounded-2xl border border-border-subtle"
      >
        <DialogHeader className="px-5 py-4 flex flex-row items-center justify-between border-b border-border-subtle bg-surface-container-high/50">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-on-surface">
            <ScanBarcode className="w-6 h-6 text-primary" />
            <span>Scan Barcode Produk</span>
          </DialogTitle>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-text-muted hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer outline-none"
            type="button"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <DialogBody className="p-5 flex flex-col gap-4 text-on-surface">
          {/* Viewfinder animation */}
          <div className="relative w-full h-44 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
            <div className="w-48 h-28 border-2 border-emerald-400 rounded-lg relative flex items-center justify-center">
              <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_#34d399] animate-pulse"></div>
              <span className="text-[11px] font-mono opacity-60">
                Arahkan ke barcode
              </span>
            </div>
          </div>

          <p className="text-xs text-text-muted text-center leading-relaxed">
            Gunakan laser scanner handheld USB/Bluetooth atau masukkan barcode manual di kolom pencarian.
          </p>

          <Button
            variant="primary"
            onClick={onScanMock}
            className="w-full h-11 text-sm font-semibold rounded-xl"
          >
            Simulasi Scan: {mockProductName}
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

