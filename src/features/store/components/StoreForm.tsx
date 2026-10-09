import React, { useRef } from 'react';
import {
  Store,
  Camera,
  Building2,
  Tags,
  Phone,
  Receipt,
  QrCode,
  RotateCcw,
  Save,
  Loader2,
} from 'lucide-react';
import type { StoreFormProps } from '../../../types/store';

export type { StoreFormProps };

export const StoreForm: React.FC<StoreFormProps> = ({
  data,
  onChange,
  onReset,
  onSave,
  isSaving,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onChange('logoUrl', evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-card rounded-xl p-6 md:p-8 shadow-xs border border-border-subtle/60 flex flex-col gap-8"
    >
      {/* Bagian 1: Identitas Bisnis */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
            <Store className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-on-surface">Identitas Bisnis</h2>
            <span className="text-xs text-text-muted">
              Informasi legalitas dan kontak utama toko
            </span>
          </div>
        </div>

        {/* Logo Upload Unit */}
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border-subtle/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-container-lowest p-2 flex items-center justify-center shadow-xs border border-border-subtle/40 shrink-0">
              <img
                alt="Logo Toko"
                className="w-full h-full object-contain"
                src={data.logoUrl}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface">
                Logo Usaha KasirIn
              </span>
              <span className="text-xs text-text-muted">
                PNG atau JPG transparan (Maks. 2MB)
              </span>
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Ganti Logo</span>
            </button>
          </div>
        </div>

        {/* Nama Toko Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>
              Nama Toko <span className="text-status-danger">*</span>
            </span>
            <span className="text-xs text-text-muted">Kop Struk Baris 1</span>
          </label>
          <div className="relative flex items-center">
            <Building2 className="w-5 h-5 absolute left-3.5 text-text-muted pointer-events-none" />
            <input
              type="text"
              required
              value={data.storeName}
              onChange={(e) => onChange('storeName', e.target.value)}
              placeholder="Contoh: Toko Berkah Mandiri"
              className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest text-on-surface rounded-lg text-sm outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-container-high/40 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Kategori Usaha Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>Kategori Usaha</span>
            <span className="text-xs text-text-muted">Jenis / bidang usaha</span>
          </label>
          <div className="relative flex items-center">
            <Tags className="w-5 h-5 absolute left-3.5 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={data.category}
              onChange={(e) => onChange('category', e.target.value)}
              placeholder="Contoh: Toko Kelontong, Cafe, Retail"
              className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest text-on-surface rounded-lg text-sm outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-container-high/40 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* WhatsApp / Telepon Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>
              Nomor Telepon / WhatsApp <span className="text-status-danger">*</span>
            </span>
            <span className="text-xs text-text-muted">Untuk konfirmasi pelanggan</span>
          </label>
          <div className="relative flex items-center">
            <Phone className="w-5 h-5 absolute left-3.5 text-secondary pointer-events-none" />
            <input
              type="tel"
              required
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest text-on-surface rounded-lg text-sm outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-container-high/40 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Alamat Toko Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>
              Alamat Toko Lengkap <span className="text-status-danger">*</span>
            </span>
            <span className="text-xs text-text-muted">Tercetak di struk</span>
          </label>
          <div className="relative">
            <textarea
              required
              rows={3}
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Masukkan jalan, RT/RW, kelurahan, kecamatan, dan kota..."
              className="w-full p-3.5 bg-surface-container-lowest text-on-surface rounded-lg text-sm outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-container-high/40 transition-all shadow-xs resize-none"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-surface-container"></div>

      {/* Bagian 2: Kustomisasi Struk Kasir */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-on-surface">Kustomisasi Struk Kasir</h2>
            <span className="text-xs text-text-muted">
              Atur pesan penutup dan modul pembayaran instan
            </span>
          </div>
        </div>

        {/* Pesan Terima Kasih (Footer Struk) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>Pesan Terima Kasih (Footer Struk)</span>
            <span className="text-xs text-text-muted">Maks. 120 karakter</span>
          </label>
          <div className="relative">
            <textarea
              rows={2}
              maxLength={120}
              value={data.footerNote}
              onChange={(e) => onChange('footerNote', e.target.value)}
              className="w-full p-3.5 bg-surface-container-lowest text-on-surface rounded-lg text-sm outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-primary focus:bg-surface-container-high/40 transition-all shadow-xs resize-none"
            />
          </div>
        </div>

        {/* Toggle QRIS Struk */}
        <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-4 border border-border-subtle/40">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs border border-border-subtle/40">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface">
                Tampilkan QRIS Toko di Struk
              </span>
              <span className="text-xs text-text-muted">
                Cetak barcode QRIS pembayaran statis di bagian bawah struk pelanggan
              </span>
            </div>
          </div>

          {/* Switch Toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={data.showQris}
              onChange={(e) => onChange('showQris', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto h-12 px-6 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-semibold transition-colors flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulang</span>
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto h-12 px-7 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-75"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>SIMPAN PERUBAHAN</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
