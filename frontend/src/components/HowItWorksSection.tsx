import React from 'react';
import { Card } from '@/components/ui/card';
import { Search, Calendar, Rocket, Share2, Users, TrendingUp } from 'lucide-react';

const menteeSteps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse expert mentors by skill, industry, and experience level",
    detail: "Use our smart matching algorithm to find mentors who align with your goals"
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Schedule 1:1 sessions that fit your timeline and learning pace", 
    detail: "Flexible scheduling with instant booking confirmation"
  },
  {
    icon: Rocket,
    title: "Learn & Grow",
    description: "Transform your skills through personalized guidance and feedback",
    detail: "Track your progress and celebrate milestones along your journey"
  }
];

const mentorSteps = [
  {
    icon: Share2,
    title: "Share",
    description: "Create your mentor profile and showcase your expertise",
    detail: "Highlight your skills, experience, and teaching approach"
  },
  {
    icon: Users,
    title: "Connect",
    description: "Get matched with motivated mentees seeking your guidance",
    detail: "Our platform connects you with learners who value your knowledge"
  },
  {
    icon: TrendingUp,
    title: "Impact & Earn",
    description: "Make a difference while building your network and income",
    detail: "Earn competitive rates while helping others achieve their goals"
  }
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-neural-cream via-background to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neural-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-neural-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground font-['Poppins'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto font-['Inter']">
            Join a growing network where knowledge flows freely and careers flourish through meaningful connections
          </p>
        </div>

        {/* For Mentees */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-neural-accent">For Mentees</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {menteeSteps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < menteeSteps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neural-accent via-neural-primary to-transparent opacity-30" />
                )}
                
                <Card className="growth-card text-center p-8 h-full">
                  {/* Growth Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-neural-accent to-neural-primary flex items-center justify-center organic-shape">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-neural-growth rounded-full flex items-center justify-center text-sm font-bold text-neural-dark">
                      {index + 1}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold mb-4 text-neural-accent">{step.title}</h4>
                  <p className="text-foreground mb-4 text-lg">{step.description}</p>
                  <p className="text-muted-foreground text-sm">{step.detail}</p>

                  {/* Growth Animation */}
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 bg-neural-growth rounded-full transition-all duration-1000 group-hover:bg-neural-accent`}
                          style={{
                            height: `${(i + 1) * 8}px`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* For Mentors */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12 text-neural-primary">For Mentors</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {mentorSteps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < mentorSteps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neural-primary via-neural-secondary to-transparent opacity-30" />
                )}
                
                <Card className="growth-card text-center p-8 h-full">
                  {/* Growth Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-neural-primary to-neural-secondary flex items-center justify-center organic-shape">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-neural-highlight rounded-full flex items-center justify-center text-sm font-bold text-neural-dark">
                      {index + 1}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold mb-4 text-neural-primary">{step.title}</h4>
                  <p className="text-foreground mb-4 text-lg">{step.description}</p>
                  <p className="text-muted-foreground text-sm">{step.detail}</p>

                  {/* Network Animation */}
                  <div className="mt-6 flex justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-neural-primary rounded-full opacity-40 group-hover:opacity-100 transition-all duration-500"
                          style={{
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Central Connection Visual */}
        <div className="flex justify-center mt-16">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neural-accent via-neural-primary to-neural-secondary animate-pulse-neural flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white" />
              </div>
            </div>
            {/* Connecting lines to both sections */}
            <div className="absolute -top-32 left-1/2 w-0.5 h-32 bg-gradient-to-t from-neural-accent to-transparent transform -translate-x-1/2" />
            <div className="absolute -bottom-32 left-1/2 w-0.5 h-32 bg-gradient-to-b from-neural-primary to-transparent transform -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
};