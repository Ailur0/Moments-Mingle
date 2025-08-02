'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityCard } from "@/components/ui/activity-card";
import { PageLoader } from "@/components/ui/page-loader";
import { ActivityLoadingCard } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { RelationshipTheme } from "@/components/ui/relationship-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, ArrowLeft, Plus, Calendar, Clock, CheckCircle, Circle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { showActivityToast } from "@/components/ui/toast-notifications";

interface User {
  id: string;
  name: string;
  email: string;
  pairingCode: string;
  pairedWith: string | null;
  createdAt: string;
  interests?: string[];
  relationshipType?: 'lovers' | 'friends' | 'family';
}

interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdBy: string;
  createdAt: string;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Simulate loading activities
    setTimeout(() => {
      const sampleActivities: Activity[] = [
        {
          id: '1',
          title: 'Weekend Getaway',
          description: 'Plan a romantic weekend trip to the mountains. Research cozy cabins, hiking trails, and local restaurants.',
          status: 'pending',
          dueDate: '2025-02-15',
          createdBy: parsedUser.id,
          createdAt: '2025-01-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'Cooking Class',
          description: 'Learn to make homemade pasta together. Book a class at the local culinary school.',
          status: 'in-progress',
          dueDate: '2025-01-25',
          createdBy: parsedUser.id,
          createdAt: '2025-01-08T15:30:00Z'
        },
        {
          id: '3',
          title: 'Home Movie Night',
          description: 'Set up a cozy movie night with blankets, popcorn, and our favorite films.',
          status: 'completed',
          dueDate: '2025-01-12',
          createdBy: parsedUser.id,
          createdAt: '2025-01-05T20:00:00Z'
        },
        {
          id: '4',
          title: 'Visit Art Museum',
          description: 'Explore the new exhibition at the modern art museum downtown.',
          status: 'pending',
          dueDate: '2025-02-01',
          createdBy: parsedUser.id,
          createdAt: '2025-01-11T14:20:00Z'
        },
        {
          id: '5',
          title: 'Sunrise Hike',
          description: 'Wake up early to catch the sunrise from the hilltop trail.',
          status: 'in-progress',
          dueDate: '2025-01-20',
          createdBy: parsedUser.id,
          createdAt: '2025-01-09T08:15:00Z'
        }
      ];
      setActivities(sampleActivities);
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const toggleActivityStatus = (activityId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        let newStatus: 'pending' | 'in-progress' | 'completed';
        let message = '';
        switch (activity.status) {
          case 'pending':
            newStatus = 'in-progress';
            message = 'Activity started! 🚀';
            break;
          case 'in-progress':
            newStatus = 'completed';
            message = 'Activity completed! 🎉';
            break;
          default:
            newStatus = 'pending';
            message = 'Activity reset to pending';
            break;
        }
        showActivityToast(message, `"${activity.title}" status updated`);
        return { ...activity, status: newStatus };
      }
      return activity;
    }));
  };

  if (!user) {
    return <PageLoader />;
  }

  const pendingActivities = activities.filter(a => a.status === 'pending');
  const inProgressActivities = activities.filter(a => a.status === 'in-progress');
  const completedActivities = activities.filter(a => a.status === 'completed');

  return (
    <>
      <RelationshipTheme relationshipType={user.relationshipType} />
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">MomentMingle</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/activities/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Your Activities</h1>
          <p className="text-xl text-muted-foreground">
            Plan, track, and complete activities together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Circle className="h-5 w-5 mr-2 text-gray-400" />
                  Pending ({pendingActivities.length})
                </CardTitle>
                <CardDescription>Activities waiting to be started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <ActivityLoadingCard />
                    <ActivityLoadingCard />
                  </>
                ) : pendingActivities.length > 0 ? (
                  pendingActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ActivityCard
                        activity={activity}
                        onStatusChange={toggleActivityStatus}
                        userName={user.name}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Circle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No pending activities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* In Progress Activities */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlayCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  In Progress ({inProgressActivities.length})
                </CardTitle>
                <CardDescription>Activities you're currently working on</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <ActivityLoadingCard />
                  </>
                ) : inProgressActivities.length > 0 ? (
                  inProgressActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ActivityCard
                        activity={activity}
                        onStatusChange={toggleActivityStatus}
                        userName={user.name}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <PlayCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No activities in progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Completed Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Completed ({completedActivities.length})
                </CardTitle>
                <CardDescription>Activities you've finished together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <ActivityLoadingCard />
                  </>
                ) : completedActivities.length > 0 ? (
                  completedActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <ActivityCard
                        activity={activity}
                        onStatusChange={toggleActivityStatus}
                        userName={user.name}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No completed activities yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
    </>
  );
}