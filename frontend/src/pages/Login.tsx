// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Zap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setUser } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Store logs in session storage
  const log = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
    console.log(logEntry);
    const logs = JSON.parse(sessionStorage.getItem('loginLogs') || '[]');
    logs.push(logEntry);
    sessionStorage.setItem('loginLogs', JSON.stringify(logs));
  };

  // Debug component
  useEffect(() => {
    log('Login component mounted');
    return () => log('Login component unmounted');
  }, []);

  // Handle OAuth callback on component mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we were redirected from OAuth flow
      const isOAuthRedirect = searchParams.get('oauth') === 'true';
      
      if (isOAuthRedirect) {
        setLoading(true);
        try {
          // The backend has already set the auth cookie, just fetch user data
          log('OAuth callback detected, fetching user data');
          const data = await apiFetch<{ user: User }>('/auth/me', { 
            credentials: 'include' 
          });
          
          // Update auth state
          setUser(data.user);
          
          // Handle redirection based on onboarding status
          const role = data.user.role?.toUpperCase();
          const roleData = role === 'MENTOR' ? data.user.mentor : data.user.mentee;
          const needsOnboarding = !role || !roleData?.currentRole || !roleData?.workplace;
          
          if (needsOnboarding) {
            log('Redirecting to /onboarding');
            navigate('/onboarding');
          } else {
            const dashboardPath = role === 'MENTOR' ? '/mentor/dashboard' : '/dashboard';
            log(`Redirecting to ${dashboardPath}`);
            navigate(dashboardPath);
          }
          
          // Clear the OAuth query param
          window.history.replaceState({}, document.title, window.location.pathname);
          
        } catch (error) {
          log('OAuth login failed', { error: error.message });
          toast({
            title: 'Authentication failed',
            description: 'Failed to complete OAuth login. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Try to login with email/password
      const user = await login({ email, password });
      if (!user) {
        throw new Error('Login failed: No user returned');
      }
      log('Login successful', { userId: user.id });
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      // Handle redirection based on onboarding status
      const role = user.role?.toUpperCase();
      const roleData = role === 'MENTOR' ? user.mentor : user.mentee;
      const needsOnboarding = !role || !roleData?.currentRole || !roleData?.workplace;
      if (needsOnboarding) {
        log('Redirecting to /onboarding');
        navigate('/onboarding');
      } else {
        const dashboardPath = role === 'MENTOR' ? '/mentor/dashboard' : '/dashboard';
        log(`Redirecting to ${dashboardPath}`);
        navigate(dashboardPath);
      }
    } catch (err: any) {
      // If login fails due to user not existing, try to register
      if (err.message?.includes('User not found') || err.message?.includes('Invalid credentials')) {
        try {
          // Register new user with default role as mentee (will be changed in onboarding)
          await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ 
              email, 
              password, 
              name: email.split('@')[0], // Use email prefix as default name
              role: 'mentee' // Default role, will be updated in onboarding
            }),
            credentials: 'include'
          });
          
          // Login with the same credentials after registration
          const user = await login({ email, password });
          
          if (!user) {
            throw new Error('Registration successful but login failed');
          }
          
          log('Registration and login successful', { userId: user.id });
          
          toast({
            title: 'Welcome to Intellectify!',
            description: 'Let\'s set up your profile.',
          });
          navigate('/onboarding');
        } catch (registerErr: any) {
          setError(registerErr.message || 'Failed to create account.');
        }
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-primary/30 via-neural-accent/25 to-neural-secondary/20 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neural-primary/10 via-transparent to-neural-accent/10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neural-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neural-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="flex flex-col items-center mb-8 relative z-10">
        <Zap className="w-10 h-10 text-neural-primary mb-2" />
        <h1 className="text-2xl font-bold text-neural-primary">Welcome to Intellectify</h1>
      </div>
      <Card className="mx-auto max-w-sm w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl relative z-10">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="ml-auto inline-block text-sm text-neural-primary/70 hover:underline hover:text-neural-accent">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-white/80 border-neural-accent/50 focus:border-neural-accent focus:ring-neural-accent rounded-lg"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neural-cream px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              <a href={`${process.env.NODE_ENV === 'production' ? 'https://mentorship-platform-tscc.onrender.com' : 'http://localhost:5000'}/api/auth/google`} className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 36.126 44 30.563 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                Google
              </a>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="mt-2">
              <Link to="/" className="text-gray-600 hover:underline">
                Back to Homepage
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage; 