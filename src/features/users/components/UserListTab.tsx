import React, { useState } from 'react';
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
} from 'lucide-react';
import type { UserItem, RoleItem } from '../../../types/users';

interface UserListTabProps {
  users: UserItem[];
  roles: RoleItem[];
  onOpenAddModal: () => void;
  onOpenEditModal: (user: UserItem) => void;
  onToggleUserStatus: (user: UserItem) => void;
}

export const UserListTab: React.FC<UserListTabProps> = ({
  users,
  roles,
  onOpenAddModal,
  onOpenEditModal,
  onToggleUserStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadge = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return (
          <span className="text-[11px] font-bold bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            {roleName}
          </span>
        );
      case 'manajer toko':
        return (
          <span className="text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
            <Store className="w-3.5 h-3.5" />
            {roleName}
          </span>
        );
      case 'kasir':
      default:
        return (
          <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
            <Monitor className="w-3.5 h-3.5 text-primary" />
            {roleName}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Filter & Action Bar */}
      <div className="w-full bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border border-border-subtle/70">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama atau username..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg rounded-lg text-sm text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent transition-all"
          />
        </div>

        {/* Dropdowns & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-2.5 sm:gap-3 w-full lg:w-auto">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-surface-bg px-3 py-2 rounded-lg border border-border-subtle sm:border-transparent w-full sm:w-auto">
              <span className="text-xs text-text-muted shrink-0">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm text-on-surface focus:outline-none cursor-pointer w-full text-ellipsis"
              >
                <option value="all">Semua Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-surface-bg px-3 py-2 rounded-lg border border-border-subtle sm:border-transparent w-full sm:w-auto">
              <span className="text-xs text-text-muted shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm text-on-surface focus:outline-none cursor-pointer w-full text-ellipsis"
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Add User Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-subtle/70">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-surface-bg border-b border-border-subtle">
              <tr>
                <th className="px-4 py-3.5 text-[11px] font-bold text-text-muted uppercase tracking-wider min-w-[200px]">
                  Pengguna
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-text-muted uppercase tracking-wider min-w-[130px]">
                  Peran (Role)
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-text-muted uppercase tracking-wider min-w-[110px]">
                  Status Akun
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-text-muted uppercase tracking-wider min-w-[170px]">
                  Login Terakhir
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-text-muted uppercase tracking-wider min-w-[110px]">
                  Terdaftar
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-text-muted uppercase tracking-wider text-right min-w-[180px]">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => {
                  const isInactive = user.status === 'Nonaktif';
                  const isPrimaryAdmin = user.role === 'Admin' || user.role === 'Administrator';

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-surface-bg transition-colors ${
                        isInactive ? 'opacity-80' : ''
                      }`}
                    >
                      {/* PENGGUNA */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className={`w-10 h-10 rounded-full object-cover shadow-sm shrink-0 ${
                              isInactive ? 'grayscale' : ''
                            }`}
                            onError={(e) => {
                              // fallback to avatar placeholder
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-on-surface">
                                {user.name}
                              </span>
                              {user.isVerifiedAdmin && (
                                <span title="Pemilik Toko / Akun Utama" className="inline-flex">
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-text-muted">{user.username}</span>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-4 py-3.5">{getRoleBadge(user.role)}</td>

                      {/* STATUS */}
                      <td className="px-4 py-3.5">
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
                      </td>

                      {/* LOGIN TERAKHIR */}
                      <td className="px-4 py-3.5 text-xs text-on-surface whitespace-nowrap">
                        {user.isOnline ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            <span className="font-medium text-secondary">{user.lastLogin}</span>
                            <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded">
                              Online
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{user.lastLogin}</span>
                          </div>
                        )}
                      </td>

                      {/* TERDAFTAR */}
                      <td className="px-4 py-3.5 text-xs text-text-muted whitespace-nowrap">
                        {user.registeredDate}
                      </td>

                      {/* TINDAKAN */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPrimaryAdmin ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onOpenEditModal(user)}
                                className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-medium transition-colors cursor-pointer"
                                title="Edit Profil"
                              >
                                Edit Profil
                              </button>
                              <span
                                className="px-3 py-1.5 rounded-lg bg-surface-container-low text-text-muted text-xs inline-flex items-center gap-1 cursor-not-allowed border border-border-subtle"
                                title="Akun Utama tidak dapat dinonaktifkan"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                Terkunci
                              </span>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => onOpenEditModal(user)}
                                className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-medium transition-colors cursor-pointer"
                                title="Edit Data & Reset Password"
                              >
                                Edit & Reset
                              </button>
                              {user.status === 'Aktif' ? (
                                <button
                                  type="button"
                                  onClick={() => onToggleUserStatus(user)}
                                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-text-muted text-xs font-medium transition-colors cursor-pointer"
                                  title="Nonaktifkan User"
                                >
                                  Nonaktifkan
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onToggleUserStatus(user)}
                                  className="px-3 py-1.5 rounded-lg bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-xs font-medium transition-colors cursor-pointer"
                                  title="Aktifkan Kembali"
                                >
                                  Aktifkan Kembali
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted text-sm">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="w-full px-4 py-3.5 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle">
          <span className="text-xs text-text-muted text-center sm:text-left">
            Menampilkan <strong className="text-on-surface">{displayedUsers.length}</strong> dari{' '}
            <strong className="text-on-surface">{filteredUsers.length}</strong> total user terdaftar
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1.5 rounded bg-surface-container-lowest text-text-muted hover:text-on-surface disabled:opacity-40 text-xs border border-border-subtle cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-border-subtle'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1.5 rounded bg-surface-container-lowest text-text-muted hover:text-on-surface disabled:opacity-40 text-xs border border-border-subtle cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};