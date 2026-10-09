export interface BackendStoreItem {
  _id?: string;
  name?: string;
  businessCategory?: string;
  category?: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  logoUrl?: string;
  logo?: string;
  footerNote?: string;
  showQris?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface StoreProfileData {
  id?: string;
  storeName: string;
  category: string;
  phone: string;
  address: string;
  footerNote: string;
  showQris: boolean;
  logoUrl: string;
}

export interface UpdateStorePayload {
  name?: string;
  businessCategory?: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  footerNote?: string;
  showQris?: boolean;
}



export interface StoreFormProps {
  data: StoreProfileData;
  onChange: <K extends keyof StoreProfileData>(field: K, value: StoreProfileData[K]) => void;
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export interface SaveToastProps {
  show: boolean;
}
