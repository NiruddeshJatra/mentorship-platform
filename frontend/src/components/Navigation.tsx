import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll past hero or not on homepage
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setScrolled(true);
    }
  }, [location.pathname]);

  const navBg = scrolled
    ? 'bg-transparent backdrop-blur border-b border-border'
    : 'bg-transparent';
  const logoTextColor = scrolled ? 'text-neural-primary' : 'text-white';
  const logoIconColor = 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-0 py-0 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2 group focus:outline-none">
          <div className={`w-8 h-8 rounded-lg bg-neural-primary flex items-center justify-center relative transition-colors duration-300`}>
            <Zap className={`w-4 h-4 absolute left-2 top-2 transition-colors duration-300 ${logoIconColor}`} />
            <div className="w-4 h-4 rounded-full bg-neural-light animate-pulse opacity-60" />
          </div>
          <span className={`text-2xl font-bold font-['Poppins'] transition-colors duration-300 ${logoTextColor}`}>Intellectify</span>
        </Link>
        {/* Auth Button */}
        <div className="flex items-center">
          <Button asChild className="bg-neural-accent hover:bg-neural-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-200">
            <Link to="/login" aria-label="Login or Register">Login/Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};