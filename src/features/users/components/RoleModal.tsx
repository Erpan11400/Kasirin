import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Edit3,
  ShieldPlus,
  AlertCircle,
  CheckSquare,
  Square,
  Save,
  KeyRound,
} from 'lucide-react';
import type { RoleItem, RolePermissions, PermissionActions } from '../../../types/users';
import { DEFAULT_ROLE_PERMISSIONS } from '../../../services/RoleAction';
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

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleItem | null;
  onSave: (data: {
    name: string;
    description?: string;
    permissions: RolePermissions;
    id?: string;
  }) => void;
}

interface ModuleConfig {
  key: keyof RolePermissions;
  title: string;
  icon: string;
  description: string;
  labels: {
    view: { title: string; desc: string };
    create: { title: string; desc: string };
    update: { title: string; desc: string };
    delete: { title: string; desc: string };
  };
}

const MODULE_CONFIGS: ModuleConfig[] = [
  {
    key: 'transactions',
    title: 'MODUL TRANSAKSI (POS)',
    icon: '🛒',
    description: 'Izin kasir, input transaksi penjualan, checkout, dan pembatalan transaksi',
    labels: {
      view: { title: 'Lihat Transaksi', desc: 'Melihat antarmuka kasir dan riwayat pesanan' },
      create: { title: 'Buat Transaksi Baru', desc: 'Input pesanan, checkout kasir & cetak struk' },
      update: { title: 'Ubah Transaksi / Diskon', desc: 'Edit item belanja, berikan diskon manual' },
      delete: { title: 'Void / Batalkan Struk', desc: 'Membatalkan pembayaran yang telah tuntas' },
    },
  },
  {
    key: 'products',
    title: 'MODUL PRODUK & STOK',
    icon: '📦',
    description: 'Katalog produk, harga modal, harga jual, barcode SKU dan penyesuaian stok barang',
    labels: {
      view: { title: 'Lihat Produk & Stok', desc: 'Melihat master daftar barang dan kuantitas sisa' },
      create: { title: 'Tambah Produk Baru', desc: 'Input SKU/Barcode, foto produk & kategori baru' },
      update: { title: 'Edit Harga & Stok', desc: 'Sesuaikan harga jual/modal dan penyesuaian stok' },
      delete: { title: 'Hapus Master Produk', desc: 'Menghapus master barang dari sistem kasir' },
    },
  },
  {
    key: 'categories',
    title: 'MODUL KATEGORI PRODUK',
    icon: '🏷️',
    description: 'Pengelompokan barang / kategori produk untuk memudahkan klasifikasi di kasir',
    labels: {
      view: { title: 'Lihat Daftar Kategori', desc: 'Melihat daftar kategori produk yang tersedia' },
      create: { title: 'Tambah Kategori Baru', desc: 'Menambahkan kategori atau kelompok produk baru' },
      update: { title: 'Ubah Data Kategori', desc: 'Mengedit nama kategori atau ikon kelompok' },
      delete: { title: 'Hapus Kategori', desc: 'Menghapus kelompok kategori produk' },
    },
  },
  {
    key: 'store',
    title: 'MODUL PENGATURAN TOKO',
    icon: '🏪',
    description: 'Profil toko, alamat, kontak, konfigurasi struk kasir, dan pengaturan operasional',
    labels: {
      view: { title: 'Lihat Profil Toko', desc: 'Melihat informasi identitas toko dan printer struk' },
      create: { title: 'Tambah Pengaturan Toko', desc: 'Membuat konfigurasi profil atau data cabang baru' },
      update: { title: 'Ubah Profil Toko', desc: 'Mengedit nama toko, alamat, pajak & footer struk' },
      delete: { title: 'Reset Pengaturan Toko', desc: 'Menghapus atau mereset konfigurasi toko' },
    },
  },
  {
    key: 'users',
    title: 'MODUL MANAJEMEN PENGGUNA',
    icon: '👥',
    description: 'Akun staf kasir, supervisor, pergantian password dan status aktif pengguna',
    labels: {
      view: { title: 'Lihat Daftar Pengguna', desc: 'Melihat akun staf toko dan waktu login terakhir' },
      create: { title: 'Tambah Pengguna Baru', desc: 'Membuat akun staf baru dan password' },
      update: { title: 'Ubah Akun Pengguna', desc: 'Edit username, nama, password, dan status staf' },
      delete: { title: 'Hapus / Nonaktifkan User', desc: 'Menonaktifkan atau menghapus akun staf' },
    },
  },
  {
    key: 'roles',
    title: 'MODUL PERAN & HAK AKSES',
    icon: '🎭',
    description: 'Pengaturan matriks perizinan RBAC (Role-Based Access Control) untuk semua fitur',
    labels: {
      view: { title: 'Lihat Daftar Role', desc: 'Melihat tabel daftar peran dan matriks hak akses' },
      create: { title: 'Tambah Role Baru', desc: 'Membuat peran kustom baru dengan izin fleksibel' },
      update: { title: 'Ubah Hak Akses Role', desc: 'Mengubah matriks perizinan dan wewenang peran' },
      delete: { title: 'Hapus Custom Role', desc: 'Menghapus peran kustom non-sistem' },
    },
  },
];

