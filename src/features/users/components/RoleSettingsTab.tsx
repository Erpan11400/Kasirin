import React from 'react';
import {
  Shield,
  Monitor,
  Store,
  PlusCircle,
  Lock,
  Trash2,
  KeyRound,
  Pencil,
  Info,
  Users,
} from 'lucide-react';
import type { RoleItem } from '../../../types/users';

interface RoleSettingsTabProps {
  roles: RoleItem[];
  selectedRoleId?: string;
  onSelectRole?: (roleId: string) => void;
  onOpenAddRoleModal: () => void;
  onOpenEditRoleModal: (role: RoleItem) => void;
  onUpdateRolePermissions?: (roleId: string, permissions: RoleItem['permissions']) => void;
  onDeleteRole: (roleId: string) => void;
  showToast?: (msg: string) => void;
}

export const RoleSettingsTab: React.FC<RoleSettingsTabProps> = ({
  roles,
  onOpenAddRoleModal,
  onOpenEditRoleModal,
  onDeleteRole,
}) => {
  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'pos':
      case 'transaksi':
        return <Monitor className="w-5 h-5" />;
      case 'store':
        return <Store className="w-5 h-5" />;
      default:
        return <KeyRound className="w-5 h-5" />;
    }
  };

  const countActiveInModule = (
    permissions: RoleItem['permissions'],
    moduleKey: keyof RoleItem['permissions']
  ) => {
    const mod = permissions[moduleKey];
    return [mod.view, mod.create, mod.update, mod.delete].filter(Boolean).length;
  };

  const countTotalActive = (permissions: RoleItem['permissions']) => {
    return (
      countActiveInModule(permissions, 'transaksi') +
      countActiveInModule(permissions, 'produk') +
      countActiveInModule(permissions, 'laporan') +
      countActiveInModule(permissions, 'pengaturan')
    );
  };

  const handleDelete = (role: RoleItem) => {
    if (role.type === 'system') {
      alert(
        `Role "${role.name}" adalah System Role bawaan KasirIn dan tidak dapat dihapus demi keamanan sistem.`
      );
      return;
    }
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus role "${role.name}"? Tindakan ini akan membatalkan hak akses semua pengguna dengan role ini.`
      )
    ) {
      onDeleteRole(role.id);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Action & Search/Filter Bar */}
      <div className="w-full bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-sm border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">🎭</span>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              Daftar Role &amp; Hak Akses
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              {roles.length} Role Terdaftar
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Kelola hak akses dan izin modul operasional untuk setiap peran melalui tombol Edit Role.
          </p>
        </div>

        {/* Add Role Button */}
        <button
          type="button"
          onClick={onOpenAddRoleModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          <span>+ Buat Role Baru</span>
        </button>
      </div>

      {/* Grid of Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
        {roles.map((role) => {
          const isSys = role.type === 'system';
          const totalActive = countTotalActive(role.permissions);

          return (
            <div
              key={role.id}
              className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-border-subtle hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-fixed/30 text-primary flex items-center justify-center shrink-0">
                      {getRoleIcon(role.iconName)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-on-surface leading-tight">
                        {role.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isSys ? (
                          <span className="text-[11px] font-bold bg-surface-container text-text-muted px-2 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            System Role
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                            Active Role
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-text-muted bg-surface-container-low px-2.5 py-1 rounded-full border border-border-subtle/70 flex items-center gap-1 shrink-0">
                    <Users className="w-3.5 h-3.5 text-text-muted" />
                    <span>{role.userCount} User</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2 min-h-[32px]">
                  {role.description || 'Tidak ada deskripsi tambahan untuk peran ini.'}
                </p>

                {/* Permissions Module Badges Preview */}
                <div className="bg-surface-bg p-3 rounded-xl border border-border-subtle flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted">
                    <span>Ringkasan Izin Akses</span>
                    <span className="text-primary font-bold">{totalActive}/16 Aktif</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-surface-container-lowest border border-border-subtle/60 text-[11px]">
                      <span className="text-text-muted">🛒 Transaksi:</span>
                      <span className="font-bold text-on-surface">
                        {countActiveInModule(role.permissions, 'transaksi')}/4
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-surface-container-lowest border border-border-subtle/60 text-[11px]">
                      <span className="text-text-muted">📦 Produk:</span>
                      <span className="font-bold text-on-surface">
                        {countActiveInModule(role.permissions, 'produk')}/4
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-surface-container-lowest border border-border-subtle/60 text-[11px]">
                      <span className="text-text-muted">📊 Laporan:</span>
                      <span className="font-bold text-on-surface">
                        {countActiveInModule(role.permissions, 'laporan')}/4
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-surface-container-lowest border border-border-subtle/60 text-[11px]">
                      <span className="text-text-muted">⚙️ Pengaturan:</span>
                      <span className="font-bold text-on-surface">
                        {countActiveInModule(role.permissions, 'pengaturan')}/4
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(role)}
                  disabled={isSys}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSys
                      ? 'opacity-40 text-text-muted cursor-not-allowed'
                      : 'text-error hover:bg-error-container hover:text-on-error-container border border-error/30'
                  }`}
                  title={isSys ? 'Role sistem bawaan tidak dapat dihapus' : 'Hapus role ini'}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>

                {/* Edit Role & Akses Button */}
                <button
                  type="button"
                  onClick={() => onOpenEditRoleModal(role)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  title="Ubah nama, deskripsi, dan matriks hak akses peran ini"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Role &amp; Akses</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Tip Banner */}
      <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 border border-border-subtle/70">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-text-muted leading-relaxed">
          <strong className="text-on-surface font-semibold">Petunjuk Pengaturan Role:</strong> Klik tombol{' '}
          <span className="text-primary font-bold">Edit Role &amp; Akses</span> pada kartu peran untuk membuka modal pengaturan lengkap, termasuk penggantian nama peran dan pengaturan izin modul per fitur secara menyeluruh.
        </div>
      </div>
    </div>
  );
};