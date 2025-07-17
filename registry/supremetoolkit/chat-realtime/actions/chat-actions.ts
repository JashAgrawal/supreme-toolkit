"use server";

import { chatQueries } from '../lib/convex';
import type { ChatRoom, ChatMessage, CreateRoomRequest, SendMessageRequest } from '../types';

// ============================================================================
// CHAT SERVER ACTIONS
// ============================================================================

/**
 * Create a new chat room
 */
export async function createChatRoom(
  userId: string,
  roomData: CreateRoomRequest
): Promise<{
  success: boolean;
  room?: ChatRoom;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    if (!roomData.name?.trim()) {
      return {
        success: false,
        error: 'Room name is required',
      };
    }

    // Fix createChatRoom to use Convex field names
    const { data, error } = await chatQueries.createRoom({
      name: roomData.name.trim(),
      description: roomData.description?.trim(),
      type: roomData.type,
      createdBy: userId,
      participants: roomData.participants || [userId],
    });

    return {
      success: !error,
      room: mapConvexRoomToChatRoom(data),
      error: error ? 'Failed to create room' : undefined,
    };
  } catch (error) {
    console.error('Error in createChatRoom:', error);
    return {
      success: false,
      error: 'Failed to create room',
    };
  }
}

/**
 * Send a message to a chat room
 */
export async function sendChatMessage(
  userId: string,
  messageData: SendMessageRequest
): Promise<{
  success: boolean;
  message?: ChatMessage;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    if (!messageData.content?.trim()) {
      return {
        success: false,
        error: 'Message content is required',
      };
    }

    if (!messageData.room_id) {
      return {
        success: false,
        error: 'Room ID is required',
      };
    }

    // Fix sendChatMessage to use Convex field names
    const { data, error } = await chatQueries.sendMessage({
      roomId: messageData.room_id,
      userId: userId,
      content: messageData.content.trim(),
      type: messageData.type || 'text',
      replyTo: messageData.reply_to,
      metadata: messageData.metadata,
    });

    return {
      success: !error,
      message: mapConvexMessageToChatMessage(data),
      error: error ? 'Failed to send message' : undefined,
    };
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    return {
      success: false,
      error: 'Failed to send message',
    };
  }
}

/**
 * Get chat rooms for a user
 */
export async function getUserChatRooms(userId: string): Promise<{
  success: boolean;
  rooms?: ChatRoom[];
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    const { data, error } = await chatQueries.getRooms();
    const rooms = (data || []).map(mapConvexRoomToChatRoom).filter(Boolean) as ChatRoom[];

    if (error) {
      console.error('Error fetching rooms:', error);
      return {
        success: false,
        error: 'Failed to fetch rooms',
      };
    }

    // Filter rooms based on user access
    const accessibleRooms = rooms?.filter(room => {
      // Public rooms are accessible to everyone
      if (room.type === 'public') return true;
      
      // Private rooms and direct messages need participant check
      if (room.participants) {
        return room.participants.includes(userId);
      }
      
      // If no participants array, check if user created the room
      return room.created_by === userId;
    }) || [];

    return {
      success: true,
      rooms: accessibleRooms,
    };
  } catch (error) {
    console.error('Error in getUserChatRooms:', error);
    return {
      success: false,
      error: 'Failed to fetch rooms',
    };
  }
}

/**
 * Get messages for a chat room
 */
export async function getChatMessages(
  roomId: string,
  limit = 50
): Promise<{
  success: boolean;
  messages?: ChatMessage[];
  error?: string;
}> {
  try {
    if (!roomId) {
      return {
        success: false,
        error: 'Room ID is required',
      };
    }

    const { data, error } = await chatQueries.getMessages(roomId, limit);
    const messages = (data || []).map(mapConvexMessageToChatMessage).filter(Boolean) as ChatMessage[];

    if (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        error: 'Failed to fetch messages',
      };
    }

    return {
      success: true,
      messages: messages?.reverse() || [], // Reverse to show oldest first
    };
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    return {
      success: false,
      error: 'Failed to fetch messages',
    };
  }
}

/**
 * Join a chat room
 */
export async function joinChatRoom(
  userId: string,
  roomId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!userId || !roomId) {
      return {
        success: false,
        error: 'User ID and Room ID are required',
      };
    }

    // Get room details first
    const { data: room, error: fetchError } = await chatQueries.getRoom(roomId);
    
    if (fetchError || !room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    // Check if user is already a participant
    const participants = room.participants || [];
    if (participants.includes(userId)) {
      return { success: true }; // Already a participant
    }

    // Add user to participants
    const updatedParticipants = [...participants, userId];
    // TODO: Use Convex mutation to update participants in chatRooms

    return { success: true };
  } catch (error) {
    console.error('Error in joinChatRoom:', error);
    return {
      success: false,
      error: 'Failed to join room',
    };
  }
}

/**
 * Leave a chat room
 */
export async function leaveChatRoom(
  userId: string,
  roomId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!userId || !roomId) {
      return {
        success: false,
        error: 'User ID and Room ID are required',
      };
    }

    // Get room details first
    const { data: room, error: fetchError } = await chatQueries.getRoom(roomId);
    
    if (fetchError || !room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    // Remove user from participants
    const participants = room.participants || [];
    const updatedParticipants = participants.filter((id:any) => id !== userId);
    // TODO: Use Convex mutation to update participants in chatRooms

    return { success: true };
  } catch (error) {
    console.error('Error in leaveChatRoom:', error);
    return {
      success: false,
      error: 'Failed to leave room',
    };
  }
}

// Helper to map Convex room to ChatRoom
function mapConvexRoomToChatRoom(room: any): ChatRoom | undefined {
  if (!room) return undefined;
  return {
    id: room._id,
    name: room.name,
    description: room.description,
    type: room.type,
    created_by: room.created_by || room.createdBy, // support both for migration
    participants: room.participants,
    created_at: room.createdAt,
    updated_at: room.updatedAt,
    last_message_at: room.lastMessageAt,
    unread_count: room.unread_count,
  };
}

// Helper to map Convex message to ChatMessage
function mapConvexMessageToChatMessage(msg: any): ChatMessage | undefined {
  if (!msg) return undefined;
  return {
    id: msg._id,
    room_id: msg.roomId,
    user_id: msg.userId,
    content: msg.content,
    type: msg.type,
    metadata: msg.metadata,
    created_at: msg.createdAt,
    updated_at: msg.updatedAt,
    edited_at: msg.editedAt,
    reply_to: msg.replyTo,
    user: msg.user,
  };
}
