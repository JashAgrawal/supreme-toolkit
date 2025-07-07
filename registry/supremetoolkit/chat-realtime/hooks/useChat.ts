"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  fetchInitialMessages,
  sendMessage as sendSupabaseMessage,
  subscribeToChannel
} from '@/lib/chat-supabase';
import { ChatMessage, ChatUser } from '@/types/chat'; // Using module-specific type import
import { getModuleConfig } from '@/config';
// import { onNewMessageSent } from '@/actions/chat-actions'; // Server action

export interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string, metadata?: Record<string, any>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  channelId: string;
  currentUser: ChatUser;
}

export interface UseChatProps {
  channelId: string;
  currentUser: ChatUser; // Simplified ChatUser, expecting id, name, avatarUrl
  onMessagesReceived?: (messages: ChatMessage[]) => void;
  onErrorOccurred?: (error: Error) => void;
}

export function useChat({
  channelId,
  currentUser,
  onMessagesReceived,
  onErrorOccurred,
}: UseChatProps): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  const chatConfig = getModuleConfig('chat');

  // Fetch initial messages
  useEffect(() => {
    if (!channelId || !currentUser?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchInitialMessages(channelId)
      .then((initialMessages) => {
        setMessages(initialMessages);
        onMessagesReceived?.(initialMessages);
      })
      .catch((err) => {
        console.error('useChat - Error fetching initial messages:', err);
        setError(err);
        onErrorOccurred?.(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [channelId, currentUser?.id, onMessagesReceived, onErrorOccurred]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!channelId || !currentUser?.id) return;

    const handleNewMessage = (newMessage: ChatMessage) => {
      // Avoid adding duplicate messages if client also optimistically updates
      setMessages((prevMessages) => {
        if (prevMessages.find(msg => msg.id === newMessage.id)) {
          return prevMessages;
        }
        const newMsgList = [...prevMessages, newMessage];
        onMessagesReceived?.(newMsgList); // Notify parent about the full new list
        return newMsgList;
      });
    };

    // Potentially handle updates and deletes
    // const handleMessageUpdated = (updatedMessage: ChatMessage) => { ... };
    // const handleMessageDeleted = (deletedMessageId: string) => { ... };

    const subscription = subscribeToChannel(
      channelId,
      handleNewMessage
      // handleMessageUpdated,
      // handleMessageDeleted
    );
    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        console.log(`Unsubscribed from channel: ${channelId}`);
      }
    };
  }, [channelId, currentUser?.id, onMessagesReceived]);

  const sendMessage = useCallback(async (content: string, metadata?: Record<string, any>) => {
    if (!channelId || !currentUser?.id || !content.trim()) {
      console.warn('Cannot send message: missing channelId, userId, or content.');
      return;
    }

    // Optimistic update (optional, but good for UX)
    // const optimisticMessage: ChatMessage = {
    //   id: Date.now().toString(), // Temporary ID
    //   channelId,
    //   userId: currentUser.id,
    //   content,
    //   createdAt: new Date(),
    //   user: currentUser,
    //   isLoading: true, // Custom flag for optimistic UI
    // };
    // setMessages(prev => [...prev, optimisticMessage]);

    try {
      const sentMessage = await sendSupabaseMessage(channelId, currentUser.id, content, metadata);

      // Replace optimistic message with actual server message or just add if no optimistic update
      // setMessages(prev => prev.map(msg => msg.id === optimisticMessage.id ? { ...sentMessage, isLoading: false } : msg));

      // If not doing optimistic updates, or if the subscription handler is robust enough:
      // The subscription should pick up this message. If not, uncomment the line below.
      // setMessages(prev => [...prev, sentMessage]);


      // Call server action after successful send (e.g., for notifications)
      // await onNewMessageSent({
      //   message: sentMessage,
      //   channelId,
      //   sender: currentUser,
      // });

    } catch (err) {
      console.error('useChat - Error sending message:', err);
      setError(err as Error);
      onErrorOccurred?.(err as Error);
      // Rollback optimistic update if used
      // setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
  }, [channelId, currentUser, onErrorOccurred]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    channelId,
    currentUser,
  };
}
