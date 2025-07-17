/**
 * Client-side utilities for the chatbot module
 * These functions can be used on both client and server
 */

/**
 * Handle OpenAI API errors (client-side version)
 */
export function handleOpenAIError(error: any): string {
  // Handle OpenAI SDK errors
  if (error && typeof error === 'object' && error.status) {
    switch (error.status) {
      case 401:
        return 'Invalid OpenAI API key. Please check your configuration.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 402:
        return 'OpenAI API quota exceeded. Please check your billing.';
      case 404:
        return 'The requested model is not available.';
      case 500:
      case 502:
      case 503:
        return 'OpenAI service is temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An error occurred while processing your request.';
    }
  }
  
  // Handle other error types
  const errorMessage = error?.message || error?.toString() || '';
  
  if (errorMessage.includes('rate limit')) {
    return 'Rate limit exceeded. Please try again later.';
  }
  
  if (errorMessage.includes('insufficient_quota')) {
    return 'OpenAI API quota exceeded. Please check your billing.';
  }
  
  if (errorMessage.includes('invalid_api_key')) {
    return 'Invalid OpenAI API key. Please check your configuration.';
  }
  
  if (errorMessage.includes('model_not_found')) {
    return 'The requested model is not available.';
  }
  
  return errorMessage || 'An error occurred while processing your request.';
}

/**
 * Estimate token count for messages (rough approximation)
 */
export function estimateTokenCount(messages: Array<{content: string}>): number {
  const text = messages.map(msg => msg.content).join(' ');
  // Rough approximation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Calculate approximate cost based on token usage
 */
export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  // Pricing as of 2024 (per 1K tokens)
  const pricing: Record<string, { prompt: number; completion: number }> = {
    'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 },
    'gpt-4': { prompt: 0.03, completion: 0.06 },
    'gpt-4-turbo': { prompt: 0.01, completion: 0.03 },
    'gpt-4o': { prompt: 0.005, completion: 0.015 },
  };

  const modelPricing = pricing[model] || pricing['gpt-3.5-turbo'];
  
  const promptCost = (promptTokens / 1000) * modelPricing.prompt;
  const completionCost = (completionTokens / 1000) * modelPricing.completion;
  
  return promptCost + completionCost;
}
