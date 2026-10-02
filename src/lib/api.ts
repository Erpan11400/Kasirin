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

import { getAccessToken, clearAuthSession } from './authStorage';

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
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Menangani response dan error HTTP umum
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesi telah berakhir atau tidak terotorisasi (401).');
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
