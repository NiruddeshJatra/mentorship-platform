import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiFetch } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const mentee = user?.mentee || {};
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentRole: mentee.currentRole || '',
    learningGoals: mentee.learningGoals || '',
    bio: user?.bio || '',
    profileImageUrl: user?.profileImageUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    timezone: user?.timezone || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (form.password && form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }
    try {
      // Build update payload for mentee
      const payload: any = {
        name: form.name,
        bio: form.bio,
        profileImageUrl: form.profileImageUrl,
        linkedinUrl: form.linkedinUrl,
        portfolioUrl: form.portfolioUrl,
        timezone: form.timezone,
        mentee: {
          currentRole: form.currentRole,
          learningGoals: form.learningGoals,
        },
      };
      // Only send password if changed (handled by backend if supported)
      if (form.password) payload.password = form.password;
      const { user: updatedUser } = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }, true);
      setUser && setUser(updatedUser);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 pt-24 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <Input name="email" value={form.email} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Current Role</label>
              <Input name="currentRole" value={form.currentRole} onChange={handleChange} required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Learning Goals</label>
              <Textarea name="learningGoals" value={form.learningGoals} onChange={handleChange} required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Bio</label>
              <Textarea name="bio" value={form.bio} onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Profile Image URL</label>
              <Input name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold mb-1">LinkedIn URL</label>
              <Input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Portfolio URL</label>
              <Input name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Timezone</label>
              <Input name="timezone" value={form.timezone} onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password (min 8 chars)"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Profile updated!</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 