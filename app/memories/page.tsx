'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MemoryCard } from "@/components/ui/memory-card";
import { PageLoader } from "@/components/ui/page-loader";
import { MemoryLoadingCard } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { RelationshipTheme } from "@/components/ui/relationship-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, ArrowLeft, Plus, Camera, MessageCircle, ThumbsUp, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { showMemoryToast } from "@/components/ui/toast-notifications";

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

export default function MemoriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch memories from backend
    fetch(`/api/memories?createdBy=${parsedUser.id}`)
      .then(res => res.json())
      .then((data: Memory[]) => {
        setMemories(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const toggleLike = (memoryId: string) => {
    setMemories(prev => prev.map(memory => 
      memory.id === memoryId 
        ? { 
            ...memory, 
            likes: memory.likes + 1 
          }
        : memory
    ));
    showMemoryToast("Memory liked! ❤️", "Your appreciation has been shared");
  };

  if (!user) {
    return <PageLoader />;
  }

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
              <Link href="/memories/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Memory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Your Memories</h1>
          <p className="text-xl text-muted-foreground">
            A timeline of your beautiful moments together
          </p>
        </motion.div>

        <div className="space-y-6">
          {isLoading ? (
            <>
              <MemoryLoadingCard />
              <MemoryLoadingCard />
              <MemoryLoadingCard />
            </>
          ) : memories.length > 0 ? (
            memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <MemoryCard
                  memory={memory}
                  userName={user.name}
                  onLike={toggleLike}
                />
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon={<Camera className="h-16 w-16" />}
              title="No memories yet"
              description="Start capturing your special moments together"
              actionLabel="Add Your First Memory"
              actionHref="/memories/new"
            />
          )}
        </div>
      </main>
    </div>
    </>
  );
}