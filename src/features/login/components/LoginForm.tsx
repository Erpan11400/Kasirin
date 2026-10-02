import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import TextField from '../../../components/ui/TextField';
import Toast, { type ToastType } from '../../../components/ui/Toast';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: ToastType;
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi respons backend/autentikasi (1 detik)
    setTimeout(() => {
      setIsLoading(false);

      if (email.trim() && password.trim()) {
        setToast({
          type: 'success',
          title: 'Login Berhasil',
          message: `Selamat datang kembali! Menyiapkan dashboard...`,
        });

        // Arahkan ke dashboard setelah notifikasi muncul
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setToast({
          type: 'error',
          title: 'Login Gagal',
          message: 'Silakan isi email dan kata sandi Anda terlebih dahulu.',
        });
      }
    }, 1000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Field Username */}
        <TextField
          label="Email"
          icon={User}
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Field Password */}
        <TextField
          label="Kata Sandi"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightElement={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="h-7 w-7 rounded-lg text-[#64748B] hover:text-[#131b2e] p-0"
              tabIndex={-1}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </Button>
          }
        />

        {/* Security Alert Box */}
        <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3 flex gap-3 items-start">
          <ShieldCheck size={18} className="text-[#006948] shrink-0 mt-0.5" />
          <p className="text-xs text-[#64748B] leading-relaxed">
            <strong className="text-[#131b2e] font-semibold">Akses Tertutup:</strong> Akun kasir dan izin peran didaftarkan oleh Administrator gerai.
          </p>
        </div>

        {/* Submit Button */}
        <Button type='submit' rightIcon={<ArrowRight size={18} />} isLoading={isLoading}>Masuk</Button>
      </form>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          position="top-right"
          duration={3500}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};