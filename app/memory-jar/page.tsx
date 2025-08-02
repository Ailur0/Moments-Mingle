'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/ui/page-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { showSuccessToast, showErrorToast, showJarToast } from "@/components/ui/toast-notifications";
import { RelationshipTheme } from "@/components/ui/relationship-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, ArrowLeft, Plus, Clock, Gift, Lock, Unlock, Calendar, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  pairingCode: string;
  pairedWith: string | null;
  createdAt: string;
  relationshipType?: 'lovers' | 'friends' | 'family';
}

interface MemoryJarNote {
  id: string;
  title: string;
  message: string;
  deliveryDate: string;
  createdBy: string;
  createdAt: string;
  isDelivered: boolean;
  deliveredAt?: string;
  noteType: 'love' | 'memory' | 'future' | 'gratitude' | 'surprise';
  isRead: boolean;
}

export default function MemoryJarPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<MemoryJarNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Simulate loading notes
    setTimeout(() => {
      const sampleNotes: MemoryJarNote[] = [
        {
          id: '1',
          title: 'Our First Date Memory',
          message: 'Remember when we got caught in the rain on our first date? You laughed so hard and said it was perfect. I knew then that you were special. ❤️',
          deliveryDate: '2025-01-15',
          createdBy: parsedUser.id,
          createdAt: '2025-01-10T10:00:00Z',
          isDelivered: true,
          deliveredAt: '2025-01-15T09:00:00Z',
          noteType: 'memory',
          isRead: true
        },
        {
          id: '2',
          title: 'Future Adventure',
          message: 'By the time you read this, we should be planning our trip to Japan! I can\'t wait to explore Tokyo with you and try all the amazing food. 🍜✈️',
          deliveryDate: '2025-03-01',
          createdBy: parsedUser.id,
          createdAt: '2025-01-08T15:30:00Z',
          isDelivered: false,
          noteType: 'future',
          isRead: false
        },
        {
          id: '3',
          title: 'Daily Gratitude',
          message: 'Thank you for always making me coffee in the morning and for your patience when I\'m grumpy before I\'ve had it. The little things mean everything. ☕💕',
          deliveryDate: '2025-01-20',
          createdBy: parsedUser.id,
          createdAt: '2025-01-12T08:00:00Z',
          isDelivered: false,
          noteType: 'gratitude',
          isRead: false
        },
        {
          id: '4',
          title: 'Anniversary Surprise',
          message: 'Happy 6 month anniversary! I\'ve planned something special for us tonight. Check your email for the details. I love you more each day! 🎉💖',
          deliveryDate: '2025-02-14',
          createdBy: parsedUser.id,
          createdAt: '2025-01-05T20:00:00Z',
          isDelivered: false,
          noteType: 'surprise',
          isRead: false
        }
      ];
      setNotes(sampleNotes);
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'love': return '💕';
      case 'memory': return '📸';
      case 'future': return '🔮';
      case 'gratitude': return '🙏';
      case 'surprise': return '🎁';
      default: return '💌';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'love': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'memory': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'future': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gratitude': return 'bg-green-100 text-green-800 border-green-200';
      case 'surprise': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isRead: true } : note
    ));
    showJarToast("Note marked as read", "Thank you for reading this special message");
  };

  if (!user) {
    return <PageLoader />;
  }

  const deliveredNotes = notes.filter(note => note.isDelivered);
  const pendingNotes = notes.filter(note => !note.isDelivered);
  const unreadCount = deliveredNotes.filter(note => !note.isRead).length;

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
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {unreadCount} new
                </Badge>
              )}
              <ThemeToggle />
              <Link href="/memory-jar/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center pulse-glow">
              <Gift className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Memory Jar</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create digital time capsules for your special someone. Write heartfelt notes, 
            set future delivery dates, and surprise each other with meaningful messages.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="delivered" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="delivered" className="flex items-center">
                <Unlock className="h-4 w-4 mr-2" />
                Delivered Notes ({deliveredNotes.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Pending Notes ({pendingNotes.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="delivered" className="space-y-6">
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : deliveredNotes.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {deliveredNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className={`romantic-bg border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${!note.isRead ? 'ring-2 ring-primary/20' : ''}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center text-lg">
                                <span className="mr-2 text-xl">{getTypeIcon(note.noteType)}</span>
                                {note.title}
                                {!note.isRead && (
                                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground text-xs">
                                    New
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-2">
                                <Calendar className="h-4 w-4 mr-1" />
                                Delivered on {new Date(note.deliveredAt!).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className={`${getTypeColor(note.noteType)} text-xs`}>
                              {note.noteType}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {note.message}
                          </p>
                          {!note.isRead && (
                            <Button 
                              size="sm" 
                              onClick={() => markAsRead(note.id)}
                              className="w-full"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Gift className="h-16 w-16" />}
                  title="No delivered notes yet"
                  description="Notes you've written will appear here once their delivery date arrives"
                  actionLabel="Create Your First Note"
                  actionHref="/memory-jar/new"
                />
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-6">
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pendingNotes.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {pendingNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="romantic-bg border-0 shadow-lg opacity-75 hover:opacity-90 transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center text-lg">
                                <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
                                {note.title}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-2">
                                <Clock className="h-4 w-4 mr-1" />
                                Will be delivered on {new Date(note.deliveryDate).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className={`${getTypeColor(note.noteType)} text-xs`}>
                              {note.noteType}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-muted-foreground text-sm italic">
                              This note is sealed until its delivery date. The magic is in the waiting! ✨
                            </p>
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground">
                            Created on {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Clock className="h-16 w-16" />}
                  title="No pending notes"
                  description="Create time-delayed notes that will be delivered on future dates"
                  actionLabel="Write a Future Note"
                  actionHref="/memory-jar/new"
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Feature Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="romantic-bg border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">How Memory Jar Works</h3>
                <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                  Write heartfelt notes, choose a future delivery date, and let time add magic to your words. 
                  Perfect for anniversaries, birthdays, or just because moments. Your partner will receive 
                  these digital time capsules exactly when you planned, creating beautiful surprises that 
                  strengthen your bond over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
    </>
  );
}