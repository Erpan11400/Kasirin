import React from 'react';
import {
  Table,
  Coffee,
  ShoppingBag,
  Droplets,
  Package,
  Eye,
  Banknote,
  QrCode,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { TransactionMatrixTableProps } from '../../../types/report';
import { formatRupiah } from '../../../lib/formatters';

export type { TransactionMatrixTableProps };

export const TransactionMatrixTable: React.FC<TransactionMatrixTableProps> = ({
  transactions,
  onViewReceipt,
}) => {
  // Compute subtotal summaries for the displayed transactions
  const totalCoffeeQty = transactions.reduce((acc, t) => acc + t.coffeeQty, 0);
  const totalSugarQty = transactions.reduce((acc, t) => acc + t.sugarQty, 0);
  const totalOilQty = transactions.reduce((acc, t) => acc + t.oilQty, 0);
  const totalRiceQty = transactions.reduce((acc, t) => acc + t.riceQty, 0);
  const grandTotal = transactions.reduce((acc, t) => acc + t.total, 0);

  return (
    <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle/60 overflow-hidden">
      {/* Table Topbar Context Info */}
      <div className="px-5 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border-subtle/60">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-on-surface">
            Matriks Distribusi Qty &amp; Total per Transaksi
          </span>
        </div>
        <span className="text-xs text-text-muted">
          Menampilkan {transactions.length} dari 142 baris data terverifikasi (10 per halaman)
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[1100px] text-sm">
          <thead>
            <tr className="bg-surface-bg text-text-muted text-xs uppercase tracking-wider border-b border-border-subtle/60">
              <th className="py-3 px-4 font-semibold">No. Invoice</th>
              <th className="py-3 px-4 font-semibold">Tanggal &amp; Waktu</th>
              {/* Product 1 */}
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4" />
                  <span>Kopi Hitam 200g</span>
                </div>
              </th>
              {/* Product 2 */}
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Gula Pasir 1kg</span>
                </div>
              </th>
              {/* Product 3 */}
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" />
                  <span>Minyak Goreng 2L</span>
                </div>
              </th>
              {/* Product 4 */}
              <th className="py-3 px-4 font-semibold bg-surface-container-low/60 text-primary">
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  <span>Beras 5kg</span>
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">Pembayaran</th>
              <th className="py-3 px-4 font-semibold text-right">Total Bayar</th>
              <th className="py-3 px-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-on-surface">
            {transactions.map((t, idx) => (
              <tr
                key={t.id}
                className={`hover:bg-surface-bg/80 transition-colors ${idx % 2 === 1 ? 'bg-surface-container-low/20' : ''
                  }`}
              >
                <td className="py-3 px-4 text-sm font-bold text-primary font-mono">
                  {t.invoiceId}
                </td>
                <td className="py-3 px-4 text-text-muted text-xs">
                  {t.dateTime.split(' ')[0]}{' '}
                  <span className="text-on-surface font-semibold">
                    {t.dateTime.split(' ')[1]}
                  </span>
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {t.coffeeQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {t.coffeeQty} x Rp 15.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {t.sugarQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {t.sugarQty} x Rp 16.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {t.oilQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {t.oilQty} x Rp 28.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 bg-surface-container-low/30 text-xs">
                  {t.riceQty > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                      {t.riceQty} x Rp 75.000
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {t.paymentMethod === 'Tunai' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-secondary-container text-on-secondary-container font-semibold">
                      <Banknote className="w-3.5 h-3.5" /> Tunai
                    </span>
                  ) : t.paymentMethod === 'QRIS' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-surface-container-high text-on-surface font-semibold">
                      <QrCode className="w-3.5 h-3.5" /> QRIS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-surface-container-highest text-on-surface-variant font-semibold">
                      <Building2 className="w-3.5 h-3.5" /> Transfer
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right text-base font-bold text-on-surface">
                  {formatRupiah(t.total)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onViewReceipt(t)}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-bg hover:bg-surface-container-high text-primary text-xs font-semibold transition-colors cursor-pointer border border-border-subtle/40"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Struk</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Matriks Subtotal Bar */}
          <tfoot>
            <tr className="bg-surface-container-low text-xs text-on-surface border-t-2 border-border-subtle/60">
              <td
                className="py-3 px-4 font-bold text-right uppercase text-text-muted"
                colSpan={2}
              >
                Subtotal Sample Terpilih:
              </td>
              <td className="py-3 px-4 font-bold text-primary">
                {totalCoffeeQty} Pcs ({formatRupiah(totalCoffeeQty * 15000)})
              </td>
              <td className="py-3 px-4 font-bold text-primary">
                {totalSugarQty} Pcs ({formatRupiah(totalSugarQty * 16000)})
              </td>
              <td className="py-3 px-4 font-bold text-primary">
                {totalOilQty} Pcs ({formatRupiah(totalOilQty * 28000)})
              </td>
              <td className="py-3 px-4 font-bold text-primary">
                {totalRiceQty} Pcs ({formatRupiah(totalRiceQty * 75000)})
              </td>
              <td className="py-3 px-4 text-text-muted font-normal text-[11px]">
                {transactions.length} Trx Valid
              </td>
              <td className="py-3 px-4 text-right font-bold text-base text-primary">
                {formatRupiah(grandTotal)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination & Footer Summary */}
      <div className="p-4 bg-surface-card border-t border-border-subtle/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-text-muted text-xs">
          <span className="font-medium text-on-surface">
            Menampilkan <strong className="text-primary">1 - {transactions.length}</strong> dari{' '}
            <strong>142</strong> data transaksi
          </span>
          <div className="flex items-center gap-1.5 pl-0 sm:pl-3 border-l-0 sm:border-l border-border-subtle">
            <span className="text-text-muted">Baris:</span>
            <select className="bg-surface-bg text-on-surface font-semibold rounded-lg px-2.5 py-1 text-xs border border-border-subtle outline-none">
              <option>10 per halaman</option>
              <option>25 per halaman</option>
              <option>50 per halaman</option>
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
          <span className="px-1 text-text-muted text-xs">...</span>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-bg text-on-surface font-medium text-xs hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer"
          >
            15
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
