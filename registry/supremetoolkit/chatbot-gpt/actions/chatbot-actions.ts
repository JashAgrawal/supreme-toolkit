"use server";

import OpenAI from 'openai';
import { getModuleConfig } from '@/config';
import { Message } from '@/types/chatbot'; // Using the re-exported type

let openai: OpenAI;

function getOpenAIClient() {
  if (openai) {
    return openai;
  }
  const openAIConfig = getModuleConfig('openai');
  if (!openAIConfig || !openAIConfig.apiKey) {
    throw new Error('OpenAI API key not configured in toolkitConfig.openai');
  }
  openai = new OpenAI({
    apiKey: openAIConfig.apiKey,
  });
  return openai;
}

interface GetChatbotResponseParams {
  messages: Message[]; // Expects an array of Message objects { role, content }
  systemPrompt?: string;
}

export async function getChatbotResponse({
  messages,
  systemPrompt: paramSystemPrompt,
}: GetChatbotResponseParams): Promise<{ success: boolean; response?: string; error?: string }> {
  if (!messages || messages.length === 0) {
    return { success: false, error: "Messages are required." };
  }

  try {
    const client = getOpenAIClient();
    const openAIConfig = getModuleConfig('openai');

    const systemMessageContent = paramSystemPrompt || openAIConfig?.systemPrompt || "You are a helpful AI assistant.";

    const processedMessages = [
      { role: "system", content: systemMessageContent },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    const completion = await client.chat.completions.create({
      model: openAIConfig?.model || 'gpt-3.5-turbo',
      messages: processedMessages as any, // OpenAI SDK expects specific ChatCompletionMessageParam array
      max_tokens: openAIConfig?.maxTokens || 1024,
      temperature: openAIConfig?.temperature || 0.7,
      // stream: false, // Default is false
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (responseContent) {
      return { success: true, response: responseContent };
    } else {
      return { success: false, error: "No response content from OpenAI." };
    }
  } catch (error) {
    console.error("[CHATBOT ACTION ERROR]", error);
    let errorMessage = 'An unexpected error occurred';
     if (error instanceof OpenAI.APIError) {
      errorMessage = error.message || 'Error from OpenAI API';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// Placeholder for other potential chatbot-related server actions
// For example, logging conversations, user feedback on responses, etc.

export async function logConversation(messages: Message[], userId?: string): Promise<{ success: boolean }> {
  console.log("Logging conversation for user:", userId, messages);
  // In a real app, you might save this to a database
  // await db.table('chatbot_logs').insert({ userId, messages, timestamp: new Date() });
  return { success: true };
}
