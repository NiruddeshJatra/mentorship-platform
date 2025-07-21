import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MenteeDashboard: React.FC = () => {
  const { user } = useAuth();

  // Simulate profile completeness check (replace with real data fetch later)
  // For demo, assume profile is incomplete if user.currentRole or user.learningGoals is missing
  // In real app, fetch full mentee profile from backend
  const profileIncomplete = !user?.currentRole || !user?.learningGoals;

  return (
    <div className="container mx-auto px-6 py-16 pt-24">
      <h1 className="text-3xl font-bold mb-8">Mentee Dashboard</h1>
      {profileIncomplete && (
        <Card className="mb-8 border-2 border-yellow-400 bg-yellow-50">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-yellow-800">To get the most out of Intellectify, please complete your profile.</p>
            <Button variant="outline">Complete Profile</Button>
          </CardContent>
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><span className="font-semibold">Name:</span> {user?.name}</div>
              <div><span className="font-semibold">Email:</span> {user?.email}</div>
              <div><span className="font-semibold">Role:</span> Mentee</div>
            </div>
          </CardContent>
        </Card>
        {/* Bookings Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your upcoming and past bookings will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenteeDashboard; 