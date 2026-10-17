import { apiClient } from '../lib/api';
import type {
  ExportReportPdfParams,
  ExportPdfResult,
  ExportPdfReportType,
  ExportPdfOrientation,
} from '../types/report';

export type {
  ExportReportPdfParams,
  ExportPdfResult,
  ExportPdfReportType,
  ExportPdfOrientation,
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
 * Format tanggal ke standar ISO YYYY-MM-DD yang didukung backend.
 * Menerima format DD/MM/YYYY, Date object, atau YYYY-MM-DD.
 */
export const toQueryDateString = (date?: string | Date): string | undefined => {
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

  // Cek apakah format DD/MM/YYYY
  const parts = str.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return str;
};

/**
 * Normalisasi nilai metode pembayaran untuk backend filter
 * Mengubah format frontend ('Semua' | 'Tunai' | 'QRIS' | 'Transfer')
 * ke format backend ('all' | 'cash' | 'qris' | 'transfer')
 */
export const normalizePaymentMethod = (method?: string): string => {
  if (!method) return 'all';
  const m = method.trim().toLowerCase();
  if (m === 'semua' || m === 'all') return 'all';
  if (m === 'tunai' || m === 'cash') return 'cash';
  if (m === 'qris') return 'qris';
  if (m === 'transfer' || m.includes('transfer')) return 'transfer';
  return m;
};

/**
 * Helper untuk menentukan path endpoint relatif yang tepat terhadap baseURL apiClient.
 * Memastikan request selalu mengarah ke `/api/reports/export-pdf`.
 */
export const getExportPdfEndpoint = (): string => {
  const baseURL = (apiClient.defaults.baseURL || '').trim();
  if (baseURL.endsWith('/api')) {
    return '/reports/export-pdf';
  }
  return '/api/reports/export-pdf';
};

/**
 * Helper untuk mengekstrak nama file PDF dari header response `Content-Disposition`.
 * Mendukung format:
 * - `attachment; filename="Laporan_transaksi_2026-10-17.pdf"`
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
 * Helper untuk men-trigger auto-download file biner (Blob) di background
 * tanpa memicu dialog cetak browser (`window.print`).
 */
export const triggerBlobDownload = (blobData: BlobPart, filename: string): void => {
  const blob =
    blobData instanceof Blob
      ? blobData
      : new Blob([blobData], { type: 'application/pdf' });

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
export const parseBlobErrorMessage = async (error: any): Promise<string> => {
  const defaultFallback = 'Gagal memproses dan mengunduh laporan PDF dari server.';

  if (!error) return defaultFallback;

  // Tangani jika response data berbentuk Blob
  if (error.response?.data instanceof Blob) {
    try {
      const errorText = await error.response.data.text();
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) return errorJson.message;
        if (errorJson.error) return errorJson.error;
      } catch {
        // Bukan format JSON, gunakan text jika ada
        if (errorText.trim()) return errorText.trim();
      }
    } catch (readErr) {
      console.warn('Gagal membaca blob payload error:', readErr);
    }
  }

  // Fallback standar response data JSON
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return defaultFallback;
};

/**
 * Mengambil file biner PDF laporan dari endpoint backend `/api/reports/export-pdf`
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
  const formattedParams: Record<string, any> = {
    type: params.type || 'transaksi',
    orientation: params.orientation || 'portrait',
    showSignatures: params.showSignatures !== false,
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

  // Generate fallback filename
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultFallback =
    options.fallbackFilename ||
    `Laporan_${formattedParams.type}_${todayStr}.pdf`;

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
      response.headers?.['Content-Disposition'];

    const filename = extractFilenameFromContentDisposition(
      contentDisposition,
      defaultFallback
    );

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: 'application/pdf' });

    return { blob, filename };
  } catch (error: any) {
    console.error('Error saat request export PDF laporan:', error);
    const parsedMessage = await parseBlobErrorMessage(error);
    throw new Error(parsedMessage);
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
  triggerBlobDownload(result.blob, result.filename);
  return result;
};

export const reportService = {
  fetchReportPdfBlob,
  downloadReportPdf,
  triggerBlobDownload,
  extractFilenameFromContentDisposition,
  parseBlobErrorMessage,
  toQueryDateString,
  normalizePaymentMethod,
};

export default reportService;
