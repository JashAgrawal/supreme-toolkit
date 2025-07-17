/**
 * Stripe Configuration
 * 
 * Configure Stripe payments, subscriptions, and customer portal
 */

export interface StripeConfig {
  apiKey: string;
  productIds?: string[];
  successUrl?: string;
  cancelUrl?: string;
  webhookSecret?: string;
}

export const defaultStripeConfig: Partial<StripeConfig> = {
  successUrl: '/payment/success',
  cancelUrl: '/payment/cancel',
};

/**
 * Get Stripe configuration with defaults
 */
export function getStripeConfig(userConfig?: Partial<StripeConfig>): StripeConfig {
  return {
    ...defaultStripeConfig,
    ...userConfig,
    apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  };
}

/**
 * Validate Stripe environment variables
 */
export function validateStripeConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required for Stripe module');
  }
  
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is required for Stripe module');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
