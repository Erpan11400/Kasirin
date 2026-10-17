import { apiClient } from '../lib/api';
import { toQueryDateString, normalizePaymentMethod } from './reportService';
import type {
  ExportReportPdfParams,
  ExportPdfResult,
  ExportPdfReportType,
  ExportPdfOrientation,
  ExportRawDataExcelParams,
  ExportExcelResult,
} from '../types/report';

export type {
  ExportReportPdfParams,
  ExportPdfResult,
  ExportPdfReportType,
  ExportPdfOrientation,
  ExportRawDataExcelParams,
  ExportExcelResult,
};

/**
 * Opsi tambahan untuk request export PDF laporan
 */
export interface ExportReportPdfOptions {
  /**
   * HTTP Method untuk pemanggilan endpoint backend (Default: 'POST')
   * Backend mendukung GET (query params) maupun POST (body payload)
   */
  method?: 'GET' | 'POST';
  /**
   * Nama file cadangan jika Content-Disposition tidak tersedia pada response header
   */
  fallbackFilename?: string;
  /**
   * Timeout request dalam milidetik (Default: 60000 / 60 detik untuk puppeteer rendering)
   */
  timeout?: number;
}

/**
 * Opsi tambahan untuk request export Raw Data Excel
 */
export interface ExportRawDataExcelOptions {
  /**
   * HTTP Method untuk pemanggilan endpoint backend (Default: 'POST')
   * Backend mendukung GET (query params) maupun POST (JSON body)
   */
  method?: 'GET' | 'POST';
  /**
   * Nama file cadangan jika Content-Disposition tidak tersedia pada response header
   */
  fallbackFilename?: string;
  /**
   * Timeout request dalam milidetik (Default: 60000 / 60 detik)
   */
  timeout?: number;
}

/**
 * Helper untuk menentukan path endpoint relatif yang tepat terhadap baseURL apiClient.
 * Memastikan request selalu mengarah ke `/api/export/report/pdf`.
 */
export const getExportPdfEndpoint = (): string => {
  const baseURL = (apiClient.defaults.baseURL || '').trim();
  if (baseURL.endsWith('/api')) {
    return '/export/report/pdf';
  }
  return '/api/export/report/pdf';
};

/**
 * Helper untuk menentukan path endpoint relatif yang tepat terhadap baseURL apiClient.
 * Memastikan request selalu mengarah ke `/api/export/raw-data/excel`.
 */
export const getExportRawDataExcelEndpoint = (): string => {
  const baseURL = (apiClient.defaults.baseURL || '').trim();
  if (baseURL.endsWith('/api')) {
    return '/export/raw-data/excel';
  }
  return '/api/export/raw-data/excel';
};

/**
 * Helper untuk mengekstrak nama file dari header response `Content-Disposition`.
 * Mendukung format:
 * - `attachment; filename="Laporan_Transaksi_2026-10-17.pdf"`
 * - `attachment; filename=Laporan.pdf`
 * - `attachment; filename*=UTF-8''Laporan%20Transaksi.pdf`
 */
export const extractFilenameFromContentDisposition = (
  contentDisposition?: string,
  fallbackFilename: string = 'Laporan.pdf'
): string => {
  if (!contentDisposition) return fallbackFilename;

  try {
    // 1. Prioritaskan format RFC 5987 (filename*=UTF-8''...)
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
      return decodeURIComponent(utf8Match[1].trim());
    }

    // 2. Format standar filename="..." atau filename=...
    const standardMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (standardMatch && standardMatch[1]) {
      return standardMatch[1].trim();
    }
  } catch (err) {
    console.warn('Gagal mem-parsing header Content-Disposition:', err);
  }

  return fallbackFilename;
};

/**
 * Helper penamaan file fallback untuk ekspor data mentah Excel (.xlsx)
 * Mengikuti pola backend KasirIn-BE:
 * - Data_Mentah_Transaksi_<start>_sd_<end>.xlsx
 * - Data_Mentah_Transaksi_<start>_sd_Terbaru.xlsx (hanya startDate)
 * - Data_Mentah_Transaksi_Awal_sd_<end>.xlsx (hanya endDate)
 * - Data_Mentah_Transaksi_Semua_<YYYY-MM-DD>.xlsx (tanpa filter tanggal)
 */
export const getRawDataExcelFallbackFilename = (
  startDate?: string,
  endDate?: string
): string => {
  const start = toQueryDateString(startDate);
  const end = toQueryDateString(endDate);
  const todayStr = new Date().toISOString().slice(0, 10);

  if (start && end) {
    return `Data_Mentah_Transaksi_${start}_sd_${end}.xlsx`;
  }
  if (start) {
    return `Data_Mentah_Transaksi_${start}_sd_Terbaru.xlsx`;
  }
  if (end) {
    return `Data_Mentah_Transaksi_Awal_sd_${end}.xlsx`;
  }
  return `Data_Mentah_Transaksi_Semua_${todayStr}.xlsx`;
};

