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
  
  // No longer using token from localStorage, but keeping for backward compatibility
  const token = null;

  // Store logs in session storage
  const log = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
    console.log(logEntry);
    const logs = JSON.parse(sessionStorage.getItem('authLogs') || '[]');
    logs.push(logEntry);
    sessionStorage.setItem('authLogs', JSON.stringify(logs));
  };

  useEffect(() => {
    const loadUser = async () => {
      log('loadUser: Attempting to fetch user data with credentials');
      try {
        // Use the enhanced apiFetch with credentials included
        const data = await apiFetch<{ user: User }>('/auth/me', { 
          method: 'GET',
          cache: 'no-store' // Prevent caching of auth state
        }, true);
        
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

  const login = async (credentials?: { email: string; password: string }): Promise<User | null> => {
    log('login() called', { hasCredentials: !!credentials });
    setLoading(true);
    try {
      let token: string | null = null;
      // For standard login, make the login request and store the token
      if (credentials) {
        log('Performing standard login with credentials');
        const loginResp = await apiFetch<{ user: User; token: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        }, false);
        token = loginResp.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      }
      // Fetch user data using the token
      log('Fetching user data from /auth/me');
      const data = await apiFetch<{ user: User }>('/auth/me', {
        method: 'GET',
        cache: 'no-store'
      }, true);
      log('User data received', {
        id: data.user?.id,
        role: data.user?.role,
        hasMentor: !!data.user?.mentor,
        hasMentee: !!data.user?.mentee
      });
      setUser(data.user);
      // Handle redirection based on onboarding status
      const role = data.user.role?.toUpperCase();
      const roleData = role === 'MENTOR' ? data.user.mentor : data.user.mentee;
      const needsOnboarding = !role || !roleData?.currentRole || !roleData?.workplace;
      log('Onboarding check', {
        role,
        hasRole: !!role,
        hasCurrentRole: !!roleData?.currentRole,
        hasWorkplace: !!roleData?.workplace,
        needsOnboarding
      });
      return data.user;
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