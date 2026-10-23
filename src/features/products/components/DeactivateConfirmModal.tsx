import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
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

export interface DeactivateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  itemName: string;
  itemType?: 'kategori' | 'produk';
  isActivating?: boolean;
  isLoading?: boolean;
  warningText?: string;
}

export const DeactivateConfirmModal: React.FC<DeactivateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'kategori',
  isActivating = false,
  isLoading = false,
  warningText,
}) => {
  const isCategory = itemType === 'kategori';
  const actionWord = isActivating ? 'Aktifkan' : 'Nonaktifkan';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent size="sm" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isActivating
                ? 'bg-status-success/15 text-status-success'
                : 'bg-status-danger/10 text-status-danger'
            }`}
          >
            {isActivating ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <DialogTitle className="text-base font-bold text-on-surface">
              {isActivating ? `Aktifkan ${isCategory ? 'Kategori' : 'Produk'}` : `Nonaktifkan ${isCategory ? 'Kategori' : 'Produk'}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              {isActivating
                ? `Pulihkan item ini kembali ke katalog aktif.`
                : `Item ini tidak akan dihapus permanen, hanya dinonaktifkan.`}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Body */}
        <DialogBody className="p-6 space-y-3.5">
          <p className="text-sm text-on-surface leading-relaxed">
            Apakah Anda yakin ingin {isActivating ? 'mengaktifkan kembali' : 'menonaktifkan'}{' '}
            {itemType}{' '}
            <span className="font-bold text-on-surface underline decoration-primary/40 underline-offset-2">
              "{itemName}"
            </span>
            ?
          </p>

          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isActivating
                ? 'bg-status-success/5 border-status-success/20 text-on-surface'
                : 'bg-status-warning/10 border-status-warning/30 text-on-surface'
            }`}
          >
            <ShieldAlert
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                isActivating ? 'text-status-success' : 'text-status-warning'
              }`}
            />
            <p className="text-xs text-text-muted leading-relaxed">
              {warningText ||
                (isActivating
                  ? `${isCategory ? 'Kategori' : 'Produk'} akan kembali muncul di daftar aktif serta dapat dipilih pada kasir (POS).`
                  : `${isCategory ? 'Kategori' : 'Produk'} akan dipindahkan ke tabel non-aktif dan disembunyikan dari transaksi kasir. Data transaksi historis tetap aman.`)}
            </p>
          </div>
        </DialogBody>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant={isActivating ? 'primary' : 'danger'}
            isLoading={isLoading}
            onClick={onConfirm}
            className="gap-1.5"
          >
            <span>{isActivating ? 'Ya, Aktifkan' : `Ya, ${actionWord}`}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
