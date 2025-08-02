'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageLoader } from "@/components/ui/page-loader";
import { showSuccessToast, showErrorToast, showMemoryToast, showLoadingToast } from "@/components/ui/toast-notifications";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { Heart, ArrowLeft, Camera, Upload, Image as ImageIcon } from "lucide-react";
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

export default function NewMemoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    caption: '',
    imageUrl: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.caption.trim()) {
      newErrors.caption = 'Caption is required';
    } else if (formData.caption.trim().length < 5) {
      newErrors.caption = 'Caption must be at least 5 characters';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
        loading: "Adding your memory...",
        success: "Memory added successfully! 📸",
        error: "Failed to add memory. Please try again."
      });
      
      // Create memory
      const newMemory = {
        id: Math.random().toString(36).substr(2, 9),
        caption: formData.caption.trim(),
        imageUrl: formData.imageUrl.trim(),
        createdBy: user!.id,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0
      };

      // In a real app, this would be saved to the backend
      console.log('New memory created:', newMemory);
      
      router.push('/memories');
    } catch (error) {
      // Error already handled by showLoadingToast
    } finally {
      setIsLoading(false);
    }
  };

  const sampleImages = [
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/7654174/pexels-photo-7654174.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/memories" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">MomentMingle</span>
            </Link>
            <span className="text-sm text-muted-foreground">Add a new memory</span>
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Add New Memory</h1>
          <p className="text-xl text-muted-foreground">
            Capture and share a special moment
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
                <Camera className="h-6 w-6 mr-2 text-primary" />
                Memory Details
              </CardTitle>
              <CardDescription>
                Share a photo and tell the story behind it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  id="imageUrl"
                  label="Image URL"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                    if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
                  }}
                  error={errors.imageUrl}
                  description="Paste the URL of your image here"
                  required
                />

                {/* Sample Images */}
                <div className="space-y-2">
                  <Label>Or choose from sample images:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleImages.map((url, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          formData.imageUrl === url 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, imageUrl: url }));
                          if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
                          showMemoryToast("Sample image selected!", "You can now add your caption");
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img 
                          src={url} 
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="space-y-2">
                    <Label>Preview:</Label>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      )}
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => setImageLoading(false)}
                        onLoadStart={() => setImageLoading(true)}
                        onError={() => {
                          setImageLoading(false);
                          showErrorToast("Invalid image URL");
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <FormTextarea
                  id="caption"
                  label="Caption"
                  placeholder="Tell the story behind this moment... What made it special?"
                  rows={4}
                  value={formData.caption}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, caption: e.target.value }));
                    if (errors.caption) setErrors(prev => ({ ...prev, caption: '' }));
                  }}
                  error={errors.caption}
                  description="Share the story, emotions, or details that make this memory special"
                  required
                />
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Privacy Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    This memory will only be visible to you and your paired partner. 
                    It will be added to your shared timeline and can receive likes and comments.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <EnhancedButton 
                    type="submit" 
                    className="flex-1" 
                    loading={isLoading} 
                    loadingText="Adding memory..."
                    icon={<Upload className="h-4 w-4" />}
                  >
                    Add Memory
                  </EnhancedButton>
                  <Link href="/memories">
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