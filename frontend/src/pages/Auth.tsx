// src/pages/Auth.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Zap, Mail } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login flow
        const response = await apiFetch<{ token: string; user: any }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        
        await login(response.token);
        
        // Check if user needs onboarding
        if (!response.user.currentRole || !response.user.bio) {
          toast({
            title: 'Welcome back!',
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
      } else {
        // Register flow
        const response = await apiFetch<{ token: string; user: any }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, role }),
        });
        
        await login(response.token);
        
        toast({
          title: 'Registration Successful',
          description: 'Let\'s set up your profile!',
        });
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center mb-8">
        <Zap className="w-12 h-12 text-indigo-600 mb-3" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isLogin ? 'Welcome back to Intellectify' : 'Join Intellectify'}
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          {isLogin 
            ? 'Sign in to continue your mentorship journey' 
            : 'Connect with mentors and mentees worldwide'
          }
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Fill in your details to get started'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <Label>I want to join as:</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'mentee' | 'mentor')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentee" id="mentee" />
                    <Label htmlFor="mentee" className="cursor-pointer">
                      Mentee - I want to learn and grow
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentor" id="mentor" />
                    <Label htmlFor="mentor" className="cursor-pointer">
                      Mentor - I want to guide and teach
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
