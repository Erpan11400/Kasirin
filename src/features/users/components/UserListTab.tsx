import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Search,
  UserPlus,
  Monitor,
  Store,
  Clock,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserX,
  RotateCcw,
  Pencil,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import type { UserItem, UserListTabProps } from '../../../types/users';
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
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
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

export type { UserListTabProps };

export const UserListTab: React.FC<UserListTabProps> = ({
  users,
  roles,
  onOpenAddModal,
  onOpenEditModal,
  onToggleUserStatus,
}) => {
  const { hasPermission } = useAuth();
  const canCreateUser = hasPermission('users:create');
  const canUpdateUser = hasPermission('users:update');
  const canDeleteUser = hasPermission('users:delete');

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 data per halaman

  // Status toggle confirmation dialog state
  const [targetUser, setTargetUser] = useState<UserItem | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.username && user.username.toLowerCase().includes(searchLower));

    const matchesRole =
      roleFilter === 'all' ||
      user.role === roleFilter ||
      user.roleId === roleFilter;

    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const startEntry = filteredUsers.length > 0 ? startIndex + 1 : 0;
  const endEntry = Math.min(startIndex + itemsPerPage, filteredUsers.length);

  const handleOpenStatusDialog = (user: UserItem) => {
    setTargetUser(user);
    setIsStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setTargetUser(null);
  };

  const handleConfirmStatusToggle = () => {
    if (targetUser) {
      onToggleUserStatus(targetUser);
      handleCloseStatusDialog();
    }
  };

  const getRoleBadge = (roleName: string) => {
    const lower = roleName.toLowerCase();
    if (lower.includes('admin')) {
      return (
        <span className="text-[11px] font-bold bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5" />
          {roleName}
        </span>
      );
    }
    if (lower.includes('manajer') || lower.includes('toko') || lower.includes('store')) {
      return (
        <span className="text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
          <Store className="w-3.5 h-3.5" />
          {roleName}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
        <Monitor className="w-3.5 h-3.5 text-primary" />
        {roleName}
      </span>
    );
  };

  const willDeactivate = targetUser?.status === 'Aktif' || targetUser?.isActive;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Filter & Action Bar */}
      <div className="w-full bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border border-border-subtle">
        {/* Search Input */}
        <div className="w-full lg:w-80">
          <TextField
            icon={Search}
            placeholder="Cari nama atau email pengguna..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Dropdowns & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-2.5 sm:gap-3 w-full lg:w-auto">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* Role Filter */}
            <div className="w-full sm:w-48">
              <Select
                value={roleFilter}
                onValueChange={(val) => {
                  setRoleFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger size="default" className="bg-surface-bg border-border-subtle rounded-xl h-10">
                  <span className="text-xs text-text-muted font-medium mr-1 shrink-0">Role:</span>
                  <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-44">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger size="default" className="bg-surface-bg border-border-subtle rounded-xl h-10">
                  <span className="text-xs text-text-muted font-medium mr-1 shrink-0">Status:</span>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add User Button */}
          {canCreateUser && (
            <Button
              type="button"
              variant="primary"
              onClick={onOpenAddModal}
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="w-full sm:w-auto shrink-0"
            >
              Tambah Pengguna
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <TableContainer>
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead className="min-w-[220px]">Pengguna (Nama & Email)</TableHead>
              <TableHead className="min-w-[130px]">Peran (Role)</TableHead>
              <TableHead className="min-w-[110px]">Status Akun</TableHead>
              <TableHead className="min-w-[150px]">Login Terakhir</TableHead>
              <TableHead className="min-w-[110px]">Terdaftar</TableHead>
              <TableHead alignContent="right" className="min-w-[180px]">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => {
                const isInactive = user.status === 'Nonaktif';
                const isPrimaryAdmin =
                  user.isVerifiedAdmin ||
                  user.role?.toLowerCase() === 'admin' ||
                  user.role?.toLowerCase() === 'administrator';

                const hasAnyAction = canUpdateUser || canDeleteUser;

                return (
                  <TableRow
                    key={user.id}
                    className={isInactive ? 'opacity-80' : ''}
                  >
                    {/* PENGGUNA */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className={`w-10 h-10 rounded-full object-cover shadow-xs shrink-0 ${
                            isInactive ? 'grayscale' : ''
                          }`}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-on-surface">
                              {user.name}
                            </span>
                            {isPrimaryAdmin && (
                              <span title="Administrator Sistem" className="inline-flex">
                                <CheckCircle className="w-4 h-4 text-primary" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Mail className="w-3 h-3 text-text-muted" />
                            {user.email || user.username}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* ROLE */}
                    <TableCell>{getRoleBadge(user.role)}</TableCell>

                    {/* STATUS */}
                    <TableCell>
                      {user.status === 'Aktif' ? (
                        <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                          Aktif
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold bg-surface-container text-text-muted px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-text-muted"></span>
                          Nonaktif
                        </span>
                      )}
                    </TableCell>

                    {/* LOGIN TERAKHIR */}
                    <TableCell className="whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        <span className="font-medium text-text-muted">{user.lastLogin}</span>
                      </div>
                    </TableCell>

                    {/* TERDAFTAR */}
                    <TableCell className="whitespace-nowrap text-xs text-text-muted">
                      {user.registeredDate}
                    </TableCell>

                    {/* TINDAKAN */}
                    <TableCell alignContent="right" className="whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!hasAnyAction ? (
                          <span className="text-xs text-text-muted italic px-2.5 py-1 bg-surface-container-low rounded-lg border border-border-subtle">
                            Hanya Lihat
                          </span>
                        ) : isPrimaryAdmin ? (
                          <>
                            {canUpdateUser && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => onOpenEditModal(user)}
                                leftIcon={<Pencil className="w-3.5 h-3.5" />}
                                title="Edit Profil"
                              >
                                Edit Profil
                              </Button>
                            )}
                            <span
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-text-muted text-xs inline-flex items-center gap-1 cursor-not-allowed border border-border-subtle"
                              title="Akun Utama tidak dapat dinonaktifkan"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              Terkunci
                            </span>
                          </>
                        ) : (
                          <>
                            {canUpdateUser && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => onOpenEditModal(user)}
                                leftIcon={<Pencil className="w-3.5 h-3.5" />}
                                title="Edit Data & Reset Password"
                              >
                                Edit & Reset
                              </Button>
                            )}
                            {(canUpdateUser || canDeleteUser) && (
                              user.status === 'Aktif' ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenStatusDialog(user)}
                                  leftIcon={<UserX className="w-3.5 h-3.5 text-error" />}
                                  className="text-error hover:bg-error-container hover:text-on-error-container border-error/30"
                                  title="Nonaktifkan Akun"
                                >
                                  Nonaktifkan
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleOpenStatusDialog(user)}
                                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-secondary" />}
                                  className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container"
                                  title="Aktifkan Kembali"
                                >
                                  Aktifkan
                                </Button>
                              )
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
                colSpan={6}
                title="Tidak ada pengguna ditemukan"
                description="Tidak ditemukan data pengguna yang cocok dengan kriteria pencarian atau filter saat ini."
              />
            )}
          </TableBody>
        </Table>

        {/* Table Footer Pagination */}
        <div className="w-full px-4 py-3 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle rounded-b-xl">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>
              Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
              <strong className="text-on-surface font-semibold">{filteredUsers.length}</strong> user
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

      {/* Modal Konfirmasi Perubahan Status Akun Pengguna */}
      <Dialog open={isStatusDialogOpen} onOpenChange={(open) => !open && handleCloseStatusDialog()}>
        <DialogContent size="md" className="rounded-2xl border border-border-subtle p-0 gap-0 overflow-hidden">
          <DialogHeader
            className={`px-6 py-4 border-b flex flex-row items-center gap-3 ${
              willDeactivate ? 'bg-red-50 border-red-100' : 'bg-secondary-container/40 border-secondary/20'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                willDeactivate ? 'bg-red-100 text-red-600' : 'bg-secondary-container text-secondary'
              }`}
            >
              {willDeactivate ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <RotateCcw className="w-5 h-5 text-secondary" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <DialogTitle className="text-base font-bold text-slate-900">
                {willDeactivate ? 'Konfirmasi Nonaktifkan Akun' : 'Konfirmasi Aktifkan Akun'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {willDeactivate
                  ? 'Pengguna tidak akan dapat mengakses sistem kasir saat status nonaktif.'
                  : 'Pengguna akan dapat kembali login dan menggunakan aplikasi POS.'}
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogBody className="p-6 flex flex-col gap-4 text-sm text-slate-700">
            <p className="leading-relaxed">
              Apakah Anda yakin ingin {willDeactivate ? 'menonaktifkan' : 'mengaktifkan kembali'} akun{' '}
              <strong className="text-slate-900 font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                {targetUser?.name}
              </strong>{' '}
              ({targetUser?.email})?
            </p>
          </DialogBody>

          <DialogFooter className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseStatusDialog}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant={willDeactivate ? 'destructive' : 'primary'}
              onClick={handleConfirmStatusToggle}
              leftIcon={
                willDeactivate ? (
                  <UserX className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )
              }
            >
              {willDeactivate ? 'Ya, Nonaktifkan Akun' : 'Ya, Aktifkan Akun'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserListTab;