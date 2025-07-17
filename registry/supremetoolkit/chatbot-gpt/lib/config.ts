import { getModuleConfig } from "@/config";
import { ChatbotConfig } from "../types";

const config = getModuleConfig('chatbot') as ChatbotConfig;

export const openaiConfig = {
  apiKey: config.openaiApiKey,
  model: config.model || 'gpt-3.5-turbo',
  maxTokens: config.maxTokens || 1000,
  temperature: config.temperature || 0.7,
  systemPrompt: config.systemPrompt || 'You are a helpful AI assistant.',
  enableStreaming: config.enableStreaming ?? true,
};