import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ToastInfo } from '../../../types/pos';

interface ToastProps {
  toast: ToastInfo;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 transition-all duration-300 pointer-events-none ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};
