import React from 'react';
import BrandLogo from '../../../components/common/BrandLogo';
import type {
  ReportTab,
  PaymentFilter,
  TransactionRecord,
  DailyRecord,
  MonthlyRecord,
  DailyProductSale,
} from '../../../types/report';
import type { ProductNameItem } from '../../../types/products';
import type { StoreProfileData } from '../../../types/store';
import { formatRupiah, formatNumber, formatDateTimeFull } from '../../../lib/formatters';

export interface ReportPrintOptions {
  orientation?: 'portrait' | 'landscape';
  showKpis?: boolean;
  showSignatures?: boolean;
  customNotes?: string;
  documentNumber?: string;
  cashierName?: string;
  approverName?: string;
}

export interface ReportPrintTemplateProps {
  activeTab: ReportTab;
  startDate: string;
  endDate: string;
  transactions: TransactionRecord[];
  dailyRecords: DailyRecord[];
  monthlyRecords: MonthlyRecord[];
  products: ProductNameItem[];
  selectedPayment: PaymentFilter;
  searchQuery?: string;
  store: StoreProfileData;
  operatorName?: string;
  options?: ReportPrintOptions;
  id?: string;
}

// Helper pencarian penjualan produk pada rekap harian
const getDailyProductQty = (record: DailyRecord, product: ProductNameItem): number => {
  if (!record.productSales) return 0;
  if (Array.isArray(record.productSales)) {
    const matched = record.productSales.find(
      (p: DailyProductSale) =>
        p.productId === product._id ||
        p.productName?.trim().toLowerCase() === product.name?.trim().toLowerCase()
    );
    return matched ? matched.quantity : 0;
  }
  const map = record.productSales as Record<string, { qty: number }>;
  if (map[product._id]) return map[product._id].qty;
  if (map[product.name]) return map[product.name].qty;
  const lower = product.name.trim().toLowerCase();
  const foundKey = Object.keys(map).find((k) => k.toLowerCase() === lower);
  return foundKey ? map[foundKey].qty : 0;
};

// Helper pencarian penjualan produk pada rekap bulanan
const getMonthlyProductQty = (record: MonthlyRecord, product: ProductNameItem): number => {
  if (!record.productSales) return 0;
  if (Array.isArray(record.productSales)) {
    const matched = record.productSales.find(
      (p: DailyProductSale) =>
        p.productId === product._id ||
        p.productName?.trim().toLowerCase() === product.name?.trim().toLowerCase()
    );
    return matched ? matched.quantity : 0;
  }
  const map = record.productSales as Record<string, { qty: number }>;
  if (map[product._id]) return map[product._id].qty;
  if (map[product.name]) return map[product.name].qty;
  const lower = product.name.trim().toLowerCase();
  const foundKey = Object.keys(map).find((k) => k.toLowerCase() === lower);
  return foundKey ? map[foundKey].qty : 0;
};

