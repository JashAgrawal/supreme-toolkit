/**
 * Supreme Toolkit Configuration
 * 
 * This file contains all configuration for Supreme Toolkit modules.
 * Each module can access its configuration through this centralized system.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuthConfig {
  providers: ('google' | 'github' | 'email')[];
  redirectUrl?: string;
  sessionDuration?: number; // in seconds
}

export interface StripeConfig {
  apiKey: string;
  productIds: string[];
  successUrl?: string;
  cancelUrl?: string;
  webhookSecret?: string;
}

export interface ResendConfig {
  apiKey: string;
  fromEmail?: string;
  fromName?: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset?: string;
}

export interface WaitlistConfig {
  successRedirect: string;
  emailNotifications?: boolean;
  autoApprove?: boolean;
}

export interface RichTextEditorConfig {
  saveEndpoint: string;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
}

export interface AnalyticsConfig {
  trackingId?: string;
  enablePageViews?: boolean;
  enableEvents?: boolean;
}

export interface ChatConfig {
  provider: 'supabase' | 'pusher';
  maxMessageLength?: number;
  enableTypingIndicators?: boolean;
  enableFileUploads?: boolean;
}

export interface SupportConfig {
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  autoAssignment?: boolean;
  emailNotifications?: boolean;
}

export interface WebhookConfig {
  enableLogging?: boolean;
  retryAttempts?: number;
  timeout?: number; // in milliseconds
}

export interface FeedbackConfig {
  categories?: string[];
  enableScreenshots?: boolean;
  emailNotifications?: boolean;
}

export interface NewsletterConfig {
  provider: 'mailerlite' | 'postmark' | 'resend';
  doubleOptIn?: boolean;
  welcomeEmail?: boolean;
}

// ============================================================================
// MAIN CONFIG INTERFACE
// ============================================================================

export interface ToolkitConfig {
  // Core modules
  auth?: AuthConfig;
  stripe?: StripeConfig;
  resend?: ResendConfig;
  
  // Advanced modules
  openai?: OpenAIConfig;
  supabase?: SupabaseConfig;
  cloudinary?: CloudinaryConfig;
  
  // Feature modules
  waitlist?: WaitlistConfig;
  richTextEditor?: RichTextEditorConfig;
  analytics?: AnalyticsConfig;
  chat?: ChatConfig;
  support?: SupportConfig;
  webhook?: WebhookConfig;
  feedback?: FeedbackConfig;
  newsletter?: NewsletterConfig;
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const defaultConfig: Partial<ToolkitConfig> = {
  auth: {
    providers: ['email'],
    sessionDuration: 30 * 24 * 60 * 60, // 30 days
  },
  waitlist: {
    successRedirect: '/thanks',
    emailNotifications: true,
    autoApprove: false,
  },
  richTextEditor: {
    saveEndpoint: '/api/save-content',
    autoSave: true,
    autoSaveInterval: 5000, // 5 seconds
  },
  analytics: {
    enablePageViews: true,
    enableEvents: true,
  },
  chat: {
    provider: 'supabase',
    maxMessageLength: 1000,
    enableTypingIndicators: true,
    enableFileUploads: false,
  },
  support: {
    defaultPriority: 'medium',
    autoAssignment: false,
    emailNotifications: true,
  },
  webhook: {
    enableLogging: true,
    retryAttempts: 3,
    timeout: 30000, // 30 seconds
  },
  feedback: {
    categories: ['bug', 'feature', 'improvement', 'other'],
    enableScreenshots: true,
    emailNotifications: true,
  },
  newsletter: {
    provider: 'resend',
    doubleOptIn: true,
    welcomeEmail: true,
  },
};

// ============================================================================
// USER CONFIGURATION
// ============================================================================

/**
 * Supreme Toolkit Configuration
 * 
 * Configure your Supreme Toolkit modules here.
 * Only include the modules you're using in your project.
 */
export const toolkitConfig: ToolkitConfig = {
  // waitlist-component: {
  //   // Add your waitlist-component configuration here
  // },

  // Authentication with betterAuth
  auth: {
    providers: ['google', 'email', 'github'],
  },
  
  // Stripe payments
  stripe: {
    apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    productIds: ['prod_example1', 'prod_example2'],
    successUrl: '/payment/success',
    cancelUrl: '/payment/cancel',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  
  // Email with Resend
  resend: {
    apiKey: process.env.RESEND_API_KEY!,
    fromEmail: 'noreply@yourapp.com',
    fromName: 'Your App',
  },
  
  // OpenAI for chatbot
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
  },
  
  // Supabase for realtime features
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Cloudinary for image uploads
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    uploadPreset: 'supreme-toolkit',
  },
  
  // Waitlist configuration
  waitlist: {
    successRedirect: '/thanks',
    emailNotifications: true,
  },
  
  // Rich text editor
  richTextEditor: {
    saveEndpoint: '/api/save-content',
    autoSave: true,
    autoSaveInterval: 3000, // 3 seconds
  },
  
  // Analytics
  analytics: {
    trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    enablePageViews: true,
    enableEvents: true,
  },
};

// ============================================================================
// CONFIG UTILITIES
// ============================================================================

/**
 * Get configuration for a specific module
 */
export function getModuleConfig<K extends keyof ToolkitConfig>(
  module: K
): ToolkitConfig[K] {
  const userConfig = toolkitConfig[module];
  const defaultModuleConfig = defaultConfig[module];
  
  if (!userConfig && !defaultModuleConfig) {
    throw new Error(`Configuration for module "${module}" not found`);
  }
  
  // Merge user config with defaults
  return {
    ...defaultModuleConfig,
    ...userConfig,
  } as ToolkitConfig[K];
}

/**
 * Validate that required environment variables are set
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check Stripe config if enabled
  if (toolkitConfig.stripe) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required for Stripe module');
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      errors.push('STRIPE_SECRET_KEY is required for Stripe module');
    }
  }
  
  // Check Resend config if enabled
  if (toolkitConfig.resend) {
    if (!process.env.RESEND_API_KEY) {
      errors.push('RESEND_API_KEY is required for Resend module');
    }
  }
  
  // Check OpenAI config if enabled
  if (toolkitConfig.openai) {
    if (!process.env.OPENAI_API_KEY) {
      errors.push('OPENAI_API_KEY is required for OpenAI module');
    }
  }
  
  // Check Supabase config if enabled
  if (toolkitConfig.supabase) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is required for Supabase module');
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required for Supabase module');
    }
  }
  
  // Check Cloudinary config if enabled
  if (toolkitConfig.cloudinary) {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      errors.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required for Cloudinary module');
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      errors.push('CLOUDINARY_API_KEY is required for Cloudinary module');
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      errors.push('CLOUDINARY_API_SECRET is required for Cloudinary module');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a module is enabled in the configuration
 */
export function isModuleEnabled(module: keyof ToolkitConfig): boolean {
  return toolkitConfig[module] !== undefined;
}
