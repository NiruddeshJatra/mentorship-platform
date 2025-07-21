import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
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

  const navBg = scrolled ? 'bg-transparent backdrop-blur border-b border-border' : 'bg-transparent';
  const logoTextColor = scrolled ? 'text-neural-dark' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-0 py-0 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2 group focus:outline-none">
          <div className="w-8 h-8 rounded-lg bg-neural-primary flex items-center justify-center relative transition-colors duration-300">
            <Zap className="w-4 h-4 absolute left-2 top-2 transition-colors duration-300 text-white" />
            <div className="w-4 h-4 rounded-full bg-neural-light animate-pulse opacity-60" />
          </div>
          <span className={`text-2xl font-bold font-['Poppins'] transition-colors duration-300 ${logoTextColor}`}>Intellectify</span>
        </Link>
        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className={`text-sm ${logoTextColor}`}>Loading...</div>
          ) : user ? (
            <>
              <span className={`font-semibold ${logoTextColor}`}>Welcome, {user.name}</span>
              <Button
                variant="destructive"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              asChild
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-200 text-white ${scrolled ? 'bg-neural-primary hover:bg-neural-accent' : 'bg-neural-accent hover:bg-neural-primary'}`}
            >
              <Link to="/login" aria-label="Login or Register">Login/Register</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};