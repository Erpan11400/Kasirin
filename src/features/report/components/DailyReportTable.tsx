import React, { useState } from 'react';
import {
  CalendarDays,
  Coffee,
  Package,
  Soup,
  Banknote,
  QrCode,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import type { DailyReportTableProps, DailyRecord } from '../../../types/report';
import type { ProductNameItem } from '../../../types/products';
import { formatRupiah } from '../../../lib/formatters';
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
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

export type { DailyReportTableProps };

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

const getDailyProductSale = (record: DailyRecord, product: ProductNameItem) => {
  if (record.productSales) {
    if (Array.isArray(record.productSales)) {
      const matched = record.productSales.find(
        (p) =>
          p.productId === product._id ||
          p.productName?.trim().toLowerCase() === product.name?.trim().toLowerCase()
      );
      if (matched) {
        return { qty: matched.quantity, price: matched.price };
      }
    } else {
      if (record.productSales[product._id]) {
        return record.productSales[product._id];
      }
      if (record.productSales[product.name]) {
        return record.productSales[product.name];
      }
      const lowerName = product.name.trim().toLowerCase();
      const matchedKey = Object.keys(record.productSales).find(
        (k) => k.toLowerCase() === lowerName
      );
      if (matchedKey) {
        return record.productSales[matchedKey];
      }
    }
  }

  return { qty: 0, price: 0 };
};

export const DailyReportTable: React.FC<DailyReportTableProps> = ({
  records,
  products = [],
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 hari per halaman

  const totalPages = Math.max(1, Math.ceil(records.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRecords = records.slice(startIndex, startIndex + itemsPerPage);

  const startEntry = records.length > 0 ? startIndex + 1 : 0;
  const endEntry = Math.min(startIndex + itemsPerPage, records.length);

  const minTableWidth = Math.max(1100, 500 + products.length * 150);

  return (
    <TableContainer className="shadow-xs border border-border-subtle/60">
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

      <Table style={{ minWidth: `${minTableWidth}px` }} className="text-sm">
        <TableHeader>
          <TableRow className="bg-surface-bg border-b border-border-subtle/60">
            <TableHead className="font-semibold">Tanggal Operasional</TableHead>
            <TableHead alignContent="center" className="font-semibold">Jumlah Trx</TableHead>
            {/* Dynamic Product Columns */}
            {products.map((p) => (
              <TableHead
                key={p._id}
                className="font-semibold bg-surface-container-low/60 text-primary whitespace-nowrap min-w-[140px]"
              >
                <div className="flex items-center gap-1.5">
                  {getProductIcon(p.name)}
                  <span className="truncate" title={p.name}>
                    {p.name}
                  </span>
                </div>
              </TableHead>
            ))}
            <TableHead className="font-semibold">Metode Dominan</TableHead>
            <TableHead alignContent="right" className="font-semibold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={products.length + 4}
                className="py-12 text-center text-text-muted"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm font-medium">Memuat data rekap harian...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : displayedRecords.length > 0 ? (
            displayedRecords.map((row, idx) => (
              <TableRow
                key={row.id}
                className={idx % 2 === 1 ? 'bg-surface-container-low/20' : ''}
              >
                <TableCell className="text-sm font-bold text-on-surface">
                  {row.dayDate}
                </TableCell>
                <TableCell alignContent="center" className="font-semibold text-xs">
                  {row.trxCount} Trx
                </TableCell>
                {/* Dynamic Product Cells */}
                {products.map((p) => {
                  const sale = getDailyProductSale(row, p);
                  return (
                    <TableCell
                      key={p._id}
                      className="bg-surface-container-low/30 text-xs whitespace-nowrap"
                    >
                      {sale && sale.qty > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface">
                          {sale.qty} {sale.price && sale.price > 0 ? `x ${formatRupiah(sale.price)}` : 'pcs'}
                        </span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell>
                  {row.dominantMethod?.type === 'Tunai' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                      <Banknote className="w-3.5 h-3.5" />
                      {row.dominantMethod.percentage}% Tunai
                    </span>
                  ) : row.dominantMethod?.type === 'QRIS' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold">
                      <QrCode className="w-3.5 h-3.5" />
                      {row.dominantMethod.percentage}% QRIS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                      <Building2 className="w-3.5 h-3.5" />
                      {row.dominantMethod?.percentage}% Transfer
                    </span>
                  )}
                </TableCell>
                <TableCell alignContent="right" className="text-sm font-bold text-primary">
                  {formatRupiah(row.totalRevenue)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmpty
              colSpan={products.length + 4}
              title="Tidak ada data laporan harian"
              description="Tidak ditemukan rekaman penjualan harian pada filter rentang tanggal yang dipilih."
            />
          )}
        </TableBody>
      </Table>

      {/* Footer Pagination */}
      <div className="w-full px-4 py-3 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle rounded-b-xl">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>
            Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
            <strong className="text-on-surface font-semibold">{records.length}</strong> hari operasional
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
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
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
