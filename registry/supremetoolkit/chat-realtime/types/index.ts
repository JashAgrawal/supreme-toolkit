// Re-export global chat types for module clarity if needed,
// or define module-specific types.
// For now, we rely on global types found in @/types/index.ts

export {
  type ChatMessage,
  type ChatChannel,
  type ChatAttachment,
  type TypingIndicator,
  type User as ChatUser // Alias User for chat context if preferred
} from '@/types'; // Assuming global types are in @/types

export interface UseChatOptions {
  channelId: string;
  currentUser: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
  onMessagesReceived?: (messages: ChatMessage[]) => void;
  onError?: (error: Error) => void;
}

export interface SendMessagePayload {
  content: string;
  // channelId is usually part of useChat options or known by the hook instance
  // userId is usually taken from currentUser in useChat options
  metadata?: Record<string, any>;
}

// Example of a more specific type for this module if needed:
// export interface SupabaseChatMessage extends ChatMessage {
//   supabase_specific_field?: any;
// }
