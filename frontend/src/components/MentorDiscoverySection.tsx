import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star } from 'lucide-react';

// Example mentor data (replace with real data/fetch in future)
const mentors = [
  {
    name: 'Ava Patel',
    title: 'Senior Frontend Engineer',
    expertise: ['React', 'JavaScript', 'UI/UX'],
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: '10+ years building scalable web apps. Loves teaching and design systems.'
  },
  {
    name: 'Liam Chen',
    title: 'DevOps Lead',
    expertise: ['DevOps', 'AWS', 'CI/CD'],
    rating: 4.8,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Cloud automation and infrastructure expert. Mentors on career growth.'
  },
  {
    name: 'Sophia Kim',
    title: 'Data Scientist',
    expertise: ['Python', 'Data Science', 'ML'],
    rating: 5.0,
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Machine learning specialist. Passionate about making data accessible.'
  },
  {
    name: 'Noah Smith',
    title: 'Backend Architect',
    expertise: ['Node.js', 'System Design', 'APIs'],
    rating: 4.7,
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    bio: 'Architected high-traffic systems. Loves deep dives into backend tech.'
  }
];

export const MentorDiscoverySection: React.FC = () => {
  const [query, setQuery] = useState('');

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(query.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <section id="mentor-discovery" className="py-24 bg-gradient-to-b from-white via-neural-cream to-background relative overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground font-['Poppins'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
            Discover Expert Mentors
          </h2>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto font-['Inter']">
            Search, filter, and connect with top mentors in your field
          </p>
        </div>

        {/* Search Bar */}
        <form className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" role="search" aria-label="Mentor search">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search by name or skill..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg rounded-xl shadow-sm border border-border focus:ring-2 focus:ring-neural-accent"
              aria-label="Search mentors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
          <Button type="submit" className="px-8 py-3 rounded-xl text-lg font-semibold bg-neural-primary text-white hover:bg-neural-primary/90" tabIndex={-1}>
            Search
          </Button>
        </form>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredMentors.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground text-lg py-12">
              No mentors found. Try a different search.
            </div>
          ) : (
            filteredMentors.map((mentor, idx) => (
              <Card key={mentor.name} className="flex flex-col items-center p-8 growth-card h-full">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-neural-accent shadow-md"
                  loading="lazy"
                />
                <h3 className="text-xl font-bold text-foreground mb-1 font-['Poppins']">{mentor.name}</h3>
                <div className="text-neural-accent font-medium mb-2">{mentor.title}</div>
                <div className="flex flex-wrap gap-2 mb-3 justify-center">
                  {mentor.expertise.map((skill) => (
                    <span key={skill} className="bg-neural-accent/10 text-neural-accent px-3 py-1 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-neural-highlight fill-neural-highlight" />
                  <span className="text-sm font-semibold text-neural-highlight">{mentor.rating}</span>
                </div>
                <p className="text-muted-foreground text-center text-sm mb-4">{mentor.bio}</p>
                <Button className="w-full cta-button mt-auto" aria-label={`Book session with ${mentor.name}`}>
                  Book Session
                </Button>
              </Card>
            ))
          )}
        </div>
        {/* TODO: Replace grid with carousel for enhanced UX on mobile/desktop */}
      </div>
    </section>
  );
}; 