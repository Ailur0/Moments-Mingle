'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RelationshipTheme } from "@/components/ui/relationship-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, ArrowLeft, User, Link2, Shield, QrCode, Copy, Check, Unlink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { showSuccessToast, showErrorToast, showLoadingToast, showWarningToast } from "@/components/ui/toast-notifications";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { FormInput } from "@/components/ui/form-field";

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [] as string[]
  });
  
  const availableInterests = [
    'Cooking', 'Travel', 'Movies', 'Music', 'Sports', 'Art', 'Photography',
    'Reading', 'Gaming', 'Fitness', 'Nature', 'Dancing', 'Theater',
    'Museums', 'Concerts', 'Food & Dining', 'Adventure', 'Crafts',
    'Technology', 'Fashion', 'Gardening', 'Pets', 'Volunteering'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name,
      email: parsedUser.email,
      interests: parsedUser.interests || []
    });
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast("Please fix the errors below");
      return;
    }
    
    setIsLoading(true);

    try {
      const savePromise = new Promise((resolve) => {
        setTimeout(() => resolve("success"), 1500);
      });

      await showLoadingToast(savePromise, {
        loading: "Saving your profile...",
        success: "Profile updated successfully! ✨",
        error: "Failed to update profile. Please try again."
      });
      
      const updatedUser = {
        ...user!,
        name: formData.name.trim(),
        email: formData.email.trim(),
        interests: formData.interests
      };

      localStorage.setItem('momentmingle_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      // Error already handled by showLoadingToast
    } finally {
      setIsLoading(false);
    }
  };

  const copyPairingCode = () => {
    if (user?.pairingCode) {
      navigator.clipboard.writeText(user.pairingCode);
      setCopied(true);
      showSuccessToast("Pairing code copied!", "Share this with someone to connect");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fixed: showWarningToast expects only 2 arguments. Use a browser confirm dialog for confirmation.
  const handleUnpair = () => {
    if (confirm("Are you sure you want to unpair? This will disconnect you from your partner and cannot be easily undone.")) {
      const updatedUser = {
        ...user!,
        pairedWith: null
      };
      localStorage.setItem('momentmingle_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showSuccessToast("Successfully unpaired", "You can now connect with someone new");
    }
  };


  const showUnpairConfirmation = () => {
    if (confirm("Are you sure you want to unpair? This will disconnect you from your partner and cannot be easily undone.")) {
      const updatedUser = {
        ...user!,
        pairedWith: null
      };
      localStorage.setItem('momentmingle_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showSuccessToast("Successfully unpaired", "You can now connect with someone new");
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('momentmingle_user');
      showSuccessToast("Logged out successfully", "See you soon!");
      router.push('/');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
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
              <span className="text-sm text-muted-foreground">Manage your profile</span>
              <ThemeToggle />
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Your Profile</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account settings and connection status
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="romantic-bg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-6 w-6 mr-2 text-primary" />
                    Profile Information
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <FormInput
                      id="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      error={errors.name}
                      required
                    />
                    <FormInput
                      id="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      error={errors.email}
                      required
                    />
                    <div className="flex gap-2">
                      <EnhancedButton type="submit" loading={isLoading} loadingText="Saving...">
                        Save Changes
                      </EnhancedButton>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ name: user.name, email: user.email, interests: user.interests || [] });
                          setErrors({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Member Since</Label>
                      <p className="text-lg">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Interests</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(user.interests || []).length > 0 ? (
                          user.interests!.map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No interests added</p>
                        )}
                      </div>
                    </div>
                    {user.relationshipType && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Relationship Type</Label>
                        <p className="text-lg">
                          {user.relationshipType === 'lovers' ? '💕 Romantic Partner' : 
                           user.relationshipType === 'friends' ? '👫 Friends' : 
                           '👨‍👩‍👧‍👦 Family'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {isEditing && (
                  <div className="space-y-2 mt-4">
                    <Label>Your Interests</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select activities and topics you enjoy (helps with AI suggestions)
                    </p>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {availableInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`text-sm px-3 py-2 rounded-full border transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:border-primary/50'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selected: {formData.interests.length} interests
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="romantic-bg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link2 className="h-6 w-6 mr-2 text-primary" />
                  Connection Status
                </CardTitle>
                <CardDescription>
                  Manage your pairing and connection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.pairedWith ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-lg font-medium text-green-700">Connected</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You are connected with someone special! You can now share activities, 
                      memories, and create beautiful moments together.
                    </p>
                    <Button variant="destructive" size="sm" onClick={handleUnpair}>
                      <Unlink className="h-4 w-4 mr-2" />
                      Unpair
                    </Button>
                    <Button variant="destructive" size="sm" onClick={showUnpairConfirmation}>
                      <Unlink className="h-4 w-4 mr-2" />
                      Unpair
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-lg font-medium text-yellow-700">Not Connected</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Share your pairing code with someone special to start creating memories together.
                    </p>
                    <Link href="/pair">
                      <EnhancedButton>
                        <QrCode className="h-4 w-4 mr-2" />
                        Connect Now
                      </EnhancedButton>
                    </Link>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-2">Your Pairing Code</h4>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white p-2 rounded border-2 border-primary/20">
                      <span className="text-xl font-bold text-primary tracking-wider">
                        {user.pairingCode}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyPairingCode}>
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This code is unique to you and never changes
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="romantic-bg border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Privacy Guarantee</h4>
                  <p className="text-xs text-muted-foreground">
                    Your data is private and secure. Only you and your paired partner can see your 
                    shared activities and memories. We never share your information with third parties 
                    or use it for advertising.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={handleLogout}>
                    Log Out
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This will sign you out of your account on this device
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
    </>
  );
}