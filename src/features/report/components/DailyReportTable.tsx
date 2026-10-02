import React from 'react';
import {
  CalendarDays,
  Coffee,
  ShoppingBag,
  Droplets,
  Package,
  Banknote,
  QrCode,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { DailyRecord } from '../../../types/report';
import { formatRupiah } from '../../../lib/formatters';

interface DailyReportTableProps {
  records: DailyRecord[];
}

export const DailyReportTable: React.FC<DailyReportTableProps> = ({ records }) => {
  return (
    <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle/60 overflow-hidden">
      {/* Table Topbar */}
      <div className="px-5 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border-subtle/60">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-on-surface">
            Matriks Akumulasi Produk Harian
          </span>
        </div>
        <span className="text-[11px] font-bold bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full uppercase tracking-wider">
          Agregat Kas Harian
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[1100px] text-sm">
          <thead>
            <tr className="bg-surface-bg text-text-muted text-xs uppercase tracking-wider border-b border-border-subtle/60">
              <th className="py-3 px-4 font-semibold">Tanggal Operasional</th>
              <th className="py-3 px-4 font-semibold text-center">Jumlah Trx</th>
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
              <th className="py-3 px-4 font-semibold">Metode Dominan</th>
              <th className="py-3 px-4 font-semibold text-right">Total Omset Bersih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-on-surface">
            {records.map((row, idx) => (
              <tr
                key={row.id}
                className={`hover:bg-surface-bg/80 transition-colors ${idx % 2 === 1 ? 'bg-surface-container-low/20' : ''
                  }`}
              >
                <td className="py-3 px-4 text-sm font-bold text-on-surface">
                  {row.dayDate}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-xs">
                  {row.trxCount} Trx
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {row.coffeeQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {row.coffeeQty} x Rp 15.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {row.sugarQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {row.sugarQty} x Rp 16.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {row.oilQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {row.oilQty} x Rp 28.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {row.riceQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {row.riceQty} x Rp 75.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {row.dominantMethod.type === 'Tunai' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                      <Banknote className="w-3.5 h-3.5" />
                      {row.dominantMethod.percentage}% Tunai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-bold">
                      <QrCode className="w-3.5 h-3.5" />
                      {row.dominantMethod.percentage}% QRIS
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right text-sm font-bold text-primary">
                  {formatRupiah(row.totalRevenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-surface-card border-t border-border-subtle/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-text-muted text-xs">
          <span className="font-medium text-on-surface">
            Menampilkan <strong className="text-primary">1 - {records.length}</strong> dari{' '}
            <strong>30</strong> hari operasional
          </span>
          <div className="flex items-center gap-1.5 pl-0 sm:pl-3 border-l-0 sm:border-l border-border-subtle">
            <span className="text-text-muted">Baris:</span>
            <select className="bg-surface-bg text-on-surface font-semibold rounded-lg px-2.5 py-1 text-xs border border-border-subtle outline-none">
              <option>10 per halaman</option>
              <option>20 per halaman</option>
              <option>30 per halaman</option>
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
