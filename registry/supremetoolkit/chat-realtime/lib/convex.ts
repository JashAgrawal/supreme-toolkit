import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getModuleConfig } from "@/config";
import { Id } from "@/convex/_generated/dataModel";

// ============================================================================
// CONVEX CLIENT SETUP
// ============================================================================

const config = getModuleConfig('convex');

if (!config?.url) {
  throw new Error('Convex configuration is missing. Please add CONVEX_URL to your config.');
}

export const convex = new ConvexHttpClient(config.url);

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  participants: string[];
  lastMessageAt?: string;
  lastMessage?: string;
  isArchived: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  replyTo?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

// ============================================================================
// CONVEX HELPERS
// ============================================================================

export const chatQueries = {
  // Room queries
  getRooms: async () => {
    try {
      const rooms = await convex.query(api.chat.listRooms, {});
      return { data: rooms, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getRoom: async (roomId: string) => {
    try {
      const room = await convex.query(api.chat.getRoom, { id: roomId as Id<"chatRooms"> });
      return { data: room, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  createRoom: async (room: Omit<ChatRoom, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => {
    try {
      const newRoom = await convex.mutation(api.chat.createRoom, {
        name: room.name,
        description: room.description,
        type: room.type,
        createdBy: room.createdBy,
        participants: room.participants || [room.createdBy],
      });
      return { data: newRoom, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Message queries
  getMessages: async (roomId: string, limit = 50) => {
    try {
      const messages = await convex.query(api.chat.listMessages, { 
        roomId: roomId as Id<"chatRooms">, 
        limit 
      });
      return { data: messages, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  sendMessage: async (message: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newMessage = await convex.mutation(api.chat.sendMessage, {
        roomId: message.roomId as Id<"chatRooms">,
        userId: message.userId as Id<"users">,
        content: message.content,
        type: message.type,
        metadata: message.metadata,
        replyTo: message.replyTo as Id<"chatMessages"> | undefined,
      });
      return { data: newMessage, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // User queries
  getUsers: async () => {
    try {
      const users = await convex.query(api.chat.listUsers, {});
      return { data: users, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateUserStatus: async (userId: string, status: ChatUser['status']) => {
    try {
      await convex.mutation(api.chat.updateUserStatus, {
        userId: userId as Id<"users">,
        status,
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Presence
  trackPresence: async (roomId: string, userId: string, userInfo: { name: string; avatar?: string }) => {
    try {
      await convex.mutation(api.chat.trackPresence, {
        roomId: roomId as Id<"chatRooms">,
        userId: userId as Id<"users">,
        name: userInfo.name,
        avatar: userInfo.avatar,
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};

// ============================================================================
// CONVEX ACTION WRAPPERS
// ============================================================================

export const joinRoom = async (roomId: string, userId: string) => {
  try {
    await convex.mutation(api.chat.joinRoom, { roomId: roomId as Id<"chatRooms">, userId });
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const leaveRoom = async (roomId: string, userId: string) => {
  try {
    await convex.mutation(api.chat.leaveRoom, { roomId: roomId as Id<"chatRooms">, userId });
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const editMessage = async (messageId: string, userId: string, content: string) => {
  try {
    await convex.mutation(api.chat.editMessage, {
      id: messageId as Id<"chatMessages">,
      userId: userId as Id<"users">, // Only allow editing own messages
      content,
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const deleteMessage = async (messageId: string, userId: string) => {
  try {
    await convex.mutation(api.chat.deleteMessage, {
      id: messageId as Id<"chatMessages">,
      userId: userId as Id<"users">, // Only allow deleting own messages
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
};