const MODULE_KEYS = MODULE_CONFIGS.map((m) => m.key);
const ACTION_KEYS: (keyof PermissionActions)[] = ['view', 'create', 'update', 'delete'];

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave,
}) => {
  const { hasPermission } = useAuth();
  const isEditMode = Boolean(role);
  const canSave = isEditMode ? hasPermission('roles:update') : hasPermission('roles:create');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setRoleName(role.name);
        setDescription(role.description || '');
        // Pastikan semua 6 key modul terisi
        setPermissions({
          categories: { ...DEFAULT_ROLE_PERMISSIONS.categories, ...(role.permissions?.categories || {}) },
          products: { ...DEFAULT_ROLE_PERMISSIONS.products, ...(role.permissions?.products || {}) },
          store: { ...DEFAULT_ROLE_PERMISSIONS.store, ...(role.permissions?.store || {}) },
          transactions: { ...DEFAULT_ROLE_PERMISSIONS.transactions, ...(role.permissions?.transactions || {}) },
          roles: { ...DEFAULT_ROLE_PERMISSIONS.roles, ...(role.permissions?.roles || {}) },
          users: { ...DEFAULT_ROLE_PERMISSIONS.users, ...(role.permissions?.users || {}) },
        });
      } else {
        setRoleName('');
        setDescription('');
        setPermissions(JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS)));
      }
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const isSystemRole = isEditMode && (role?.isSystemRole || role?.type === 'system');

  // Toggle single permission checkbox
  const handleTogglePermission = (
    moduleKey: keyof RolePermissions,
    action: keyof PermissionActions
  ) => {
    setPermissions((prev) => {
      const currentModule = prev[moduleKey] || { view: false, create: false, update: false, delete: false };
      const nextValue = !currentModule[action];

      const updatedModule = {
        ...currentModule,
        [action]: nextValue,
      };

      // Saat pengguna memilih akses create, update, delete -> view otomatis aktif
      if (action !== 'view' && nextValue) {
        updatedModule.view = true;
      }

      // Jika akses view dinonaktifkan, maka create, update, delete otomatis nonaktif
      if (action === 'view' && !nextValue) {
        updatedModule.create = false;
        updatedModule.update = false;
        updatedModule.delete = false;
      }

      return {
        ...prev,
        [moduleKey]: updatedModule,
      };
    });
  };

  // Toggle ALL permissions within a specific feature/module
  const handleToggleModuleAll = (moduleKey: keyof RolePermissions) => {
    const current = permissions[moduleKey] || { view: false, create: false, update: false, delete: false };
    const isAllChecked = current.view && current.create && current.update && current.delete;
    const targetState = !isAllChecked;

    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        view: targetState,
        create: targetState,
        update: targetState,
        delete: targetState,
      },
    }));
  };

  // Helper to check if all permissions in a module are active
  const isModuleAllActive = (moduleKey: keyof RolePermissions) => {
    const mod = permissions[moduleKey];
    if (!mod) return false;
    return mod.view && mod.create && mod.update && mod.delete;
  };

  // Count active in a module
  const countActiveInModule = (moduleKey: keyof RolePermissions) => {
    const mod = permissions[moduleKey];
    if (!mod) return 0;
    return [mod.view, mod.create, mod.update, mod.delete].filter(Boolean).length;
  };

  // Calculate total active permissions across all 6 modules (24 total)
  const totalPossible = MODULE_KEYS.length * ACTION_KEYS.length;
  const currentTotalActive = MODULE_KEYS.reduce((acc, mod) => {
    const m = permissions[mod];
    if (!m) return acc;
    return acc + ACTION_KEYS.filter((act) => m[act]).length;
  }, 0);
  const isAllSelected = currentTotalActive === totalPossible;

  const handleToggleGlobalAll = (checked: boolean) => {
    const newPermissions = { ...permissions };
    MODULE_KEYS.forEach((mod) => {
      newPermissions[mod] = {
        view: checked,
        create: checked,
        update: checked,
        delete: checked,
      };
    });
    setPermissions(newPermissions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    onSave({
      id: role?.id,
      name: roleName.trim(),
      description: description.trim(),
      permissions,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="4xl" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden max-h-[92vh]">
        {/* Header */}
        <DialogHeader className="px-6 py-4.5 bg-surface-container-high/40 border-b border-border-subtle flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
            {isEditMode ? (
              <Edit3 className="w-5 h-5 text-secondary" />
            ) : (
              <ShieldPlus className="w-5 h-5 text-secondary" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <DialogTitle className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span>{isEditMode ? 'Edit Role & Hak Akses' : 'Tambah Role Baru & Hak Akses'}</span>
              {isEditMode && role && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                  {role.name}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              {isEditMode
                ? 'Ubah informasi nama, deskripsi, dan matriks hak akses perizinan modul untuk peran ini.'
                : 'Tentukan nama peran, deskripsi, dan atur langsung matriks hak akses modul untuk peran baru ini.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <DialogBody className="p-5 sm:p-6 flex flex-col gap-6 max-h-[calc(92vh-140px)]">
            {/* System Role Notice (Edit mode only) */}
            {isSystemRole && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">System Role Bawaan:</strong> Peran ini memiliki identifier sistem penting. Anda dapat menyesuaikan label nama dan hak akses fitur sesuai kebutuhan operasional toko.
                </div>
              </div>
            )}

            {/* Section 1: Role Basic Information */}
            <div className="bg-surface-bg p-4 sm:p-5 rounded-xl border border-border-subtle flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <span>📝</span> Informasi Dasar Role
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">
                    Nama Role (Peran) <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Contoh: Staf Kasir, Supervisor Gudang"
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">
                    Deskripsi Peran <span className="text-text-muted font-normal text-[11px]">(Opsional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Bertanggung jawab melayani transaksi kasir POS dan melihat daftar katalog produk"
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Permissions Matrix */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border-subtle gap-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-on-surface">
                    Matriks Hak Akses Modul
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                    {currentTotalActive}/{totalPossible} Izin Aktif
                  </span>
                </div>

                {/* Master Global Select All / Deselect All */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleGlobalAll(!isAllSelected)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isAllSelected
                        ? 'bg-primary text-on-primary shadow-sm hover:bg-primary-container'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-border-subtle'
                    }`}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-3.5 h-3.5" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-text-muted" />
                    )}
                    <span>
                      {isAllSelected ? 'Batal Pilih Semua' : 'Pilih Semua Hak Akses'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Note on View Dependency */}
              <div className="p-3 bg-secondary-container/40 border border-secondary/20 rounded-xl text-xs text-on-secondary-container flex items-center justify-between gap-2">
                <span>
                  💡 <strong>Catatan:</strong> Memilih wewenang Tambah, Ubah, atau Hapus akan otomatis mengaktifkan izin <strong>Lihat (View)</strong> pada modul terkait.
                </span>
              </div>

              {/* Matrix Cards for all 6 Modules */}
              <div className="flex flex-col gap-4">
                {MODULE_CONFIGS.map((modConfig) => {
                  const modKey = modConfig.key;
                  const modPerm = permissions[modKey] || { view: false, create: false, update: false, delete: false };
                  const isAllActive = isModuleAllActive(modKey);
                  const activeCount = countActiveInModule(modKey);

                  return (
                    <div
                      key={modKey}
                      className="bg-surface-bg p-4 sm:p-4.5 rounded-xl border border-border-subtle flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle/70">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{modConfig.icon}</span>
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-on-surface uppercase">
                              {modConfig.title}
                            </h5>
                            <span className="text-[11px] text-text-muted">
                              {modConfig.description}
                            </span>
                          </div>
                        </div>

                        {/* Per-feature Select All button */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleModuleAll(modKey)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container-lowest hover:bg-surface-container border border-border-subtle text-on-surface transition-colors cursor-pointer"
                          >
                            {isAllActive ? (
                              <CheckSquare className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-text-muted" />
                            )}
                            <span>
                              {isAllActive ? 'Batal Semua' : 'Pilih Semua Akses'}
                            </span>
                          </button>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              activeCount === 4
                                ? 'bg-primary-fixed text-on-primary-fixed'
                                : 'bg-surface-container text-text-muted'
                            }`}
                          >
                            {activeCount}/4 Aktif
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* 1. Lihat (View) */}
                        <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <input
                              type="checkbox"
                              checked={modPerm.view}
                              onChange={() => handleTogglePermission(modKey, 'view')}
                              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                            />
                            <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded uppercase">
                              Lihat
                            </span>
                          </div>
                          <div className="flex flex-col mt-0.5">
                            <span className="text-xs font-semibold text-on-surface leading-snug">
                              {modConfig.labels.view.title}
                            </span>
                            <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                              {modConfig.labels.view.desc}
                            </span>
                          </div>
                        </label>

                        {/* 2. Tambah (Create) */}
                        <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <input
                              type="checkbox"
                              checked={modPerm.create}
                              onChange={() => handleTogglePermission(modKey, 'create')}
                              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                            />
                            <span className="text-[11px] font-bold bg-secondary-container text-secondary px-1.5 py-0.5 rounded uppercase">
                              Tambah
                            </span>
                          </div>
                          <div className="flex flex-col mt-0.5">
                            <span className="text-xs font-semibold text-on-surface leading-snug">
                              {modConfig.labels.create.title}
                            </span>
                            <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                              {modConfig.labels.create.desc}
                            </span>
                          </div>
                        </label>

                        {/* 3. Ubah (Update) */}
                        <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <input
                              type="checkbox"
                              checked={modPerm.update}
                              onChange={() => handleTogglePermission(modKey, 'update')}
                              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                            />
                            <span className="text-[11px] font-bold bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded uppercase">
                              Ubah
                            </span>
                          </div>
                          <div className="flex flex-col mt-0.5">
                            <span className="text-xs font-semibold text-on-surface leading-snug">
                              {modConfig.labels.update.title}
                            </span>
                            <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                              {modConfig.labels.update.desc}
                            </span>
                          </div>
                        </label>

                        {/* 4. Hapus (Delete) */}
                        <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <input
                              type="checkbox"
                              checked={modPerm.delete}
                              onChange={() => handleTogglePermission(modKey, 'delete')}
                              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                            />
                            <span className="text-[11px] font-bold bg-error-container text-error px-1.5 py-0.5 rounded uppercase">
                              Hapus
                            </span>
                          </div>
                          <div className="flex flex-col mt-0.5">
                            <span className="text-xs font-semibold text-on-surface leading-snug">
                              {modConfig.labels.delete.title}
                            </span>
                            <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                              {modConfig.labels.delete.desc}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogBody>

          {/* Dialog Footer Actions */}
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
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isEditMode
                  ? 'Simpan Perubahan Role & Hak Akses'
                  : 'Simpan & Buat Role Baru'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
