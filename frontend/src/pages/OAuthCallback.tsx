// src/pages/OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast({
        title: 'Authentication Failed',
        description: error,
        variant: 'destructive',
      });
      navigate('/login');
    } else if (token) {
      login(token).then(async () => {
        try {
          // Get user info to check if onboarding is needed
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userData = await response.json();
          
          // Check if user needs onboarding (missing role, currentRole, or bio)
          if (!userData.user?.role || !userData.user?.currentRole || !userData.user?.bio) {
            toast({
              title: 'Welcome to Intellectify!',
              description: 'Let\'s complete your profile.',
            });
            navigate('/onboarding');
          } else {
            toast({
              title: 'Login Successful',
              description: 'Welcome back!',
            });
            navigate('/');
          }
        } catch (err) {
          // If we can't get user info, just redirect to onboarding to be safe
          toast({
            title: 'Welcome to Intellectify!',
            description: 'Let\'s set up your profile.',
          });
          navigate('/onboarding');
        }
      });
    } else {
      toast({
        title: 'Authentication Error',
        description: 'Could not retrieve authentication token.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [searchParams, login, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Finalizing your authentication...</p>
    </div>
  );
};

export default OAuthCallbackPage; 