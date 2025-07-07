// Using Vercel AI SDK's Message type for compatibility
// If not using Vercel AI SDK, you might define your own like:
// export interface ChatbotMessage {
//   id: string;
//   role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
//   content: string;
//   name?: string; // for tool/function calls
//   ui?: React.ReactNode; // for Vercel AI SDK to render custom UI
//   createdAt?: Date;
// }

// Re-exporting from 'ai' package for easy use within the module
export type { Message } from 'ai';

export interface UseChatbotOptions {
  api?: string; // API endpoint for chat completions
  initialMessages?: Message[];
  systemPrompt?: string; // Overrides default system prompt
  onResponseStarted?: () => void;
  onResponseCompleted?: (message: Message) => void;
  onError?: (error: Error) => void;
  // Add other options as needed, e.g., specific model parameters
}
