import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { NeuralNetwork } from './NeuralNetwork';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

const topics = [
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Career Advice',
  'System Design',
  'Data Science',
  'DevOps',
  'Database Design',
  'Mobile Development',
];

const heroContent = {
  mentor: {
    subtext:
      'Share your expertise and help others grow. Offer personalized 1:1 sessions in your favorite topics, set your schedule, and make an impact.',
    cta: 'Become a Mentor',
  },
  mentee: {
    subtext:
      'Learn directly from experienced mentors. Discover, book, and review sessions in the topics you care about most.',
    cta: 'Find a Mentor',
  },
};

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mentor' | 'mentee'>('mentee');
  const [topicIndex, setTopicIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Typing animation effect
  useEffect(() => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    const currentTopic = topics[topicIndex];
    if (!deleting && charIndex < currentTopic.length) {
      typingTimeout.current = setTimeout(() => {
        setDisplayed(currentTopic.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 25);
    } else if (!deleting && charIndex === currentTopic.length) {
      typingTimeout.current = setTimeout(() => {
        setDeleting(true);
      }, 400);
    } else if (deleting && charIndex > 0) {
      typingTimeout.current = setTimeout(() => {
        setDisplayed(currentTopic.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 15);
    } else if (deleting && charIndex === 0) {
      typingTimeout.current = setTimeout(() => {
        setDeleting(false);
        setTopicIndex((i) => (i + 1) % topics.length);
      }, 100);
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [charIndex, deleting, topicIndex]);

  // Reset charIndex when topicIndex changes (no infinite loop)
  useEffect(() => {
    setCharIndex(0);
    setDisplayed('');
    setDeleting(false);
    // Only run when topicIndex changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-neural-primary via-neural-accent to-background pt-24 pb-16">
      {/* Tabs */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        <button
          className={`px-6 py-2 font-semibold border-b-4 transition-colors duration-200 focus:outline-none ${
            activeTab === 'mentee'
              ? 'border-neural-accent text-neural-accent'
              : 'border-transparent text-white hover:text-neural-accent'
          }`}
          onClick={() => setActiveTab('mentee')}
        >
          Mentee
        </button>
        <button
          className={`px-6 py-2 font-semibold border-b-4 transition-colors duration-200 focus:outline-none ${
            activeTab === 'mentor'
              ? 'border-neural-accent text-neural-accent'
              : 'border-transparent text-white hover:text-neural-accent'
          }`}
          onClick={() => setActiveTab('mentor')}
        >
          Mentor
        </button>
      </div>

      {/* Neural Network Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <NeuralNetwork />
      </div>

      {/* Subtle Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/10 z-10" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center mt-24">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] font-['Poppins']">
          1-on-1 <span
            className="inline-block font-extrabold text-2xl md:text-4xl lg:text-5xl tracking-tight align-middle"
            style={{
              color: '#00FFFF',
              letterSpacing: '0.04em',
              fontFamily: 'Poppins, Inter, sans-serif',
            }}
            aria-live="polite"
          >
            {displayed}
            <span className="inline-block animate-pulse">|</span>
          </span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] font-['Poppins']">
          Mentorship
        </h2>
        <p className="text-base md:text-xl font-medium text-black/60 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)] font-['Inter']">
          {heroContent[activeTab].subtext}
        </p>
        <div className="flex justify-center">
          <Button
            className="bg-gradient-to-r from-[#22675a] to-[#25e1d2] hover:from-[#2bbfae] hover:to-[#36d1c4] text-white px-20 py-6 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[64px] flex items-center gap-3"
            onClick={() => navigate(activeTab === 'mentor' ? '/mentors/apply' : '/mentors')}
            aria-label={heroContent[activeTab].cta}
          >
            {heroContent[activeTab].cta}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 neural-node animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-6 h-6 neural-node animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-5 h-5 neural-node animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-3 h-3 neural-node animate-float" style={{ animationDelay: '0.5s' }} />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neural-accent rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neural-accent rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};