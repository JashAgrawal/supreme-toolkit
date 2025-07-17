/**
 * Authentication Module Configuration
 * 
 * Configure betterAuth providers and settings
 */

export interface AuthConfig {
  providers: ('google' | 'github' | 'email')[];
  redirectUrl?: string;
  sessionDuration?: number; // in seconds
}

export const defaultAuthConfig: AuthConfig = {
  providers: ['email'],
  sessionDuration: 30 * 24 * 60 * 60, // 30 days
};

/**
 * Get auth configuration with defaults
 */
export function getAuthConfig(userConfig?: Partial<AuthConfig>): AuthConfig {
  return {
    ...defaultAuthConfig,
    ...userConfig,
  };
}

/**
 * Validate auth environment variables
 */
export function validateAuthConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.BETTER_AUTH_SECRET) {
    errors.push('BETTER_AUTH_SECRET is required for auth module');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
