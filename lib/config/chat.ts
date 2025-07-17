/**
 * Chat Realtime Configuration
 *
 * Configure chat settings (Convex only)
 */

export interface ChatConfig {
  maxMessageLength?: number;
  enableTypingIndicators?: boolean;
  enableFileUploads?: boolean;
  enableReactions?: boolean;
}

export const defaultChatConfig: Partial<ChatConfig> = {
  maxMessageLength: 1000,
  enableTypingIndicators: true,
  enableFileUploads: false,
  enableReactions: true,
};

/**
 * Get chat configuration with defaults
 */
export function getChatConfig(userConfig?: Partial<ChatConfig>): ChatConfig {
  return {
    ...defaultChatConfig,
    ...userConfig,
  };
}
