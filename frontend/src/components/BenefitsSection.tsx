import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Target, DollarSign, Network, Shield, Star, Zap, Trophy, Users, Lightbulb } from 'lucide-react';

const menteebenefits = [
  {
    icon: Target,
    title: "Expert Matching",
    description: "Get paired with mentors who have walked your path and achieved your goals",
    color: "neural-accent"
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book sessions that work with your schedule, from early morning to late evening",
    color: "neural-growth"
  },
  {
    icon: Zap,
    title: "Accelerated Learning",
    description: "Skip years of trial and error with proven strategies from industry veterans",
    color: "neural-secondary"
  },
  {
    icon: Trophy,
    title: "Measurable Progress",
    description: "Track your growth with milestone-based learning and progress metrics",
    color: "neural-primary"
  }
];

const mentorBenefits = [
  {
    icon: DollarSign,
    title: "Competitive Earnings",
    description: "Set your own rates and earn meaningful income sharing your expertise",
    color: "neural-highlight"
  },
  {
    icon: Network,
    title: "Expand Your Network",
    description: "Connect with ambitious professionals and build lasting relationships",
    color: "neural-accent"
  },
  {
    icon: Lightbulb,
    title: "Share Your Impact",
    description: "Make a real difference in someone's career journey and legacy",
    color: "neural-growth"
  },
  {
    icon: Star,
    title: "Build Authority",
    description: "Establish yourself as a thought leader and industry expert",
    color: "neural-primary"
  }
];

const platformFeatures = [
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Verified mentors, secure payments, and quality assurance on every session"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join exclusive networking events and workshops for our community"
  }
];

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-white via-neural-cream to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-neural-primary rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-neural-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neural-growth rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground font-['Poppins'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
            Why Choose Intellectify?
          </h2>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto font-['Inter']">
            Experience the power of personalized mentorship in a platform designed for real results
          </p>
        </div>

        {/* For Mentees Benefits */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-neural-accent">Accelerate Your Growth</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menteebenefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="growth-card group p-6 text-center relative overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${benefit.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon with organic shape */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-${benefit.color} to-${benefit.color}/70 flex items-center justify-center organic-shape`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  
                  {/* Growth indicator */}
                  <div className="mt-4 flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-${benefit.color} rounded-full transition-all duration-300 group-hover:bg-neural-accent`}
                        style={{
                          height: `${(i + 1) * 3 + 4}px`,
                          transitionDelay: `${i * 50}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* For Mentors Benefits */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-neural-primary">Share Your Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorBenefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="growth-card group p-6 text-center relative overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${benefit.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon with organic shape */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-${benefit.color} to-${benefit.color}/70 flex items-center justify-center organic-shape`}>
                    <benefit.icon className="w-8 h-8 text-neural-dark" />
                  </div>
                  
                  <h4 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  
                  {/* Network indicator */}
                  <div className="mt-4 flex justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 bg-${benefit.color} rounded-full opacity-40 group-hover:opacity-100 transition-all duration-300`}
                          style={{
                            transitionDelay: `${i * 30}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Central Trust Message */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-neural-primary/20 to-neural-accent/20 border border-neural-accent/30">
            <Shield className="w-6 h-6 text-neural-accent" />
            <span className="text-lg font-semibold text-foreground">Trusted by 10,000+ professionals worldwide</span>
            <Star className="w-6 h-6 text-neural-highlight" />
          </div>
        </div>
      </div>
    </section>
  );
};