import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Sliders,
} from 'lucide-react';
import type { ReportPrintModalProps, ReportPrintOptions } from '../../../types/report';
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
import { ReportPrintTemplate } from './ReportPrintTemplate';
import { printReportDocument } from '../utils/printReport';

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

  // Print customization options
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showKpis, setShowKpis] = useState<boolean>(true);
  const [showSignatures, setShowSignatures] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [approverName, setApproverName] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const printOptions: ReportPrintOptions = {
    orientation,
    showKpis,
    showSignatures,
    customNotes,
    cashierName: user?.name || 'Kasir / Petugas',
    approverName: approverName.trim() || undefined,
  };

  const printableElementId = 'kasirin-printable-report-content';

  // Penamaan file saat di-download / diexport PDF
  const sanitizedStart = startDate.replace(/\//g, '-');
  const sanitizedEnd = endDate.replace(/\//g, '-');
  const baseFileName =
    activeTab === 'transaksi'
      ? `Laporan_Transaksi_${sanitizedStart}_sd_${sanitizedEnd}`
      : activeTab === 'harian'
      ? `Laporan_Rekap_Harian_${sanitizedStart}_sd_${sanitizedEnd}`
      : `Laporan_Rekap_Bulanan_${sanitizedStart}`;

  // Handler Download PDF / Cetak Laporan
  const handleDownloadPdf = () => {
    try {
      setIsPrinting(true);
      printReportDocument(printableElementId, baseFileName);
    } catch (err) {
      console.error('Gagal mencetak dokumen report:', err);
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="5xl" className="p-0 overflow-hidden max-h-[92vh] flex flex-col">
        {/* =========================================================================
            HEADER MODAL
           ========================================================================= */}
        <DialogHeader className="bg-surface-card px-5 py-3.5 border-b border-border-subtle flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-on-surface">
                Pratinjau &amp; Download Laporan PDF
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Periksa tata letak template resmi sebelum mengunduh atau mencetak dokumen
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
              className="text-xs h-8"
            >
              Kustomisasi
            </Button>
          </div>
        </DialogHeader>

        {/* =========================================================================
            PANEL KUSTOMISASI LAPORAN (COLLAPSIBLE)
           ========================================================================= */}
        {showSettings && (
          <div className="bg-surface-container-high/60 border-b border-border-subtle px-5 py-3 shrink-0 text-xs text-on-surface space-y-3 transition-all animate-in fade-in-50">
            <div className="flex flex-wrap items-center gap-6">
              {/* Orientasi Kertas */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-muted">Orientasi Halaman:</span>
                <div className="inline-flex rounded-lg border border-border-subtle bg-surface-card p-0.5">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      orientation === 'portrait'
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'text-text-muted hover:text-on-surface'
                    }`}
                  >
                    Potret (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      orientation === 'landscape'
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'text-text-muted hover:text-on-surface'
                    }`}
                  >
                    Lanskap
                  </button>
                </div>
              </div>

              {/* Toggle Opsi KPI & Tanda Tangan */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showKpis}
                    onChange={(e) => setShowKpis(e.target.checked)}
                    className="rounded border-border-subtle text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="font-medium text-on-surface">Tampilkan Ringkasan Finansial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
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

            {/* Input Nama Penyetuju & Memo Tambahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-muted shrink-0">Nama Penyetuju:</span>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  placeholder="Kosongkan untuk diisi tulis tangan manual..."
                  className="flex-1 bg-surface-card border border-border-subtle rounded-lg px-3 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-muted shrink-0">Catatan / Memo:</span>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Misal: Laporan Tutup Shift Kasir Pagi..."
                  className="flex-1 bg-surface-card border border-border-subtle rounded-lg px-3 py-1 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PRATINJAU DOKUMEN REALISTIS (PAPER PREVIEW CANVAS)
           ========================================================================= */}
        <DialogBody className="p-4 sm:p-6 bg-slate-800/80 overflow-y-auto flex-1 select-text scrollbar-thin">
          <div className="max-w-full flex justify-center">
            {/* Realistic Paper Container with Drop Shadow */}
            <div
              className={`bg-white rounded shadow-2xl transition-all duration-200 border border-slate-300 overflow-hidden ${
                orientation === 'landscape' ? 'w-full max-w-[1100px]' : 'w-full max-w-[850px]'
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
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              💡 <strong>Tips Simpan PDF:</strong> Pada jendela cetak yang muncul, pilih tujuan{' '}
              <strong className="text-on-surface">&ldquo;Save as PDF&rdquo; / &ldquo;Simpan sebagai PDF&rdquo;</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={onClose}
              className="text-xs h-9"
            >
              Tutup
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handleDownloadPdf}
              disabled={isPrinting}
              className="text-xs h-9 bg-surface-bg border-border-subtle text-on-surface"
            >
              Cetak Dokumen
            </Button>

            <Button
              type="button"
              variant="primary"
              size="default"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadPdf}
              disabled={isPrinting}
              className="text-xs h-9 font-bold shadow-xs"
            >
              {isPrinting ? 'Menyiapkan Dokumen...' : 'Download / Simpan PDF'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
