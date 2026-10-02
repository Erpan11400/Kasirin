import React from 'react';
import {
  Coffee,
  ShoppingBag,
  Droplets,
  Package,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import type { MonthlyRecord } from '../../../types/report';
import { formatRupiah } from '../../../lib/formatters';

interface MonthlyReportViewProps {
  records: MonthlyRecord[];
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({ records }) => {
  const chartData = [
    { month: 'Mei', height: '45%', opacity: 'bg-primary/30', isCurrent: false },
    { month: 'Jun', height: '55%', opacity: 'bg-primary/45', isCurrent: false },
    { month: 'Jul', height: '68%', opacity: 'bg-primary/60', isCurrent: false },
    { month: 'Agt', height: '78%', opacity: 'bg-primary/80', isCurrent: false },
    { month: 'Sep (Berjalan)', height: '95%', opacity: 'bg-primary shadow-xs', isCurrent: true },
  ];

  return (
    <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle/60 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-on-surface">
            Rekap Laporan Bulanan Tahun 2026
          </h2>
          <p className="text-xs text-text-muted">
            Komparasi performa volume penjualan per produk &amp; omset Toko Sembako Jaya
          </p>
        </div>
        <span className="text-xs font-bold bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
          Kuartal Q3 Aktif
        </span>
      </div>

      {/* Chart Visualizer */}
      <div className="p-4 bg-surface-container-low rounded-xl space-y-3 border border-border-subtle/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface">
            Grafik Pertumbuhan Pendapatan (Mei - Sep 2026)
          </span>
          <span className="text-xs text-primary font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tren +24.8% Naik</span>
          </span>
        </div>

        <div className="h-28 w-full flex items-end gap-3 sm:gap-6 pt-4 px-2">
          {chartData.map((bar) => (
            <div
              key={bar.month}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
            >
              <div
                style={{ height: bar.height }}
                className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 group-hover:scale-y-105 ${bar.opacity}`}
              ></div>
              <span
                className={`text-[11px] ${bar.isCurrent ? 'font-bold text-primary' : 'text-text-muted'
                  }`}
              >
                {bar.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[1100px] text-sm">
          <thead>
            <tr className="bg-surface-bg text-text-muted text-xs uppercase tracking-wider border-b border-border-subtle/60">
              <th className="py-3 px-4 font-semibold">Periode Bulan</th>
              <th className="py-3 px-4 font-semibold text-center">Total Trx</th>
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4" />
                  <span>Kopi Hitam 200g</span>
                </div>
              </th>
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Gula Pasir 1kg</span>
                </div>
              </th>
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" />
                  <span>Minyak Goreng 2L</span>
                </div>
              </th>
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  <span>Beras 5kg</span>
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right">Omset Bruto</th>
              <th className="py-3 px-4 font-semibold text-right">Status Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-on-surface">
            {records.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-surface-bg/80 transition-colors ${row.isCurrent ? 'bg-primary-container/10 font-medium' : ''
                  }`}
              >
                <td
                  className={`py-3 px-4 text-sm font-bold ${row.isCurrent ? 'text-primary' : 'text-on-surface'
                    }`}
                >
                  {row.period}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-xs">
                  {row.trxCount} Trx
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                    {row.coffeeQty} x Rp 15.000
                  </span>
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                    {row.sugarQty} x Rp 16.000
                  </span>
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                    {row.oilQty} x Rp 28.000
                  </span>
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                    {row.riceQty} x Rp 75.000
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-base font-bold text-on-surface">
                  {formatRupiah(row.grossRevenue)}
                </td>
                <td className="py-3 px-4 text-right">
                  {row.auditStatus === 'Aktif Berjalan' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                      Aktif Berjalan
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold">
                      Audit Selesai
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 border-t border-border-subtle/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-text-muted text-xs">
          <span className="font-medium text-on-surface">
            Menampilkan <strong className="text-primary">1 - {records.length}</strong> dari{' '}
            <strong>24</strong> periode bulan
          </span>
          <div className="flex items-center gap-1.5 pl-0 sm:pl-3 border-l-0 sm:border-l border-border-subtle">
            <span className="text-text-muted">Baris:</span>
            <select className="bg-surface-bg text-on-surface font-semibold rounded-lg px-2.5 py-1 text-xs border border-border-subtle outline-none">
              <option>10 per halaman</option>
              <option>12 per halaman</option>
              <option>24 per halaman</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-bg text-text-muted font-medium text-xs hover:bg-surface-container-high transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-xs"
          >
            1
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-bg text-on-surface font-medium text-xs hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-bg text-on-surface font-medium text-xs hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-bg text-on-surface font-medium text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
