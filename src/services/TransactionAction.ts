import api from '../lib/api';
import type {
  CreateTransactionItemPayload,
  CreateTransactionPayload,
  BackendTransactionItem,
  BackendTransactionCashier,
  BackendTransactionResponse,
} from '../types/transaction';

export type {
  CreateTransactionItemPayload,
  CreateTransactionPayload,
  BackendTransactionItem,
  BackendTransactionCashier,
  BackendTransactionResponse,
};

/**
 * Membuat transaksi baru ke backend route `POST /transactions`
 */
export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<BackendTransactionResponse> => {
  try {
    const response = await api.post<BackendTransactionResponse>('/transactions', payload);
    const data = (response?.data as BackendTransactionResponse) || (response as unknown as BackendTransactionResponse);
    return data;
  } catch (error: any) {
    console.error('Error saat membuat transaksi:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memproses transaksi.'
    );
  }
};

/**
 * Mengambil seluruh riwayat transaksi dari backend route `GET /transactions`
 */
export const getTransactions = async (): Promise<BackendTransactionResponse[]> => {
  try {
    const response = await api.get<BackendTransactionResponse[]>('/transactions');
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat daftar transaksi:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat riwayat transaksi.'
    );
  }
};

/**
 * Mengambil detail transaksi berdasarkan ID dari backend route `GET /transactions/:id`
 */
export const getTransactionById = async (
  id: string
): Promise<BackendTransactionResponse> => {
  try {
    const response = await api.get<BackendTransactionResponse>(`/transactions/${id}`);
    const data = (response?.data as BackendTransactionResponse) || (response as unknown as BackendTransactionResponse);
    return data;
  } catch (error: any) {
    console.error(`Error saat memuat detail transaksi ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat detail transaksi.'
    );
  }
};
