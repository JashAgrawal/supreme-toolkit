"use server";

import { sendChatCompletion, getChatCompletion, processStreamingResponse } from '../lib/openai';
import type { ChatbotMessage } from '../types';

/**
 * Server action to send a chat completion request
 */
export async function sendChatCompletionAction(
  messages: ChatbotMessage[],
  options: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
    userId?: string;
  } = {}
) {
  return await sendChatCompletion(messages, options);
}

/**
 * Server action to get a non-streaming chat completion
 */
export async function getChatCompletionAction(
  messages: ChatbotMessage[],
  options: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    userId?: string;
  } = {}
) {
  return await getChatCompletion(messages, options);
}

/**
 * Server action to process streaming response
 */
export async function* processStreamingResponseAction(stream: any) {
  yield* processStreamingResponse(stream);
}
