import api, { type ApiResponse } from '../lib/api';
import { saveAuthSession, clearAuthSession, getRefreshToken } from '../lib/authStorage';
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
  try {
    const response: LoginApiResponse = await api.post<LoginResponseData>('/auth/login', payload);

    if (response && response.data) {
      saveAuthSession(response.data);
      return response.data;
    }

    throw new Error(response?.message || 'Login gagal');
  } catch (error: any) {
    let message = 'Email atau kata sandi tidak valid. Silakan coba lagi.';

    if (!error?.response) {
      message = 'Tidak dapat terhubung ke server. Pastikan server aktif dan koneksi internet stabil.';
    } else if (error?.response?.status >= 500) {
      message =
        error?.response?.data?.message ||
        'Terjadi gangguan pada server. Silakan coba beberapa saat lagi.';
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    throw new Error(message);
  }
};

/**
 * Service untuk logout dan membersihkan session
 * Mengirimkan refreshToken ke backend route /auth/logout
 */
export const logout = async (): Promise<ApiResponse<string>> => {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      const response = await api.post<string>('/auth/logout', { refreshToken });
      return response;
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Logout berhasil',
      data: '',
    };
  } catch (error) {
    console.error('Gagal mengirim request logout ke server:', error);
    throw error;
  } finally {
    clearAuthSession();
  }
};