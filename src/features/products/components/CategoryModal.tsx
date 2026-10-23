import React, { useState, useEffect } from 'react';
import { Tag, PowerOff, CheckCircle2, Info } from 'lucide-react';
import type { CategoryModalProps } from '../../../types/products';
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
import { DeactivateConfirmModal } from './DeactivateConfirmModal';

export type { CategoryModalProps };

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onToggleStatus,
  editingCategory,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    await onSave(name.trim());
  };

  const handleConfirmToggleStatus = async () => {
    if (!editingCategory || !onToggleStatus) return;
    const newStatus = !editingCategory.isActive;
    try {
      setIsToggling(true);
      await onToggleStatus(editingCategory, newStatus);
      setIsConfirmModalOpen(false);
    } finally {
      setIsToggling(false);
    }
  };

  const isEdit = Boolean(editingCategory);
  const isActive = editingCategory ? editingCategory.isActive !== false : true;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && !isToggling && onClose()}>
        <DialogContent size="md" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden shadow-xl">
          {/* Header */}
          <DialogHeader className="px-6 py-5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2.5">
                <DialogTitle className="text-base sm:text-lg font-bold text-on-surface">
                  {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </DialogTitle>
                {isEdit && (
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isActive
                        ? 'bg-status-success/15 text-status-success'
                        : 'bg-surface-container-highest text-text-muted border border-border-subtle'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-status-success' : 'bg-text-muted'
                      }`}
                    />
                    {isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-text-muted mt-1 leading-relaxed">
                {isEdit
                  ? 'Perbarui nama kategori atau kelola status aktif/nonaktifnya.'
                  : 'Tambahkan nama kategori baru untuk mengelompokkan produk katalog.'}
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody className="p-6 space-y-5">
              {/* Field: Nama Kategori */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Nama Kategori <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting || isToggling}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Makanan, Minuman, Sembako"
                  className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                />
                <p className="text-[11px] text-text-muted mt-1.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Nama kategori akan ditampilkan pada menu kasir dan filter katalog produk.</span>
                </p>
              </div>

              {/* Section Status & Opsi Nonaktif (Hanya muncul saat edit) */}
              {isEdit && onToggleStatus && (
                <div className="pt-2 border-t border-border-subtle">
                  <div
                    className={`p-4 rounded-xl border transition-colors ${
                      isActive
                        ? 'bg-surface-bg/70 border-border-subtle'
                        : 'bg-surface-container-high/40 border-border-subtle'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                            Status Kategori
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-status-success/15 text-status-success'
                                : 'bg-surface-container-highest text-text-muted'
                            }`}
                          >
                            {isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 max-w-sm leading-relaxed">
                          {isActive
                            ? 'Kategori ini aktif dan tersedia untuk produk dan kasir.'
                            : 'Kategori ini dinonaktifkan dan tersimpan di tabel non-aktif.'}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant={isActive ? 'danger' : 'outline'}
                        size="sm"
                        onClick={() => setIsConfirmModalOpen(true)}
                        disabled={isSubmitting || isToggling}
                        className="gap-1.5 shrink-0 self-start sm:self-center"
                      >
                        {isActive ? (
                          <>
                            <PowerOff className="w-3.5 h-3.5" />
                            <span>Nonaktifkan</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                            <span className="text-status-success">Aktifkan Kembali</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogBody>

            {/* Footer */}
            <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || isToggling}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isToggling}
              >
                <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Kategori'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Verifikasi Penonaktifan / Pengaktifan Kategori */}
      {isConfirmModalOpen && editingCategory && (
        <DeactivateConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmToggleStatus}
          itemName={editingCategory.name}
          itemType="kategori"
          isActivating={!isActive}
          isLoading={isToggling}
        />
      )}
    </>
  );
};
