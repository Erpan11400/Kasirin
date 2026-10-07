import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * Format standar response dari backend KasirIn
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  status: 'success' | 'failed';
  message: string;
  data: T;
}

/**
 * Mengambil Backend URL langsung dari file .env (VITE_BACKEND_URL)
 */
export const BASE_URL: string = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  'http://localhost:3000'
).toString().trim();

import { getAccessToken, getRefreshToken, setAccessToken, isTokenExpired, clearAuthSession } from './authStorage';

/**
 * Mengambil token autentikasi dari localStorage
 */
export const getAuthToken = (): string | null => {
  return getAccessToken();
};

/**
 * Menghapus token autentikasi saat logout
 */
export const removeAuthToken = (): void => {
  clearAuthSession();
};

/**
 * Inisialisasi Axios Instance dengan baseURL dari .env
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Antrean (Queue) request yang menunggu refresh token selesai
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || undefined);
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor:
 * Setiap request secara otomatis menyertakan header 'Authorization: Bearer <token>'
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fungsi untuk request refresh token langsung ke endpoint backend (POST /auth/refresh-token)
 */
export const refreshAccessToken = async (token?: string | null): Promise<string> => {
  const refreshToken = token || getRefreshToken();

  if (!refreshToken || isTokenExpired(refreshToken)) {
    clearAuthSession();
    throw new Error('Sesi telah berakhir. Silakan login kembali.');
  }

  const response = await axios.post<ApiResponse<string>>(
    `${BASE_URL}/auth/refresh-token`,
    { refreshToken }
  );

  const newAccessToken = response.data?.data;

  if (!newAccessToken) {
    throw new Error(response.data?.message || 'Token baru tidak ditemukan dalam response');
  }

  setAccessToken(newAccessToken);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:token-refreshed', { detail: { accessToken: newAccessToken } }));
  }

  return newAccessToken;
};

/**
 * Response Interceptor:
 * Menangani response dan auto silent refresh token (LocalStorage / Non-HttpOnly)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthEndpoint = ['/auth/login', '/auth/refresh-token', '/auth/logout'].some((url) =>
      requestUrl.includes(url)
    );

    if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers && newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthSession();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          if (!window.location.pathname.startsWith('/login')) {
            const currentPath = window.location.pathname + window.location.search;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Reusable API Methods (GET, POST, PUT, PATCH, DELETE)
 * Mengembalikan tipe data ApiResponse<T> ({ statusCode, status, message, data })
 */
export const api = {
  /**
   * HTTP GET Request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data);
  },

  /**
   * HTTP POST Request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },

  /**
   * HTTP PUT Request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },

  /**
   * HTTP PATCH Request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },

  /**
   * HTTP DELETE Request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data);
  },

  /**
   * Akses langsung ke raw Axios Instance jika dibutuhkan konfigurasi spesifik
   */
  client: apiClient,
};

// Export fungsi individual untuk fleksibilitas import
export const get = api.get;
export const post = api.post;
export const put = api.put;
export const patch = api.patch;
export const del = api.delete;

export default api;
