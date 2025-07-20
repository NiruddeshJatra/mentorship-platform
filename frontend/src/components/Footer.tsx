import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Twitter, Github, Mail, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neural-cream border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-neural-primary flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-neural-light animate-pulse" />
              </div>
              <span className="text-2xl font-bold text-neural-primary font-['Poppins']">
                Intellectify
              </span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Where knowledge blooms and careers grow. Connect with mentors who care about your success.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-background hover:bg-neural-primary hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-background hover:bg-neural-primary hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-background hover:bg-neural-primary hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neural-primary">Platform</h3>
            <div className="space-y-4">
              <Link to="/mentors" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg">
                Find a Mentor
              </Link>
              <Link to="/mentors/apply" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg">
                Become a Mentor
              </Link>
              <Link to="/how-it-works" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg">
                How It Works
              </Link>
              <Link to="/testimonials" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg" tabIndex={-1} aria-disabled>
                Success Stories
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neural-primary">Support</h3>
            <div className="space-y-4">
              <Link to="/help" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg" tabIndex={-1} aria-disabled>
                Help Center
              </Link>
              <Link to="/contact" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg">
                Contact Us
              </Link>
              <Link to="/privacy" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-foreground hover:text-neural-primary transition-colors duration-300 text-lg">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neural-primary">Stay Connected</h3>
            <p className="text-muted-foreground text-lg">
              Get weekly insights on mentorship and career growth.
            </p>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background border-border focus:border-neural-primary"
                />
                <Button className="bg-neural-primary hover:bg-neural-primary/90 text-primary-foreground px-4">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>We respect your privacy. Unsubscribe anytime.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>© 2024 Intellectify.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/security" className="hover:text-neural-primary transition-colors duration-300" tabIndex={-1} aria-disabled>
                Security
              </Link>
              <Link to="/accessibility" className="hover:text-neural-primary transition-colors duration-300" tabIndex={-1} aria-disabled>
                Accessibility
              </Link>
              <Link to="/status" className="hover:text-neural-primary transition-colors duration-300" tabIndex={-1} aria-disabled>
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};