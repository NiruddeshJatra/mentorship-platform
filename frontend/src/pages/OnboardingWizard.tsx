import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, User, Briefcase, Building, FileText, Camera, Linkedin, Globe, Check } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  question: string;
  placeholder: string;
  type: 'radio' | 'input' | 'textarea' | 'url';
  required: boolean;
  options?: { value: string; label: string; description: string }[];
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'role',
    title: 'What is your role?',
    question: 'Are you a Mentor or a Mentee?',
    placeholder: '',
    type: 'radio',
    required: true,
    options: [
      { value: 'mentor', label: 'Mentor', description: 'I want to guide and mentor others.' },
      { value: 'mentee', label: 'Mentee', description: 'I want to learn and grow with a mentor.' },
    ],
    icon: <Briefcase />,
  },
  {
    id: 'currentRole',
    title: 'What is your current role?',
    question: 'What is your current job title or position?',
    placeholder: 'e.g. Software Engineer, Product Manager',
    type: 'input',
    required: true,
    icon: <User />,
  },
  {
    id: 'workplace',
    title: 'Where do you work?',
    question: 'What is the name of your company or organization?',
    placeholder: 'e.g. Google, Microsoft',
    type: 'input',
    required: true,
    icon: <Building />,
  },
  {
    id: 'bio',
    title: 'Tell us about yourself',
    question: 'Write a short bio about yourself.',
    placeholder: 'e.g. I am a software engineer with a passion for machine learning.',
    type: 'textarea',
    required: true,
    icon: <FileText />,
  },
  {
    id: 'profileImageUrl',
    title: 'Add a profile picture',
    question: 'Upload a profile picture or provide a URL.',
    placeholder: 'e.g. https://example.com/profile-picture.jpg',
    type: 'url',
    required: false,
    icon: <Camera />,
  },
  {
    id: 'linkedinUrl',
    title: 'Add your LinkedIn profile',
    question: 'Provide a link to your LinkedIn profile.',
    placeholder: 'e.g. https://linkedin.com/in/yourname',
    type: 'url',
    required: false,
    icon: <Linkedin />,
  },
  {
    id: 'portfolioUrl',
    title: 'Add your portfolio',
    question: 'Provide a link to your portfolio or website.',
    placeholder: 'e.g. https://yourportfolio.com',
    type: 'url',
    required: false,
    icon: <Globe />,
  },
];

const OnboardingWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    role: user?.role || '',
    currentRole: '',
    workplace: '',
    bio: '',
    profileImageUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLastStep = step === onboardingSteps.length - 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    setError(null);
    if (step === 0 && !['mentor', 'mentee'].includes(form.role.toLowerCase())) {
      setError('Please select Mentor or Mentee.');
      return;
    }
    if (step === 1 && !form.currentRole) {
      setError('Please enter your current role.');
      return;
    }
    if (step === 2 && !form.workplace) {
      setError('Please enter your workplace.');
      return;
    }
    if (step === 3 && !form.bio) {
      setError('Please enter your bio.');
      return;
    }
    if (isLastStep) {
      setLoading(true);
      try {
        // Build payload for backend - only include non-empty optional fields
        const payload: any = {
          role: form.role,
          currentRole: form.currentRole,
          workplace: form.workplace,
          bio: form.bio,
        };
        
        // Add optional fields only if they have values
        if (form.profileImageUrl && form.profileImageUrl.trim()) {
          payload.profileImageUrl = form.profileImageUrl;
        }
        if (form.linkedinUrl && form.linkedinUrl.trim()) {
          payload.linkedinUrl = form.linkedinUrl;
        }
        if (form.portfolioUrl && form.portfolioUrl.trim()) {
          payload.portfolioUrl = form.portfolioUrl;
        }
        
        await apiFetch('/auth/onboarding', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        navigate(form.role.toLowerCase() === 'mentor' ? '/mentor/dashboard' : '/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to complete onboarding.');
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  // Live profile preview
  const preview = {
    name: user?.name,
    role: form.role,
    currentRole: form.currentRole,
    workplace: form.workplace,
    bio: form.bio,
    profileImageUrl: form.profileImageUrl,
    linkedinUrl: form.linkedinUrl,
    portfolioUrl: form.portfolioUrl,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Modern Step Indicator */}
      <div className="max-w-4xl mx-auto mb-8 pt-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {onboardingSteps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index < step ? 'bg-indigo-600 border-indigo-600 text-white' :
                  index === step ? 'bg-white border-indigo-600 text-indigo-600' :
                  'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {index < step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                    index < step ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Step {step + 1} of {onboardingSteps.length}: {onboardingSteps[step].title}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left: Step Form */}
        <div className="flex-1">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  {onboardingSteps[step].icon}
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">{onboardingSteps[step].title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{onboardingSteps[step].question}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {step === 0 ? (
                <div className="space-y-4">
                  {onboardingSteps[step].options?.map((option) => (
                    <div
                      key={option.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        form.role === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setForm({ ...form, role: option.value })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          form.role === option.value
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {form.role === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : step === 3 ? (
                <div className="space-y-4">
                  <Textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder={onboardingSteps[step].placeholder}
                    rows={4}
                    className="resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500">Tell us about your background, interests, and what you hope to achieve.</p>
                </div>
              ) : step === 4 ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setForm({ ...form, profileImageUrl: e.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Click to upload profile picture</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                  </div>
                  {form.profileImageUrl && (
                    <div className="flex items-center justify-center">
                      <img
                        src={form.profileImageUrl}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    name={onboardingSteps[step].id}
                    value={form[onboardingSteps[step].id as keyof typeof form] || ''}
                    onChange={(e) => setForm({ ...form, [onboardingSteps[step].id]: e.target.value })}
                    placeholder={onboardingSteps[step].placeholder}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500">Example: {onboardingSteps[step].placeholder}</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 0}
                  className="px-6"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {isLastStep ? (
                  <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 px-8"
                  >
                    {loading ? 'Completing...' : 'Complete Profile'}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Profile Preview */}
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
                      {form.role && (
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-white ${
                          form.role === 'mentor' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}>
                          {form.role === 'mentor' ? 'M' : 'L'}
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
                    
                    {form.role && (
                      <Badge className={`px-2 py-1 text-xs font-medium ${
                        form.role === 'mentor' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                          : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                      }`}>
                        ✨ {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {form.bio && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-3 rounded-lg border border-gray-100">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-800 text-sm">
                        <FileText className="w-3 h-3 text-blue-600" />
                        About Me
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {form.bio}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  {(form.linkedinUrl || form.portfolioUrl) && (
                    <div>
                      <div className="flex gap-2">
                        {form.linkedinUrl && (
                          <a 
                            href={form.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs text-blue-700 border border-blue-200"
                          >
                            <Linkedin className="w-3 h-3" />
                            LinkedIn
                          </a>
                        )}
                        {form.portfolioUrl && (
                          <a 
                            href={form.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-xs text-purple-700 border border-purple-200"
                          >
                            <Globe className="w-3 h-3" />
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-xs text-gray-800 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                        Progress
                      </h4>
                      <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full">
                        {Math.round(((step + 1) / onboardingSteps.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/80 rounded-full h-2 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm" 
                        style={{ width: `${((step + 1) / onboardingSteps.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      {step + 1} of {onboardingSteps.length} steps
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard; 