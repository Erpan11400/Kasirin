import React, { useState, useEffect } from 'react';
import {
  Edit3,
  ShieldPlus,
  X,
  AlertCircle,
  CheckSquare,
  Square,
  Save,
  KeyRound,
} from 'lucide-react';
import type { RoleItem, PermissionActions } from '../../../types/users';

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleItem | null;
  onSave: (data: {
    name: string;
    description: string;
    permissions: RoleItem['permissions'];
    id?: string;
  }) => void;
}

const DEFAULT_PERMISSIONS: RoleItem['permissions'] = {
  transaksi: { view: false, create: false, update: false, delete: false },
  produk: { view: false, create: false, update: false, delete: false },
  laporan: { view: false, create: false, update: false, delete: false },
  pengaturan: { view: false, create: false, update: false, delete: false },
};

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave,
}) => {
  const isEditMode = Boolean(role);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<RoleItem['permissions']>(DEFAULT_PERMISSIONS);

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setRoleName(role.name);
        setDescription(role.description || '');
        setPermissions(JSON.parse(JSON.stringify(role.permissions)));
      } else {
        setRoleName('');
        setDescription('');
        setPermissions(JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)));
      }
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const isSystemRole = isEditMode && role?.type === 'system';

  // Toggle single permission checkbox
  const handleTogglePermission = (
    moduleKey: keyof RoleItem['permissions'],
    action: keyof PermissionActions
  ) => {
    setPermissions((prev) => {
      const currentModule = prev[moduleKey];
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
  const handleToggleModuleAll = (moduleKey: keyof RoleItem['permissions']) => {
    const current = permissions[moduleKey];
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
  const isModuleAllActive = (moduleKey: keyof RoleItem['permissions']) => {
    const mod = permissions[moduleKey];
    return mod.view && mod.create && mod.update && mod.delete;
  };

  // Count active in a module
  const countActiveInModule = (moduleKey: keyof RoleItem['permissions']) => {
    const mod = permissions[moduleKey];
    return [mod.view, mod.create, mod.update, mod.delete].filter(Boolean).length;
  };

  // Toggle all permissions across all modules
  const allModules: (keyof RoleItem['permissions'])[] = ['transaksi', 'produk', 'laporan', 'pengaturan'];
  const allActions: (keyof PermissionActions)[] = ['view', 'create', 'update', 'delete'];
  const totalPossible = allModules.length * allActions.length;
  const currentTotalActive = allModules.reduce((acc, mod) => {
    return acc + allActions.filter((act) => permissions[mod][act]).length;
  }, 0);
  const isAllSelected = currentTotalActive === totalPossible;

  const handleToggleGlobalAll = (checked: boolean) => {
    setPermissions({
      transaksi: { view: checked, create: checked, update: checked, delete: checked },
      produk: { view: checked, create: checked, update: checked, delete: checked },
      laporan: { view: checked, create: checked, update: checked, delete: checked },
      pengaturan: { view: checked, create: checked, update: checked, delete: checked },
    });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-xl flex flex-col m-2 sm:m-4 border border-border-subtle">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-surface-container-lowest px-5 sm:px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              {isEditMode ? (
                <Edit3 className="w-5 h-5 text-secondary" />
              ) : (
                <ShieldPlus className="w-5 h-5 text-secondary" />
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                <span>{isEditMode ? 'Edit Role & Hak Akses' : 'Tambah Role Baru & Hak Akses'}</span>
                {isEditMode && role && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                    {role.name}
                  </span>
                )}
              </h3>
              <p className="text-xs text-text-muted">
                {isEditMode
                  ? 'Ubah informasi nama, deskripsi, dan matriks hak akses perizinan modul untuk peran ini.'
                  : 'Tentukan nama peran, deskripsi, dan atur langsung matriks hak akses modul untuk peran baru ini.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-text-muted hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Nama Role (Peran) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Contoh: Staf Gudang, Supervisor Kasir"
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan ruang lingkup peran ini..."
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle transition-all placeholder:text-text-muted"
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
                💡 <strong>Catatan:</strong> Memilih aksi Tambah, Ubah, atau Hapus akan otomatis mengaktifkan izin <strong>Lihat (View)</strong> pada modul terkait.
              </span>
            </div>

            {/* Matrix Cards for 4 Features */}
            <div className="flex flex-col gap-4">
              {/* 1. Modul Transaksi */}
              <div className="bg-surface-bg p-4 sm:p-4.5 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle/70">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛒</span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-on-surface">
                        MODUL TRANSAKSI
                      </h5>
                      <span className="text-[11px] text-text-muted">
                        Izin transaksi kasir, input order kasir, riwayat pesanan, dan pembatalan transaksi
                      </span>
                    </div>
                  </div>

                  {/* Per-feature Select All button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleModuleAll('transaksi')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container-lowest hover:bg-surface-container border border-border-subtle text-on-surface transition-colors cursor-pointer"
                    >
                      {isModuleAllActive('transaksi') ? (
                        <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span>
                        {isModuleAllActive('transaksi') ? 'Batal Semua' : 'Pilih Semua Akses Fitur'}
                      </span>
                    </button>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        countActiveInModule('transaksi') === 4
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container text-text-muted'
                      }`}
                    >
                      {countActiveInModule('transaksi')}/4 Aktif
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Lihat */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.transaksi.view}
                        onChange={() => handleTogglePermission('transaksi', 'view')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded uppercase">
                        Lihat
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Lihat Menu Transaksi
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Melihat antarmuka kasir dan riwayat pesanan
                      </span>
                    </div>
                  </label>

                  {/* Tambah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.transaksi.create}
                        onChange={() => handleTogglePermission('transaksi', 'create')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-secondary-container text-secondary px-1.5 py-0.5 rounded uppercase">
                        Tambah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Buat Transaksi Baru
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Input pesanan, checkout kasir &amp; cetak struk
                      </span>
                    </div>
                  </label>

                  {/* Ubah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.transaksi.update}
                        onChange={() => handleTogglePermission('transaksi', 'update')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded uppercase">
                        Ubah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Ubah Transaksi / Diskon
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Edit item belanja, berikan diskon manual
                      </span>
                    </div>
                  </label>

                  {/* Hapus */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.transaksi.delete}
                        onChange={() => handleTogglePermission('transaksi', 'delete')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-error-container text-error px-1.5 py-0.5 rounded uppercase">
                        Hapus
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Void / Batalkan Struk
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Membatalkan pembayaran yang telah tuntas
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. Modul Produk */}
              <div className="bg-surface-bg p-4 sm:p-4.5 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle/70">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📦</span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-on-surface">
                        MODUL PRODUK &amp; INVENTORI
                      </h5>
                      <span className="text-[11px] text-text-muted">
                        Katalog produk, harga modal, harga jual, barcode, kategori dan stok barang
                      </span>
                    </div>
                  </div>

                  {/* Per-feature Select All button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleModuleAll('produk')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container-lowest hover:bg-surface-container border border-border-subtle text-on-surface transition-colors cursor-pointer"
                    >
                      {isModuleAllActive('produk') ? (
                        <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span>
                        {isModuleAllActive('produk') ? 'Batal Semua' : 'Pilih Semua Akses Fitur'}
                      </span>
                    </button>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        countActiveInModule('produk') === 4
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container text-text-muted'
                      }`}
                    >
                      {countActiveInModule('produk')}/4 Aktif
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Lihat */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.produk.view}
                        onChange={() => handleTogglePermission('produk', 'view')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded uppercase">
                        Lihat
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Lihat Produk &amp; Stok
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Melihat master daftar barang dan kuantitas sisa
                      </span>
                    </div>
                  </label>

                  {/* Tambah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.produk.create}
                        onChange={() => handleTogglePermission('produk', 'create')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-secondary-container text-secondary px-1.5 py-0.5 rounded uppercase">
                        Tambah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Tambah Produk Baru
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Input SKU/Barcode, foto produk &amp; kategori baru
                      </span>
                    </div>
                  </label>

                  {/* Ubah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.produk.update}
                        onChange={() => handleTogglePermission('produk', 'update')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded uppercase">
                        Ubah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Edit Harga &amp; Stok
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Sesuaikan harga jual/modal dan penyesuaian stok
                      </span>
                    </div>
                  </label>

                  {/* Hapus */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.produk.delete}
                        onChange={() => handleTogglePermission('produk', 'delete')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-error-container text-error px-1.5 py-0.5 rounded uppercase">
                        Hapus
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Hapus Data Produk
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Menghapus master barang dari sistem kasir
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Modul Laporan */}
              <div className="bg-surface-bg p-4 sm:p-4.5 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle/70">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📊</span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-on-surface">
                        MODUL LAPORAN &amp; ANALITIK
                      </h5>
                      <span className="text-[11px] text-text-muted">
                        Statistik pendapatan, omzet, laba kotor, riwayat shift kasir dan audit transaksi
                      </span>
                    </div>
                  </div>

                  {/* Per-feature Select All button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleModuleAll('laporan')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container-lowest hover:bg-surface-container border border-border-subtle text-on-surface transition-colors cursor-pointer"
                    >
                      {isModuleAllActive('laporan') ? (
                        <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span>
                        {isModuleAllActive('laporan') ? 'Batal Semua' : 'Pilih Semua Akses Fitur'}
                      </span>
                    </button>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        countActiveInModule('laporan') === 4
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container text-text-muted'
                      }`}
                    >
                      {countActiveInModule('laporan')}/4 Aktif
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Lihat */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.laporan.view}
                        onChange={() => handleTogglePermission('laporan', 'view')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded uppercase">
                        Lihat
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Lihat Laporan Penjualan
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Akses dashboard omzet harian &amp; grafik laba rugi
                      </span>
                    </div>
                  </label>

                  {/* Tambah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.laporan.create}
                        onChange={() => handleTogglePermission('laporan', 'create')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-secondary-container text-secondary px-1.5 py-0.5 rounded uppercase">
                        Tambah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Ekspor / Rekap Baru
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Generate file Excel/PDF rekap keuangan toko
                      </span>
                    </div>
                  </label>

                  {/* Ubah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.laporan.update}
                        onChange={() => handleTogglePermission('laporan', 'update')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded uppercase">
                        Ubah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Koreksi Rekap Shift
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Penyesuaian selisih kas fisik laci uang kasir
                      </span>
                    </div>
                  </label>

                  {/* Hapus */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.laporan.delete}
                        onChange={() => handleTogglePermission('laporan', 'delete')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-error-container text-error px-1.5 py-0.5 rounded uppercase">
                        Hapus
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Hapus / Reset Riwayat
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Hapus log audit lama atau reset rekaman shift
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Modul Pengaturan */}
              <div className="bg-surface-bg p-4 sm:p-4.5 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle/70">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚙️</span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-on-surface">
                        MODUL PENGATURAN &amp; PENGGUNA
                      </h5>
                      <span className="text-[11px] text-text-muted">
                        Profil toko, pengaturan printer struk, manajemen staf kasir, dan konfigurasi pajak
                      </span>
                    </div>
                  </div>

                  {/* Per-feature Select All button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleModuleAll('pengaturan')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container-lowest hover:bg-surface-container border border-border-subtle text-on-surface transition-colors cursor-pointer"
                    >
                      {isModuleAllActive('pengaturan') ? (
                        <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span>
                        {isModuleAllActive('pengaturan') ? 'Batal Semua' : 'Pilih Semua Akses Fitur'}
                      </span>
                    </button>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        countActiveInModule('pengaturan') === 4
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container text-text-muted'
                      }`}
                    >
                      {countActiveInModule('pengaturan')}/4 Aktif
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Lihat */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.pengaturan.view}
                        onChange={() => handleTogglePermission('pengaturan', 'view')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded uppercase">
                        Lihat
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Lihat Profil Toko &amp; Pengguna
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Cek konfigurasi alamat toko, printer &amp; staf
                      </span>
                    </div>
                  </label>

                  {/* Tambah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.pengaturan.create}
                        onChange={() => handleTogglePermission('pengaturan', 'create')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-secondary-container text-secondary px-1.5 py-0.5 rounded uppercase">
                        Tambah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Tambah User / Staf Baru
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Membuat akun staf baru dan konfigurasi metode bayar
                      </span>
                    </div>
                  </label>

                  {/* Ubah */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.pengaturan.update}
                        onChange={() => handleTogglePermission('pengaturan', 'update')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded uppercase">
                        Ubah
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Ubah Pengaturan Sistem
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Ganti nama toko, tarif pajak, dan password staf
                      </span>
                    </div>
                  </label>

                  {/* Hapus */}
                  <label className="flex flex-col gap-1.5 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={permissions.pengaturan.delete}
                        onChange={() => handleTogglePermission('pengaturan', 'delete')}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-error-container text-error px-1.5 py-0.5 rounded uppercase">
                        Hapus
                      </span>
                    </div>
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-semibold text-on-surface leading-snug">
                        Hapus / Nonaktifkan Akun Pengguna
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 leading-tight">
                        Blokir akses kasir lama &amp; cabut kredensial
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Modal Footer Actions */}
          <div className="sticky bottom-0 z-20 bg-surface-container-lowest pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-surface-container transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {isEditMode
                  ? 'Simpan Perubahan Role & Hak Akses'
                  : 'Simpan & Buat Role Baru'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RoleModal;
