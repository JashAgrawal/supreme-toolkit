"use server"
import OpenAI from 'openai';
import type { Stream } from 'openai/streaming';
import type { ChatbotMessage } from '../types';
import { openaiConfig } from './config';

// ============================================================================
// OPENAI CLIENT SETUP
// ============================================================================

if (!openaiConfig?.apiKey) {
  throw new Error('OpenAI API key is missing. Please add OPENAI_API_KEY to your config.');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: openaiConfig.apiKey,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// ============================================================================
// OPENAI HELPERS
// ============================================================================



/**
 * Convert chatbot messages to OpenAI format
 */
export async function formatMessagesForOpenAI(
  messages: ChatbotMessage[],
  systemPrompt?: string
): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]> {
  const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  // Add system prompt if provided
  if (systemPrompt) {
    formattedMessages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  // Add conversation messages (exclude system messages from conversation)
  messages
    .filter(msg => msg.role !== 'system')
    .forEach(msg => {
      formattedMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    });

  return formattedMessages;
}

/**
 * Send a chat completion request to OpenAI using the SDK
 */
export async function sendChatCompletion(
  messages: ChatbotMessage[],
  options: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
    userId?: string;
  } = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion | Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  const formattedMessages = await formatMessagesForOpenAI(messages, options.systemPrompt);

  const requestParams:any = {
    messages: formattedMessages,
    model: "gemini-2.5-flash",
    max_tokens: options.maxTokens || openaiConfig.maxTokens,
    temperature: options.temperature ?? openaiConfig.temperature,
    stream: options.stream ?? openaiConfig.enableStreaming,
    user: options.userId,
  };

  try {
    if (options.stream ?? openaiConfig.enableStreaming) {
      return await openai.chat.completions.create({
        ...requestParams,
        stream: true,
      });
    } else {
      return await openai.chat.completions.create({
        ...requestParams,
        stream: false,
      });
    }
  } catch (error: any) {
    throw new Error(await handleOpenAIError(error));
  }
}

/**
 * Process streaming response from OpenAI SDK
 */
export async function* processStreamingResponse(
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
): AsyncGenerator<string, void, unknown> {
  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Error processing streaming response:', error);
    throw error;
  }
}

/**
 * Get non-streaming response from OpenAI
 */
export async function getChatCompletion(
  messages: ChatbotMessage[],
  options: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    userId?: string;
  } = {}
): Promise<{
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}> {
  const formattedMessages = await formatMessagesForOpenAI(messages, options.systemPrompt);

  try {
    const completion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: options.model || openaiConfig.model,
      max_tokens: options.maxTokens || openaiConfig.maxTokens,
      temperature: options.temperature ?? openaiConfig.temperature,
      stream: false,
      user: options.userId,
    });

    return {
      content: completion.choices[0]?.message?.content || '',
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens || 0,
        completion_tokens: completion.usage?.completion_tokens || 0,
        total_tokens: completion.usage?.total_tokens || 0,
      },
    };
  } catch (error: any) {
    throw new Error(await handleOpenAIError(error));
  }
}



/**
 * Validate OpenAI API key
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const testClient = new OpenAI({ apiKey });
    await testClient.models.list();
    return true;
  } catch {
    return false;
  }
}

/**
 * Handle OpenAI API errors (server-side version)
 */
export async function handleOpenAIError(error: any): Promise<string> {
  // Handle OpenAI SDK errors
  if (error instanceof OpenAI.APIError) {
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

  // Handle other error types safely
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
