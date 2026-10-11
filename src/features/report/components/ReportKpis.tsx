import React, { useEffect, useState, useCallback } from 'react';
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Receipt,
  Flame,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { getTransactionKpis, type TransactionKpiData } from '../../../services/TransactionAction';
import { formatRupiah, formatNumber } from '../../../lib/formatters';

export interface ReportKpisProps {
  /**
   * Data KPI opsional jika di-pass dari parent component (ReportPage)
   */
  data?: TransactionKpiData | null;
  /**
   * Status loading opsional dari parent
   */
  isLoading?: boolean;
  /**
   * Callback refresh opsional
   */
  onRefresh?: () => void;
}

export const ReportKpis: React.FC<ReportKpisProps> = ({
  data: propData,
  isLoading: propLoading,
  onRefresh: propRefresh,
}) => {
  const [internalData, setInternalData] = useState<TransactionKpiData | null>(null);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gunakan data dari prop jika ada, sebaliknya pakai internal state
  const kpiData = propData !== undefined ? propData : internalData;
  const isLoading = propLoading !== undefined ? propLoading : internalLoading;

  const fetchKpiData = useCallback(async () => {
    // Jika data dikontrol oleh parent, jangan fetch internal
    if (propData !== undefined) {
      if (propRefresh) propRefresh();
      return;
    }

    try {
      setInternalLoading(true);
      setErrorMessage(null);
      const result = await getTransactionKpis();
      setInternalData(result);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memuat ringkasan KPI transaksi.');
    } finally {
      setInternalLoading(false);
    }
  }, [propData, propRefresh]);

  useEffect(() => {
    // Fetch hanya jika data tidak di-pass dari props
    if (propData === undefined) {
      fetchKpiData();
    }
  }, [fetchKpiData, propData]);

  // Loading Skeleton View
  if (isLoading && !kpiData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-card p-5 rounded-xl border border-border-subtle/60 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-surface-container-high rounded" />
              <div className="w-8 h-8 rounded-lg bg-surface-container-high" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-8 w-36 bg-surface-container-high rounded" />
              <div className="h-4 w-28 bg-surface-container-high rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State View
  if (errorMessage && !kpiData) {
    return (
      <div className="bg-error-container/20 border border-error/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 text-error">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
        <button
          onClick={fetchKpiData}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  // Safe Fallback Data
  const revenue = kpiData?.revenue ?? {
    total: 0,
    lastMonth: 0,
    difference: 0,
    growthPercentage: 0,
  };

  const transactions = kpiData?.transactions ?? {
    total: 0,
    lastMonth: 0,
    difference: 0,
    growthPercentage: 0,
    period: 'Bulan Ini',
  };

  const topProduct = kpiData?.topProduct;

  const aov = kpiData?.aov ?? {
    currentAverage: 0,
    difference: 0,
  };

  // Helper Revenue Growth
  const isRevenueGrowthPositive = revenue.growthPercentage >= 0;
  // Helper AOV Difference
  const isAovDiffPositive = aov.difference >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Pendapatan */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute right-0 top-0 w-24 h-24 bg-primary-container opacity-10 rounded-bl-full pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Total Pendapatan (Bulan Ini)</span>
          <span className="w-8 h-8 rounded-lg bg-primary-container/15 text-primary flex items-center justify-center">
            <Banknote className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold text-on-surface tracking-tight">
            {formatRupiah(revenue.total)}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                isRevenueGrowthPositive
                  ? 'text-primary bg-secondary-container/50'
                  : 'text-error bg-error-container/50'
              }`}
            >
              {isRevenueGrowthPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {isRevenueGrowthPositive ? '+' : ''}
              {revenue.growthPercentage}%
            </span>
            <span className="text-xs text-text-muted">dibandingkan bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Transaksi */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Total Transaksi</span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold text-on-surface tracking-tight">
            {formatNumber(transactions.total)}{' '}
            <span className="text-base font-normal text-text-muted">Trx</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs text-text-muted">Tercatat pada</span>
            <span className="text-[11px] font-bold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md">
              {transactions.period || 'Bulan Ini'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Produk Terlaris */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Produk Terlaris</span>
          <span className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div
            className="text-lg font-bold text-on-surface truncate"
            title={topProduct?.name || 'Belum ada transaksi'}
          >
            {topProduct?.name || 'Belum ada data'}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] font-bold bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded-full">
              {formatNumber(topProduct?.soldCount ?? 0)} pcs terjual
            </span>
            <span className="text-xs text-text-muted">
              dari total {formatNumber(topProduct?.totalItemsSold ?? 0)} item terjual
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Nilai Rata-rata Belanja (AOV) */}
      <div className="bg-surface-card p-5 rounded-xl shadow-xs border border-border-subtle/60 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Rata-rata Nilai Belanja (AOV)</span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-[28px] leading-[36px] font-bold text-on-surface tracking-tight">
            {formatRupiah(aov.currentAverage)}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                isAovDiffPositive
                  ? 'text-primary bg-secondary-container/50'
                  : 'text-error bg-error-container/50'
              }`}
            >
              {isAovDiffPositive ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              )}
              {isAovDiffPositive ? '+' : '-'}
              {formatRupiah(Math.abs(aov.difference))}
            </span>
            <span className="text-xs text-text-muted">dari rata-rata bulan lalu</span>
          </div>
        </div>
      </div>
    </div>
  );
};