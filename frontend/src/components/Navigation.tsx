import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent px-0 py-0">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-neural-primary flex items-center justify-center relative">
            {/* Icon inside the logo */}
            <Zap className="w-4 h-4 text-white absolute left-2 top-2" />
            <div className="w-4 h-4 rounded-full bg-neural-light animate-pulse opacity-60" />
          </div>
          <span className="text-2xl font-bold text-white font-['Poppins']">
            Intellectify
          </span>
        </div>
        {/* Auth Button */}
        <div className="flex items-center">
          <Button className="bg-neural-accent hover:bg-neural-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-200">
            Login/Register
          </Button>
        </div>
      </div>
    </nav>
  );
};