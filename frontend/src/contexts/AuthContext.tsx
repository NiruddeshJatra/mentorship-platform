// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'MENTOR' | 'MENTEE';
  profilePicture?: string;
  profileImageUrl?: string;
  bio?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  timezone?: string;
  currentRole?: string;
  learningGoals?: string;
  mentor?: {
    id: string;
    currentRole?: string;
    workplace?: string;
    experienceYears?: number;
    hourlyRate?: number;
    averageRating?: number;
    totalReviews?: number;
    isActive?: boolean;
  };
  mentee?: {
    id: string;
    currentRole?: string;
    workplace?: string;
    learningGoals?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials?: { email: string; password: string }) => Promise<User | null>;
  logout: () => void;
  setUser?: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Store logs in session storage
  const log = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
    console.log(logEntry);
    const logs = JSON.parse(sessionStorage.getItem('authLogs') || '[]');
    logs.push(logEntry);
    sessionStorage.setItem('authLogs', JSON.stringify(logs));
  };

  // Check if we're coming back from OAuth
  const checkOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const oauth = urlParams.get('oauth');
    
    if (token) {
      log('OAuth callback detected with token');
      // Store the token and remove it from URL
      localStorage.setItem('token', token);
      setToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } else if (oauth === 'true') {
      log('OAuth callback detected (cookie-based)');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const loadUser = async () => {
      log('loadUser: Attempting to fetch user data with credentials');
      
      // Check for OAuth callback first
      const isOAuthCallback = checkOAuthCallback();
      
      try {
        // Add a small delay after OAuth callback to ensure cookies are set
        if (isOAuthCallback) {
          log('loadUser: OAuth callback detected, waiting for cookies...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        log('loadUser: Fetching user data from /auth/me');
        const data = await apiFetch<{ user: User }>('/auth/me', { 
          method: 'GET',
          cache: 'no-store',
          credentials: 'include' as const,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        log('loadUser: User data received', { 
          id: data.user?.id,
          role: data.user?.role,
          hasMentor: !!data.user?.mentor,
          hasMentee: !!data.user?.mentee
        });
        
        setUser(data.user);
      } catch (error) {
        log('loadUser: Failed to load user', { 
          error: error.message,
          status: error.status
        });
        
        // If we're coming from OAuth and got an error, try one more time after a delay
        if (isOAuthCallback) {
          log('Retrying user load after OAuth callback...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
            const retryData = await apiFetch<{ user: User }>('/auth/me');
            setUser(retryData.user);
            return;
          } catch (retryError) {
            log('Retry failed:', { error: retryError.message });
          }
        }
        
        // Don't logout on first load to prevent flash of login page
        if (user) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials?: { email: string; password: string }) => {
    log('login: Attempting login', { hasCredentials: !!credentials });
    
    try {
      let userData;
      
      if (credentials) {
        // Standard login with email/password
        const response = await apiFetch<{ user: User; token: string }>(
          '/auth/login',
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            credentials: 'include' as const,
          },
          false
        );
        
        userData = response;
        
        // Store the token if it exists (for backward compatibility)
        if (response.token) {
          localStorage.setItem('token', response.token);
          setToken(response.token);
        }
      } else {
        // OAuth login - just get the current user
        try {
          userData = await apiFetch<{ user: User }>(
            '/auth/me',
            { 
              method: 'GET',
              credentials: 'include' as const,
              headers: {
                'Content-Type': 'application/json',
              },
              cache: 'no-store',
            },
            true
          );
        } catch (error) {
          console.error('Failed to fetch user after OAuth:', error);
          throw new Error('Failed to complete OAuth login. Please try again.');
        }
      }
      
      log('login: Login successful', { user: userData.user });
      
      // Handle redirection based on onboarding status
      const role = userData.user.role?.toUpperCase();
      const roleData = role === 'MENTOR' ? userData.user.mentor : userData.user.mentee;
      const needsOnboarding = !role || !roleData?.currentRole || !roleData?.workplace;
      
      log('Onboarding check', {
        role,
        hasRole: !!role,
        hasCurrentRole: !!roleData?.currentRole,
        hasWorkplace: !!roleData?.workplace,
        needsOnboarding
      });
      
      setUser(userData.user);
      return userData.user;
    } catch (error) {
      log('Login failed', {
        error: error.message,
        status: error.status,
        stack: error.stack
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    log('Logging out user');
    try {
      // Call the backend to clear the HTTP-only cookie
      await apiFetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
    } catch (error) {
      log('Error during logout:', { 
        error: error.message,
        status: error.status,
        stack: error.stack
      });
    } finally {
      // Clear local state
      setUser(null);
      
      // Clear any client-side storage
      localStorage.removeItem('token');
      sessionStorage.removeItem('authState');
      
      // Force a hard redirect to ensure all state is cleared
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token: null, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 