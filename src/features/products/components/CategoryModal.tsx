import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏷️');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon isi nama kategori!');
      return;
    }
    onSave(name.trim(), emoji.trim() || '🏷️');
    setName('');
    setEmoji('🏷️');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-surface-bg flex items-center justify-between border-b border-border-subtle/60">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface">Tambah Kategori Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Nama Kategori <span className="text-status-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Frozen Food, Rokok, Minuman Dingin"
                className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">
                Ikon Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="Contoh: 🧊, 🍜, 🥫"
                className="w-24 px-3.5 py-2.5 bg-surface-bg rounded-lg text-lg text-center text-on-surface ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-card outline-none transition-all"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-surface-bg border-t border-border-subtle/60 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-on-surface cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container shadow-xs cursor-pointer transition-colors"
            >
              Simpan Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