/**
 * Helper untuk men-trigger auto-download file biner (Blob) di background
 * tanpa memicu dialog cetak browser (`window.print`).
 */
export const triggerBlobDownload = (
  blobData: BlobPart,
  filename: string,
  defaultMimeType?: string
): void => {
  let mime = defaultMimeType;
  if (!mime) {
    if (filename.endsWith('.xlsx')) {
      mime =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (filename.endsWith('.pdf')) {
      mime = 'application/pdf';
    } else {
      mime = 'application/octet-stream';
    }
  }

  const blob =
    blobData instanceof Blob ? blobData : new Blob([blobData], { type: mime });

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Bersihkan memori object URL setelah jeda agar browser sempat memulai proses unduhan
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
};

/**
 * Parser pesan error khusus untuk request dengan `responseType: 'blob'`.
 * Pada kegagalan request (status 400/401/403/500), Axios mengembalikan body response
 * sebagai Blob biner sehingga harus dibaca menggunakan `.text()` lalu diparse JSON.
 */
export const parseBlobErrorMessage = async (error: unknown): Promise<string> => {
  const defaultFallback = 'Gagal memproses dan mengunduh data dari server.';

  if (!error || typeof error !== 'object') return defaultFallback;

  const errObj = error as {
    response?: {
      data?: unknown;
    };
    message?: string;
  };

  // Tangani jika response data berbentuk Blob
  if (errObj.response?.data instanceof Blob) {
    try {
      const errorText = await errObj.response.data.text();
      try {
        const errorJson = JSON.parse(errorText);
        if (typeof errorJson.message === 'string') return errorJson.message;
        if (typeof errorJson.error === 'string') return errorJson.error;
      } catch {
        // Bukan format JSON, gunakan text jika ada
        if (errorText.trim()) return errorText.trim();
      }
    } catch (readErr) {
      console.warn('Gagal membaca blob payload error:', readErr);
    }
  }

  // Fallback standar response data JSON
  const resData = errObj.response?.data as
    | { message?: string; error?: string }
    | undefined;
  if (resData?.message) {
    return resData.message;
  }

  if (resData?.error) {
    return resData.error;
  }

  if (errObj.message) {
    return errObj.message;
  }

  return defaultFallback;
};

/**
 * Helper kapitalisasi huruf pertama kata
 */
const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Mengambil file biner PDF laporan dari endpoint backend `/api/export/report/pdf`
 * menggunakan Axios dengan opsi `responseType: 'blob'`.
 */
export const fetchReportPdfBlob = async (
  params: ExportReportPdfParams = {},
  options: ExportReportPdfOptions = {}
): Promise<ExportPdfResult> => {
  const endpoint = getExportPdfEndpoint();
  const method = options.method || 'POST';
  const timeout = options.timeout ?? 60000; // 60 detik untuk rendering Puppeteer

  // Siapkan dan bersihkan parameter payload
  const formattedParams: Record<string, unknown> = {
    type: params.type || 'transaksi',
    orientation: params.orientation || 'portrait',
    showSignatures: params.showSignatures !== false,
    showKpis: params.showKpis !== false,
  };

  const startDateFormatted = toQueryDateString(params.startDate);
  if (startDateFormatted) {
    formattedParams.startDate = startDateFormatted;
  }

  const endDateFormatted = toQueryDateString(params.endDate);
  if (endDateFormatted) {
    formattedParams.endDate = endDateFormatted;
  }

  if (params.paymentMethod) {
    formattedParams.paymentMethod = normalizePaymentMethod(params.paymentMethod);
  }

  if (params.approverName && params.approverName.trim()) {
    formattedParams.approverName = params.approverName.trim();
  }

  const resolvedOperator = params.operatorName || params.cashierName;
  if (resolvedOperator && resolvedOperator.trim()) {
    formattedParams.operatorName = resolvedOperator.trim();
  }

  if (params.customNotes && params.customNotes.trim()) {
    formattedParams.customNotes = params.customNotes.trim();
  }

  // Generate fallback filename sesuai format backend: Laporan_<Type>_<YYYY-MM-DD>.pdf
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultFallback =
    options.fallbackFilename ||
    `Laporan_${capitalize(String(formattedParams.type))}_${todayStr}.pdf`;

  try {
    let response;

    if (method === 'GET') {
      response = await apiClient.get(endpoint, {
        params: formattedParams,
        responseType: 'blob',
        timeout,
      });
    } else {
      response = await apiClient.post(endpoint, formattedParams, {
        responseType: 'blob',
        timeout,
      });
    }

    // Ekstrak nama file dari Content-Disposition jika ada
    const contentDisposition =
      response.headers?.['content-disposition'] ||
      response.headers?.['Content-Disposition'] ||
      (typeof response.headers?.get === 'function'
        ? response.headers.get('content-disposition')
        : undefined);

    const filename = extractFilenameFromContentDisposition(
      contentDisposition,
      defaultFallback
    );

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: 'application/pdf' });

    return { blob, filename };
  } catch (error: unknown) {
    console.error('Error saat request export PDF laporan:', error);
    const parsedMessage = await parseBlobErrorMessage(error);
    throw new Error(parsedMessage, { cause: error });
  }
};

