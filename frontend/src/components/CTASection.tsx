import React from 'react';
import { Button } from '@/components/ui/Button';
import { NeuralNetwork } from './NeuralNetwork';
import { ArrowRight, Sparkles, Users, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-neural-cream to-white relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-30">
        <NeuralNetwork />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-neural-primary/20 via-transparent to-neural-accent/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-neural-dark/50 via-transparent to-neural-dark/50" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground font-['Poppins'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto font-['Inter']">
            Join thousands of professionals already accelerating their careers through expert mentorship. Your next breakthrough is just one conversation away.
          </p>
        </div>
        {/* Main CTA Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neural-accent/20 border border-neural-accent/30 mb-8 animate-grow-in">
            <Sparkles className="w-5 h-5 text-neural-accent" />
            <span className="text-neural-accent font-semibold text-lg">Join the Network</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button asChild className="cta-button group text-xl px-12 py-6">
              <Link to="/mentors" aria-label="Start Your Journey">
                <Rocket className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="relative px-12 py-6 text-xl font-semibold rounded-2xl border-2 border-neural-primary text-neural-primary hover:bg-transparent hover:text-neural-primary transition-all duration-300 group overflow-visible"
            >
              <Link to="/mentors/apply" aria-label="Become a Mentor" className="relative flex items-center">
                <Users className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Become a Mentor</span>
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-neural-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-border/20 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-neural-accent mb-2">10k+</div>
              <div className="text-muted-foreground text-sm">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neural-growth mb-2">500+</div>
              <div className="text-muted-foreground text-sm">Expert Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neural-secondary mb-2">50k+</div>
              <div className="text-muted-foreground text-sm">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neural-primary mb-2">4.9★</div>
              <div className="text-muted-foreground text-sm">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-neural-primary/10 to-neural-accent/10 border border-neural-accent/20">
          <p className="text-lg text-foreground mb-4">
            <strong>Limited Time:</strong> Join now and get your first mentorship session at 50% off
          </p>
          <p className="text-muted-foreground">
            Be part of a community that's redefining professional growth. Your future self will thank you.
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-6 h-6 neural-node animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-4 h-4 neural-node animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 left-20 w-5 h-5 neural-node animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-20 right-10 w-3 h-3 neural-node animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
};