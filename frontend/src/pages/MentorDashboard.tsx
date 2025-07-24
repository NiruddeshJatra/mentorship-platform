import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Star, 
  MessageSquare, 
  Settings,
  ArrowRight,
  Plus,
  BookOpen,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingSessions] = useState([
    {
      id: 1,
      menteeName: 'Alex Johnson',
      menteeAvatar: '',
      topic: 'React Development',
      date: '2024-01-25',
      time: '2:00 PM',
      duration: '60 min',
      type: 'Video Call'
    },
    {
      id: 2,
      menteeName: 'Sarah Chen',
      menteeAvatar: '',
      topic: 'System Design',
      date: '2024-01-26',
      time: '10:00 AM',
      duration: '90 min',
      type: 'Video Call'
    }
  ]);
  
  const [recentMentees] = useState([
    {
      id: 1,
      name: 'David Wilson',
      avatar: '',
      goal: 'Full Stack Development',
      sessionsCompleted: 8,
      lastSession: '2 days ago'
    },
    {
      id: 2,
      name: 'Emma Davis',
      avatar: '',
      goal: 'Career Transition',
      sessionsCompleted: 5,
      lastSession: '1 week ago'
    },
    {
      id: 3,
      name: 'Michael Brown',
      avatar: '',
      goal: 'System Design',
      sessionsCompleted: 12,
      lastSession: '3 days ago'
    }
  ]);

  const [stats] = useState({
    totalMentees: 24,
    totalSessions: 156,
    monthlyEarnings: 2400,
    averageRating: 4.9,
    hoursThisMonth: 48,
    responseRate: 98
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-primary/30 via-neural-accent/25 to-neural-secondary/20 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neural-primary/10 via-transparent to-neural-accent/10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-neural-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-neural-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 ring-4 ring-white shadow-neural">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-gradient-cta text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-neural-primary">Welcome back, {user?.name}! 🌟</h1>
              <p className="text-neural-primary/70 mt-1">Ready to inspire and guide your mentees?</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-neural">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-neural-accent/20 rounded-full mx-auto mb-2">
                <Users className="w-6 h-6 text-neural-primary" />
              </div>
              <div className="text-2xl font-bold text-neural-primary">{stats.totalMentees}</div>
              <div className="text-sm text-neural-primary/70">Total Mentees</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-neural">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-neural-growth/20 rounded-full mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-neural-primary" />
              </div>
              <div className="text-2xl font-bold text-neural-primary">{stats.totalSessions}</div>
              <div className="text-sm text-neural-primary/70">Total Sessions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-neural">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-neural-secondary/20 rounded-full mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-neural-primary" />
              </div>
              <div className="text-2xl font-bold text-neural-primary">${stats.monthlyEarnings}</div>
              <div className="text-sm text-neural-primary/70">This Month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-neural">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-neural-highlight/20 rounded-full mx-auto mb-2">
                <Star className="w-6 h-6 text-neural-primary" />
              </div>
              <div className="text-2xl font-bold text-neural-primary">{stats.averageRating}</div>
              <div className="text-sm text-neural-primary/70">Avg Rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-neural">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-neural-accent/20 rounded-full mx-auto mb-2">
                <Clock className="w-6 h-6 text-neural-primary" />
              </div>
              <div className="text-2xl font-bold text-neural-primary">{stats.hoursThisMonth}</div>
              <div className="text-sm text-neural-primary/70">Hours</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-neural">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-neural-secondary/20 rounded-full mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-neural-primary" />
              </div>
              <div className="text-2xl font-bold text-neural-primary">{stats.responseRate}%</div>
              <div className="text-sm text-neural-primary/70">Response Rate</div>
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
                    <Calendar className="w-5 h-5 text-green-600" />
                    Upcoming Sessions
                  </CardTitle>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Settings className="w-4 h-4 mr-1" />
                    Manage Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={session.menteeAvatar} />
                            <AvatarFallback className="bg-green-500 text-white">
                              {session.menteeName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-800">{session.menteeName}</h4>
                            <p className="text-sm text-gray-600">{session.topic}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{session.date}</span>
                              <span>{session.time}</span>
                              <span>{session.duration}</span>
                              <Badge variant="outline" className="text-xs">{session.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Start Session
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Set Your Availability
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Mentees */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Your Mentees
                  </CardTitle>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/mentees">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentMentees.slice(0, 4).map((mentee) => (
                    <div key={mentee.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={mentee.avatar} />
                          <AvatarFallback className="bg-blue-500 text-white text-sm">
                            {mentee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{mentee.name}</h4>
                          <p className="text-xs text-gray-600">{mentee.goal}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{mentee.sessionsCompleted} sessions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{mentee.lastSession}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Message
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
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700" asChild>
                  <Link to="/schedule">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Schedule
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/mentees">
                    <Users className="w-4 h-4 mr-2" />
                    View All Mentees
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/earnings">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Earnings & Analytics
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/profile/mentor">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Sessions Completed</span>
                    </div>
                    <span className="font-semibold text-gray-800">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">New Mentees</span>
                    </div>
                    <span className="font-semibold text-gray-800">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Avg Session Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-800">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Response Time</span>
                    </div>
                    <span className="font-semibold text-gray-800">&lt; 2h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Top Mentor</h3>
                <p className="text-sm text-gray-600 mb-4">You're in the top 10% of mentors this month!</p>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  🏆 Excellence Award
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;