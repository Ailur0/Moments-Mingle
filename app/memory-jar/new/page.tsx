'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLoader } from "@/components/ui/page-loader";
import { showSuccessToast, showErrorToast, showJarToast, showLoadingToast } from "@/components/ui/toast-notifications";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { Heart, ArrowLeft, Gift, Calendar, Send, Sparkles, AlertCircle } from "lucide-react";
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

export default function NewMemoryJarNotePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    deliveryDate: '',
    noteType: 'love' as 'love' | 'memory' | 'future' | 'gratitude' | 'surprise'
  });

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      deliveryDate: tomorrow.toISOString().split('T')[0]
    }));
  }, [router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Note title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.deliveryDate = 'Delivery date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast("Please fix the errors below");
      return;
    }
    
    setIsLoading(true);

    try {
      const createPromise = new Promise((resolve) => {
        setTimeout(() => resolve("success"), 2000);
      });

      const deliveryDateFormatted = new Date(formData.deliveryDate).toLocaleDateString();
      
      await showLoadingToast(createPromise, {
        loading: "Sealing your note...",
        success: `Note scheduled for ${deliveryDateFormatted}! 🎁`,
        error: "Failed to create note. Please try again."
      });
      
      // Create memory jar note
      const newNote = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title.trim(),
        message: formData.message.trim(),
        deliveryDate: formData.deliveryDate,
        noteType: formData.noteType,
        createdBy: user!.id,
        createdAt: new Date().toISOString(),
        isDelivered: false,
        isRead: false
      };

      // In a real app, this would be saved to the backend
      console.log('New memory jar note created:', newNote);
      
      router.push('/memory-jar');
    } catch (error) {
      // Error already handled by showLoadingToast
    } finally {
      setIsLoading(false);
    }
  };

  const noteTypes = [
    { value: 'love', label: '💕 Love Note', description: 'Express your feelings and affection' },
    { value: 'memory', label: '📸 Memory', description: 'Share a special moment or experience' },
    { value: 'future', label: '🔮 Future Plans', description: 'Dreams and plans for your future together' },
    { value: 'gratitude', label: '🙏 Gratitude', description: 'Thank them for something meaningful' },
    { value: 'surprise', label: '🎁 Surprise', description: 'A fun surprise or announcement' }
  ];

  const getRelationshipSuggestions = () => {
    switch (user?.relationshipType) {
      case 'lovers':
        return [
          "Remember our first kiss under the stars...",
          "I can't wait to grow old with you...",
          "Thank you for loving me exactly as I am...",
          "By the time you read this, we'll be...",
          "I have a surprise planned for our anniversary..."
        ];
      case 'friends':
        return [
          "Remember that crazy adventure we had...",
          "Thank you for always being there for me...",
          "I can't wait for our next trip together...",
          "You're the best friend anyone could ask for...",
          "I have something exciting planned for us..."
        ];
      case 'family':
        return [
          "I'm so grateful to have you in my life...",
          "Remember when we used to...",
          "I can't wait for our family reunion...",
          "Thank you for all the love and support...",
          "I have a special surprise for the family..."
        ];
      default:
        return [
          "I wanted to share this special moment with you...",
          "Thank you for being such an important person in my life...",
          "I can't wait to create more memories together...",
          "You mean the world to me...",
          "I have something special planned for us..."
        ];
    }
  };

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/memory-jar" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">MomentMingle</span>
            </Link>
            <span className="text-sm text-muted-foreground">Create a memory jar note</span>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Create Memory Jar Note</h1>
          <p className="text-xl text-muted-foreground">
            Write a heartfelt message that will be delivered on a future date
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="romantic-bg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-primary" />
                Your Time Capsule
              </CardTitle>
              <CardDescription>
                Create a meaningful message that will surprise and delight your special someone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="noteType">Note Type</Label>
                  <Select value={formData.noteType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, noteType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose the type of note" />
                    </SelectTrigger>
                    <SelectContent>
                      {noteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FormInput
                  id="title"
                  label="Note Title"
                  type="text"
                  placeholder="Give your note a meaningful title..."
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  error={errors.title}
                  description="A short, descriptive title for your note"
                  required
                />
                
                <FormTextarea
                  id="message"
                  label="Your Message"
                  placeholder="Write your heartfelt message here..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, message: e.target.value }));
                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  error={errors.message}
                  required
                />
                
                {!errors.message && (
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-2">Need inspiration? Try one of these starters:</p>
                    <div className="grid gap-1">
                      {getRelationshipSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="text-left p-2 rounded bg-muted/50 hover:bg-muted transition-colors text-xs italic"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, message: suggestion }));
                            if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                            showJarToast("Message template applied!", "Feel free to customize it");
                          }}
                        >
                          "{suggestion}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, deliveryDate: e.target.value }));
                      if (errors.deliveryDate) setErrors(prev => ({ ...prev, deliveryDate: '' }));
                    }}
                    className={errors.deliveryDate ? "border-destructive focus-visible:ring-destructive" : ""}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                    required
                  />
                  {errors.deliveryDate ? (
                    <div className="flex items-center space-x-1 text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <p className="text-xs">{errors.deliveryDate}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Choose when this note should be delivered (must be at least tomorrow)
                    </p>
                  )}
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    How it works
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Your note will be sealed until the delivery date you choose. On that day, 
                    it will appear in your partner's "Delivered Notes" section with a special 
                    notification. The anticipation makes it even more meaningful! ✨
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <EnhancedButton 
                    type="submit" 
                    className="flex-1" 
                    loading={isLoading} 
                    loadingText="Sealing note..."
                    icon={<Send className="h-4 w-4" />}
                  >
                    Seal & Schedule
                  </EnhancedButton>
                  <Link href="/memory-jar">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}