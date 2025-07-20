import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Meta",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "My mentor helped me transition from junior to senior engineer in just 8 months. The personalized guidance was invaluable.",
    achievement: "Promoted to Senior Engineer"
  },
  {
    name: "Marcus Rodriguez", 
    role: "Product Manager",
    company: "Stripe",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Intellectify connected me with a PM who had exactly the experience I needed. Now I'm leading a team of 12.",
    achievement: "Became Team Lead"
  },
  {
    name: "Emily Watson",
    role: "UX Designer", 
    company: "Airbnb",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The flexible scheduling made it possible to get mentorship while working full-time. Game changer for my career.",
    achievement: "Design System Lead"
  }
];

const companyLogos = [
  "Google", "Meta", "Apple", "Microsoft", "Netflix", "Stripe", "Airbnb", "Uber"
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-neural-cream via-background to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-32 left-20 w-40 h-40 bg-neural-primary rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-32 w-56 h-56 bg-neural-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground font-['Poppins'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
            What Our Members Say
          </h2>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto font-['Inter']">
            Real stories from real people—see how Intellectify has transformed careers and lives
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="growth-card group p-8 relative overflow-hidden"
            >
              {/* Quote Background */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-neural-accent" />
              </div>
              
              <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-neural-highlight text-neural-highlight" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg leading-relaxed text-foreground mb-6">
                  "{testimonial.text}"
                </blockquote>

                {/* Achievement Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neural-growth/20 border border-neural-growth/30 mb-6">
                  <div className="w-2 h-2 bg-neural-growth rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-neural-growth">{testimonial.achievement}</span>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-neural-accent/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neural-growth rounded-full border-2 border-neural-dark" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>

              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-neural-accent/5 via-transparent to-neural-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-muted-foreground mb-12">
            Mentors from top companies worldwide
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center">
            {companyLogos.map((company, index) => (
              <div 
                key={index}
                className="group flex items-center justify-center h-16 px-4 rounded-lg bg-card/50 border border-border/50 hover:border-neural-accent/50 transition-all duration-300"
              >
                <span className="text-lg font-semibold text-muted-foreground group-hover:text-neural-accent transition-colors">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center">
          <div className="group">
            <div className="text-4xl font-bold text-neural-accent mb-2 group-hover:scale-110 transition-transform">98%</div>
            <div className="text-muted-foreground">Would Recommend</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-neural-growth mb-2 group-hover:scale-110 transition-transform">4.9</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-neural-secondary mb-2 group-hover:scale-110 transition-transform">72%</div>
            <div className="text-muted-foreground">Career Advancement</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-neural-primary mb-2 group-hover:scale-110 transition-transform">3x</div>
            <div className="text-muted-foreground">Faster Growth</div>
          </div>
        </div>
      </div>
    </section>
  );
};