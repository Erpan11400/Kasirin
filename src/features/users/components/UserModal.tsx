import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, KeyRound, X } from 'lucide-react';
import type { UserItem, RoleItem } from '../../../types/users';

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserItem | null;
  roles: RoleItem[];
  onSave: (data: Partial<UserItem> & { password?: string }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onSave,
}) => {
  const isEditMode = Boolean(user);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.name);
        setUsername(user.username.replace(/^@/, ''));
        setRole(user.role);
        setPassword('');
      } else {
        setName('');
        setUsername('');
        setRole(roles[1]?.name || roles[0]?.name || 'Kasir');
        setPassword('');
      }
    }
  }, [isOpen, user, roles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    const formattedUsername = username.startsWith('@')
      ? username.trim()
      : `@${username.trim()}`;

    if (isEditMode && user) {
      onSave({
        ...user,
        name: name.trim(),
        username: formattedUsername,
        role,
        ...(password.trim() ? { password: password.trim() } : {}),
      });
    } else {
      const avatarUrl =
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      onSave({
        name: name.trim(),
        username: formattedUsername,
        role,
        status: 'Aktif',
        avatarUrl,
        password: password.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col gap-5 m-2 sm:m-4 border border-border-subtle">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isEditMode
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-primary-fixed text-on-primary-fixed'
              }`}
            >
              {isEditMode ? (
                <Edit3 className="w-5 h-5 text-secondary" />
              ) : (
                <UserPlus className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-[18px] sm:text-xl font-bold text-on-surface">
                {isEditMode ? 'Edit Data & Akses Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <p className="text-xs text-text-muted">
                {isEditMode && user
                  ? `Mengubah akun ${user.username}`
                  : 'Tambahkan akun staf kasir atau admin baru untuk akses sistem toko.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-text-muted hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Nama Lengkap <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dedi Setiawan"
              className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Username (ID Kasir/Staf) <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: dedi_kasir"
              className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Peran (Role) <span className="text-error">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-border-subtle"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Password section */}
          {isEditMode ? (
            <div className="p-3.5 bg-surface-bg rounded-xl flex flex-col gap-2 border border-border-subtle">
              <div className="flex items-center gap-1.5 text-tertiary font-semibold text-xs">
                <KeyRound className="w-4 h-4" /> Reset Password
              </div>
              <p className="text-xs text-text-muted">
                Biarkan kosong jika tidak ingin mengubah kata sandi akun pengguna ini.
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ketik kata sandi baru (opsional)"
                className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle placeholder:text-text-muted"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Password Masuk <span className="text-error">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
                className="w-full px-3.5 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-surface-container transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              {isEditMode ? 'Simpan Perubahan' : 'Simpan Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
