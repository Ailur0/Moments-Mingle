'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Camera, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

interface QuickStatsProps {
  activitiesCount: number;
  memoriesCount: number;
  connectionStatus: 'connected' | 'not-connected';
  totalLikes: number;
  relationshipType?: 'lovers' | 'friends' | 'family';
  partnerName?: string;
}

export function QuickStats({ 
  activitiesCount, 
  memoriesCount, 
  connectionStatus, 
  totalLikes,
  relationshipType = 'lovers',
  partnerName
}: QuickStatsProps) {
  const getConnectionLabel = () => {
    switch (relationshipType) {
      case 'lovers': return connectionStatus === 'connected' ? 'Connected Hearts' : 'Single';
      case 'friends': return connectionStatus === 'connected' ? 'Best Friends' : 'Solo';
      case 'family': return connectionStatus === 'connected' ? 'Family Bond' : 'Individual';
      default: return connectionStatus === 'connected' ? 'Connected' : 'Not Connected';
    }
  };

  const stats = [
    {
      label: 'Activities',
      value: activitiesCount,
      icon: Calendar,
      color: 'text-primary'
    },
    {
      label: 'Memories',
      value: memoriesCount,
      icon: Camera,
      color: 'text-accent'
    },
    {
      label: 'Total Likes',
      value: totalLikes,
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      label: 'Status',
      value: getConnectionLabel(),
      icon: Users,
      color: connectionStatus === 'connected' ? 'text-green-500' : 'text-yellow-500'
    }
  ];

  return (
    <>
      {partnerName && (
        <div className="mb-2 text-center text-sm text-muted-foreground">
          Partner: <span className="font-semibold text-foreground">{partnerName}</span>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="romantic-bg border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-background/50 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {typeof stat.value === 'number' ? stat.value : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}