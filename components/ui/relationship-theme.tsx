'use client';

import { useEffect } from 'react';

interface RelationshipThemeProps {
  relationshipType?: 'lovers' | 'friends' | 'family';
}

export function RelationshipTheme({ relationshipType = 'lovers' }: RelationshipThemeProps) {
  useEffect(() => {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-lovers', 'theme-friends', 'theme-family');
    
    // Add new theme class
    body.classList.add(`theme-${relationshipType}`);
    
    return () => {
      // Cleanup on unmount
      body.classList.remove('theme-lovers', 'theme-friends', 'theme-family');
    };
  }, [relationshipType]);

  return null;
}