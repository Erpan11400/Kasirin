import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CalendarRange,
} from 'lucide-react';
import type { DateRangeModalProps } from '../../../types/report';
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

export type { DateRangeModalProps };

// Helper to convert DD/MM/YYYY to YYYY-MM-DD
const ddmmyyyyToIso = (d: string): string => {
  if (!d) return '';
  const parts = d.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return d;
};

// Helper to convert YYYY-MM-DD to DD/MM/YYYY
const isoToDdmmyyyy = (iso: string): string => {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return iso;
};

// Helper to format Date object to YYYY-MM-DD
const formatDateToIso = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

interface PresetOption {
  label: string;
  getRange: () => { start: string; end: string };
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  onApply,
}) => {
  const [tempStart, setTempStart] = useState<string>('');
  const [tempEnd, setTempEnd] = useState<string>('');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preset definitions
  const presets: PresetOption[] = [
    {
      label: 'Hari Ini',
      getRange: () => {
        const today = new Date();
        const iso = formatDateToIso(today);
        return { start: iso, end: iso };
      },
    },
    {
      label: 'Kemarin',
      getRange: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const iso = formatDateToIso(yesterday);
        return { start: iso, end: iso };
      },
    },
    {
      label: '7 Hari Terakhir',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        return { start: formatDateToIso(start), end: formatDateToIso(end) };
      },
    },
    {
      label: '30 Hari Terakhir',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return { start: formatDateToIso(start), end: formatDateToIso(end) };
      },
    },
    {
      label: 'Bulan Ini',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: formatDateToIso(start), end: formatDateToIso(end) };
      },
    },
    {
      label: 'Bulan Lalu',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: formatDateToIso(start), end: formatDateToIso(end) };
      },
    },
  ];

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const isoStart = ddmmyyyyToIso(startDate);
      const isoEnd = ddmmyyyyToIso(endDate);
      setTempStart(isoStart);
      setTempEnd(isoEnd);

      const matched = presets.find((p) => {
        const range = p.getRange();
        return range.start === isoStart && range.end === isoEnd;
      });
      setActivePreset(matched ? matched.label : null);
      setErrorMessage(null);
    }
  }, [isOpen, startDate, endDate]);

  const handleSelectPreset = (preset: PresetOption) => {
    const range = preset.getRange();
    setTempStart(range.start);
    setTempEnd(range.end);
    setActivePreset(preset.label);
    setErrorMessage(null);
  };

  const handleStartChange = (val: string) => {
    setTempStart(val);
    setActivePreset(null);
    if (tempEnd && val > tempEnd) {
      setErrorMessage('Tanggal awal tidak boleh melebihi tanggal akhir');
    } else {
      setErrorMessage(null);
    }
  };

  const handleEndChange = (val: string) => {
    setTempEnd(val);
    setActivePreset(null);
    if (tempStart && val < tempStart) {
      setErrorMessage('Tanggal akhir tidak boleh lebih awal dari tanggal awal');
    } else {
      setErrorMessage(null);
    }
  };

  const handleReset = () => {
    const defaultStart = ddmmyyyyToIso(startDate);
    const defaultEnd = ddmmyyyyToIso(endDate);
    setTempStart(defaultStart);
    setTempEnd(defaultEnd);
    setActivePreset(null);
    setErrorMessage(null);
  };

  const handleSave = () => {
    if (!tempStart || !tempEnd) {
      setErrorMessage('Silakan pilih tanggal awal dan akhir.');
      return;
    }

    if (tempStart > tempEnd) {
      setErrorMessage('Tanggal akhir tidak boleh lebih awal dari tanggal mulai.');
      return;
    }

    const formattedStart = isoToDdmmyyyy(tempStart);
    const formattedEnd = isoToDdmmyyyy(tempEnd);
    onApply(formattedStart, formattedEnd);
    onClose();
  };

  const calculateDays = (): number => {
    if (!tempStart || !tempEnd) return 0;
    const d1 = new Date(tempStart);
    const d2 = new Date(tempEnd);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime < 0) return 0;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateDays();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-surface-container-low px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-on-surface">
                Pilih Rentang Tanggal Laporan
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted mt-0.5">
                Filter data laporan berdasarkan periode operasional
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <DialogBody className="p-5 space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Pilihan Cepat (Preset)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presets.map((p) => {
                const isSelected = activePreset === p.label;
                return (
                  <Button
                    key={p.label}
                    type="button"
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleSelectPreset(p)}
                    className={`justify-center text-xs h-9 ${
                      isSelected
                        ? 'shadow-xs font-semibold'
                        : 'bg-surface-bg hover:bg-surface-container-high text-on-surface border-border-subtle/70'
                    }`}
                  >
                    {p.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border-subtle/60 pt-4">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5 block">
              Tentukan Tanggal Kustom
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Tanggal Awal
                </span>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-bg border border-border-subtle rounded-lg text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Tanggal Akhir
                </span>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-bg border border-border-subtle rounded-lg text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <p className="text-xs text-status-danger mt-2 font-medium bg-status-danger/10 px-3 py-1.5 rounded-md">
                {errorMessage}
              </p>
            )}

            {/* Selected Period Preview Summary */}
            {tempStart && tempEnd && !errorMessage && (
              <div className="mt-3 px-3.5 py-2.5 bg-surface-container-low/70 border border-border-subtle/80 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-on-surface font-semibold">
                  <span>{isoToDdmmyyyy(tempStart)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                  <span>{isoToDdmmyyyy(tempEnd)}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-container/30 text-on-primary-fixed-variant font-bold text-[11px]">
                  {totalDays} Hari Terpilih
                </span>
              </div>
            )}
          </div>
        </DialogBody>

        {/* Footer Actions */}
        <DialogFooter className="px-5 py-3.5 bg-surface-container-low border-t border-border-subtle flex flex-row items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-text-muted hover:text-on-surface"
          >
            Reset
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Check className="w-4 h-4" />}
              className="shadow-xs"
            >
              Terapkan Filter
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
