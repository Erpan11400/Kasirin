import React, { useState } from 'react';
import { Users, Key, UserCog } from 'lucide-react';
import { UserListTab } from './components/UserListTab';
import { RoleSettingsTab } from './components/RoleSettingsTab';
import { UserModal } from './components/UserModal';
import { RoleModal } from './components/RoleModal';
import { Toast } from './components/Toast';
import { INITIAL_USERS, INITIAL_ROLES } from './data/initialUsers';
import type { UserItem, RoleItem } from '../../types/users';

export const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(INITIAL_ROLES[1].id); // 'role-kasir'

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleTabChange = (tab: 'users' | 'roles') => {
    setActiveTab(tab);
    if (tab === 'users') {
      showToast('Menampilkan tab Daftar Pengguna');
    } else {
      showToast('Menampilkan Pengaturan Role & Hak Akses');
    }
  };

  // User Actions
  const handleAddUser = (newUser: Omit<UserItem, 'id' | 'lastLogin' | 'registeredDate'>) => {
    const createdUser: UserItem = {
      ...newUser,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      lastLogin: 'Baru saja',
      registeredDate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };

    setUsers((prev) => [createdUser, ...prev]);

    // Update role user count
    setRoles((prev) =>
      prev.map((r) =>
        r.name.toLowerCase() === newUser.role.toLowerCase()
          ? { ...r, userCount: r.userCount + 1 }
          : r
      )
    );

    showToast('Pengguna baru berhasil ditambahkan ke database toko.');
  };

  const handleUpdateUser = (updated: UserItem) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('Informasi staf dan kredensial berhasil disimpan.');
  };

  const handleToggleUserStatus = (user: UserItem) => {
    const willDeactivate = user.status === 'Aktif';
    const actionText = willDeactivate ? 'menonaktifkan' : 'mengaktifkan';

    if (window.confirm(`Apakah Anda yakin ingin ${actionText} akun ${user.name}?`)) {
      const updatedStatus = willDeactivate ? 'Nonaktif' : 'Aktif';
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: updatedStatus } : u))
      );
      showToast(`Status akun ${user.name} berhasil diperbarui.`);
    }
  };

  const handleOpenAddUserModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (data: Partial<UserItem> & { password?: string }) => {
    if (editingUser) {
      handleUpdateUser(data as UserItem);
    } else {
      handleAddUser(data as Omit<UserItem, 'id' | 'lastLogin' | 'registeredDate'>);
    }
  };

  // Role Actions
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      showToast(`Memuat matriks hak akses: ${role.name}`);
    }
  };

  const handleAddRole = (newRole: RoleItem) => {
    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleId(newRole.id);
    setActiveTab('roles');
    showToast(`Role baru "${newRole.name}" berhasil dibuat.`);
  };

  const handleOpenAddRoleModal = () => {
    setEditingRole(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRoleModal = (role: RoleItem) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const handleUpdateRole = (
    roleId: string,
    newName: string,
    newDescription: string,
    newPermissions: RoleItem['permissions']
  ) => {
    const roleToUpdate = roles.find((r) => r.id === roleId);
    if (!roleToUpdate) return;
    const oldName = roleToUpdate.name;

    // Update role
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              name: newName,
              description: newDescription,
              permissions: newPermissions,
            }
          : r
      )
    );

    // Synchronize users role name if it changed
    if (oldName !== newName) {
      setUsers((prev) =>
        prev.map((u) => (u.role === oldName ? { ...u, role: newName } : u))
      );
    }

    showToast(`Role "${newName}" dan hak aksesnya berhasil diperbarui.`);
  };

  const handleSaveRole = (data: {
    id?: string;
    name: string;
    description: string;
    permissions: RoleItem['permissions'];
  }) => {
    if (editingRole) {
      handleUpdateRole(editingRole.id, data.name, data.description, data.permissions);
    } else {
      const newRole: RoleItem = {
        id: `role-${Date.now()}`,
        name: data.name,
        type: 'active',
        userCount: 0,
        description:
          data.description ||
          'Peran khusus toko dengan matriks hak akses yang disesuaikan.',
        iconName: 'custom',
        permissions: data.permissions,
      };
      handleAddRole(newRole);
    }
  };

  const handleUpdateRolePermissions = (
    roleId: string,
    permissions: RoleItem['permissions']
  ) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
  };

  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (!roleToDelete) return;

    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    setSelectedRoleId(roles[1]?.id || roles[0]?.id);
    showToast(`Role "${roleToDelete.name}" berhasil dihapus.`);
  };

  const activeUsersCount = users.filter((u) => u.status === 'Aktif').length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-6 py-4 sm:py-6 flex flex-col gap-5 sm:gap-6 bg-surface-bg min-h-screen">
      {/* Top Action & Info Bar */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-border-subtle/70">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
              <UserCog className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              <span>Manajemen Pengguna &amp; Hak Akses (RBAC)</span>
            </h1>
            <span className="text-[11px] font-bold bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full uppercase tracking-wider">
              Modul Khusus Administrator
            </span>
          </div>
          <p className="text-sm text-text-muted max-w-2xl">
            Kelola akun kasir, staf, dan matriks hak akses peran untuk mengamankan operasional toko Anda.
          </p>
        </div>

        {/* Status Pill on the Right */}
        <div className="flex items-center gap-3 self-start lg:self-center shrink-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface w-full sm:w-auto justify-between sm:justify-start border border-border-subtle/50">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 animate-pulse"></span>
              <span className="text-xs font-semibold">{activeUsersCount} Pengguna Aktif</span>
            </div>
            <span className="text-text-muted">•</span>
            <span className="text-xs text-text-muted">{roles.length} Peran Terdaftar</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl w-max border border-border-subtle/60">
          <button
            type="button"
            onClick={() => handleTabChange('users')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-text-muted hover:text-on-surface'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Daftar Pengguna</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('roles')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-text-muted hover:text-on-surface'
            }`}
          >
            <Key className="w-4.5 h-4.5" />
            <span>Pengaturan Role &amp; Hak Akses</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex flex-col gap-6">
        {activeTab === 'users' ? (
          <UserListTab
            users={users}
            roles={roles}
            onOpenAddModal={handleOpenAddUserModal}
            onOpenEditModal={handleOpenEditModal}
            onToggleUserStatus={handleToggleUserStatus}
          />
        ) : (
          <RoleSettingsTab
            roles={roles}
            selectedRoleId={selectedRoleId}
            onSelectRole={handleSelectRole}
            onOpenAddRoleModal={handleOpenAddRoleModal}
            onOpenEditRoleModal={handleOpenEditRoleModal}
            onUpdateRolePermissions={handleUpdateRolePermissions}
            onDeleteRole={handleDeleteRole}
            showToast={showToast}
          />
        )}
      </div>

      {/* Modals */}
      {/* Unified User Modal (Handles both Add & Edit) */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={editingUser}
        roles={roles}
        onSave={handleSaveUser}
      />

      {/* Unified Role Modal (Handles both Add & Edit) */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={editingRole}
        onSave={handleSaveRole}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default UsersPage;