"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { chatQueries, editMessage as convexEditMessage, deleteMessage as convexDeleteMessage } from '../lib/convex';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { ChatMessage, ChatPresence, UseChatOptions, UseChatReturn } from '../types';
import { Id } from '@/convex/_generated/dataModel';

export function useChat({
  roomId,
  userId,
  userInfo,
  onError,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<ChatPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const offsetRef = useRef(0);

  // Use Convex live query for real-time messages
  const liveMessages = useQuery(api.chat.listMessages, { roomId, limit: 50 });

  // Load initial messages (fallback for pagination)
  const loadMessages = useCallback(async (offset = 0, limit = 50) => {
    try {
      setError(null);
      const { data, error: fetchError } = await chatQueries.getMessages(roomId as Id<"chatRooms">, limit);
      if (fetchError) throw fetchError;
      if (data) {
        // Map Convex messages to ChatMessage type
        const mapped: ChatMessage[] = data.map((msg: any) => {
          const mappedMsg: ChatMessage = {
            id: String(msg._id),
            room_id: String(msg.roomId),
            user_id: String(msg.userId),
            content: msg.content,
            type: msg.type,
            created_at: msg.createdAt,
            updated_at: msg.updatedAt,
          };
          if (msg.metadata !== undefined) mappedMsg.metadata = msg.metadata;
          if (msg.editedAt !== undefined) mappedMsg.edited_at = msg.editedAt;
          if (msg.replyTo !== undefined) mappedMsg.reply_to = msg.replyTo;
          if (msg.user !== undefined) mappedMsg.user = msg.user;
          return mappedMsg;
        });
        const sortedMessages = mapped.reverse();
        if (offset === 0) {
          setMessages(sortedMessages);
        } else {
          setMessages(prev => [...prev, ...sortedMessages]);
        }
        setHasMoreMessages(data.length === limit);
        offsetRef.current = offset + data.length;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, onError]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoading) return;
    setIsLoading(true);
    await loadMessages(offsetRef.current);
  }, [hasMoreMessages, isLoading, loadMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string, type: ChatMessage['type'] = 'text') => {
    if (!content.trim()) return;
    try {
      setError(null);
      const { error: sendError } = await chatQueries.sendMessage({
        roomId,
        userId,
        content: content.trim(),
        type,
      });
      if (sendError) throw sendError;
      // Message will be added via real-time query
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [roomId, userId, onError]);

  // Edit message
  const editMessage = useCallback(async (messageId: string, content: string) => {
    if (!content.trim()) return;
    try {
      setError(null);
      const { error: editError } = await convexEditMessage(messageId, userId, content.trim());
      if (editError) throw editError;
      // Local state will update via live query
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit message';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [userId, onError]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setError(null);
      const { error: deleteError } = await convexDeleteMessage(messageId, userId);
      if (deleteError) throw deleteError;
      // Local state will update via live query
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [userId, onError]);

  // Presence tracking (Convex presence API, if available)
  useEffect(() => {
    // TODO: Implement Convex-based presence tracking if needed
    setIsConnected(true);
    return () => setIsConnected(false);
  }, []);

  // Update messages from live query
  useEffect(() => {
    if (liveMessages) {
      // Convert Convex format to ChatMessage type and filter for valid objects
      function isChatMessage(m: any): m is ChatMessage {
        return (
          typeof m === 'object' &&
          typeof m.id === 'string' &&
          typeof m.room_id === 'string' &&
          typeof m.user_id === 'string' &&
          typeof m.content === 'string' &&
          typeof m.type === 'string' &&
          typeof m.created_at === 'string' &&
          typeof m.updated_at === 'string'
        );
      }
      const formatted = liveMessages
        .map((msg: any) => {
          const mapped: ChatMessage = {
            id: String(msg._id),
            room_id: String(msg.roomId),
            user_id: String(msg.userId),
            content: msg.content,
            type: msg.type,
            created_at: msg.createdAt,
            updated_at: msg.updatedAt,
          };
          if (msg.metadata !== undefined) mapped.metadata = msg.metadata;
          if (msg.editedAt !== undefined) mapped.edited_at = msg.editedAt;
          if (msg.replyTo !== undefined) mapped.reply_to = msg.replyTo;
          if (msg.user !== undefined) mapped.user = msg.user;
          return mapped;
        })
        .filter(isChatMessage);
      setMessages(formatted);
      setIsLoading(false);
    }
  }, [liveMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages,
    hasMoreMessages,
    onlineUsers,
    isConnected,
  };
}
