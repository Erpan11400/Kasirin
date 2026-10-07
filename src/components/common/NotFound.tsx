import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import Button from '../ui/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
      <div className="w-20 h-20 bg-surface-container-low border border-border-subtle rounded-3xl flex items-center justify-center shadow-xs text-primary mb-6">
        <FileQuestion className="w-10 h-10" />
      </div>

      <div className="max-w-md space-y-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 border border-primary/20 px-3 py-1 rounded-full">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface pt-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Halaman atau URL yang Anda tuju tidak tersedia, telah dipindahkan, atau belum terdaftar.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
          leftIcon={<Home className="w-4 h-4" />}
        >
          Ke Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
