import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 transform transition-all duration-300 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5">
      <div className="px-4 py-3 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-xl flex items-center gap-3 border border-slate-700/50">
        <CheckCircle2 className="w-5 h-5 text-secondary-fixed shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};
