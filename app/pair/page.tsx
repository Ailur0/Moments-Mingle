'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelationshipTheme } from "@/components/ui/relationship-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, ArrowLeft, QrCode, Users, Copy, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/components/ui/toast-notifications";
import { EnhancedButton } from "@/components/ui/enhanced-button";
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

export default function PairPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pairingCode, setPairingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [relationshipType, setRelationshipType] = useState<'lovers' | 'friends' | 'family'>('lovers');
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('momentmingle_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Generate QR code
    if (typeof window !== 'undefined' && qrRef.current) {
      // @ts-expect-error: qrcode has no types by default. To fix, run: npm i --save-dev @types/qrcode (if available)
      import('qrcode').then((QRCode) => {
        QRCode.toCanvas(qrRef.current, parsedUser.pairingCode, {
          width: 200,
          margin: 2,
          color: {
            dark: '#E91E63',
            light: '#FFFFFF'
          }
        });
      });
    }
  }, [router]);

  const validatePairingForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (pairingCode.length !== 6) {
      newErrors.pairingCode = 'Pairing code must be exactly 6 characters';
    }
    
    if (pairingCode.toUpperCase() === user?.pairingCode) {
      newErrors.pairingCode = 'You cannot pair with yourself';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePairWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePairingForm()) {
      showErrorToast("Please fix the errors below");
      return;
    }
    
    setIsLoading(true);

    try {
      const pairPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          if (Math.random() > 0.3) {
            resolve("success");
          } else {
            reject(new Error("Invalid pairing code"));
          }
        }, 2000);
      });

      await showLoadingToast(pairPromise, {
        loading: "Connecting with your partner...",
        success: "Successfully paired! Welcome to your private space! 💕",
        error: "Failed to pair. Please check the code and try again."
      });
      
      // Update user with pairing info
      const updatedUser = {
        ...user!,
        pairedWith: pairingCode.toUpperCase(),
        relationshipType: relationshipType
      };

      localStorage.setItem('momentmingle_user', JSON.stringify(updatedUser));
      
      router.push('/dashboard');
    } catch (error) {
      // Error already handled by showLoadingToast
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (user?.pairingCode) {
      navigator.clipboard.writeText(user.pairingCode);
      setCopied(true);
      showSuccessToast("Pairing code copied!", "Share this with someone special to connect");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RelationshipTheme relationshipType={relationshipType} />
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
              <span className="text-sm text-muted-foreground">Connect with someone special</span>
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Connect Privately</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your unique code or scan someone else's to create your private space together
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="share" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="share">Share Your Code</TabsTrigger>
              <TabsTrigger value="connect">Connect with Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="share" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="romantic-bg border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <QrCode className="h-6 w-6 mr-2 text-primary" />
                      Your QR Code
                    </CardTitle>
                    <CardDescription>
                      Let someone scan this QR code to connect instantly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <canvas ref={qrRef} id="pair-qr-canvas" />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                        const canvas = document.getElementById('pair-qr-canvas') as HTMLCanvasElement | null;
                        if (canvas) {
                          const link = document.createElement('a');
                          link.download = 'pairing-qr.png';
                          link.href = canvas.toDataURL('image/png');
                          link.click();
                        }
                      }}>
                        Download QR Code
                      </Button>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with any QR scanner
                    </p>
                  </CardContent>
                </Card>

                <Card className="romantic-bg border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-6 w-6 mr-2 text-primary" />
                      Your Pairing Code
                    </CardTitle>
                    <CardDescription>
                      Share this 6-character code to connect
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="bg-white p-4 rounded-lg border-2 border-primary/20 inline-block">
                        <motion.span 
                          className="text-4xl font-bold text-primary tracking-wider"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {user.pairingCode}
                        </motion.span>
                      </div>
                    </div>
                    
                    <Button onClick={copyToClipboard} className="w-full" variant="outline">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      This code is unique to you. Keep it private and only share with people you trust.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="connect" className="mt-6">
              <div className="max-w-md mx-auto">
                <Card className="romantic-bg border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-center">Enter Pairing Code</CardTitle>
                    <CardDescription className="text-center">
                      Enter the 6-character code from someone you want to connect with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePairWithCode} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Relationship Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['lovers', 'friends', 'family'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setRelationshipType(type)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                relationshipType === type
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted hover:bg-muted/80'
                              }`}
                            >
                              {type === 'lovers' ? '💕 Lovers' : 
                               type === 'friends' ? '👫 Friends' : 
                               '👨‍👩‍👧‍👦 Family'}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pairingCode">Pairing Code</Label>
                        <Input
                          id="pairingCode"
                          type="text"
                          placeholder="ABC123"
                          value={pairingCode}
                          onChange={(e) => {
                            setPairingCode(e.target.value.toUpperCase());
                            if (errors.pairingCode) setErrors(prev => ({ ...prev, pairingCode: '' }));
                          }}
                          className={errors.pairingCode ? "border-destructive focus-visible:ring-destructive text-center text-2xl tracking-wider" : "text-center text-2xl tracking-wider"}
                          maxLength={6}
                          required
                        />
                        {errors.pairingCode ? (
                          <div className="flex items-center justify-center space-x-1 text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <p className="text-xs">{errors.pairingCode}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center">
                            Enter the 6-character code exactly as shown
                          </p>
                        )}
                      </div>
                      
                      <EnhancedButton type="submit" className="w-full" loading={isLoading} loadingText="Connecting...">
                        Connect
                      </EnhancedButton>
                    </form>
                    
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Privacy Note</h4>
                      <p className="text-xs text-muted-foreground">
                        Once connected, you and your partner will be able to share activities, 
                        memories, and comments privately. This connection cannot be undone easily, 
                        so make sure you trust this person.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
    </>
  );
}