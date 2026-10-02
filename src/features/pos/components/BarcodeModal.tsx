import React from 'react';
import { ScanBarcode, X } from 'lucide-react';

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanMock: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  isOpen,
  onClose,
  onScanMock,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-xl p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanBarcode className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-on-surface">
              Scan Barcode Produk
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-text-muted hover:text-on-surface flex items-center justify-center cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder animation */}
        <div className="relative w-full h-44 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
          <div className="w-48 h-28 border-2 border-emerald-400 rounded-lg relative flex items-center justify-center">
            <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_#34d399] animate-pulse"></div>
            <span className="text-[11px] font-mono opacity-60">
              Arahkan ke barcode
            </span>
          </div>
        </div>

        <p className="text-xs text-text-muted text-center">
          Gunakan laser scanner handheld USB/Bluetooth atau masukkan barcode manual di kolom pencarian.
        </p>

        <button
          onClick={onScanMock}
          className="h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          type="button"
        >
          Simulasi Scan: Beras Pandan Wangi
        </button>
      </div>
    </div>
  );
};
