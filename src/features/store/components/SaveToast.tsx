import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SaveToastProps {
  show: boolean;
}

export const SaveToast: React.FC<SaveToastProps> = ({ show }) => {
  return (
    <div
      className={`fixed top-20 right-6 z-50 transform transition-all duration-300 flex items-center gap-3 bg-surface-card shadow-xl border border-border-subtle/80 px-5 py-3.5 rounded-xl ${
        show
          ? 'translate-y-0 opacity-100'
          : '-translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-on-surface">Pembaruan Berhasil</span>
        <span className="text-xs text-text-muted">
          Perubahan profil toko berhasil disimpan dan terintegrasi dengan struk.
        </span>
      </div>
    </div>
  );
};
