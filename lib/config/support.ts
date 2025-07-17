/**
 * Support Ticket System Configuration
 * 
 * Configure support ticket settings
 */

export interface SupportConfig {
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  autoAssignment?: boolean;
  emailNotifications?: boolean;
  enableFileUploads?: boolean;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
}

export const defaultSupportConfig: SupportConfig = {
  defaultPriority: 'medium',
  autoAssignment: false,
  emailNotifications: true,
  enableFileUploads: true,
  maxFileSize: 10,
  allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx'],
};

/**
 * Get support configuration with defaults
 */
export function getSupportConfig(userConfig?: Partial<SupportConfig>): SupportConfig {
  return {
    ...defaultSupportConfig,
    ...userConfig,
  };
}

/**
 * Validate support configuration
 */
export function validateSupportConfig(config: SupportConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(config.defaultPriority)) {
    errors.push('defaultPriority must be one of: low, medium, high, urgent');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
