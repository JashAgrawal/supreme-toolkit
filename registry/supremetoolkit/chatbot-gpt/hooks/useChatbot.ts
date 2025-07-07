"use client";

import { useState, useCallback } from 'react';
import { useChat } from 'ai/react'; // Vercel AI SDK hook
import type { Message, UseChatOptions as VercelUseChatOptions } from 'ai';
import { UseChatbotOptions } from '@/types/chatbot'; // Module-specific options

export interface ExtendedMessage extends Message {
  // Add any custom fields you might need for UI rendering, e.g.
  // isError?: boolean;
  // sources?: any[]; // For chatbots that cite sources
}

// Combine Vercel's UseChatOptions with our custom options
export interface MergedUseChatbotOptions extends Omit<VercelUseChatOptions, 'api' | 'initialMessages'>, UseChatbotOptions {}

export function useChatbot(options: MergedUseChatbotOptions = {}) {
  const {
    api = '/api/chat-completion', // Default API endpoint
    initialMessages,
    systemPrompt, // Our custom systemPrompt prop
    onResponseStarted,
    onResponseCompleted,
    onError: userOnError,
    ...vercelOptions // Pass remaining Vercel AI SDK options
  } = options;

  const [chatbotError, setChatbotError] = useState<Error | null>(null);

  const handleFinish = (message: Message) => {
    if (onResponseCompleted) {
      onResponseCompleted(message);
    }
    // Example: if you wanted to log every completed assistant message
    // if (message.role === 'assistant') {
    //   logConversation([...messages, message]); // Assuming logConversation is available
    // }
  };

  const handleError = (error: Error) => {
    setChatbotError(error);
    if (userOnError) {
      userOnError(error);
    }
    console.error("Chatbot error:", error);
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error: vercelError, // Vercel's error, we'll also use our own
    append,
    reload,
    stop,
    setMessages,
    setInput
  } = useChat({
    api,
    initialMessages,
    body: { // Body to be sent to the API route
      systemPrompt: systemPrompt, // Pass our systemPrompt here
    },
    onResponse: (_response) => {
      if (onResponseStarted) {
        onResponseStarted();
      }
    },
    onFinish: handleFinish,
    onError: handleError,
    ...vercelOptions,
  });

  // Custom submit function if more complex logic is needed before calling Vercel's handleSubmit
  // const customHandleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => {
  //   // Add any custom logic here, e.g., validation, modifying messages
  //   if (systemPrompt && messages.every(m => m.role !== 'system')) {
  //     // Ensure system prompt is included if not already
  //     // This is now handled by sending it in the body to the API route
  //   }
  //   handleSubmit(e, chatRequestOptions);
  // }, [handleSubmit, systemPrompt, messages]);

  return {
    messages: messages as ExtendedMessage[], // Cast if you extend Message
    input,
    handleInputChange,
    handleSubmit, // Use Vercel's handleSubmit directly or your custom one
    isLoading,
    error: chatbotError || vercelError, // Combine errors
    append,
    reload,
    stop,
    setMessages,
    setInput,
    systemPrompt, // Expose systemPrompt if needed by UI
  };
}

// Example of how you might use a non-streaming action (less common for chatbots)
// import { getChatbotResponse } from '@/actions/chatbot-actions';
// const sendMessageNonStreaming = useCallback(async (messageContent: string) => {
//   setIsLoading(true);
//   setError(null);
//   const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageContent };
//   const currentMessages = [...messages, userMessage];
//   setMessages(currentMessages);

//   const result = await getChatbotResponse({ messages: currentMessages, systemPrompt });
//   if (result.success && result.response) {
//     const assistantMessage: Message = { id: Date.now().toString(), role: 'assistant', content: result.response };
//     setMessages([...currentMessages, assistantMessage]);
//     onResponseCompleted?.(assistantMessage);
//   } else {
//     const err = new Error(result.error || "Failed to get response");
//     setError(err);
//     userOnError?.(err);
//     // Optionally remove the user's message or mark it as error
//   }
//   setIsLoading(false);
// }, [messages, systemPrompt, userOnError, onResponseCompleted]);
