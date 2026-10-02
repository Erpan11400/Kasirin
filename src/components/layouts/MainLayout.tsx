import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-on-surface antialiased font-sans">
      <Navbar />
      <main className="w-full pt-16 flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
