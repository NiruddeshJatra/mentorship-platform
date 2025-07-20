import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { MentorDiscoverySection } from '@/components/MentorDiscoverySection';

// Lazy placeholder pages
const Login = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Login Page (TODO)</div> }));
const Register = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Register Page (TODO)</div> }));
const Mentors = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Mentors List (TODO)</div> }));
const MentorApply = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Mentor Application (TODO)</div> }));
const MentorProfile = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Mentor Profile (TODO)</div> }));
const HowItWorks = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">How It Works (TODO)</div> }));
const Privacy = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Privacy Policy (TODO)</div> }));
const Terms = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Terms of Service (TODO)</div> }));
const Contact = lazy(() => Promise.resolve({ default: () => <div className="min-h-[60vh] flex items-center justify-center text-3xl">Contact (TODO)</div> }));

// Custom hook for scroll animation (fixed infinite loop)
function useScrollFadeIn(ref) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let hasAnimated = false;
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          node.classList.add('fade-slide-in');
          hasAnimated = true;
          observer.unobserve(node);
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
}

function SectionWrapper({ children }) {
  const ref = React.useRef(null);
  useScrollFadeIn(ref);
  return <div ref={ref} className="opacity-0 translate-y-10 transition-all duration-700">{children}</div>;
}

function HomePage() {
  return (
    <>
      <SectionWrapper><HeroSection /></SectionWrapper>
      <SectionWrapper><MentorDiscoverySection /></SectionWrapper>
      <SectionWrapper><HowItWorksSection /></SectionWrapper>
      <SectionWrapper><BenefitsSection /></SectionWrapper>
      <SectionWrapper><TestimonialsSection /></SectionWrapper>
      <SectionWrapper><CTASection /></SectionWrapper>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="flex flex-col gap-0">
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-2xl">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentors/apply" element={<MentorApply />} />
            <Route path="/mentor/:id" element={<MentorProfile />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
