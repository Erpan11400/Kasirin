import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserInfo, LoginResponseData } from '../types/auth';
import {
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  getPermissions,
  saveAuthSession,
  clearAuthSession,
  hasPermission as checkPermissionHelper,
  isTokenExpired,
} from '../lib/authStorage';
import { refreshAccessToken } from '../lib/api';
import { login as loginService, logout as logoutService, type LoginPayload } from '../services/LoginAction';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  permissions: string[];
  token: string | null;
  login: (payload: LoginPayload) => Promise<LoginResponseData>;
  logout: () => Promise<void>;
  hasPermission: (moduleOrPermission: string, action?: string) => boolean;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(() => getUserInfo());
  const [permissions, setPermissions] = useState<string[]>(() => getPermissions());
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifikasi status autentikasi dari localStorage / token
  const checkAuth = useCallback((): boolean => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const currentUser = getUserInfo();
    const currentPermissions = getPermissions();

    if (!accessToken && !refreshToken) {
      clearAuthSession();
      setUser(null);
      setPermissions([]);
      setToken(null);
      return false;
    }

    // Jika access token sudah expired
    if (isTokenExpired(accessToken)) {
      // Jika refresh token juga expired atau tidak ada
      if (!refreshToken || isTokenExpired(refreshToken)) {
        clearAuthSession();
        setUser(null);
        setPermissions([]);
        setToken(null);
        return false;
      }

      // Jika refreshToken masih valid, perbarui accessToken di background
      refreshAccessToken()
        .then((newToken) => {
          setToken(newToken);
        })
        .catch((err) => {
          console.warn('Gagal memicu refresh token saat inisialisasi sesi:', err);
        });
    }

    setUser(currentUser);
    setPermissions(currentPermissions);
    setToken(accessToken);
    return true;
  }, []);

  // Inisialisasi pengecekan saat aplikasi pertama kali dimuat
  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);

  // Listener untuk menangani event session expired (401), token refreshed, atau multi-tab sync
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthSession();
      setUser(null);
      setPermissions([]);
      setToken(null);
    };

    const handleTokenRefreshed = (e: any) => {
      if (e?.detail?.accessToken) {
        setToken(e.detail.accessToken);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'userInfo' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:token-refreshed', handleTokenRefreshed);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  // Handle proses Login
  const login = async (payload: LoginPayload): Promise<LoginResponseData> => {
    const data = await loginService(payload);
    saveAuthSession(data);
    setToken(data.accessToken);
    setUser({
      name: data.name,
      roleName: data.roleName,
    });
    setPermissions(data.permissions || []);
    return data;
  };

  // Handle proses Logout
  const logout = async (): Promise<void> => {
    try {
      await logoutService();
    } catch (err) {
      console.error('Error saat proses logout:', err);
    } finally {
      clearAuthSession();
      setUser(null);
      setPermissions([]);
      setToken(null);
    }
  };

  const hasPermission = (moduleOrPermission: string, action?: string): boolean => {
    return checkPermissionHelper(moduleOrPermission, action);
  };

  const isAuthenticated = Boolean(
    user && (!isTokenExpired(token) || (getRefreshToken() && !isTokenExpired(getRefreshToken())))
  );


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        permissions,
        token,
        login,
        logout,
        hasPermission,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
