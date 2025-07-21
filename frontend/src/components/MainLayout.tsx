import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Toaster } from './ui/sonner';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout; 