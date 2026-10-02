import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] py-3.5 mt-auto">
      <div className="w-full px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-text-muted text-xs">
        <span>KasirIn POS UMKM — Sistem Kasir Digital Terintegrasi</span>
        <span>Operasional Shift Pagi • Terminal #01</span>
      </div>
    </footer>
  );
};
