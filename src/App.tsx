import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';
import { PosPage } from './features/pos/PosPage';
import { ProductPage } from './features/products/ProductPage';
import { ReportPage } from './features/report/ReportPage';
import { StorePage } from './features/store/StorePage';
import { UsersPage } from './features/users/UsersPage';
import LoginPage from './features/login/LoginPage';
import Testing from './features/testing/Testing';

export default function App() {

  // const isAuthenticated = true

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PosPage />} />
          <Route path="transaksi" element={<PosPage />} />
          <Route path="produk" element={<ProductPage />} />
          <Route path="laporan" element={<ReportPage />} />
          <Route path="pengaturan-toko" element={<StorePage />} />
          <Route path="pengaturan-users" element={<UsersPage />} />
          <Route path="testing" element={<Testing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
