'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Circle, PlayCircle } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdBy: string;
  createdAt: string;
}

interface ActivityCardProps {
  activity: Activity;
  onStatusChange: (activityId: string) => void;
  userName: string;
}

export function ActivityCard({ activity, onStatusChange, userName }: ActivityCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
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

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'Start';
      case 'in-progress': return 'Complete';
      case 'completed': return 'Reset';
      default: return 'Update';
    }
  };

  return (
    <Card className="romantic-bg border-0 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium line-clamp-1">{activity.title}</h4>
            <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(activity.status)}
                <span>{activity.status}</span>
              </div>
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {activity.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Due: {new Date(activity.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(activity.id)}
            className="w-full text-xs"
          >
            {getNextStatus(activity.status)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}