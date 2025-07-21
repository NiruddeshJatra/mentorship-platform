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
      login(token).then(() => {
        toast({
          title: 'Login Successful',
          description: 'Welcome!',
        });
        navigate('/');
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