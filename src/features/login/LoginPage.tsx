import React from 'react';
import { Shield, LockKeyhole, Zap } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import BrandLogo from '../../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 relative overflow-hidden font-sans">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#006948]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex flex-col items-center">
            <BrandLogo variant="pill" size="xl" layout="vertical" />
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Sistem Kasir Pintar & Terintegrasi untuk UMKM
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e]">Masuk ke Sistem</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Gunakan kredensial kasir atau admin Anda
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-center gap-3 text-xs text-[#64748B] pt-2">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#006948]" />
              <span>Enkripsi JWT</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <LockKeyhole size={14} className="text-[#006948]" />
              <span>Sesi Dilindungi</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#006948]" />
              <span>POS UMKM Siap Pakai</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            v2.4.0-build.2026
          </span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;