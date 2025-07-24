import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, LogOut, MapPin, Briefcase, Link, Globe, Mail } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get role-specific data based on user's actual role
  const roleData = user?.role?.toLowerCase() === 'mentor' ? user?.mentor : user?.mentee;
  
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentRole: roleData?.currentRole || '',
    workplace: roleData?.workplace || '',
    bio: user?.bio || '',
    profileImageUrl: user?.profileImageUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    timezone: user?.timezone || '',
  });
  
  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      const currentRoleData = user.role?.toLowerCase() === 'mentor' ? user.mentor : user.mentee;
      setForm({
        name: user.name || '',
        email: user.email || '',
        currentRole: currentRoleData?.currentRole || '',
        workplace: currentRoleData?.workplace || '',
        bio: user.bio || '',
        profileImageUrl: user.profileImageUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        timezone: user.timezone || '',
      });
    }
  }, [user]);
  
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
    
    try {
      const payload: any = {
        name: form.name,
        currentRole: form.currentRole,
        workplace: form.workplace,
        bio: form.bio,
      };
      
      // Add optional fields only if they have values
      if (form.profileImageUrl && form.profileImageUrl.trim()) {
        payload.profileImageUrl = form.profileImageUrl.trim();
      }
      if (form.linkedinUrl && form.linkedinUrl.trim()) {
        payload.linkedinUrl = form.linkedinUrl.trim();
      }
      if (form.portfolioUrl && form.portfolioUrl.trim()) {
        payload.portfolioUrl = form.portfolioUrl.trim();
      }
      if (form.timezone && form.timezone.trim()) {
        payload.timezone = form.timezone.trim();
      }
      
      const response = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }, true) as { user: any };
      
      if (response?.user && setUser) {
        setUser(response.user);
      }
      setSuccess(true);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-primary/30 via-neural-accent/25 to-neural-secondary/20 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neural-primary/10 via-transparent to-neural-accent/10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-neural-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-neural-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto pt-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neural-primary mb-2">Profile</h1>
          <p className="text-neural-primary/70">Manage your profile information and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Profile Preview */}
          <div className="flex-1">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm sticky top-8 overflow-hidden">
              <div className="relative">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
                
                <CardHeader className="relative pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    Profile Preview
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="text-center">
                      <div className="relative inline-block mb-3">
                        {form.profileImageUrl ? (
                          <img 
                            src={form.profileImageUrl} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-xl ring-2 ring-indigo-100"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl ring-2 ring-indigo-100">
                            <User className="w-10 h-10 text-white" />
                          </div>
                        )}
                        {user?.role && (
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-white ${
                            user.role.toLowerCase() === 'mentor' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}>
                            {user.role.toLowerCase() === 'mentor' ? 'M' : 'L'}
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {user?.name || 'Your Name'}
                      </h3>
                      
                      {/* Role and Workplace combined */}
                      {(form.currentRole || form.workplace) && (
                        <div className="mb-3">
                          <p className="text-gray-600 text-sm font-medium">
                            {form.currentRole && form.workplace 
                              ? `${form.currentRole} at ${form.workplace}`
                              : form.currentRole || form.workplace
                            }
                          </p>
                        </div>
                      )}
                      
                      {user?.role && (
                        <Badge className={`px-2 py-1 text-xs font-medium ${
                          user.role?.toLowerCase() === 'mentor' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                            : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                        }`}>
                          ✨ {user.role?.toLowerCase() === 'mentor' ? 'Mentor' : 'Mentee'}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Bio */}
                    {form.bio && (
                      <div className="text-center">
                        <p className="text-gray-600 text-sm leading-relaxed">{form.bio}</p>
                      </div>
                    )}
                    
                    {/* Links */}
                    <div className="space-y-2">
                      {form.linkedinUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Link className="w-4 h-4" />
                          <span>LinkedIn Profile</span>
                        </div>
                      )}
                      {form.portfolioUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span>Portfolio</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4">
                      <Button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
          
          {/* Right: Profile Details/Edit Form */}
          <div className="flex-1">
            <Card className="shadow-neural border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-neural-primary flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit3 className="w-6 h-6" />
                      Edit Profile
                    </>
                  ) : (
                    <>
                      <User className="w-6 h-6" />
                      Profile Details
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 text-neural-primary">Name</label>
                        <Input 
                          name="name" 
                          value={form.name} 
                          onChange={handleChange} 
                          required 
                          className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-neural-primary">Email</label>
                        <Input 
                          name="email" 
                          value={form.email} 
                          readOnly 
                          className="bg-neural-primary/10 cursor-not-allowed border-neural-primary/30"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 text-neural-primary">Current Role</label>
                        <Input 
                          name="currentRole" 
                          value={form.currentRole} 
                          onChange={handleChange} 
                          required 
                          className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-neural-primary">Workplace</label>
                        <Input 
                          name="workplace" 
                          value={form.workplace} 
                          onChange={handleChange} 
                          className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-semibold mb-1 text-neural-primary">Bio</label>
                      <Textarea 
                        name="bio" 
                        value={form.bio} 
                        onChange={handleChange} 
                        rows={3}
                        className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-semibold mb-1 text-neural-primary">Profile Image URL</label>
                      <Input 
                        name="profileImageUrl" 
                        value={form.profileImageUrl} 
                        onChange={handleChange} 
                        className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 text-neural-primary">LinkedIn URL</label>
                        <Input 
                          name="linkedinUrl" 
                          value={form.linkedinUrl} 
                          onChange={handleChange} 
                          className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-neural-primary">Portfolio URL</label>
                        <Input 
                          name="portfolioUrl" 
                          value={form.portfolioUrl} 
                          onChange={handleChange} 
                          className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-semibold mb-1 text-neural-primary">Timezone</label>
                      <Input 
                        name="timezone" 
                        value={form.timezone} 
                        onChange={handleChange} 
                        className="bg-white/80 border-neural-accent/50 focus:border-neural-accent"
                      />
                    </div>
                    
                    {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
                    {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">Profile updated successfully!</div>}
                    
                    <Button type="submit" className="w-full bg-gradient-cta hover:opacity-90 text-white" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neural-primary font-semibold">
                          <User className="w-4 h-4" />
                          <span>Name</span>
                        </div>
                        <p className="text-neural-primary/80 ml-6">{user?.name || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neural-primary font-semibold">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </div>
                        <p className="text-neural-primary/80 ml-6">{user?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neural-primary font-semibold">
                          <Briefcase className="w-4 h-4" />
                          <span>Current Role</span>
                        </div>
                        <p className="text-neural-primary/80 ml-6">{form.currentRole || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neural-primary font-semibold">
                          <MapPin className="w-4 h-4" />
                          <span>Workplace</span>
                        </div>
                        <p className="text-neural-primary/80 ml-6">{form.workplace || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    {form.bio && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neural-primary font-semibold">
                          <User className="w-4 h-4" />
                          <span>Bio</span>
                        </div>
                        <p className="text-neural-primary/80 ml-6">{form.bio}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {form.linkedinUrl && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-neural-primary font-semibold">
                            <Link className="w-4 h-4" />
                            <span>LinkedIn</span>
                          </div>
                          <a href={form.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 ml-6 text-sm">
                            {form.linkedinUrl}
                          </a>
                        </div>
                      )}
                      {form.portfolioUrl && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-neural-primary font-semibold">
                            <Globe className="w-4 h-4" />
                            <span>Portfolio</span>
                          </div>
                          <a href={form.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 ml-6 text-sm">
                            {form.portfolioUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 