// src/pages/Register.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Zap } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      toast({
        title: 'Registration Successful',
        description: 'You can now log in with your new account.',
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center mb-8">
        <Zap className="w-10 h-10 text-gray-700 mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
      </div>
      <Card className="mx-auto max-w-sm w-full shadow-2xl bg-neural-cream rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input
                  id="full-name"
                  placeholder="Max Robinson"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-white/80 border-teal-500/50 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                />
              </div>
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
                  className="bg-white/80 border-teal-500/50 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-white/80 border-teal-500/50 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label>I am a...</Label>
                <RadioGroup
                  defaultValue="mentee"
                  className="grid grid-cols-2 gap-4"
                  onValueChange={(value: 'mentee' | 'mentor') => setRole(value)}
                  disabled={loading}
                >
                  <div>
                    <RadioGroupItem value="mentee" id="mentee" className="peer sr-only" />
                    <Label
                      htmlFor="mentee"
                      className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-4 hover:bg-gray-100 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:text-teal-600 cursor-pointer"
                    >
                      Mentee
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="mentor" id="mentor" className="peer sr-only" />
                    <Label
                      htmlFor="mentor"
                      className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-4 hover:bg-gray-100 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:text-teal-600 cursor-pointer"
                    >
                      Mentor
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg" disabled={loading}>
                {loading ? 'Creating account...' : 'Create an Account'}
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neural-cream px-2 text-gray-500">Or sign up with</span>
                </div>
              </div>
              <a href="http://localhost:3000/api/auth/google" className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 36.126 44 30.563 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                Google
              </a>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-600 hover:underline">
                Sign in
              </Link>
            </p>
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

export default RegisterPage; 