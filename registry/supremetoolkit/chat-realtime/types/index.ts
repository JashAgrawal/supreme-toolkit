// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  created_by: string;
  created_at: string;
  updated_at: string;
  participants?: string[];
  last_message_at?: string;
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  edited_at?: string;
  reply_to?: string;
  user?: ChatUser;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
}

export interface ChatPresence {
  user_id: string;
  name: string;
  avatar?: string;
  online_at: string;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

import { Id } from '@/convex/_generated/dataModel';

export interface UseChatOptions {
  roomId: Id<"chatRooms">;
  userId: string;
  userInfo: {
    name: string;
    avatar?: string;
  };
  onError?: (error: string) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, type?: ChatMessage['type']) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  onlineUsers: ChatPresence[];
  isConnected: boolean;
}

export interface UseRoomsOptions {
  userId: string;
  onError?: (error: string) => void;
}

export interface UseRoomsReturn {
  rooms: ChatRoom[];
  isLoading: boolean;
  error: string | null;
  createRoom: (room: Omit<ChatRoom, 'id' | 'created_at' | 'updated_at'>) => Promise<ChatRoom | null>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  refreshRooms: () => Promise<void>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ChatRoomProps {
  roomId: Id<"chatRooms">;
  userId: string;
  userInfo: {
    name: string;
    avatar?: string;
  };
  className?: string;
  showHeader?: boolean;
  showUserList?: boolean;
  maxHeight?: string;
  onError?: (error: string) => void;
}

export interface ChatMessageProps {
  message: ChatMessage;
  currentUserId: string;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  className?: string;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  replyTo?: ChatMessage;
  onCancelReply?: () => void;
}

export interface ChatRoomListProps {
  userId: string;
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom?: () => void;
  className?: string;
}

export interface ChatUserListProps {
  users: ChatPresence[];
  currentUserId: string;
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateRoomRequest {
  name: string;
  description?: string;
  type: ChatRoom['type'];
  participants?: string[];
}

export interface SendMessageRequest {
  room_id: string;
  content: string;
  type?: ChatMessage['type'];
  reply_to?: string;
  metadata?: Record<string, any>;
}

export interface EditMessageRequest {
  content: string;
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      chat_rooms: {
        Row: ChatRoom;
        Insert: Omit<ChatRoom, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChatRoom, 'id' | 'created_at'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>;
      };
      chat_users: {
        Row: ChatUser;
        Insert: Omit<ChatUser, 'id'>;
        Update: Partial<Omit<ChatUser, 'id'>>;
      };
    };
  };
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export type ChatEvent = 
  | { type: 'message_sent'; payload: ChatMessage }
  | { type: 'message_edited'; payload: ChatMessage }
  | { type: 'message_deleted'; payload: { id: string; room_id: string } }
  | { type: 'user_joined'; payload: ChatPresence }
  | { type: 'user_left'; payload: { user_id: string } }
  | { type: 'typing_start'; payload: { user_id: string; room_id: string } }
  | { type: 'typing_stop'; payload: { user_id: string; room_id: string } };

// ============================================================================
// CONFIG TYPES
// ============================================================================

export interface ChatConfig {
  maxMessageLength?: number;
  allowFileUploads?: boolean;
  allowImageUploads?: boolean;
  maxFileSize?: number;
  enablePresence?: boolean;
  enableTypingIndicators?: boolean;
  messageRetentionDays?: number;
}
