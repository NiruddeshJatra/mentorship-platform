import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Search, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star, 
  Users, 
  Target,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MenteeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingSessions] = useState([
    {
      id: 1,
      mentorName: 'Sarah Johnson',
      mentorAvatar: '',
      topic: 'React Development',
      date: '2024-01-25',
      time: '2:00 PM',
      duration: '60 min'
    }
  ]);
  
  const [recentMentors] = useState([
    {
      id: 1,
      name: 'John Smith',
      avatar: '',
      expertise: 'Full Stack Development',
      rating: 4.9,
      sessions: 150
    },
    {
      id: 2,
      name: 'Emily Chen',
      avatar: '',
      expertise: 'Data Science',
      rating: 4.8,
      sessions: 89
    },
    {
      id: 3,
      name: 'Michael Brown',
      avatar: '',
      expertise: 'Product Management',
      rating: 4.9,
      sessions: 200
    }
  ]);

  const [stats] = useState({
    totalSessions: 12,
    hoursLearned: 18,
    skillsImproved: 5,
    currentStreak: 3
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
              <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.hoursLearned}</div>
              <div className="text-sm text-gray-600">Hours Learned</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.skillsImproved}</div>
              <div className="text-sm text-gray-600">Skills Improved</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Upcoming Sessions
                  </CardTitle>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Book Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={session.mentorAvatar} />
                            <AvatarFallback className="bg-indigo-500 text-white">
                              {session.mentorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-800">{session.mentorName}</h4>
                            <p className="text-sm text-gray-600">{session.topic}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{session.date}</span>
                              <span>{session.time}</span>
                              <span>{session.duration}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Join Session
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Book Your First Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor Exploration */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-600" />
                    Discover Mentors
                  </CardTitle>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/mentors">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentMentors.slice(0, 4).map((mentor) => (
                    <div key={mentor.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={mentor.avatar} />
                          <AvatarFallback className="bg-purple-500 text-white text-sm">
                            {mentor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{mentor.name}</h4>
                          <p className="text-xs text-gray-600">{mentor.expertise}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">{mentor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{mentor.sessions}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link to="/mentors">
                    <Search className="w-4 h-4 mr-2" />
                    Find Mentors
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/sessions">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Sessions
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/progress">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Learning Progress
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-gray-800">Master React Hooks</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-gray-800">System Design Basics</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Goal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;