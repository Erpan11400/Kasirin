import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import TextField from '../../../components/ui/TextField';
import Toast, { type ToastType } from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: ToastType;
    title: string;
    message: string;
  } | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Silakan isi email dan kata sandi Anda terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await login({
        email: email.trim(),
        password,
      });

      setToast({
        type: 'success',
        title: 'Login Berhasil',
        message: `Selamat datang kembali, ${data.name || 'User'}! Menyiapkan dashboard...`,
      });

      const destination = (location.state as any)?.from?.pathname || '/';
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 1000);
    } catch (err: any) {
      const message = err?.message || 'Email atau kata sandi tidak valid. Silakan coba lagi.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Error Alert Box - Di atas field Email */}
        {errorMessage && (
          <div
            role="alert"
            className="bg-red-50/90 border border-red-200/90 rounded-xl p-3.5 flex gap-3 items-start transition-all animate-in fade-in zoom-in-95 duration-200"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-red-900 leading-tight">
                Gagal Masuk
              </p>
              <p className="text-xs text-red-700 leading-relaxed mt-0.5">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-700 p-0.5 rounded-lg hover:bg-red-100/80 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
              aria-label="Tutup pesan error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Field Username / Email */}
        <TextField
          label="Email"
          icon={User}
          placeholder="Masukkan Email"
          value={email}
          onChange={handleEmailChange}
          autoComplete="email"
        />

        {/* Field Password */}
        <TextField
          label="Kata Sandi"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="current-password"
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