export const ReportPrintTemplate: React.FC<ReportPrintTemplateProps> = ({
  activeTab,
  startDate,
  endDate,
  transactions,
  dailyRecords,
  monthlyRecords,
  products,
  selectedPayment,
  searchQuery,
  store,
  operatorName = 'Kasir / Petugas',
  options = {},
  id = 'kasirin-printable-report',
}) => {
  const {
    orientation = 'portrait',
    showKpis = true,
    showSignatures = true,
    customNotes = '',
  } = options;

  const printDateTime = formatDateTimeFull(new Date());

  // 1. Hitung Ringkasan Metrik Finansial Sesuai Tab Aktif
  let totalRevenue = 0;
  let totalTransactions = 0;
  let totalItemsSold = 0;
  let averageTicket = 0;

  // Rincian Metode Bayar
  let cashTotal = 0;
  let cashCount = 0;
  let qrisTotal = 0;
  let qrisCount = 0;
  let transferTotal = 0;
  let transferCount = 0;

  if (activeTab === 'transaksi') {
    totalRevenue = transactions.reduce((acc, t) => acc + (t.total || 0), 0);
    totalTransactions = transactions.length;
    averageTicket = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    transactions.forEach((t) => {
      // Hitung item sold
      if (Array.isArray(t.items)) {
        totalItemsSold += t.items.reduce((sum, item) => sum + (item.qty || 0), 0);
      }
      // Hitung per metode pembayaran
      const method = (t.paymentMethod || '').toLowerCase();
      if (method.includes('tunai') || method.includes('cash')) {
        cashTotal += t.total || 0;
        cashCount += 1;
      } else if (method.includes('qris')) {
        qrisTotal += t.total || 0;
        qrisCount += 1;
      } else {
        transferTotal += t.total || 0;
        transferCount += 1;
      }
    });
  } else if (activeTab === 'harian') {
    totalRevenue = dailyRecords.reduce((acc, d) => acc + (d.totalRevenue || 0), 0);
    totalTransactions = dailyRecords.reduce((acc, d) => acc + (d.trxCount || 0), 0);
    averageTicket = dailyRecords.length > 0 ? Math.round(totalRevenue / dailyRecords.length) : 0;
  } else if (activeTab === 'bulanan') {
    totalRevenue = monthlyRecords.reduce((acc, m) => acc + (m.grossRevenue || 0), 0);
    totalTransactions = monthlyRecords.reduce((acc, m) => acc + (m.trxCount || 0), 0);
    averageTicket = monthlyRecords.length > 0 ? Math.round(totalRevenue / monthlyRecords.length) : 0;
  }

  // Judul Laporan berdasarkan tab
  const reportTitle =
    activeTab === 'transaksi'
      ? 'LAPORAN RINCIAN TRANSAKSI PENJUALAN'
      : activeTab === 'harian'
      ? 'LAPORAN REKAPITULASI PENJUALAN HARIAN'
      : 'LAPORAN REKAPITULASI PENJUALAN BULANAN';

  // Format periode: jika satu tanggal yang sama cukup tampilkan 1 tanggal saja
  const periodLabel =
    activeTab === 'bulanan'
      ? 'Rekapitulasi Periode Bulanan'
      : startDate === endDate
      ? startDate
      : `${startDate} - ${endDate}`;

  return (
    <div
      id={id}
      className={`bg-white text-slate-900 font-sans p-8 sm:p-10 select-text ${
        orientation === 'landscape' ? 'w-full max-w-[1200px]' : 'w-full max-w-[900px]'
      } mx-auto`}
      style={{
        boxSizing: 'border-box',
        colorScheme: 'light',
      }}
    >
      {/* =========================================================================
          1. HEADER KOP LAPORAN (LETTERHEAD RESMI TOKO)
         ========================================================================= */}
      <div className="flex flex-row items-start justify-between border-b-2 border-slate-900 pb-5 gap-6">
        {/* Identitas Brand & Toko / Usaha */}
        <div className="flex items-start gap-4 flex-1">
          <div className="shrink-0 pt-0.5">
            <BrandLogo variant="pill" size="md" theme="light" />
          </div>
          <div className="space-y-0.5 border-l border-slate-200 pl-4">
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
              {store.storeName || 'KASIRIN POINT OF SALE'}
            </h1>
            {store.category && (
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {store.category}
              </p>
            )}
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {store.address || 'Alamat Toko Belum Dikonfigurasi'}
            </p>
            {store.phone && (
              <p className="text-xs text-slate-600 font-medium">
                Telp: <span className="font-mono">{store.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Informasi Dokumen Laporan (Kanan) */}
        <div className="text-right shrink-0 space-y-1">
          <div className="inline-block bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wider">
            DOKUMEN RESMI
          </div>
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight pt-1">
            {reportTitle}
          </h2>
          <div className="text-xs text-slate-600 space-y-0.5 pt-1">
            <div>
              <span className="text-slate-500">Periode: </span>
              <span className="font-bold text-slate-800">{periodLabel}</span>
            </div>
            <div>
              <span className="text-slate-500">Dicetak: </span>
              <span className="text-slate-800">{printDateTime}</span>
            </div>
            <div>
              <span className="text-slate-500">Operator: </span>
              <span className="font-semibold text-slate-800">{operatorName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Information Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] bg-slate-100 px-3.5 py-2 rounded border border-slate-200 text-slate-700">
        <div className="flex items-center gap-3">
          <span>
            <strong>Metode Pembayaran:</strong> {selectedPayment}
          </span>
          {searchQuery && (
            <>
              <span>•</span>
              <span>
                <strong>Pencarian:</strong> &ldquo;{searchQuery}&rdquo;
              </span>
            </>
          )}
        </div>
        <div className="font-semibold text-slate-800">
          Status Data: <span className="text-emerald-700 font-bold">Sinkron &amp; Terverifikasi</span>
        </div>
      </div>

      {/* =========================================================================
          2. RINGKASAN FINANSIAL EKSEKUTIF (EXECUTIVE KPI SUMMARY)
         ========================================================================= */}
      {showKpis && (
        <div className="mt-5 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Ringkasan Finansial Eksekutif
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Card 1: Total Omset */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Pendapatan (Omset)
              </span>
              <span className="text-lg font-extrabold text-slate-900 block mt-1 tracking-tight">
                {formatRupiah(totalRevenue)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Akumulasi seluruh transaksi
              </span>
            </div>

            {/* Card 2: Total Transaksi */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Jumlah Transaksi
              </span>
              <span className="text-lg font-extrabold text-slate-900 block mt-1 tracking-tight">
                {formatNumber(totalTransactions)}{' '}
                <span className="text-xs font-normal text-slate-600">Trx</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {activeTab === 'transaksi' && totalItemsSold > 0
                  ? `${formatNumber(totalItemsSold)} produk terjual`
                  : 'Total nota sukses'}
              </span>
            </div>

            {/* Card 3: Rata-Rata Nilai (AOV) */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {activeTab === 'transaksi'
                  ? 'Rata-rata Order (AOV)'
                  : activeTab === 'harian'
                  ? 'Rata-rata Omset / Hari'
                  : 'Rata-rata Omset / Bulan'}
              </span>
              <span className="text-lg font-extrabold text-slate-900 block mt-1 tracking-tight">
                {formatRupiah(averageTicket)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {activeTab === 'transaksi' ? 'Per struk transaksi' : 'Rata-rata pendapatan'}
              </span>
            </div>

            {/* Card 4: Distribusi Metode Pembayaran */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Penerimaan Pembayaran
              </span>
              <div className="mt-1 space-y-0.5 text-[11px]">
                {activeTab === 'transaksi' ? (
                  <>
                    <div className="flex justify-between text-slate-700">
                      <span>Tunai ({cashCount}):</span>
                      <span className="font-semibold">{formatRupiah(cashTotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>QRIS ({qrisCount}):</span>
                      <span className="font-semibold">{formatRupiah(qrisTotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Transfer ({transferCount}):</span>
                      <span className="font-semibold">{formatRupiah(transferTotal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] text-slate-600 pt-1">
                    Metode dominan dan rincian tercatat pada rekap tabel di bawah.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. TABEL DATA UTAMA LAPORAN (PRINT-OPTIMIZED TABLE)
         ========================================================================= */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Rincian Data Dokumen
          </h3>
          <span className="text-[11px] text-slate-500">
            Total {activeTab === 'transaksi' ? transactions.length : activeTab === 'harian' ? dailyRecords.length : monthlyRecords.length} Baris Data
          </span>
        </div>

        {/* Tab 1: Transaksi Rinci */}
        {activeTab === 'transaksi' && (
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">No</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-28">Waktu / Tgl</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-32">No. Invoice</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-24">Kasir</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Rincian Item Terjual</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-24 text-center">Metode</th>
                <th className="py-2.5 px-3 w-28 text-right">Total (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    Tidak ada catatan transaksi pada periode dan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                transactions.map((trx, idx) => (
                  <tr
                    key={trx.id || idx}
                    className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-500 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-700 text-[11px]">
                      {trx.dateTime || trx.dayDate || '-'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900 text-[11px]">
                      {trx.invoiceId}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-700 text-[11px]">
                      {trx.cashierName || 'Kasir'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800 text-[11px]">
                      {trx.items && trx.items.length > 0 ? (
                        <div className="space-y-0.5">
                          {trx.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center justify-between text-[11px]">
                              <span>
                                {item.name}{' '}
                                <span className="font-semibold text-slate-600">x{item.qty}</span>
                              </span>
                              <span className="text-slate-500 font-mono ml-2">
                                @{formatNumber(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-[11px]">
                      <span className="font-semibold text-slate-700">{trx.paymentMethod}</span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 text-[11px]">
                      {formatNumber(trx.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-[11px]">
                  Grand Total Keseluruhan:
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-[11px]">
                  {formatNumber(totalItemsSold)} Item Produk Terjual
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-center text-[11px]">
                  {formatNumber(totalTransactions)} Trx
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-slate-900">
                  {formatRupiah(totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* Tab 2: Rekap Harian */}
        {activeTab === 'harian' && (
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">No</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-32">Tanggal</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-24 text-center">Total Trx</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Rincian Penjualan Produk</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-32 text-center">Metode Dominan</th>
                <th className="py-2.5 px-3 w-32 text-right">Total Omset (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dailyRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    Tidak ada rekapitulasi harian pada periode dan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                dailyRecords.map((d, idx) => (
                  <tr
                    key={d.id || idx}
                    className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-500 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900 text-[11px]">
                      {d.dayDate}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-semibold text-slate-700 text-[11px]">
                      {formatNumber(d.trxCount)} Trx
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800 text-[11px]">
                      {products.length > 0 ? (
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {products.map((p) => {
                            const qty = getDailyProductQty(d, p);
                            if (qty === 0) return null;
                            return (
                              <span key={p._id} className="inline-flex items-center text-[11px]">
                                <span className="text-slate-600">{p.name}:</span>
                                <span className="font-bold text-slate-900 ml-1">{qty}</span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-500">Rekapitulasi transaksi tersimpan</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-[11px]">
                      <span className="font-semibold text-slate-800">
                        {d.dominantMethod?.type || 'Tunai'}
                      </span>
                      {d.dominantMethod?.percentage !== undefined && (
                        <span className="text-slate-500 text-[10px] ml-1">
                          ({d.dominantMethod.percentage}%)
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 text-[11px]">
                      {formatNumber(d.totalRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={2} className="py-2.5 px-3 text-right uppercase text-[11px]">
                  Total Keseluruhan ({dailyRecords.length} Hari):
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-center text-[11px]">
                  {formatNumber(totalTransactions)} Trx
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-[11px] text-slate-600">
                  Rata-rata {formatRupiah(averageTicket)} / hari
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-center text-[11px] text-slate-500">
                  -
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-slate-900">
                  {formatRupiah(totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* Tab 3: Rekap Bulanan */}
        {activeTab === 'bulanan' && (
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">No</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-36">Periode Bulan</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-28 text-center">Total Transaksi</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Rincian Produk Terjual</th>
                <th className="py-2.5 px-3 border-r border-slate-300 w-32 text-center">Status Audit</th>
                <th className="py-2.5 px-3 w-36 text-right">Total Omset (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {monthlyRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    Tidak ada catatan transaksi bulanan yang tersedia.
                  </td>
                </tr>
              ) : (
                monthlyRecords.map((m, idx) => (
                  <tr
                    key={m.id || idx}
                    className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-500 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900 text-[11px]">
                      {m.period}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-semibold text-slate-700 text-[11px]">
                      {formatNumber(m.trxCount)} Trx
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800 text-[11px]">
                      {products.length > 0 ? (
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {products.map((p) => {
                            const qty = getMonthlyProductQty(m, p);
                            if (qty === 0) return null;
                            return (
                              <span key={p._id} className="inline-flex items-center text-[11px]">
                                <span className="text-slate-600">{p.name}:</span>
                                <span className="font-bold text-slate-900 ml-1">{qty}</span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-500">Data produk terakumulasi</span>
                      )}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-[11px]">
                      <span className="font-semibold text-slate-700">
                        {m.auditStatus || 'Audit Selesai'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 text-[11px]">
                      {formatNumber(m.grossRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                <td colSpan={2} className="py-2.5 px-3 text-right uppercase text-[11px]">
                  Total Keseluruhan ({monthlyRecords.length} Periode):
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-center text-[11px]">
                  {formatNumber(totalTransactions)} Trx
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-[11px] text-slate-600">
                  Rata-rata {formatRupiah(averageTicket)} / bulan
                </td>
                <td className="py-2.5 px-3 border-r border-slate-300 text-center text-[11px] text-slate-500">
                  -
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-slate-900">
                  {formatRupiah(totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* =========================================================================
          4. CATATAN TAMBAHAN & KETERANGAN TOKO
         ========================================================================= */}
      {(customNotes || store.footerNote) && (
        <div className="mt-5 space-y-2 border border-slate-200 rounded p-3 bg-slate-50/60 text-xs">
          {customNotes && (
            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                Catatan Khusus / Memo Finansial:
              </span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{customNotes}</p>
            </div>
          )}
          {store.footerNote && (
            <div className={customNotes ? 'pt-2 border-t border-slate-200' : ''}>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                Kebijakan / Catatan Toko:
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{store.footerNote}</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          5. LEMBAR PENGESAHAN & TANDA TANGAN (SIGNATURE AUDIT SECTION)
         ========================================================================= */}
      {showSignatures && (
        <div
          className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-xs text-slate-700"
          style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
        >
          {/* Kolom 1: Kasir / Petugas Pelapor */}
          <div className="space-y-16">
            <div>
              <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider block">
                Dibuat Oleh:
              </span>
              <span className="font-bold text-slate-800">Petugas Kasir / Pelapor</span>
            </div>
            <div className="space-y-0.5">
              <div className="border-b border-slate-400 w-44 mx-auto"></div>
              <span className="font-bold text-slate-900 block font-mono text-[11px]">
                {operatorName}
              </span>
              <span className="text-[10px] text-slate-500">Tanggal: ____ / ____ / ________</span>
            </div>
          </div>

          {/* Kolom 2: Supervisor Toko */}
          <div className="space-y-16 hidden md:block">
            <div>
              <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider block">
                Diperiksa Oleh:
              </span>
              <span className="font-bold text-slate-800">Supervisor / Finance</span>
            </div>
            <div className="space-y-0.5">
              <div className="border-b border-slate-400 w-44 mx-auto"></div>
              <span className="font-bold text-slate-900 block text-[11px]">( ................................ )</span>
              <span className="text-[10px] text-slate-500">Tanggal: ____ / ____ / ________</span>
            </div>
          </div>

          {/* Kolom 3: Pemilik / Manajer Toko */}
          <div className="space-y-16">
            <div>
              <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider block">
                Disetujui Oleh:
              </span>
              <span className="font-bold text-slate-800">Owner / Store Manager</span>
            </div>
            <div className="space-y-0.5">
              <div className="border-b border-slate-400 w-44 mx-auto"></div>
              <span className="font-bold text-slate-900 block text-[11px]">
                {options.approverName ? `( ${options.approverName} )` : '( ................................ )'}
              </span>
              <span className="text-[10px] text-slate-500">Tanggal: ____ / ____ / ________</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. FOOTER RESMI DOKUMEN SISTEM KASIRIN
         ========================================================================= */}
      <div className="mt-8 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500">
        <div>
          Laporan ini dihasilkan secara otomatis oleh <strong>KasirIn POS</strong>. Dokumen finansial resmi &amp; sah.
        </div>
        <div className="font-mono mt-1 sm:mt-0">
          Dokumen 1 / 1
        </div>
      </div>
    </div>
  );
};
