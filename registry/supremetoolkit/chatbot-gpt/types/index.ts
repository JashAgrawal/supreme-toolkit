// ============================================================================
// CHATBOT TYPES
// ============================================================================

export interface ChatbotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
    error?: string;
  };
}

export interface ChatbotConversation {
  id: string;
  title: string;
  messages: ChatbotMessage[];
  created_at: Date;
  updated_at: Date;
  user_id?: string;
  metadata?: {
    model: string;
    totalTokens: number;
    totalCost: number;
  };
}

export interface ChatbotConfig {
  openaiApiKey: string;
  model?: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o';
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  enableStreaming?: boolean;
  enableConversationHistory?: boolean;
  maxConversationLength?: number;
  rateLimitPerMinute?: number;
  allowFileUploads?: boolean;
  enableFeedback?: boolean;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseChatbotOptions {
  conversationId?: string;
  userId?: string;
  systemPrompt?: string;
  onError?: (error: string) => void;
  onMessageComplete?: (message: ChatbotMessage) => void;
}

export interface UseChatbotReturn {
  messages: ChatbotMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  regenerateLastResponse: () => Promise<void>;
  stopGeneration: () => void;
  conversationId: string | null;
}

export interface UseConversationsOptions {
  userId?: string;
  onError?: (error: string) => void;
}

export interface UseConversationsReturn {
  conversations: ChatbotConversation[];
  isLoading: boolean;
  error: string | null;
  createConversation: (title?: string) => Promise<string | null>;
  deleteConversation: (conversationId: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<ChatbotConversation | null>;
  updateConversationTitle: (conversationId: string, title: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ChatbotWidgetProps {
  userId?: string;
  systemPrompt?: string;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
  showHeader?: boolean;
  showConversationList?: boolean;
  enableFileUpload?: boolean;
  enableFeedback?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'center';
  triggerButton?: React.ReactNode;
  onError?: (error: string) => void;
}

export interface ChatbotMessageProps {
  message: ChatbotMessage;
  isLast?: boolean;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  className?: string;
}

export interface ChatbotInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  disabled?: boolean;
  enableFileUpload?: boolean;
  className?: string;
  onStopGeneration?: () => void;
}

export interface ConversationListProps {
  conversations: ChatbotConversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ChatCompletionRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  user?: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamingChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
    };
    finish_reason?: string;
  }>;
}

// ============================================================================
// FEEDBACK TYPES
// ============================================================================

export interface MessageFeedback {
  id: string;
  message_id: string;
  user_id?: string;
  feedback: 'positive' | 'negative';
  comment?: string;
  created_at: Date;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ChatbotError {
  code: string;
  message: string;
  details?: any;
}

export type ChatbotErrorCode = 
  | 'OPENAI_API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_API_KEY'
  | 'CONVERSATION_NOT_FOUND'
  | 'MESSAGE_TOO_LONG'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// ============================================================================
// STORAGE TYPES
// ============================================================================

export interface ConversationStorage {
  saveConversation: (conversation: ChatbotConversation) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<ChatbotConversation | null>;
  deleteConversation: (conversationId: string) => Promise<void>;
  listConversations: (userId?: string) => Promise<ChatbotConversation[]>;
  updateConversation: (conversationId: string, updates: Partial<ChatbotConversation>) => Promise<void>;
}
