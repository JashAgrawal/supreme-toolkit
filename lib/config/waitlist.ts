/**
 * Waitlist Configuration
 * 
 * Configure waitlist settings
 */

export interface WaitlistConfig {
  successRedirect?: string;
  emailNotifications?: boolean;
  autoApprove?: boolean;
  requireEmailConfirmation?: boolean;
  customFields?: Array<{
    name: string;
    type: 'text' | 'email' | 'select';
    required: boolean;
    options?: string[];
  }>;
}

export const defaultWaitlistConfig: WaitlistConfig = {
  successRedirect: '/thanks',
  emailNotifications: true,
  autoApprove: false,
  requireEmailConfirmation: true,
};

/**
 * Get waitlist configuration with defaults
 */
export function getWaitlistConfig(userConfig?: Partial<WaitlistConfig>): WaitlistConfig {
  return {
    ...defaultWaitlistConfig,
    ...userConfig,
  };
}

/**
 * Validate waitlist configuration
 */
export function validateWaitlistConfig(config: WaitlistConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.customFields) {
    for (const field of config.customFields) {
      if (!field.name) {
        errors.push('Custom field name is required');
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        errors.push(`Select field "${field.name}" must have options`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