/**
 * Service utama untuk mengunduh laporan PDF secara langsung (Direct Download)
 * Memanggil backend Puppeteer, menerima biner PDF, mengekstrak filename,
 * dan memicu download otomatis di browser tanpa membuka dialog cetak.
 */
export const downloadReportPdf = async (
  params: ExportReportPdfParams = {},
  options: ExportReportPdfOptions = {}
): Promise<ExportPdfResult> => {
  const result = await fetchReportPdfBlob(params, options);
  triggerBlobDownload(result.blob, result.filename, 'application/pdf');
  return result;
};

/**
 * Mengambil file biner Excel (.xlsx) data mentah dari endpoint backend
 * GET/POST `/api/export/raw-data/excel` menggunakan Axios dengan `responseType: 'blob'`.
 */
export const fetchRawDataExcelBlob = async (
  params: ExportRawDataExcelParams = {},
  options: ExportRawDataExcelOptions = {}
): Promise<ExportExcelResult> => {
  const endpoint = getExportRawDataExcelEndpoint();
  const method = options.method || 'POST';
  const timeout = options.timeout ?? 60000; // 60 detik

  // Siapkan dan bersihkan parameter filter
  const formattedParams: Record<string, unknown> = {};

  const startDateFormatted = toQueryDateString(params.startDate);
  if (startDateFormatted) {
    formattedParams.startDate = startDateFormatted;
  }

  const endDateFormatted = toQueryDateString(params.endDate);
  if (endDateFormatted) {
    formattedParams.endDate = endDateFormatted;
  }

  if (params.paymentMethod) {
    formattedParams.paymentMethod = normalizePaymentMethod(params.paymentMethod);
  }

  // Fallback filename mengikuti pola backend
  const defaultFallback =
    options.fallbackFilename ||
    getRawDataExcelFallbackFilename(startDateFormatted, endDateFormatted);

  try {
    let response;

    if (method === 'GET') {
      response = await apiClient.get(endpoint, {
        params: formattedParams,
        responseType: 'blob',
        timeout,
      });
    } else {
      response = await apiClient.post(endpoint, formattedParams, {
        responseType: 'blob',
        timeout,
      });
    }

    // Ekstrak nama file dari Content-Disposition jika di-expose server
    const contentDisposition =
      response.headers?.['content-disposition'] ||
      response.headers?.['Content-Disposition'] ||
      (typeof response.headers?.get === 'function'
        ? response.headers.get('content-disposition')
        : undefined);

    const filename = extractFilenameFromContentDisposition(
      contentDisposition,
      defaultFallback
    );

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

    return { blob, filename };
  } catch (error: unknown) {
    console.error('Error saat request export raw data Excel:', error);
    const parsedMessage = await parseBlobErrorMessage(error);
    throw new Error(parsedMessage, { cause: error });
  }
};

/**
 * Service utama untuk mengunduh data mentah transaksi ke file Excel (.xlsx) secara langsung
 * Menerima file biner, menentukan filename, dan memicu download otomatis di browser.
 */
export const downloadRawDataExcel = async (
  params: ExportRawDataExcelParams = {},
  options: ExportRawDataExcelOptions = {}
): Promise<ExportExcelResult> => {
  const result = await fetchRawDataExcelBlob(params, options);
  triggerBlobDownload(
    result.blob,
    result.filename,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  return result;
};

/**
 * Alias untuk pemanggilan ekspor data mentah Excel
 */
export const exportRawDataExcel = downloadRawDataExcel;

export const exportService = {
  fetchReportPdfBlob,
  downloadReportPdf,
  fetchRawDataExcelBlob,
  downloadRawDataExcel,
  exportRawDataExcel,
  getExportPdfEndpoint,
  getExportRawDataExcelEndpoint,
  getRawDataExcelFallbackFilename,
  triggerBlobDownload,
  extractFilenameFromContentDisposition,
  parseBlobErrorMessage,
};

export default exportService;
