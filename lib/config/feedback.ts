/**
 * Feedback Widget Configuration
 * 
 * Configure feedback collection settings
 */

export interface FeedbackConfig {
  categories?: string[];
  enableScreenshots?: boolean;
  enableRatings?: boolean;
  enableEmailCollection?: boolean;
  requireEmail?: boolean;
  allowAnonymous?: boolean;
  emailNotifications?: boolean;
  webhookUrl?: string;
}

export const defaultFeedbackConfig: FeedbackConfig = {
  categories: ['bug', 'feature', 'improvement', 'other'],
  enableScreenshots: true,
  enableRatings: true,
  enableEmailCollection: true,
  requireEmail: false,
  allowAnonymous: true,
  emailNotifications: true,
};

/**
 * Get feedback configuration with defaults
 */
export function getFeedbackConfig(userConfig?: Partial<FeedbackConfig>): FeedbackConfig {
  return {
    ...defaultFeedbackConfig,
    ...userConfig,
    webhookUrl: process.env.FEEDBACK_WEBHOOK_URL,
  };
}

/**
 * Validate feedback configuration
 */
export function validateFeedbackConfig(config: FeedbackConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.categories && config.categories.length === 0) {
    errors.push('At least one feedback category is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
