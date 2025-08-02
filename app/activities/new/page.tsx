'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageLoader } from "@/components/ui/page-loader";
import { showSuccessToast, showErrorToast, showActivityToast, showLoadingToast } from "@/components/ui/toast-notifications";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { AISuggestions } from "@/components/ui/ai-suggestions";
import { ActivitySuggestion } from "@/lib/ai-suggestions";
import { Heart, ArrowLeft, Calendar, Save } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function NewActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Set default due date to next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setFormData(prev => ({
      ...prev,
      dueDate: nextWeek.toISOString().split('T')[0]
    }));
  }, [router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Activity title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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
        setTimeout(() => resolve("success"), 1500);
      });

      await showLoadingToast(createPromise, {
        loading: "Creating your activity...",
        success: "Activity created successfully! 🎉",
        error: "Failed to create activity. Please try again."
      });
      
      // Create activity
      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: 'pending' as const,
        dueDate: formData.dueDate,
        createdBy: user!.id,
        createdAt: new Date().toISOString()
      };

      // In a real app, this would be saved to the backend
      console.log('New activity created:', newActivity);
      
      router.push('/activities');
    } catch (error) {
      // Error already handled by showLoadingToast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: ActivitySuggestion) => {
    setFormData(prev => ({
      ...prev,
      title: suggestion.title,
      description: suggestion.description
    }));
    setShowAISuggestions(false);
    showActivityToast("Activity suggestion applied!", "You can edit the details before saving");
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
            <Link href="/activities" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">MomentMingle</span>
            </Link>
            <span className="text-sm text-muted-foreground">Create a new activity</span>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Create New Activity</h1>
          <p className="text-xl text-muted-foreground">
            Plan something special to do together or get AI suggestions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activity Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="romantic-bg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-primary" />
                    Activity Details
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAISuggestions(!showAISuggestions)}
                  >
                    ✨ AI Suggestions
                  </Button>
                </CardTitle>
                <CardDescription>
                  Fill in the details for your shared activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput
                    id="title"
                    label="Activity Title"
                    type="text"
                    placeholder="e.g., Weekend getaway, Cooking class, Movie night"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, title: e.target.value }));
                      if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                    }}
                    error={errors.title}
                    description="Give your activity a memorable name"
                    required
                  />
                  
                  <FormTextarea
                    id="description"
                    label="Description"
                    placeholder="Describe what you want to do, where you'll go, or any special details..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                      if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                    }}
                    error={errors.description}
                    description="Add details about the activity, location, or what you need to prepare"
                    required
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Target Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      When would you like to complete this activity?
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Activity Status</h4>
                    <p className="text-xs text-muted-foreground">
                      Your activity will start as "Pending". You can change the status to "In Progress" 
                      when you start working on it, and "Completed" when you're done.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <EnhancedButton 
                      type="submit" 
                      className="flex-1" 
                      loading={isLoading} 
                      loadingText="Creating activity..."
                      icon={<Save className="h-4 w-4" />}
                    >
                      Create Activity
                    </EnhancedButton>
                    <Link href="/activities">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Suggestions */}
          {showAISuggestions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AISuggestions
                userInterests={user.interests || []}
                relationshipType={user.relationshipType || 'lovers'}
                onSelectSuggestion={handleSelectSuggestion}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}