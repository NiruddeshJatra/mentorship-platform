import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Mail, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D5C63] text-gray-200 border-t border-teal-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Intellectify</h3>
            <p className="text-sm">
              Connecting ambitious minds with experienced mentors to accelerate growth and unlock potential.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mentors" className="hover:text-white">Find a Mentor</Link></li>
              <li><Link to="/mentors/apply" className="hover:text-white">Become a Mentor</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
            <p className="text-sm mb-4">Get updates on new mentors and platform features.</p>
            <form className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-l-md focus:ring-neural-accent focus:border-neural-accent"
                />
              <Button type="submit" className="bg-neural-accent text-white rounded-r-md hover:bg-neural-primary">
                Subscribe
                </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-teal-800 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Intellectify. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};