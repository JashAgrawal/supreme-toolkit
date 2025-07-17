"use client";

import { useState, useCallback, useRef } from 'react';
import { openaiConfig } from '../lib/config';
import { handleOpenAIError } from '../lib/client-utils';
import type { ChatbotMessage, UseChatbotOptions, UseChatbotReturn } from '../types';

export function useChatbot({
  conversationId,
  userId,
  systemPrompt,
  onError,
  onMessageComplete,
}: UseChatbotOptions): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageRef = useRef<string>('');

  // Generate conversation ID if not provided
  const getConversationId = useCallback(() => {
    if (!currentConversationId) {
      const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      setCurrentConversationId(newId);
      return newId;
    }
    return currentConversationId;
  }, [currentConversationId]);

  // Send message to chatbot
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return;

    const userMessage: ChatbotMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message to conversation
    setMessages(prev => [...prev, userMessage]);
    setError(null);
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMessageId = `msg_${Date.now() + 1}_${Math.random().toString(36).substring(2, 11)}`;
    const assistantMessage: ChatbotMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      
      const currentMessages = [...messages, userMessage];
      
      if (openaiConfig.enableStreaming) {
        setIsStreaming(true);
        streamingMessageRef.current = '';

        // Make API call for streaming response
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_message',
            messages: currentMessages,
            systemPrompt: systemPrompt || openaiConfig.systemPrompt,
            stream: true,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Process streaming response
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    break;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                      streamingMessageRef.current += parsed.content;

                      // Update the assistant message with streaming content
                      setMessages(prev =>
                        prev.map(msg =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: streamingMessageRef.current }
                            : msg
                        )
                      );
                    }
                    if (parsed.error) {
                      throw new Error(parsed.error);
                    }
                  } catch (parseError) {
                    // Ignore parse errors for incomplete chunks
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        }

        // Finalize the streaming message
        const finalMessage: ChatbotMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: streamingMessageRef.current,
          timestamp: new Date(),
          isStreaming: false,
        };

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId ? finalMessage : msg
          )
        );

        onMessageComplete?.(finalMessage);
      } else {
        // Non-streaming response
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_message',
            messages: currentMessages,
            systemPrompt: systemPrompt || openaiConfig.systemPrompt,
            stream: false,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to get response');
        }

        const finalMessage: ChatbotMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: result.data.content,
          timestamp: new Date(),
          isStreaming: false,
          metadata: result.data.metadata,
        };

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId ? finalMessage : msg
          )
        );

        onMessageComplete?.(finalMessage);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was aborted
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      } else {
        const errorMessage = handleOpenAIError(err);
        setError(errorMessage);
        onError?.(errorMessage);

        // Update assistant message with error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: 'Sorry, I encountered an error. Please try again.',
                  isStreaming: false,
                  metadata: { error: errorMessage }
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
      streamingMessageRef.current = '';
    }
  }, [messages, isLoading, isStreaming, systemPrompt, userId, onError, onMessageComplete]);

  // Regenerate last response
  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex(msg => msg.role === 'user');
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];
    
    // Remove messages after the last user message
    const messagesUpToUser = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesUpToUser);

    // Resend the last user message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  // Stop generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentConversationId(null);
    
    // Stop any ongoing generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearConversation,
    regenerateLastResponse,
    stopGeneration,
    conversationId: getConversationId(),
  };
}
