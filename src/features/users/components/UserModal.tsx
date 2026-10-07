import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, KeyRound, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import type { UserItem, RoleItem } from '../../../types/users';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserItem | null;
  roles: RoleItem[];
  onSave: (data: {
    id?: string;
    name: string;
    email: string;
    roleId: string;
    password?: string;
    isActive?: boolean;
  }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onSave,
}) => {
  const { hasPermission } = useAuth();
  const isEditMode = Boolean(user);
  const canSave = isEditMode ? hasPermission('users:update') : hasPermission('users:create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.name);
        setEmail(user.email || '');
        setRoleId(user.roleId || roles[0]?.id || '');
        setPassword('');
      } else {
        setName('');
        setEmail('');
        setRoleId(roles[1]?.id || roles[0]?.id || '');
        setPassword('');
      }
    }
  }, [isOpen, user, roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !roleId) return;

    onSave({
      id: user?.id,
      name: name.trim(),
      email: email.trim(),
      roleId,
      ...(password.trim() ? { password: password.trim() } : {}),
      isActive: user ? user.isActive : true,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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
          <div className="flex flex-col gap-0.5 min-w-0">
            <DialogTitle className="text-base sm:text-lg font-bold text-on-surface">
              {isEditMode ? 'Edit Data & Akses Pengguna' : 'Tambah Pengguna Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              {isEditMode && user
                ? `Mengubah informasi kredensial dan hak akses untuk akun ${user.email || user.name}`
                : 'Tambahkan akun staf kasir atau admin baru untuk akses operasional toko.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <DialogBody className="p-6 flex flex-col gap-4 text-on-surface">
            {/* Field: Nama Lengkap */}
            <TextField
              label="Nama Lengkap"
              required
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
            />

            {/* Field: Email */}
            <TextField
              type="email"
              label="Email Pengguna"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: budi@kasirin.com"
              helperText="Email digunakan untuk proses login akun ke sistem."
            />

            {/* Field: Peran (Role) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Peran (Role) <span className="text-error">*</span>
              </label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger size="md" className="bg-white">
                  <SelectValue placeholder="Pilih Peran (Role)" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password Section */}
            {isEditMode ? (
              <div className="p-3.5 bg-surface-bg rounded-xl flex flex-col gap-2 border border-border-subtle">
                <div className="flex items-center gap-1.5 text-tertiary font-semibold text-xs">
                  <KeyRound className="w-4 h-4" /> Reset Kata Sandi
                </div>
                <p className="text-xs text-text-muted">
                  Biarkan kosong jika tidak ingin mengubah kata sandi akun pengguna ini.
                </p>
                <TextField
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik kata sandi baru (opsional)"
                />
              </div>
            ) : (
              <TextField
                type="password"
                label="Kata Sandi Masuk"
                required
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
              />
            )}
          </DialogBody>

          {/* Footer Actions */}
          <DialogFooter className="px-6 py-4 bg-surface-container-high/30 border-t border-border-subtle flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>
            {canSave && (
              <Button
                type="submit"
                variant="primary"
              >
                {isEditMode ? 'Simpan Perubahan' : 'Simpan Pengguna'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
