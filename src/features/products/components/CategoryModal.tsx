import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import type { CategoryModalProps } from '../../../types/products';
import { getCategoryEmojiAndStyle } from '../../../services/CategoryAction';
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

export type { CategoryModalProps };

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏷️');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setEmoji(editingCategory.emoji || '🏷️');
    } else {
      setName('');
      setEmoji('🏷️');
    }
  }, [editingCategory, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory && (emoji === '🏷️' || !emoji)) {
      const autoStyle = getCategoryEmojiAndStyle(val);
      if (autoStyle.emoji !== '🏷️') {
        setEmoji(autoStyle.emoji);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    await onSave(name.trim(), emoji.trim() || '🏷️');
  };

  const isEdit = Boolean(editingCategory);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent size="md" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <DialogTitle className="text-base sm:text-lg font-bold text-on-surface">
              {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              {isEdit
                ? 'Perbarui informasi dan nama kategori produk toko.'
                : 'Tambahkan nama kategori baru untuk mengelompokkan produk katalog.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Nama Kategori <span className="text-status-danger">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Misal: Frozen Food, Rokok, Minuman Dingin"
                className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Ikon Emoji
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="🏷️"
                  className="w-20 px-3 py-2.5 bg-surface-bg rounded-lg text-xl text-center text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all disabled:opacity-50"
                />
                <span className="text-xs text-text-muted">
                  Emoji akan otomatis menyesuaikan dengan nama kategori yang diketik.
                </span>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Kategori'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
