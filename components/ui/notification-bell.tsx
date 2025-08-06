'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NotificationBell() {
  const [notifications] = useState([
    {
      id: '1',
      title: 'New Memory Jar Note',
      message: 'You have a new note waiting to be delivered tomorrow!',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2', 
      title: 'Activity Reminder',
      message: 'Your cooking class is scheduled for this weekend.',
      time: '1 day ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 px-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                {notification.unread && (
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              <span className="text-xs text-muted-foreground mt-2">{notification.time}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No notifications</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}