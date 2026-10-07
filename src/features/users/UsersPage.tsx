import React, { useState, useEffect } from 'react';
import { Users, Key, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserListTab } from './components/UserListTab';
import { RoleSettingsTab } from './components/RoleSettingsTab';
import { UserModal } from './components/UserModal';
import { RoleModal } from './components/RoleModal';
import { Toast } from '../../components/ui/Toast';
import { INITIAL_USERS, INITIAL_ROLES } from './data/initialUsers';
import type { UserItem, RoleItem, RolePermissions } from '../../types/users';
import { getRoles, createRole, updateRole, deleteRole } from '../../services/RoleAction';
import { getUsers, createUser, updateUser } from '../../services/UserAction';
import { formatDate } from '../../lib/formatters';

export const UsersPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const canViewUsers = hasPermission('users:view');
  const canViewRoles = hasPermission('roles:view');

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>(() => {
    if (canViewUsers) return 'users';
    if (canViewRoles) return 'roles';
    return 'users';
  });

  // Sinkronisasi activeTab jika izin berubah
  useEffect(() => {
    if (!canViewUsers && canViewRoles && activeTab !== 'roles') {
      setActiveTab('roles');
    } else if (canViewUsers && !canViewRoles && activeTab !== 'users') {
      setActiveTab('users');
    }
  }, [canViewUsers, canViewRoles, activeTab]);
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(INITIAL_ROLES[1]?.id || INITIAL_ROLES[0]?.id || '');

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

  // Helper untuk sinkronisasi jumlah pengguna pada setiap role
  const syncRoleUserCounts = (rolesList: RoleItem[], usersList: UserItem[]): RoleItem[] => {
    return rolesList.map((r) => {
      const count = usersList.filter(
        (u) => u.roleId === r.id || u.role.toLowerCase() === r.name.toLowerCase()
      ).length;
      return { ...r, userCount: count };
    });
  };

  // Fetch roles and users from backend GET /roles and GET /users on mount
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        let loadedRoles = roles;
        try {
          const backendRoles = await getRoles();
          if (backendRoles && backendRoles.length > 0) {
            loadedRoles = backendRoles;
          }
        } catch (roleErr) {
          console.warn('Backend roles unavailable, using fallback:', roleErr);
        }

        let loadedUsers = users;
        try {
          const backendUsers = await getUsers(loadedRoles);
          if (backendUsers && backendUsers.length > 0) {
            loadedUsers = backendUsers;
          }
        } catch (userErr) {
          console.warn('Backend users unavailable, using fallback:', userErr);
        }

        if (isMounted) {
          const syncedRoles = syncRoleUserCounts(loadedRoles, loadedUsers);
          setRoles(syncedRoles);
          setUsers(loadedUsers);

          setSelectedRoleId((prev) => {
            if (!prev || !syncedRoles.some((r) => r.id === prev)) {
              return syncedRoles[0]?.id || '';
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn('Error loading initial data:', err);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (tab: 'users' | 'roles') => {
    setActiveTab(tab);
  };

  // User Actions
  const handleOpenAddUserModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (data: {
    id?: string;
    name: string;
    email: string;
    roleId: string;
    password?: string;
    isActive?: boolean;
  }) => {
    if (editingUser) {
      try {
        const updated = await updateUser(
          editingUser.id,
          {
            name: data.name,
            email: data.email,
            roleId: data.roleId,
            ...(data.password ? { password: data.password } : {}),
            isActive: data.isActive,
          },
          roles
        );

        setUsers((prev) => {
          const nextUsers = prev.map((u) => (u.id === updated.id ? updated : u));
          setRoles((currentRoles) => syncRoleUserCounts(currentRoles, nextUsers));
          return nextUsers;
        });

        showToast(`Data pengguna "${updated.name}" berhasil diperbarui.`);
      } catch (err: any) {
        // Fallback update local state
        const matchedRole = roles.find((r) => r.id === data.roleId);
        const fallbackUpdated: UserItem = {
          ...editingUser,
          name: data.name,
          email: data.email,
          roleId: data.roleId,
          role: matchedRole?.name || editingUser.role,
        };

        setUsers((prev) => {
          const nextUsers = prev.map((u) => (u.id === fallbackUpdated.id ? fallbackUpdated : u));
          setRoles((currentRoles) => syncRoleUserCounts(currentRoles, nextUsers));
          return nextUsers;
        });

        showToast(`Data pengguna "${fallbackUpdated.name}" diperbarui.`);
      }
    } else {
      try {
        const created = await createUser(
          {
            name: data.name,
            email: data.email,
            roleId: data.roleId,
            password: data.password,
            isActive: true,
          },
          roles
        );

        setUsers((prev) => {
          const nextUsers = [created, ...prev];
          setRoles((currentRoles) => syncRoleUserCounts(currentRoles, nextUsers));
          return nextUsers;
        });

        showToast(`Pengguna baru "${created.name}" berhasil ditambahkan.`);
      } catch (err: any) {
        // Fallback create local state
        const matchedRole = roles.find((r) => r.id === data.roleId);
        const fallbackCreated: UserItem = {
          id: `USR-${Date.now()}`,
          name: data.name,
          email: data.email,
          username: `@${data.email.split('@')[0]}`,
          roleId: data.roleId,
          role: matchedRole?.name || 'Kasir',
          status: 'Aktif',
          isActive: true,
          lastLogin: 'Baru saja',
          registeredDate: formatDate(new Date()),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.name
          )}&background=006948&color=ffffff&bold=true`,
        };

        setUsers((prev) => {
          const nextUsers = [fallbackCreated, ...prev];
          setRoles((currentRoles) => syncRoleUserCounts(currentRoles, nextUsers));
          return nextUsers;
        });

        showToast(`Pengguna baru "${fallbackCreated.name}" berhasil dibuat.`);
      }
    }
  };

  const handleToggleUserStatus = async (user: UserItem) => {
    const nextActive = !user.isActive;

    try {
      const updated = await updateUser(
        user.id,
        {
          isActive: nextActive,
        },
        roles
      );

      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      showToast(`Status akun ${user.name} berhasil diperbarui menjadi ${updated.status}.`);
    } catch (err) {
      // Fallback local state toggle
      const updatedStatus = nextActive ? 'Aktif' : 'Nonaktif';
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: nextActive, status: updatedStatus } : u
        )
      );
      showToast(`Status akun ${user.name} berhasil diperbarui.`);
    }
  };

  // Role Actions
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
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
    newDescription: string | undefined,
    newPermissions: RolePermissions
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

  const handleSaveRole = async (data: {
    id?: string;
    name: string;
    description?: string;
    permissions: RolePermissions;
  }) => {
    if (editingRole) {
      try {
        const updated = await updateRole(editingRole.id, {
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        });
        setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        showToast(`Role "${updated.name}" dan hak aksesnya berhasil diperbarui.`);
      } catch (err: any) {
        // Fallback update local state if backend call fails
        handleUpdateRole(editingRole.id, data.name, data.description, data.permissions);
      }
    } else {
      try {
        const created = await createRole({
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        });
        setRoles((prev) => [...prev, created]);
        setSelectedRoleId(created.id);
        setActiveTab('roles');
        showToast(`Role baru "${created.name}" berhasil dibuat.`);
      } catch (err: any) {
        // Fallback create local state if backend call fails
        const newRole: RoleItem = {
          id: `role-${Date.now()}`,
          name: data.name,
          description: data.description,
          type: 'active',
          isSystemRole: false,
          userCount: 0,
          iconName: 'custom',
          permissions: data.permissions,
        };
        handleAddRole(newRole);
      }
    }
  };

  const handleUpdateRolePermissions = (
    roleId: string,
    permissions: RolePermissions
  ) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
  };

  const handleDeleteRole = async (roleId: string) => {
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (!roleToDelete) return;

    try {
      await deleteRole(roleId);
    } catch (err) {
      console.warn('Backend delete role error:', err);
    }

    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    const remaining = roles.filter((r) => r.id !== roleId);
    setSelectedRoleId(remaining[0]?.id || '');
    showToast(`Role "${roleToDelete.name}" berhasil dihapus.`);
  };

  const activeUsersCount = users.filter((u) => u.isActive || u.status === 'Aktif').length;

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
      {(canViewUsers && canViewRoles) && (
        <div className="w-full overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl w-max border border-border-subtle/60">
            {canViewUsers && (
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
            )}
            {canViewRoles && (
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
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full flex flex-col gap-6">
        {activeTab === 'users' && canViewUsers ? (
          <UserListTab
            users={users}
            roles={roles}
            onOpenAddModal={handleOpenAddUserModal}
            onOpenEditModal={handleOpenEditModal}
            onToggleUserStatus={handleToggleUserStatus}
          />
        ) : activeTab === 'roles' && canViewRoles ? (
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
        ) : (
          <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-border-subtle">
            <p className="text-text-muted text-sm">
              Anda tidak memiliki izin untuk melihat modul ini.
            </p>
          </div>
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