'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { FormInput } from "@/components/ui/form-field";
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/components/ui/toast-notifications";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const loginPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          if (Math.random() > 0.2) {
            resolve("success");
          } else {
            reject(new Error("Invalid credentials"));
          }
        }, 1500);
      });

      await showLoadingToast(loginPromise, {
        loading: "Signing you in...",
        success: "Welcome back! 🎉",
        error: "Invalid credentials. Please try again."
      });
      
      // For demo purposes, create a mock user if login is attempted
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        name: "Demo User",
        email: formData.email,
        pairingCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        pairedWith: null,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('momentmingle_user', JSON.stringify(user));
      
      router.push('/dashboard');
    } catch (error) {
      // Error already handled by showLoadingToast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">MomentMingle</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your private space</p>
        </div>

        <Card className="romantic-bg border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                error={errors.email}
                autoComplete="email"
                required
              />
              {errors.email && (
                <div className="flex items-center space-x-1 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  <p className="text-xs">{errors.email}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, password: e.target.value }));
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <p className="text-xs">{errors.password}</p>
                  </div>
                )}
              </div>
              
              <EnhancedButton type="submit" className="w-full" loading={isLoading} loadingText="Signing in...">
                Sign In
              </EnhancedButton>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}