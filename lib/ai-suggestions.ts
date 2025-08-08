import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || 'demo-key');

export interface ActivitySuggestion {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  cost: 'free' | 'low' | 'medium' | 'high';
  location: 'home' | 'outdoor' | 'venue';
  materials?: string[];
}

export async function generateActivitySuggestions(
  interests: string[],
  relationshipType: 'lovers' | 'friends' | 'family',
  previousActivities: string[] = []
): Promise<ActivitySuggestion[]> {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY === 'demo-key') {
      console.log('Using fallback suggestions - no valid API key');
      return getFallbackSuggestions(interests, relationshipType);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Generate 6 creative and engaging activity suggestions for ${relationshipType} based on these interests: ${interests.join(', ')}.
      
      Relationship context: ${relationshipType}
      ${previousActivities.length > 0 ? `Avoid suggesting these activities they've already done: ${previousActivities.join(', ')}` : ''}
      
      For each activity, provide:
      - A creative, engaging title
      - A detailed description (2-3 sentences)
      - Category (one of: adventure, creative, relaxation, learning, social, fitness, cultural, culinary)
      - Difficulty level (easy, medium, hard)
      - Estimated duration
      - Cost level (free, low, medium, high)
      - Location type (home, outdoor, venue)
      - Required materials (if any)
      
      Make suggestions appropriate for the relationship type:
      - Lovers: romantic, intimate, bonding activities
      - Friends: fun, social, adventurous activities
      - Family: inclusive, bonding, all-ages appropriate activities
      
      Return the response as a JSON array of objects with the exact structure specified above.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const suggestions = JSON.parse(text);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return getFallbackSuggestions(interests, relationshipType);
    }
  } catch (error) {
    console.error('AI suggestion error:', error);
    return getFallbackSuggestions(interests, relationshipType);
  }
}

function getFallbackSuggestions(
  interests: string[],
  relationshipType: 'lovers' | 'friends' | 'family'
): ActivitySuggestion[] {
  const baseSuggestions: Record<string, ActivitySuggestion[]> = {
    lovers: [
      {
        title: 'Sunset Picnic Date',
        description: 'Pack your favorite foods and watch the sunset together in a beautiful location. Create lasting memories while enjoying each other\'s company.',
        category: 'romantic',
        difficulty: 'easy',
        duration: '2-3 hours',
        cost: 'low',
        location: 'outdoor',
        materials: ['Blanket', 'Food', 'Drinks']
      },
      {
        title: 'Couples Cooking Challenge',
        description: 'Choose a cuisine you\'ve never tried before and cook a complete meal together. Turn your kitchen into a fun culinary adventure.',
        category: 'culinary',
        difficulty: 'medium',
        duration: '2-4 hours',
        cost: 'medium',
        location: 'home',
        materials: ['Ingredients', 'Recipe', 'Cooking utensils']
      }
    ],
    friends: [
      {
        title: 'Adventure Photo Walk',
        description: 'Explore your city with cameras and create a photo story together. Discover hidden gems and capture memories along the way.',
        category: 'adventure',
        difficulty: 'easy',
        duration: '3-4 hours',
        cost: 'free',
        location: 'outdoor',
        materials: ['Camera or phone', 'Comfortable shoes']
      },
      {
        title: 'Game Night Tournament',
        description: 'Set up multiple game stations and compete in various games. Create brackets and award silly prizes for different categories.',
        category: 'social',
        difficulty: 'easy',
        duration: '4-6 hours',
        cost: 'low',
        location: 'home',
        materials: ['Board games', 'Snacks', 'Prizes']
      }
    ],
    family: [
      {
        title: 'Family Recipe Exchange',
        description: 'Each family member teaches others their favorite recipe. Create a family cookbook with stories behind each dish.',
        category: 'culinary',
        difficulty: 'medium',
        duration: '4-6 hours',
        cost: 'medium',
        location: 'home',
        materials: ['Ingredients', 'Recipe cards', 'Camera']
      },
      {
        title: 'Nature Scavenger Hunt',
        description: 'Create a list of natural items to find during a family hike. Learn about local flora and fauna while bonding outdoors.',
        category: 'adventure',
        difficulty: 'easy',
        duration: '2-3 hours',
        cost: 'free',
        location: 'outdoor',
        materials: ['Scavenger hunt list', 'Collection bags', 'Camera']
      }
    ]
  };

  return baseSuggestions[relationshipType] || baseSuggestions.lovers;
}