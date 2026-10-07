import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { GuestRoute } from './components/common/GuestRoute';
import { NotFound } from './components/common/NotFound';
import { MainLayout } from './components/layouts/MainLayout';
import { PosPage } from './features/pos/PosPage';
import { ProductPage } from './features/products/ProductPage';
import { ReportPage } from './features/report/ReportPage';
import { StorePage } from './features/store/StorePage';
import { UsersPage } from './features/users/UsersPage';
import LoginPage from './features/login/LoginPage';
import Testing from './features/testing/Testing';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest / Public Only Routes (Diarahkan ke '/' jika sudah login) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected Routes (Wajib Login & Cek Sesi pada Setiap Akses) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<PosPage />} />
              <Route path="transaksi" element={<PosPage />} />
              <Route path="produk" element={<ProductPage />} />
              <Route path="laporan" element={<ReportPage />} />
              <Route path="pengaturan-toko" element={<StorePage />} />

              {/* Khusus Pengaturan Users & Hak Akses (Wajib Izin users:view atau roles:view) */}
              <Route element={<ProtectedRoute requiredPermission={['users:view', 'roles:view']} />}>
                <Route path="pengaturan-users" element={<UsersPage />} />
              </Route>

              <Route path="testing" element={<Testing />} />
              {/* Not Found inside protected layout */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          {/* Fallback 404 / Unknown route outside layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
