import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'top-center';

export interface ToastInfoObject {
  show?: boolean;
  message?: string;
  type?: ToastType;
}

export interface ToastProps {
  show?: boolean;
  message?: React.ReactNode;
  children?: React.ReactNode;
  title?: React.ReactNode;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
  icon?: React.ReactNode;
  className?: string;
  /**
   * Dukungan backward-compatibility untuk objek info (misal: state `{ show, message }`)
   */
  toast?: ToastInfoObject;
}

const positionStyles: Record<ToastPosition, string> = {
  'bottom-right': 'bottom-6 right-4 sm:right-6',
  'bottom-left': 'bottom-6 left-4 sm:left-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-6 right-4 sm:right-6',
  'top-left': 'top-6 left-4 sm:left-6',
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
};

const defaultIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
};

const typeBorders: Record<ToastType, string> = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  warning: 'border-amber-500/30',
  info: 'border-sky-500/30',
};

export const Toast: React.FC<ToastProps> = ({
  show,
  message,
  children,
  title,
  type = 'success',
  position = 'bottom-right',
  duration,
  onClose,
  icon,
  className,
  toast,
}) => {
  // Evaluasi visibilitas toast
  const isVisible =
    toast?.show !== undefined
      ? toast.show
      : show !== undefined
      ? show
      : Boolean(message || children);

  const effectiveType = toast?.type || type;
  const content = children || message || toast?.message;

  // Auto-dismiss handler jika durasi ditentukan dan terdapat callback onClose
  useEffect(() => {
    if (!isVisible || !onClose || !duration) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible || !content) return null;

  return (
    <div
      className={cn(
        'fixed z-50 transform transition-all duration-300 max-w-[calc(100vw-2rem)] sm:max-w-md',
        'animate-in fade-in zoom-in-95 duration-200 pointer-events-auto',
        positionStyles[position]
      )}
    >
      <div
        className={cn(
          'px-4 py-3 bg-[#131b2e] text-white rounded-xl shadow-2xl flex items-center gap-3 border',
          typeBorders[effectiveType],
          className
        )}
      >
        {/* Icon status */}
        <div className="shrink-0 flex items-center justify-center">
          {icon || defaultIcons[effectiveType]}
        </div>

        {/* Content text */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          {title && (
            <span className="text-sm font-semibold text-white tracking-tight">
              {title}
            </span>
          )}
          <span
            className={cn(
              title
                ? 'text-xs text-slate-300 mt-0.5 leading-relaxed'
                : 'text-xs sm:text-sm font-medium text-white leading-snug'
            )}
          >
            {content}
          </span>
        </div>

        {/* Tombol Close manual jika onClose disediakan */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0 ml-1 hover:bg-white/10"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
