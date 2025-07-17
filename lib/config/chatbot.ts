/**
 * Chatbot GPT Configuration
 * 
 * Configure OpenAI chatbot settings
 */

export interface ChatbotConfig {
  openaiApiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  enableStreaming?: boolean;
  enableFeedback?: boolean;
}

export const defaultChatbotConfig: Partial<ChatbotConfig> = {
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7,
  systemPrompt: 'You are a helpful assistant.',
  enableStreaming: true,
  enableFeedback: true,
};

/**
 * Get chatbot configuration with defaults
 */
export function getChatbotConfig(userConfig?: Partial<ChatbotConfig>): ChatbotConfig {
  return {
    ...defaultChatbotConfig,
    ...userConfig,
    openaiApiKey: process.env.OPENAI_API_KEY!,
  };
}

/**
 * Validate chatbot environment variables
 */
export function validateChatbotConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is required for chatbot module');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
