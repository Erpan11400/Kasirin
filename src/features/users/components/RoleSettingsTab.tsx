import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
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
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import type { RoleItem, RoleSettingsTabProps } from '../../../types/users';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '../../../components/ui/Table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../../components/ui/Dialog';

export type { RoleSettingsTabProps };

export const RoleSettingsTab: React.FC<RoleSettingsTabProps> = ({
  roles,
  onOpenAddRoleModal,
  onOpenEditRoleModal,
  onDeleteRole,
}) => {
  const { hasPermission } = useAuth();
  const canCreateRole = hasPermission('roles:create');
  const canUpdateRole = hasPermission('roles:update');
  const canDeleteRole = hasPermission('roles:delete');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 data per halaman

  // Delete confirmation dialog state
  const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'admin':
        return <Shield className="w-4.5 h-4.5" />;
      case 'pos':
      case 'transaksi':
        return <Monitor className="w-4.5 h-4.5" />;
      case 'store':
        return <Store className="w-4.5 h-4.5" />;
      default:
        return <KeyRound className="w-4.5 h-4.5" />;
    }
  };

  const countActiveInModule = (
    permissions: RoleItem['permissions'],
    moduleKey: keyof RoleItem['permissions']
  ) => {
    const mod = permissions[moduleKey];
    if (!mod) return 0;
    return [mod.view, mod.create, mod.update, mod.delete].filter(Boolean).length;
  };

  const countTotalActive = (permissions: RoleItem['permissions']) => {
    return (
      countActiveInModule(permissions, 'transactions') +
      countActiveInModule(permissions, 'products') +
      countActiveInModule(permissions, 'categories') +
      countActiveInModule(permissions, 'store') +
      countActiveInModule(permissions, 'users') +
      countActiveInModule(permissions, 'roles')
    );
  };

  const handleOpenDeleteDialog = (role: RoleItem) => {
    if (role.isSystemRole || role.type === 'system') {
      return;
    }
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      onDeleteRole(roleToDelete.id);
      handleCloseDeleteDialog();
    }
  };

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      role.name.toLowerCase().includes(q) ||
      (role.description && role.description.toLowerCase().includes(q));
    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  const startEntry = filteredRoles.length > 0 ? startIndex + 1 : 0;
  const endEntry = Math.min(startIndex + itemsPerPage, filteredRoles.length);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Action & Search Bar */}
      <div className="w-full bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-xs border border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="w-full sm:w-80">
          <TextField
            icon={Search}
            placeholder="Cari nama role atau deskripsi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Add Role Button */}
        {canCreateRole && (
          <Button
            type="button"
            variant="primary"
            onClick={onOpenAddRoleModal}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="shrink-0 w-full sm:w-auto"
          >
            Buat Role Baru
          </Button>
        )}
      </div>

      {/* Roles Table Card Wrapper */}
      <TableContainer>
        <Table className="min-w-[940px]">
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead className="min-w-[220px]">Nama Peran (Role)</TableHead>
                <TableHead className="min-w-[200px]">Deskripsi</TableHead>
                <TableHead className="min-w-[120px]">Pengguna</TableHead>
                <TableHead className="min-w-[280px]">Ringkasan Izin Akses</TableHead>
                <TableHead alignContent="right" className="min-w-[180px]">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRoles.length > 0 ? (
                displayedRoles.map((role) => {
                  const isSys = role.isSystemRole || role.type === 'system';
                  const totalActive = countTotalActive(role.permissions);
                  const hasAnyRoleAction = canUpdateRole || (canDeleteRole && !isSys);

                  return (
                    <TableRow key={role.id}>
                      {/* NAMA PERAN */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 text-primary flex items-center justify-center shrink-0">
                            {getRoleIcon(role.iconName)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-on-surface">
                                {role.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isSys ? (
                                <span className="text-[10px] font-bold bg-surface-container text-text-muted px-2 py-0.5 rounded flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  System Role
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                                  Custom Role
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* DESKRIPSI */}
                      <TableCell className="max-w-[240px]">
                        <span
                          className="text-xs text-text-muted line-clamp-2 leading-relaxed"
                          title={role.description || '-'}
                        >
                          {role.description || '-'}
                        </span>
                      </TableCell>

                      {/* PENGGUNA */}
                      <TableCell>
                        <span className="text-xs font-semibold text-text-muted bg-surface-container-low px-2.5 py-1 rounded-full border border-border-subtle inline-flex items-center gap-1.5 whitespace-nowrap">
                          <Users className="w-3.5 h-3.5 text-text-muted" />
                          <span>{role.userCount} User</span>
                        </span>
                      </TableCell>

                      {/* RINGKASAN IZIN AKSES */}
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary">
                              {totalActive}/24 Izin Aktif
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 max-w-xs">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-border-subtle/70 text-on-surface flex items-center justify-between"
                              title="Izin Modul Transaksi"
                            >
                              <span>🛒 Transaksi</span>
                              <strong className="font-semibold text-primary">{countActiveInModule(role.permissions, 'transactions')}/4</strong>
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-border-subtle/70 text-on-surface flex items-center justify-between"
                              title="Izin Modul Produk"
                            >
                              <span>📦 Produk</span>
                              <strong className="font-semibold text-primary">{countActiveInModule(role.permissions, 'products')}/4</strong>
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-border-subtle/70 text-on-surface flex items-center justify-between"
                              title="Izin Modul Kategori"
                            >
                              <span>🏷️ Kategori</span>
                              <strong className="font-semibold text-primary">{countActiveInModule(role.permissions, 'categories')}/4</strong>
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-border-subtle/70 text-on-surface flex items-center justify-between"
                              title="Izin Modul Toko"
                            >
                              <span>🏪 Toko</span>
                              <strong className="font-semibold text-primary">{countActiveInModule(role.permissions, 'store')}/4</strong>
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-border-subtle/70 text-on-surface flex items-center justify-between"
                              title="Izin Modul Pengguna"
                            >
                              <span>👥 Pengguna</span>
                              <strong className="font-semibold text-primary">{countActiveInModule(role.permissions, 'users')}/4</strong>
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-border-subtle/70 text-on-surface flex items-center justify-between"
                              title="Izin Modul Peran"
                            >
                              <span>🎭 Peran</span>
                              <strong className="font-semibold text-primary">{countActiveInModule(role.permissions, 'roles')}/4</strong>
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* TINDAKAN */}
                      <TableCell alignContent="right" className="whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!hasAnyRoleAction ? (
                            <span className="text-xs text-text-muted italic px-2.5 py-1 bg-surface-container-low rounded-lg border border-border-subtle">
                              Hanya Lihat
                            </span>
                          ) : (
                            <>
                              {canUpdateRole && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => onOpenEditRoleModal(role)}
                                  leftIcon={<Pencil className="w-3.5 h-3.5" />}
                                  title="Ubah nama dan matriks hak akses"
                                >
                                  Edit Role
                                </Button>
                              )}
                              {canDeleteRole && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenDeleteDialog(role)}
                                  disabled={isSys}
                                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-error" />}
                                  className={
                                    isSys
                                      ? 'opacity-40 cursor-not-allowed'
                                      : 'text-error hover:bg-error-container hover:text-on-error-container border-error/30'
                                  }
                                  title={isSys ? 'Role sistem bawaan tidak dapat dihapus' : 'Hapus role ini'}
                                >
                                  Hapus
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableEmpty
                  colSpan={5}
                  title="Tidak ada role ditemukan"
                  description="Tidak ditemukan data role yang cocok dengan kriteria pencarian saat ini."
                />
              )}
            </TableBody>
          </Table>

        {/* Table Footer Pagination */}
        <div className="w-full px-4 py-3 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle rounded-b-xl">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>
              Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
              <strong className="text-on-surface font-semibold">{filteredRoles.length}</strong> role
            </span>

            {/* Per Page Selector */}
            <div className="flex items-center gap-1.5 ml-2 border-l border-border-subtle pl-3">
              <span className="text-[11px] text-text-muted shrink-0">Tampilkan:</span>
              <div className="w-20 relative">
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(val) => {
                    setItemsPerPage(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger size="sm" className="h-7 text-xs bg-white border-border-subtle rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top" align="start" className="min-w-[5rem] z-50">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pagination Page Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-lg"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <Button
                  key={pageNum}
                  type="button"
                  variant={isActive ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="h-8 min-w-[32px] px-2 text-xs font-semibold rounded-lg"
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-lg"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </TableContainer>

      {/* Helpful Tip Banner */}
      <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 border border-border-subtle/70">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-text-muted leading-relaxed">
          <strong className="text-on-surface font-semibold">Petunjuk Pengaturan Role:</strong> Klik tombol{' '}
          <span className="text-primary font-bold">Edit Role</span> pada baris tabel untuk membuka modal pengaturan lengkap, termasuk penggantian nama peran dan pengaturan izin modul per fitur secara detail.
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Role */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && handleCloseDeleteDialog()}>
        <DialogContent size="md" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 bg-red-50 border-b border-red-100 flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <DialogTitle className="text-base font-bold text-slate-900">
                Konfirmasi Hapus Role
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Tindakan ini permanen dan tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogBody className="p-6 flex flex-col gap-4 text-sm text-slate-700">
            <p className="leading-relaxed">
              Apakah Anda yakin ingin menghapus role{' '}
              <strong className="text-slate-900 font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                {roleToDelete?.name}
              </strong>
              ?
            </p>

            {roleToDelete && roleToDelete.userCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Terdapat <strong>{roleToDelete.userCount} pengguna</strong> yang saat ini menggunakan role ini. Pengguna tersebut mungkin kehilangan hak akses fitur kasir toko.
                </span>
              </div>
            )}
          </DialogBody>

          <DialogFooter className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDeleteDialog}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Ya, Hapus Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleSettingsTab;