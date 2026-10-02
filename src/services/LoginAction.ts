import api from '../lib/api';
import { saveAuthSession, clearAuthSession } from '../lib/authStorage';
import type { LoginApiResponse, LoginResponseData } from '../types/auth';

export interface LoginPayload {
  email?: string;
  username?: string;
  password?: string;
}

/**
 * Service untuk memproses login ke backend API
 * dan otomatis menyimpan data response (accessToken, refreshToken, userInfo, permission) ke localStorage
 */
export const login = async (payload: LoginPayload): Promise<LoginResponseData> => {
  const response: LoginApiResponse = await api.post<LoginResponseData>('/auth/login', payload);

  if (response && response.data) {
    saveAuthSession(response.data);
    return response.data;
  }

  throw new Error(response.message || 'Login gagal');
};

/**
 * Service untuk logout dan membersihkan session
 */
export const logout = (): void => {
  clearAuthSession();
};