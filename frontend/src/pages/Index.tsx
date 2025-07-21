import React, { useEffect, useRef } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { MentorDiscoverySection } from '@/components/MentorDiscoverySection';

const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add('fade-slide-in-visible');
          observer.unobserve(ref.current!);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="fade-slide-in">
      {children}
    </div>
  );
};

const IndexPage = () => {
  return (
    <>
      <AnimatedSection>
        <HeroSection />
      </AnimatedSection>
      <AnimatedSection>
        <MentorDiscoverySection />
      </AnimatedSection>
      <AnimatedSection>
        <HowItWorksSection />
      </AnimatedSection>
      <AnimatedSection>
        <BenefitsSection />
      </AnimatedSection>
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
    </>
  );
};

export default IndexPage;
