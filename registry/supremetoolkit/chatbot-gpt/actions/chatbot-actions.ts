"use server";
import { sendChatCompletion, getChatCompletion, handleOpenAIError } from '../lib/openai';
import { openaiConfig } from '../lib/config';
import type { ChatbotMessage, ChatbotConversation } from '../types';

// ============================================================================
// CHATBOT SERVER ACTIONS
// ============================================================================

// Simple in-memory store for demo - replace with your database
const conversationStore: Map<string, ChatbotConversation> = new Map();

/**
 * Send a message to the chatbot and get a response
 */
export async function sendChatbotMessage(
  messages: ChatbotMessage[],
  options: {
    userId?: string;
    systemPrompt?: string;
    conversationId?: string;
    stream?: boolean;
  } = {}
): Promise<{
  success: boolean;
  message?: ChatbotMessage;
  error?: string;
}> {
  try {
    if (!messages.length) {
      return {
        success: false,
        error: 'No messages provided',
      };
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return {
        success: false,
        error: 'Last message must be from user',
      };
    }

    // Get AI response
    const result = await getChatCompletion(messages, {
      systemPrompt: options.systemPrompt || openaiConfig.systemPrompt,
      userId: options.userId,
    });

    const assistantMessage: ChatbotMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      role: 'assistant',
      content: result.content,
      timestamp: new Date(),
      metadata: {
        model: openaiConfig.model,
        tokens: result.usage.total_tokens,
      },
    };

    // Save conversation if ID provided
    if (options.conversationId) {
      await saveConversationMessage(options.conversationId, assistantMessage, options.userId);
    }

    return {
      success: true,
      message: assistantMessage,
    };
  } catch (error: any) {
    const errorMessage = await handleOpenAIError(error);
    console.error('Error in sendChatbotMessage:', error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Create a new conversation
 */
export async function createChatbotConversation(
  userId?: string,
  title?: string
): Promise<{
  success: boolean;
  conversation?: ChatbotConversation;
  error?: string;
}> {
  try {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const conversation: ChatbotConversation = {
      id: conversationId,
      title: title || 'New Conversation',
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
      user_id: userId,
      metadata: {
        model: openaiConfig.model,
        totalTokens: 0,
        totalCost: 0,
      },
    };

    conversationStore.set(conversationId, conversation);

    return {
      success: true,
      conversation,
    };
  } catch (error) {
    console.error('Error creating conversation:', error);
    return {
      success: false,
      error: 'Failed to create conversation',
    };
  }
}

/**
 * Get a conversation by ID
 */
export async function getChatbotConversation(
  conversationId: string,
  userId?: string
): Promise<{
  success: boolean;
  conversation?: ChatbotConversation;
  error?: string;
}> {
  try {
    const conversation = conversationStore.get(conversationId);
    
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Check if user has access to this conversation
    if (userId && conversation.user_id && conversation.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    return {
      success: true,
      conversation,
    };
  } catch (error) {
    console.error('Error getting conversation:', error);
    return {
      success: false,
      error: 'Failed to get conversation',
    };
  }
}

/**
 * Get all conversations for a user
 */
export async function getUserChatbotConversations(
  userId: string
): Promise<{
  success: boolean;
  conversations?: ChatbotConversation[];
  error?: string;
}> {
  try {
    const userConversations = Array.from(conversationStore.values())
      .filter(conv => conv.user_id === userId)
      .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());

    return {
      success: true,
      conversations: userConversations,
    };
  } catch (error) {
    console.error('Error getting user conversations:', error);
    return {
      success: false,
      error: 'Failed to get conversations',
    };
  }
}

/**
 * Save a message to a conversation
 */
export async function saveConversationMessage(
  conversationId: string,
  message: ChatbotMessage,
  userId?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const conversation = conversationStore.get(conversationId);
    
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Check if user has access to this conversation
    if (userId && conversation.user_id && conversation.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    // Add message to conversation
    conversation.messages.push(message);
    conversation.updated_at = new Date();

    // Update metadata
    if (message.metadata?.tokens) {
      conversation.metadata!.totalTokens += message.metadata.tokens;
    }

    conversationStore.set(conversationId, conversation);

    return { success: true };
  } catch (error) {
    console.error('Error saving message:', error);
    return {
      success: false,
      error: 'Failed to save message',
    };
  }
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
  conversationId: string,
  title: string,
  userId?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const conversation = conversationStore.get(conversationId);
    
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Check if user has access to this conversation
    if (userId && conversation.user_id && conversation.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    conversation.title = title.trim();
    conversation.updated_at = new Date();

    conversationStore.set(conversationId, conversation);

    return { success: true };
  } catch (error) {
    console.error('Error updating conversation title:', error);
    return {
      success: false,
      error: 'Failed to update title',
    };
  }
}

/**
 * Delete a conversation
 */
export async function deleteChatbotConversation(
  conversationId: string,
  userId?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const conversation = conversationStore.get(conversationId);
    
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Check if user has access to this conversation
    if (userId && conversation.user_id && conversation.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    conversationStore.delete(conversationId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return {
      success: false,
      error: 'Failed to delete conversation',
    };
  }
}
