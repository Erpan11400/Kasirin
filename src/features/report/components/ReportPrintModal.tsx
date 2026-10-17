import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Sliders,
  Loader2,
  Calendar,
  CreditCard,
  FileCheck,
  AlignLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import type {
  ReportPrintModalProps,
  ReportPrintOptions,
} from '../../../types/report';
import { useStore } from '../../../context/StoreContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Toast, type ToastType } from '../../../components/ui/Toast';
import { ReportPrintTemplate } from './ReportPrintTemplate';
import { printReportDocument } from '../utils/printReport';
import { downloadReportPdf } from '../../../services/exportService';

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  startDate,
  endDate,
  transactions,
  dailyRecords,
  monthlyRecords,
  products,
  selectedPayment,
  searchQuery,
}) => {
  const { store } = useStore();
  const { user } = useAuth();

  // Opsi Kustomisasi Dokumen Cetak / PDF (tanpa filter duplikat, mengikuti filter page)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showKpis, setShowKpis] = useState<boolean>(true);
  const [showSignatures, setShowSignatures] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [approverName, setApproverName] = useState<string>('');

  // UI Control & Loading States
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isPrintingBrowser, setIsPrintingBrowser] = useState<boolean>(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
    title?: string;
  } | null>(null);

  // Opsi cetak untuk dokumen
  const printOptions: ReportPrintOptions = {
    orientation,
    showKpis,
    showSignatures,
    customNotes,
    cashierName: user?.name || 'Kasir / Petugas',
    approverName: approverName.trim() || undefined,
  };

  const printableElementId = 'kasirin-printable-report-content';

  // Label tipe laporan aktif
  const reportTypeLabel =
    activeTab === 'transaksi'
      ? 'Rincian Transaksi'
      : activeTab === 'harian'
        ? 'Rekapitulasi Harian'
        : 'Rekapitulasi Bulanan';

  // Penamaan file saat di-download atau dicetak
  const sanitizedStart = startDate.replace(/\//g, '-');
  const sanitizedEnd = endDate.replace(/\//g, '-');
  const baseFileName =
    activeTab === 'transaksi'
      ? `Laporan_Transaksi_${sanitizedStart}_sd_${sanitizedEnd}`
      : activeTab === 'harian'
        ? `Laporan_Rekap_Harian_${sanitizedStart}_sd_${sanitizedEnd}`
        : `Laporan_Rekap_Bulanan_${sanitizedStart}`;

  // =========================================================================
  // HANDLER: Direct Download PDF via Backend Puppeteer Endpoint
  // Menggunakan filter aktif dari halaman (activeTab, startDate, endDate, selectedPayment)
  // =========================================================================
  const handleDownloadBackendPdf = async () => {
    try {
      setIsDownloadingPdf(true);

      const result = await downloadReportPdf({
        type: activeTab,
        startDate: startDate,
        endDate: endDate,
        paymentMethod: selectedPayment,
        orientation: orientation,
        showSignatures: showSignatures,
        showKpis: showKpis,
        approverName: approverName.trim() || undefined,
        operatorName: user?.name || undefined,
        customNotes: customNotes.trim() || undefined,
      });

      setToast({
        show: true,
        type: 'success',
        title: 'Berhasil Mengunduh',
        message: `File PDF "${result.filename}" berhasil digenerate dan diunduh langsung.`,
      });
    } catch (err: any) {
      console.error('Gagal mengunduh file PDF dari server:', err);
      setToast({
        show: true,
        type: 'error',
        title: 'Gagal Mengunduh PDF',
        message:
          err.message ||
          'Terjadi kesalahan saat memproses laporan PDF di server backend.',
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // =========================================================================
  // HANDLER: Cetak Dokumen via Dialog Cetak Browser (Fallback Printer Fisik)
  // =========================================================================
  const handlePrintBrowser = () => {
    try {
      setIsPrintingBrowser(true);
      printReportDocument(printableElementId, baseFileName);
    } catch (err) {
      console.error('Gagal mencetak dokumen report via browser:', err);
      setToast({
        show: true,
        type: 'error',
        title: 'Gagal Mencetak',
        message: 'Terjadi kendala saat membuka dialog pencetakan browser.',
      });
    } finally {
      setTimeout(() => {
        setIsPrintingBrowser(false);
      }, 1000);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && !isDownloadingPdf && onClose()}>
        <DialogContent size="5xl" className="p-0 overflow-hidden max-h-[94vh] flex flex-col bg-surface-card border-border-subtle shadow-2xl">
          {/* =========================================================================
              HEADER MODAL
             ========================================================================= */}
          <DialogHeader className="bg-surface-card px-5 py-3.5 border-b border-border-subtle flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-on-surface">
                  Pratinjau &amp; Download Laporan PDF
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted">
                  Periksa tata letak template resmi sebelum mengunduh PDF atau mencetak dokumen
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 mr-10 sm:mr-11">
              <Button
                type="button"
                variant={showSettings ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                leftIcon={<Sliders className="w-3.5 h-3.5" />}
                rightIcon={showSettings ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                className="text-xs h-8 font-medium"
              >
                {showSettings ? 'Sembunyikan Pengaturan' : 'Kustomisasi Dokumen'}
              </Button>
            </div>
          </DialogHeader>

          {/* =========================================================================
              INFO BAR: FILTER AKTIF DARI HALAMAN (READ-ONLY)
             ========================================================================= */}
          <div className="bg-surface-container-low px-5 py-2.5 border-b border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-text-muted font-medium">Filter Halaman:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                <FileCheck className="w-3 h-3" />
                {reportTypeLabel}
              </span>
              {activeTab !== 'bulanan' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-card text-on-surface font-medium border border-border-subtle shadow-2xs">
                  <Calendar className="w-3 h-3 text-text-muted" />
                  {startDate} s/d {endDate}
                </span>
              )}
              {activeTab !== 'bulanan' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-card text-on-surface font-medium border border-border-subtle shadow-2xs">
                  <CreditCard className="w-3 h-3 text-text-muted" />
                  Metode: {selectedPayment}
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-card text-text-muted border border-border-subtle text-[11px]">
                  Pencarian: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>
            <div className="text-[11px] text-text-muted hidden sm:block">
              Data otomatis sinkron dengan tabel di halaman laporan
            </div>
          </div>

          {/* =========================================================================
              PANEL KUSTOMISASI FORMAT DOKUMEN CETAK (COLLAPSIBLE)
             ========================================================================= */}
          {showSettings && (
            <div className="bg-surface-bg border-b border-border-subtle px-5 py-3.5 shrink-0 text-xs text-on-surface space-y-3 transition-all animate-in fade-in-50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Orientasi Halaman Cetak */}
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-text-muted shrink-0 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-primary" />
                    <span>Orientasi Halaman:</span>
                  </span>
                  <div className="inline-flex rounded-lg border border-border-subtle bg-surface-card p-0.5 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setOrientation('portrait')}
                      className={`py-1 px-3 rounded-md text-xs font-medium transition-all ${orientation === 'portrait'
                          ? 'bg-primary text-on-primary font-bold shadow-xs'
                          : 'text-text-muted hover:text-on-surface'
                        }`}
                    >
                      Potret (A4)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('landscape')}
                      className={`py-1 px-3 rounded-md text-xs font-medium transition-all ${orientation === 'landscape'
                          ? 'bg-primary text-on-primary font-bold shadow-xs'
                          : 'text-text-muted hover:text-on-surface'
                        }`}
                    >
                      Lanskap (A4)
                    </button>
                  </div>
                </div>

                {/* Toggle Opsi KPI & Tanda Tangan */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showKpis}
                      onChange={(e) => setShowKpis(e.target.checked)}
                      className="rounded border-border-subtle text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="font-medium text-on-surface">Tampilkan Ringkasan Finansial</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showSignatures}
                      onChange={(e) => setShowSignatures(e.target.checked)}
                      className="rounded border-border-subtle text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="font-medium text-on-surface">Lembar Tanda Tangan &amp; Validasi</span>
                  </label>
                </div>
              </div>

              {/* Input Nama Penyetuju & Catatan / Memo Dokumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-border-subtle/70">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-muted shrink-0 w-28">Nama Penyetuju:</span>
                  <input
                    type="text"
                    value={approverName}
                    onChange={(e) => setApproverName(e.target.value)}
                    placeholder="Kosongkan jika ditandatangani manual..."
                    className="flex-1 bg-surface-card border border-border-subtle rounded-lg px-2.5 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-muted shrink-0 w-28">Catatan / Memo:</span>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Tambahkan catatan khusus atau memo kaki laporan..."
                    className="flex-1 bg-surface-card border border-border-subtle rounded-lg px-2.5 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PRATINJAU DOKUMEN REALISTIS (PAPER PREVIEW CANVAS)
             ========================================================================= */}
          <DialogBody className="p-4 sm:p-6 bg-slate-900/90 overflow-y-auto flex-1 select-text scrollbar-thin">
            <div className="max-w-full flex justify-center">
              {/* Realistic Paper Container with Drop Shadow */}
              <div
                className={`bg-white rounded-md shadow-2xl transition-all duration-200 border border-slate-300 overflow-hidden ${orientation === 'landscape' ? 'w-full max-w-[1100px]' : 'w-full max-w-[850px]'
                  }`}
              >
                <ReportPrintTemplate
                  id={printableElementId}
                  activeTab={activeTab}
                  startDate={startDate}
                  endDate={endDate}
                  transactions={transactions}
                  dailyRecords={dailyRecords}
                  monthlyRecords={monthlyRecords}
                  products={products}
                  selectedPayment={selectedPayment}
                  searchQuery={searchQuery}
                  store={store}
                  operatorName={user?.name || 'Kasir / Operator'}
                  options={printOptions}
                />
              </div>
            </div>
          </DialogBody>

          {/* =========================================================================
              FOOTER ACTIONS MODAL
             ========================================================================= */}
          <DialogFooter className="px-5 py-3.5 bg-surface-card border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-text-muted self-start sm:self-auto">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong>Direct PDF Download:</strong> Dokumen A4 diproses langsung oleh mesin PDF server backend.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="secondary"
                size="default"
                onClick={onClose}
                disabled={isDownloadingPdf}
                className="text-xs h-9"
              >
                Tutup
              </Button>

              <Button
                type="button"
                variant="outline"
                size="default"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={handlePrintBrowser}
                disabled={isDownloadingPdf || isPrintingBrowser}
                className="text-xs h-9 bg-surface-bg border-border-subtle text-on-surface hover:bg-surface-container-high"
                title="Mencetak dokumen melalui dialog print browser"
              >
                {isPrintingBrowser ? 'Membuka Cetak...' : 'Cetak Dokumen'}
              </Button>

              <Button
                type="button"
                variant="primary"
                size="default"
                onClick={handleDownloadBackendPdf}
                disabled={isDownloadingPdf || isPrintingBrowser}
                className="text-xs h-9 font-bold shadow-xs min-w-[185px] justify-center"
                title="Download file PDF secara langsung ke komputer"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 mr-1.5" />
                    <span>Menyiapkan Dokumen PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 shrink-0 mr-1.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifikasi Feedback Unduhan */}
      <Toast
        show={toast?.show}
        title={toast?.title}
        message={toast?.message}
        type={toast?.type}
        duration={4500}
        position="top-right"
        onClose={() => setToast(null)}
      />
    </>
  );
};

export default ReportPrintModal;
