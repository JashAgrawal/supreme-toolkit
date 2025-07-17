"use client";

import { useState, useEffect, useCallback } from 'react';
import { chatQueries, joinRoom as joinRoomAction, leaveRoom as leaveRoomAction } from '../lib/convex';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { ChatRoom, UseRoomsOptions, UseRoomsReturn } from '../types';

// Helper to map Convex room to local ChatRoom type
function mapConvexRoomToChatRoom(room: any): ChatRoom {
  return {
    id: room._id,
    name: room.name,
    description: room.description,
    type: room.type,
    created_by: room.createdBy,
    created_at: String(room.createdAt),
    updated_at: String(room.updatedAt),
    participants: room.participants,
    last_message_at: room.lastMessageAt ? String(room.lastMessageAt) : undefined,
    unread_count: room.unread_count,
  };
}

export function useRooms({
  userId,
  onError,
}: UseRoomsOptions): UseRoomsReturn {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use Convex live query for real-time room updates
  const liveRooms = useQuery(api.chat.listRooms, { userId });

  // Load rooms
  const loadRooms = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error: fetchError } = await chatQueries.getRooms();
      
      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // Filter rooms based on user access
        const accessibleRooms = data.filter(room => {
          // Public rooms are accessible to everyone
          if (room.type === 'public') return true;
          
          // Private rooms and direct messages need participant check
          if (room.participants) {
            return room.participants.includes(userId);
          }
          
          // If no participants array, check if user created the room
          return room.createdBy === userId;
        });
        
        setRooms(accessibleRooms.map(mapConvexRoomToChatRoom));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load rooms';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onError]);

  // Create room
  const createRoom = useCallback(async (
    roomData: Omit<ChatRoom, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ChatRoom | null> => {
    try {
      setError(null);
      
      const { data, error: createError } = await chatQueries.createRoom({
        ...roomData,
        createdBy: userId,
        participants: roomData.participants || [userId],
      });

      if (createError) {
        throw createError;
      }

      if (data) {
        // Add to local state
        setRooms(prev => [mapConvexRoomToChatRoom(data), ...prev]);
        return mapConvexRoomToChatRoom(data);
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create room';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    }
  }, [userId, onError]);

  // Join room
  const joinRoom = useCallback(async (roomId: string) => {
    try {
      setError(null);
      
      // Get room details first
      const { data: room, error: fetchError } = await chatQueries.getRoom(roomId);
      
      if (fetchError) {
        throw fetchError;
      }

      if (!room) {
        throw new Error('Room not found');
      }

      // Check if user is already a participant
      const participants = room.participants || [];
      if (participants.includes(userId)) {
        return; // Already a participant
      }

      // Add user to participants using Convex action
      const { error: joinError } = await joinRoomAction(roomId, userId);

      if (joinError) {
        throw joinError;
      }

      // Update local state
      setRooms(prev => 
        prev.map(r => 
          r.id === roomId 
            ? { ...r, participants: [...participants, userId] }
            : r
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [userId, onError]);

  // Leave room
  const leaveRoom = useCallback(async (roomId: string) => {
    try {
      setError(null);
      
      // Get room details first
      const { data: room, error: fetchError } = await chatQueries.getRoom(roomId);
      
      if (fetchError) {
        throw fetchError;
      }

      if (!room) {
        throw new Error('Room not found');
      }

      // Remove user from participants using Convex action
      const { error: leaveError } = await leaveRoomAction(roomId, userId);

      if (leaveError) {
        throw leaveError;
      }

      // Update local state - remove room if user was the only participant
      setRooms(prev => {
        const participants = room.participants || [];
        const updatedParticipants = participants.filter(id => id !== userId);
        
        if (updatedParticipants.length === 0 && room.createdBy === userId) {
          // Remove room entirely if creator leaves and no other participants
          return prev.filter(r => r.id !== roomId);
        } else {
          // Update participants list
          return prev.map(r => 
            r.id === roomId 
              ? { ...r, participants: updatedParticipants }
              : r
          );
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave room';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [userId, onError]);

  // Refresh rooms
  const refreshRooms = useCallback(async () => {
    await loadRooms();
  }, [loadRooms]);

  // Update rooms when live query updates
  useEffect(() => {
    if (liveRooms) {
      // Convert Convex format to our format
      const formattedRooms = liveRooms.map(mapConvexRoomToChatRoom);
      
      setRooms(formattedRooms);
      setIsLoading(false);
    }
  }, [liveRooms]);

  // Load rooms on mount (fallback if live query isn't working)
  useEffect(() => {
    if (userId && !liveRooms) {
      loadRooms();
    }
  }, [userId, loadRooms, liveRooms]);

  return {
    rooms,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    refreshRooms,
  };
}