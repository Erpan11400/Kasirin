import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import type { StoreProfileData } from '../../types/store';
import { DEFAULT_STORE_DATA } from './data/initialStoreData';
import { StoreForm } from './components/StoreForm';
import { ThermalReceiptPreview } from './components/ThermalReceiptPreview';
import { Toast, type ToastType } from '../../components/ui/Toast';
import { useStore } from '../../context/StoreContext';

export const StorePage: React.FC = () => {
  const { store, updateStore, isSaving } = useStore();
  const [formData, setFormData] = useState<StoreProfileData>(store);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Sinkronkan form saat data store dari server selesai di-fetch
  useEffect(() => {
    setFormData(store);
  }, [store]);

  const handleChange = <K extends keyof StoreProfileData>(
    field: K,
    value: StoreProfileData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_STORE_DATA);
  };

  const handleSave = async () => {
    try {
      await updateStore(formData);
      setToast({
        message: 'Perubahan profil toko berhasil disimpan.',
        type: 'success',
      });
    } catch (error) {
      console.error('Gagal menyimpan profil toko:', error);
      setToast({
        message: 'Gagal menyimpan profil toko. Silakan coba lagi.',
        type: 'error',
      });
    }
  };

  return (
    <div className="w-full flex-1">
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
          position="bottom-right"
        />
      )}

      {/* Workspace Container */}
      <div className="w-full mx-auto px-4 md:px-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary">
              <Settings className="w-7 h-7 text-primary" />
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                Pengaturan Profil Toko
              </h1>
            </div>
            <p className="text-sm text-text-muted max-w-2xl">
              Kelola informasi identitas toko Anda yang akan otomatis tercetak pada kop struk
              kasir dan header aplikasi.
            </p>
          </div>

          {/* Live Sync Status Badge */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-full shadow-xs border border-border-subtle/40 self-start md:self-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="text-xs font-semibold text-on-surface-variant">
              Sinkronisasi Struk Aktif
            </span>
          </div>
        </div>

        {/* Main Form & Struk Dual-Pane Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Settings (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <StoreForm
              data={formData}
              onChange={handleChange}
              onReset={handleReset}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>

          {/* Right Column: Live Struk Thermal Preview (5 cols sticky) */}
          <ThermalReceiptPreview data={formData} />
        </div>
      </div>
    </div>
  );
};

export default StorePage;
