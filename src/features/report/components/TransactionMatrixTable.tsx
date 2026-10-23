import React, { useState } from 'react';
import {
  Table as TableIcon,
  Coffee,
  Package,
  Soup,
  Eye,
  Banknote,
  QrCode,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { TransactionMatrixTableProps } from '../../../types/report';
import { formatRupiah } from '../../../lib/formatters';
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  TableEmpty,
} from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/Select';

export type { TransactionMatrixTableProps };

const getProductIcon = (productName: string) => {
  const lower = productName.toLowerCase();
  if (
    lower.includes('mie') ||
    lower.includes('bakso') ||
    lower.includes('pangsit') ||
    lower.includes('soup') ||
    lower.includes('wonton')
  ) {
    return <Soup className="w-4 h-4 shrink-0 text-primary" />;
  }
  if (
    lower.includes('teh') ||
    lower.includes('kopi') ||
    lower.includes('minum') ||
    lower.includes('jus')
  ) {
    return <Coffee className="w-4 h-4 shrink-0 text-primary" />;
  }
  return <Package className="w-4 h-4 shrink-0 text-primary" />;
};

export const TransactionMatrixTable: React.FC<TransactionMatrixTableProps> = ({
  transactions,
  onViewReceipt,
  products = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 data per halaman

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  const startEntry = transactions.length > 0 ? startIndex + 1 : 0;
  const endEntry = Math.min(startIndex + itemsPerPage, transactions.length);

  // Compute grand total summary for the displayed transactions
  const grandTotal = displayedTransactions.reduce((acc, t) => acc + t.total, 0);

  const minTableWidth = Math.max(1100, 500 + products.length * 150);

  return (
    <TableContainer className="shadow-xs border border-border-subtle/60">
      {/* Table Topbar Context Info */}
      <div className="px-5 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border-subtle/60">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-on-surface">
            Matriks Distribusi Qty &amp; Total per Transaksi
          </span>
        </div>
        <span className="text-xs text-text-muted">
          Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
          <strong className="text-on-surface font-semibold">{transactions.length}</strong> transaksi terverifikasi
        </span>
      </div>

      <Table style={{ minWidth: `${minTableWidth}px` }} className="text-sm">
        <TableHeader>
          <TableRow className="bg-surface-bg border-b border-border-subtle/60">
            <TableHead className="font-semibold">No. Invoice</TableHead>
            <TableHead className="font-semibold">Tanggal &amp; Waktu</TableHead>
            {/* Dynamic Product Columns */}
            {products.map((p) => {
              const isInactive = p.isActive === false;
              return (
                <TableHead
                  key={p._id}
                  className={`font-semibold whitespace-nowrap min-w-[140px] ${
                    isInactive
                      ? 'bg-surface-container-high/70 text-text-muted border-l border-r border-dashed border-border-subtle/80'
                      : 'bg-surface-container-low/60 text-primary'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {getProductIcon(p.name)}
                    <span
                      className={`truncate ${isInactive ? 'line-through opacity-85' : ''}`}
                      title={p.name}
                    >
                      {p.name}
                    </span>
                    {isInactive && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                        Nonaktif
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}
            <TableHead className="font-semibold">Pembayaran</TableHead>
            <TableHead alignContent="right" className="font-semibold">Total Bayar</TableHead>
            <TableHead alignContent="center" className="font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTransactions.length > 0 ? (
            displayedTransactions.map((t, idx) => (
              <TableRow
                key={t.id}
                className={idx % 2 === 1 ? 'bg-surface-container-low/20' : ''}
              >
                <TableCell className="text-sm font-bold text-primary font-mono">
                  {t.invoiceId}
                </TableCell>
                <TableCell className="text-xs text-text-muted whitespace-nowrap">
                  {t.dateTime ? (
                    t.dateTime.includes(' ') ? (
                      <>
                        <span>{t.dateTime.substring(0, t.dateTime.lastIndexOf(' '))} </span>
                        <span className="text-on-surface font-semibold">
                          {t.dateTime.substring(t.dateTime.lastIndexOf(' ') + 1)}
                        </span>
                      </>
                    ) : (
                      <span className="text-on-surface font-semibold">{t.dateTime}</span>
                    )
                  ) : (
                    '-'
                  )}
                </TableCell>
                {/* Dynamic Product Columns */}
                {products.map((product) => {
                  const matchedItems = (t.items || []).filter((item) => {
                    if (item.productId && item.productId === product._id) return true;
                    if (
                      item.name &&
                      item.name.trim().toLowerCase() === product.name.trim().toLowerCase()
                    )
                      return true;
                    return false;
                  });
                  const totalQty = matchedItems.reduce((acc, curr) => acc + curr.qty, 0);
                  const unitPrice = matchedItems[0]?.price || 0;
                  const isInactive = product.isActive === false;

                  return (
                    <TableCell
                      key={product._id}
                      className={`text-xs whitespace-nowrap ${
                        isInactive
                          ? 'bg-surface-container-high/40 opacity-75 border-l border-r border-dashed border-border-subtle/40'
                          : 'bg-surface-container-low/30'
                      }`}
                    >
                      {totalQty > 0 ? (
                        <span
                          className={`px-2 py-0.5 rounded font-semibold ${
                            isInactive
                              ? 'bg-surface-container-highest text-text-muted'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {totalQty} {unitPrice > 0 ? `x ${formatRupiah(unitPrice)}` : 'pcs'}
                        </span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell>
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
                </TableCell>
                <TableCell alignContent="right" className="text-base font-bold text-on-surface">
                  {formatRupiah(t.total)}
                </TableCell>
                <TableCell alignContent="center">
                  <Button
                    onClick={() => onViewReceipt(t)}
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="text-primary hover:text-primary-container"
                  >
                    Lihat Struk
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmpty
              colSpan={products.length + 5}
              title="Tidak ada data transaksi"
              description="Tidak ditemukan transaksi yang sesuai dengan filter periode atau kriteria pencarian."
            />
          )}
        </TableBody>
        {/* Matriks Subtotal Bar */}
        {displayedTransactions.length > 0 && (
          <TableFooter>
            <TableRow className="bg-surface-container-low text-xs text-on-surface border-t-2 border-border-subtle/60">
              <TableCell
                className="font-bold text-right uppercase text-text-muted"
                colSpan={2}
              >
                Subtotal Halaman Terpilih:
              </TableCell>
              {products.map((product) => {
                let colQty = 0;
                let colSubtotal = 0;
                displayedTransactions.forEach((t) => {
                  const matched = (t.items || []).filter(
                    (i) =>
                      (i.productId && i.productId === product._id) ||
                      (i.name && i.name.trim().toLowerCase() === product.name.trim().toLowerCase())
                  );
                  matched.forEach((i) => {
                    colQty += i.qty;
                    colSubtotal += i.qty * (i.price || 0);
                  });
                });

                const isInactive = product.isActive === false;
                return (
                  <TableCell
                    key={product._id}
                    className={`font-bold whitespace-nowrap ${
                      isInactive ? 'text-text-muted opacity-75' : 'text-primary'
                    }`}
                  >
                    {colQty} Pcs {colSubtotal > 0 ? `(${formatRupiah(colSubtotal)})` : ''}
                  </TableCell>
                );
              })}
              <TableCell className="text-text-muted font-normal text-[11px]">
                {displayedTransactions.length} Trx
              </TableCell>
              <TableCell alignContent="right" className="font-bold text-base text-primary">
                {formatRupiah(grandTotal)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* Pagination & Footer Summary */}
      <div className="w-full px-4 py-3 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle rounded-b-xl">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>
            Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
            <strong className="text-on-surface font-semibold">{transactions.length}</strong> transaksi
          </span>

          {/* Per Page Selector */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-border-subtle pl-3">
            <span className="text-[11px] text-text-muted shrink-0">Baris:</span>
            <div className="w-24 relative">
              <Select
                value={String(itemsPerPage)}
                onValueChange={(val) => {
                  setItemsPerPage(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger size="sm" className="h-7 text-xs bg-white border-border-subtle rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top" align="start" className="min-w-[5rem] z-50">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pagination Page Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 w-8 rounded-lg"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;

            // Simple pagination windowing if many pages
            if (
              totalPages > 7 &&
              Math.abs(pageNum - currentPage) > 2 &&
              pageNum !== 1 &&
              pageNum !== totalPages
            ) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return (
                  <span key={pageNum} className="px-1 text-xs text-text-muted">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <Button
                key={pageNum}
                type="button"
                variant={isActive ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 min-w-[2rem] px-2 text-xs font-semibold rounded-lg ${
                  isActive ? 'shadow-xs' : 'text-on-surface hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 w-8 rounded-lg"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </TableContainer>
  );
};
