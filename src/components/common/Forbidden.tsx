import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import Button from '../ui/Button';

export interface ForbiddenProps {
  title?: string;
  message?: string;
  requiredPermission?: string;
  onBack?: () => void;
  showHomeButton?: boolean;
}

export const Forbidden: React.FC<ForbiddenProps> = ({
  title = '403 - Akses Ditolak',
  message = 'Maaf, Anda tidak memiliki izin atau hak akses yang cukup untuk membuka halaman ini.',
  requiredPermission,
  onBack,
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
      {/* Visual Badge / Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/10 text-rose-600">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-xl shadow-md border border-slate-100 text-slate-500">
          <Lock className="w-4 h-4 text-rose-500" />
        </div>
      </div>

      {/* Text Info */}
      <div className="max-w-md space-y-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full">
          Error 403 • Forbidden
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#131b2e] pt-2">
          {title}
        </h1>
        <p className="text-sm text-[#64748B] leading-relaxed">
          {message}
        </p>

        {requiredPermission && (
          <div className="mt-3 inline-block bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#131b2e] font-mono">
            Izin dibutuhkan: <span className="font-semibold text-rose-600">{requiredPermission}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="border-slate-300 hover:bg-slate-50"
        >
          Kembali
        </Button>

        {showHomeButton && (
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Menuju Dashboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default Forbidden;
