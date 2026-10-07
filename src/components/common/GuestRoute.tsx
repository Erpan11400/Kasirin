import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Loader2 } from 'lucide-react';

export const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-sm">
            <Store className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#006948]" />
            <span>Memverifikasi sesi...</span>
          </div>
        </div>
      </div>
    );
  }

  // Jika sudah terautentikasi, alihkan ke halaman yang dituju sebelumnya atau ke root dashboard '/'
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
