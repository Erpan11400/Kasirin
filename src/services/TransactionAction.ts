import api from '../lib/api';
import type {
  CreateTransactionItemPayload,
  CreateTransactionPayload,
  BackendTransactionItem,
  BackendTransactionCashier,
  BackendTransactionResponse,
  TransactionKpiRevenue,
  TransactionKpiTransactions,
  TransactionKpiTopProduct,
  TransactionKpiAov,
  TransactionKpiData,
  GetTransactionsFilter,
  GetTransactionsParams,
} from '../types/transaction';
import type { DailyRecord, MonthlyRecord } from '../types/report';

export type {
  CreateTransactionItemPayload,
  CreateTransactionPayload,
  BackendTransactionItem,
  BackendTransactionCashier,
  BackendTransactionResponse,
  TransactionKpiRevenue,
  TransactionKpiTransactions,
  TransactionKpiTopProduct,
  TransactionKpiAov,
  TransactionKpiData,
  GetTransactionsFilter,
  GetTransactionsParams,
  DailyRecord,
  MonthlyRecord,
};

/**
 * Helper untuk memformat tanggal ke format ISO YYYY-MM-DD yang didukung backend query.
 * Menerima format DD/MM/YYYY, Date object, atau YYYY-MM-DD.
 */
export const formatToQueryDate = (date?: string | Date): string | undefined => {
  if (!date) return undefined;
  if (date instanceof Date) {
    if (isNaN(date.getTime())) return undefined;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const str = String(date).trim();
  if (!str) return undefined;

  // Cek format DD/MM/YYYY
  const parts = str.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return str;
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
 * Mendukung filter tanggal query: `startDate` dan `endDate`
 */
export const getTransactions = async (
  params?: GetTransactionsFilter
): Promise<BackendTransactionResponse[]> => {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.startDate) {
      const formattedStart = formatToQueryDate(params.startDate);
      if (formattedStart) queryParams.startDate = formattedStart;
    }
    if (params?.endDate) {
      const formattedEnd = formatToQueryDate(params.endDate);
      if (formattedEnd) queryParams.endDate = formattedEnd;
    }

    const response = await api.get<BackendTransactionResponse[]>('/transactions', {
      params: queryParams,
    });
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray((response as any)?.data?.data)) {
      return (response as any).data.data;
    }
    if (Array.isArray(response)) {
      return response;
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
    const data =
      (response as any)?.data?.data ||
      response?.data ||
      response;
    return data;
  } catch (error: any) {
    console.error(`Error saat memuat detail transaksi ${id}:`, error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat detail transaksi.'
    );
  }
};

/**
 * Mengambil ringkasan metrik KPI transaksi dari backend route `GET /transactions/kpi`
 */
export const getTransactionKpis = async (): Promise<TransactionKpiData> => {
  try {
    const response = await api.get<TransactionKpiData>('/transactions/kpi');
    return response.data;
  } catch (error: any) {
    console.error('Error saat memuat KPI transaksi:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat data KPI transaksi.'
    );
  }
};

/**
 * Mengambil data rekap harian transaksi dari backend route `GET /transactions/daily`
 * Mendukung filter tanggal query: `startDate` dan `endDate`
 */
export const getDailyTransactions = async (
  params?: GetTransactionsFilter
): Promise<DailyRecord[]> => {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.startDate) {
      const formattedStart = formatToQueryDate(params.startDate);
      if (formattedStart) queryParams.startDate = formattedStart;
    }
    if (params?.endDate) {
      const formattedEnd = formatToQueryDate(params.endDate);
      if (formattedEnd) queryParams.endDate = formattedEnd;
    }

    const response = await api.get<DailyRecord[]>('/transactions/daily', {
      params: queryParams,
    });
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray((response as any)?.data?.data)) {
      return (response as any).data.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat rekap harian transaksi:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat rekap harian transaksi.'
    );
  }
};

/**
 * Mengambil data rekap bulanan transaksi dari backend route `GET /transactions/monthly`
 */
export const getMonthlyTransactions = async (): Promise<MonthlyRecord[]> => {
  try {
    const response = await api.get<MonthlyRecord[]>('/transactions/monthly');
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray((response as any)?.data?.data)) {
      return (response as any).data.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error: any) {
    console.error('Error saat memuat rekap bulanan transaksi:', error);
    throw new Error(
      error?.response?.data?.message || error?.message || 'Gagal memuat rekap bulanan transaksi.'
    );
  }
};

