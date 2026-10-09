import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StoreProfileData } from '../types/store';
import { DEFAULT_STORE_DATA } from '../features/store/data/initialStoreData';
import { getStoreProfile, updateStoreProfile } from '../services/StoreAction';
import { useAuth } from './AuthContext';

const STORE_STORAGE_KEY = 'kasirin_store_profile';

export interface StoreContextType {
  store: StoreProfileData;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refreshStore: () => Promise<void>;
  updateStore: (data: StoreProfileData) => Promise<StoreProfileData>;
  setStoreLocal: (data: StoreProfileData) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Inisialisasi awal langsung dari LocalStorage agar instan dan offline-friendly
  const [store, setStore] = useState<StoreProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing store cache from localStorage:', e);
    }
    return DEFAULT_STORE_DATA;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memuat data toko dari backend
  const refreshStore = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStoreProfile();
      setStore(data);
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(data));
    } catch (err: any) {
      console.warn('Menggunakan cache lokal profil toko (backend offline/request error).');
      setError(err?.message || 'Gagal memuat profil toko dari server');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Muat data dari server saat login / authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshStore();
    }
  }, [isAuthenticated, refreshStore]);

  // Fungsi untuk update profil toko (Simpan ke API + update state & cache)
  const updateStore = async (newData: StoreProfileData): Promise<StoreProfileData> => {
    setIsSaving(true);
    setError(null);
    try {
      const saved = await updateStoreProfile(newData);
      setStore(saved);
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(saved));
      return saved;
    } catch (err: any) {
      // Fallback jika backend offline: tetap simpan ke localStorage agar user experience tidak terputus
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(newData));
      setStore(newData);
      const errMsg = err?.message || 'Gagal menyimpan perubahan ke server.';
      setError(errMsg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const setStoreLocal = (data: StoreProfileData) => {
    setStore(data);
  };

  return (
    <StoreContext.Provider
      value={{
        store,
        isLoading,
        isSaving,
        error,
        refreshStore,
        updateStore,
        setStoreLocal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
