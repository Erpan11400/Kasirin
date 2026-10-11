import React, { useState, useMemo } from 'react';
import {
  Coffee,
  Package,
  Soup,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import type { MonthlyReportViewProps, MonthlyRecord } from '../../../types/report';
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

export type { MonthlyReportViewProps };

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

const getMonthlyProductSale = (record: MonthlyRecord, product: ProductNameItem) => {
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

  const lower = product.name.toLowerCase();
  if (lower.includes('kopi') && record.coffeeQty !== undefined) {
    return { qty: record.coffeeQty, price: 15000 };
  }
  if (lower.includes('gula') && record.sugarQty !== undefined) {
    return { qty: record.sugarQty, price: 16000 };
  }
  if (lower.includes('minyak') && record.oilQty !== undefined) {
    return { qty: record.oilQty, price: 28000 };
  }
  if (lower.includes('beras') && record.riceQty !== undefined) {
    return { qty: record.riceQty, price: 75000 };
  }

  return { qty: 0, price: 0 };
};

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  records,
  products = [],
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 periode per halaman

  const totalPages = Math.max(1, Math.ceil(records.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRecords = records.slice(startIndex, startIndex + itemsPerPage);

  const startEntry = records.length > 0 ? startIndex + 1 : 0;
  const endEntry = Math.min(startIndex + itemsPerPage, records.length);

  const chartData = useMemo(() => {
    if (!records || records.length === 0) return [];
    const recent = [...records].slice(0, 5).reverse();
    const maxRevenue = Math.max(...recent.map((r) => r.grossRevenue), 1);

    return recent.map((r, idx) => {
      const heightPercent = Math.max(15, Math.round((r.grossRevenue / maxRevenue) * 100));
      const monthPart = r.period ? r.period.split(' ')[0] : r.id;
      const shortName = monthPart.length > 4 ? monthPart.slice(0, 3) : monthPart;
      const label = r.isCurrent ? `${shortName} (Berjalan)` : shortName;

      return {
        month: label,
        height: `${heightPercent}%`,
        opacity: r.isCurrent ? 'bg-primary shadow-xs' : `bg-primary/${Math.min(30 + idx * 15, 80)}`,
        isCurrent: !!r.isCurrent,
        revenue: r.grossRevenue,
      };
    });
  }, [records]);

  const minTableWidth = Math.max(1100, 500 + products.length * 150);

  return (
    <div className="space-y-5">
      {/* Header & Chart Card */}
      <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle/60 p-5 space-y-4">
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
                  className={`text-[11px] ${
                    bar.isCurrent ? 'font-bold text-primary' : 'text-text-muted'
                  }`}
                >
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Table with Table UI Component & Pagination */}
      <TableContainer className="shadow-xs border border-border-subtle/60">
        <div className="px-5 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border-subtle/60">
          <span className="text-sm font-bold text-on-surface">
            Matriks Akumulasi Omset Bulanan
          </span>
          <span className="text-xs text-text-muted">
            Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
            <strong className="text-on-surface font-semibold">{records.length}</strong> bulan
          </span>
        </div>

        <Table style={{ minWidth: `${minTableWidth}px` }} className="text-sm">
          <TableHeader>
            <TableRow className="bg-surface-bg border-b border-border-subtle/60">
              <TableHead className="font-semibold">Periode Bulan</TableHead>
              <TableHead alignContent="center" className="font-semibold">Total Trx</TableHead>
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
              <TableHead alignContent="right" className="font-semibold">Omset Bruto</TableHead>
              <TableHead alignContent="right" className="font-semibold">Status Audit</TableHead>
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
                    <span className="text-sm font-medium">Memuat data rekap bulanan...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayedRecords.length > 0 ? (
              displayedRecords.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.isCurrent ? 'bg-primary-container/10 font-medium' : ''}
                >
                  <TableCell
                    className={`font-bold ${
                      row.isCurrent ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {row.period}
                  </TableCell>
                  <TableCell alignContent="center" className="font-semibold text-xs">
                    {row.trxCount} Trx
                  </TableCell>
                  {/* Dynamic Product Cells */}
                  {products.map((p) => {
                    const sale = getMonthlyProductSale(row, p);
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
                  <TableCell alignContent="right" className="text-base font-bold text-on-surface">
                    {formatRupiah(row.grossRevenue)}
                  </TableCell>
                  <TableCell alignContent="right">
                    {row.auditStatus === 'Aktif Berjalan' || row.isCurrent ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        Aktif Berjalan
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold">
                        Audit Selesai
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmpty
                colSpan={products.length + 4}
                title="Tidak ada data laporan bulanan"
                description="Belum ada rekaman akumulasi penjualan bulanan yang tersedia."
              />
            )}
          </TableBody>
        </Table>

        {/* Footer Pagination */}
        <div className="w-full px-4 py-3 bg-surface-bg flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-subtle rounded-b-xl">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>
              Menampilkan <strong className="text-on-surface font-semibold">{startEntry} - {endEntry}</strong> dari{' '}
              <strong className="text-on-surface font-semibold">{records.length}</strong> periode bulan
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
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
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
    </div>
  );
};
