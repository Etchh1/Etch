import { Service, ServicePreference } from '../types/auth';

interface RecommendationRequest {
  userId: string;
  preferences: ServicePreference[];
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

interface ChatbotMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIRequestBody {
  [key: string]: unknown;
}

class AIService {
  private apiKey: string | undefined;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;
    this.apiEndpoint = process.env.EXPO_PUBLIC_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  }

  private async makeRequest(endpoint: string, body: AIRequestBody) {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    try {
      const response = await fetch(`${this.apiEndpoint}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI API request failed:', error);
      throw error;
    }
  }

  public async getServiceRecommendations(request: RecommendationRequest): Promise<Service[]> {
    try {
      const response = await this.makeRequest('/recommendations', {
        userId: request.userId,
        preferences: request.preferences,
        location: request.location,
        priceRange: request.priceRange,
      });

      return response.recommendations;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  public async getChatbotResponse(messages: ChatbotMessage[]): Promise<string> {
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for the Etch service marketplace platform.',
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Failed to get chatbot response:', error);
      return 'I apologize, but I am unable to process your request at the moment.';
    }
  }

  public async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
  }> {
    try {
      const response = await this.makeRequest('/analyze/sentiment', {
        text,
      });

      return response.sentiment;
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      return {
        sentiment: 'neutral',
        score: 0,
      };
    }
  }

  public async generateServiceDescription(
    serviceType: string,
    features: string[],
    targetAudience: string
  ): Promise<string> {
    try {
      const response = await this.makeRequest('/generate/description', {
        serviceType,
        features,
        targetAudience,
      });

      return response.description;
    } catch (error) {
      console.error('Failed to generate service description:', error);
      return '';
    }
  }
}

export const aiService = new AIService(); 