'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Users, Home, Calendar, BookOpen, Gift, Bell, Settings, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { RelationshipTheme } from '@/components/ui/relationship-theme';
import { NotificationBell } from '@/components/ui/notification-bell';
import { QuickStats } from '@/components/ui/quick-stats';
import { ActivityCard } from '@/components/ui/activity-card';
import { MemoryCard } from '@/components/ui/memory-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageLoader } from '@/components/ui/page-loader';
import { showSuccessToast, showInfoToast } from '@/components/ui/toast-notifications';

interface User {
  id: string;
  name: string;
  email: string;
  relationshipType: 'lovers' | 'friends' | 'family';
  interests: string[];
  partnerId?: string;
  partnerName?: string;
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

interface Memory {
  id: string;
  caption: string;
  imageUrl: string;
  activityId?: string;
  createdBy: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load sample data
    loadSampleData();
    
    setTimeout(() => {
      setLoading(false);
      // Welcome toast for returning users
      if (parsedUser.name) {
        showSuccessToast(`Welcome back, ${parsedUser.name}!`, "Ready to create more memories?");
      }
    }, 1000);
  }, [router]);

  const loadSampleData = () => {
    // Sample activities
    const sampleActivities: Activity[] = [
      {
        id: '1',
        title: 'Movie Night',
        description: 'Watch a romantic comedy together',
        status: 'pending',
        dueDate: '2024-01-15',
        createdBy: 'user1',
        createdAt: '2024-01-01T12:00:00Z'
      },
      {
        id: '2',
        title: 'Cooking Class',
        description: 'Learn to make pasta from scratch',
        status: 'completed',
        dueDate: '2024-01-10',
        createdBy: 'user1',
        createdAt: '2024-01-01T10:00:00Z'
      }
    ];

    // Sample memories
    const sampleMemories: Memory[] = [
      {
        id: '1',
        caption: 'First Date',
        imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdBy: 'user1',
        createdAt: '2023-12-01T18:00:00Z',
        likes: 12,
        comments: [
          { id: 'c1', text: 'So cute!', author: 'partner', timestamp: '2023-12-01T20:00:00Z' },
          { id: 'c2', text: 'Best night ever!', author: 'user1', timestamp: '2023-12-01T21:00:00Z' }
        ]
      },
      {
        id: '2',
        caption: 'Weekend Getaway',
        imageUrl: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdBy: 'user1',
        createdAt: '2023-12-15T18:00:00Z',
        likes: 8,
        comments: [
          { id: 'c3', text: 'Beautiful view!', author: 'partner', timestamp: '2023-12-15T20:00:00Z' }
        ]
      }
    ];

    setActivities(sampleActivities);
    setMemories(sampleMemories);
  };

  const getRelationshipEmoji = (type: string) => {
    switch (type) {
      case 'lovers': return '💕';
      case 'friends': return '👫';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '❤️';
    }
  };

  const getRelationshipLabel = (type: string) => {
    switch (type) {
      case 'lovers': return 'Lovers';
      case 'friends': return 'Friends';
      case 'family': return 'Family';
      default: return 'Connected';
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <>
      <RelationshipTheme relationshipType={user.relationshipType} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-foreground">MomentMingle</span>
                </div>
                <div className="hidden md:flex items-center space-x-1 bg-muted/50 rounded-full px-3 py-1">
                  <span className="text-lg">{getRelationshipEmoji(user.relationshipType)}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {getRelationshipLabel(user.relationshipType)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <ThemeToggle />
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-2 bg-muted/50 hover:bg-muted/70 rounded-full px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.name}! {getRelationshipEmoji(user.relationshipType)}
            </h1>
            <p className="text-muted-foreground">
              {user.partnerName 
                ? `Continue creating beautiful moments with ${user.partnerName}`
                : 'Ready to create some amazing memories?'
              }
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStats 
            relationshipType={user.relationshipType}
            activitiesCount={activities.length}
            memoriesCount={memories.length}
            partnerName={user.partnerName}
            connectionStatus={user.partnerName ? 'connected' : 'not-connected'}
            totalLikes={memories.reduce((acc, m) => acc + m.likes, 0)}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => router.push('/activities/new')}
              className="group bg-card hover:bg-card/80 border border-border rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">New Activity</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/memories/new')}
              className="group bg-card hover:bg-card/80 border border-border rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Add Memory</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/memory-jar/new')}
              className="group bg-card hover:bg-card/80 border border-border rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Memory Jar</span>
              </div>
            </button>

            <button
              onClick={() => router.push('/activities')}
              className="group bg-card hover:bg-card/80 border border-border rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">View All</span>
              </div>
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Activities</h2>
                <button
                  onClick={() => router.push('/activities')}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {activities.slice(0, 3).map((activity, index) => (
                  <div
                    key={activity.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-in slide-in-from-left duration-500"
                  >
                    <ActivityCard 
                      activity={activity} 
                      userName={user.name}
                      onStatusChange={() => {}}
                    />
                  </div>
                ))}
                
                {activities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activities yet. Create your first one!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Memories */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Memories</h2>
                <button
                  onClick={() => router.push('/memories')}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {memories.slice(0, 3).map((memory, index) => (
                  <div
                    key={memory.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-in slide-in-from-right duration-500"
                  >
                    <MemoryCard 
                      memory={memory} 
                      userName={user.name}
                      onLike={() => {}}
                    />
                  </div>
                ))}
                
                {memories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No memories yet. Start capturing moments!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}