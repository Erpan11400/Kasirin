/**
 * Service helper khusus halaman Laporan (Report).
 * Logika ekspor PDF / Excel dipindahkan ke ./exportService.
 */

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

export const reportService = {
  toQueryDateString,
  normalizePaymentMethod,
};

export default reportService;
