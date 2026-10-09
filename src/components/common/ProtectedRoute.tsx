import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Loader2 } from 'lucide-react';
import Forbidden from './Forbidden';
interface ProtectedRouteProps {
  requiredPermission?: string | string[];
  requiredModule?: string;
  requiredAction?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  requiredModule,
  requiredAction,
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  // Saat pengecekan awal autentikasi (token verification) sedang berlangsung
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-sm">
            <Store className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Memverifikasi sesi akses KasirIn...</span>
          </div>
        </div>
      </div>
    );
  }

  // Jika belum login / sesi tidak valid, alihkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika route memerlukan izin spesifik
  if (requiredPermission) {
    const isAllowed = Array.isArray(requiredPermission)
      ? requiredPermission.some((perm) => hasPermission(perm))
      : hasPermission(requiredPermission);

    if (!isAllowed) {
      const permLabel = Array.isArray(requiredPermission)
        ? requiredPermission.join(' atau ')
        : requiredPermission;

      return (
        <Forbidden
          requiredPermission={permLabel}
          message={`Akun Anda tidak memiliki hak akses yang diperlukan (${permLabel}) untuk membuka halaman ini.`}
        />
      );
    }
  }

  if (requiredModule && requiredAction && !hasPermission(requiredModule, requiredAction)) {
    const permKey = `${requiredModule}:${requiredAction}`;
    return (
      <Forbidden
        requiredPermission={permKey}
        message={`Anda tidak memiliki izin untuk modul ${requiredModule} dengan aksi ${requiredAction}.`}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
