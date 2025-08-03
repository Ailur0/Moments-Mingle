'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { generateActivitySuggestions, ActivitySuggestion } from "@/lib/ai-suggestions";
import { Sparkles, RefreshCw, Clock, DollarSign, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";

interface AISuggestionsProps {
  userInterests: string[];
  relationshipType: 'lovers' | 'friends' | 'family';
  onSelectSuggestion: (suggestion: ActivitySuggestion) => void;
}

export function AISuggestions({ userInterests, relationshipType, onSelectSuggestion }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newSuggestions = await generateActivitySuggestions(
        userInterests,
        relationshipType
      );
      setSuggestions(newSuggestions);
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
      console.error('AI suggestions error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [userInterests, relationshipType]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'home': return '🏠';
      case 'outdoor': return '🌳';
      case 'venue': return '🏢';
      default: return '📍';
    }
  };

  return (
    <Card className="romantic-bg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            AI Suggestions
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSuggestions}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Personalized activity suggestions based on your interests and relationship type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(suggestion.difficulty)}`}>
                      {suggestion.difficulty}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getCostColor(suggestion.cost)}`}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      {suggestion.cost}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {suggestion.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <span className="mr-1">{getLocationIcon(suggestion.location)}</span>
                      {suggestion.location}
                    </Badge>
                  </div>
                  
                  {suggestion.materials && suggestion.materials.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center mb-1">
                        <Package className="h-3 w-3 mr-1" />
                        <span className="font-medium">Materials needed:</span>
                      </div>
                      <div className="ml-4">
                        {suggestion.materials.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  <Button size="sm" className="w-full text-xs">
                    Use This Suggestion
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!isLoading && suggestions.length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No suggestions available</p>
            <Button variant="outline" size="sm" onClick={loadSuggestions} className="mt-2">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}