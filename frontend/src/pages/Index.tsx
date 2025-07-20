import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
