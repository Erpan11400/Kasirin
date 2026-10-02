import React, { useState, useRef } from 'react';
import { Settings } from 'lucide-react';
import type { StoreProfileData } from '../../types/store';
import { DEFAULT_STORE_DATA } from './data/initialStoreData';
import { StoreForm } from './components/StoreForm';
import { ThermalReceiptPreview } from './components/ThermalReceiptPreview';
import { SaveToast } from './components/SaveToast';

export const StorePage: React.FC = () => {
  const [storeData, setStoreData] = useState<StoreProfileData>(() => {
    const saved = localStorage.getItem('kasirin_store_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STORE_DATA;
      }
    }
    return DEFAULT_STORE_DATA;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = <K extends keyof StoreProfileData>(
    field: K,
    value: StoreProfileData[K]
  ) => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setStoreData(DEFAULT_STORE_DATA);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      localStorage.setItem('kasirin_store_profile', JSON.stringify(storeData));

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setShowToast(true);
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, 3800);
    }, 600);
  };

  return (
    <div className="w-full flex-1">
      {/* Toast Notification Banner */}
      <SaveToast show={showToast} />

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
              data={storeData}
              onChange={handleChange}
              onReset={handleReset}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>

          {/* Right Column: Live Struk Thermal Preview (5 cols sticky) */}
          <ThermalReceiptPreview data={storeData} />
        </div>
      </div>
    </div>
  );
};

export default StorePage;
