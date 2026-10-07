/**
 * Kumpulan fungsi utilitas formatting terpusat untuk aplikasi KasirIn
 */

/**
 * Format angka ke format mata uang Rupiah (contoh: Rp 50.000)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format angka umum dengan pemisah ribuan standar Indonesia (contoh: 1.250)
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  return value.toLocaleString('id-ID');
}

/**
 * Format tanggal ke standar numerik Indonesia (contoh: 06/10/2026)
 */
export function formatDate(dateInput?: string | Date | number | null): string {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format tanggal lengkap dengan nama bulan Indonesia (contoh: 06 Oktober 2026)
 */
export function formatDateFull(dateInput?: string | Date | number | null): string {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format tanggal dan waktu standar (contoh: 06/10/2026, 09:24 WIB)
 */
export function formatDateTime(dateInput?: string | Date | number | null): string {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const datePart = date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timePart = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart}, ${timePart} WIB`;
}

/**
 * Format tanggal dengan bulan pendek dan waktu (contoh: 6 Okt 2026, 09:24)
 */
export function formatDateTimeShort(dateInput?: string | Date | number | null): string {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const day = date.getDate();
  const month = date.toLocaleDateString('id-ID', { month: 'short' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/**
 * Format waktu login terakhir (lastLogin) ke format ramah pengguna
 * Contoh: "Hari ini, 09:24 WIB", "Kemarin, 14:15 WIB", "06 Okt 2026, 09:24 WIB", atau "Belum pernah login"
 */
export function formatLastLogin(lastLoginStr?: string | Date | null): string {
  if (!lastLoginStr) return 'Belum pernah login';

  const date = new Date(lastLoginStr);
  if (isNaN(date.getTime())) return 'Belum pernah login';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `Hari ini, ${timeStr} WIB`;
  }
  if (isYesterday) {
    return `Kemarin, ${timeStr} WIB`;
  }

  const dateStr = date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return `${dateStr}, ${timeStr} WIB`;
}
