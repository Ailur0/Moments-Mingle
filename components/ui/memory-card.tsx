'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
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

interface MemoryCardProps {
  memory: Memory;
  userName: string;
  onLike: (memoryId: string) => void;
}

export function MemoryCard({ memory, userName, onLike }: MemoryCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(memory.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, this would add the comment to the backend
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <Card className="romantic-bg border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative">
          <img 
            src={memory.imageUrl} 
            alt={memory.caption}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Caption */}
          <p className="text-sm leading-relaxed">{memory.caption}</p>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="ml-1 text-xs">{memory.likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="p-2 text-muted-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="ml-1 text-xs">{memory.comments.length}</span>
              </Button>
            </div>
            
            <span className="text-xs text-muted-foreground">
              {new Date(memory.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 border-t pt-3"
            >
              {/* Existing Comments */}
              {memory.comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-muted-foreground ml-2">{comment.text}</span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="flex space-x-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button type="submit" size="sm" disabled={!newComment.trim()}>
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}