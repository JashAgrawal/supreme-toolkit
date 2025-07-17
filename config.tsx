/**
 * Supreme Toolkit Configuration
 *
 * Configure your Supreme Toolkit modules here.
 * Only include the modules you're using in your project.
 *
 * Each module has its own configuration interface.
 * Add environment variables to your .env.local file.
 */

// ============================================================================
// MODULE CONFIGURATIONS
// ============================================================================

/**
 * Authentication Module Configuration
 * Requires: better-auth setup
 */
export const authConfig = {
  providers: ['google', 'email', 'github'] as const,
  // Add your auth configuration here
};

/**
 * Stripe Payment Configuration
 * Requires: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY
 */
export const stripeConfig = {
  apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  successUrl: '/payment/success',
  cancelUrl: '/payment/cancel',
  // Add your Stripe configuration here
};

/**
 * Mailer Configuration
 * Requires: RESEND_API_KEY or SMTP credentials
 */
export const mailerConfig = {
  provider: 'resend' as const,
  resendApiKey: process.env.RESEND_API_KEY,
  fromEmail: 'noreply@yourapp.com',
  fromName: 'Your App',
  // Add your mailer configuration here
};

/**
 * Convex Database Configuration
 * Requires: NEXT_PUBLIC_CONVEX_URL
 */
export const convexConfig = {
  url: process.env.NEXT_PUBLIC_CONVEX_URL || "",
  // Add your Convex configuration here
};

/**
 * Waitlist Configuration
 */
export const waitlistConfig = {
  successRedirect: '/thanks',
  emailNotifications: true,
  database: 'convex', // Using Convex as the database
};

/**
 * Chat Realtime Configuration
 * Now using Convex for real-time messaging
 */
export const chatConfig = {
  database: 'convex', // Using Convex for real-time chat
  maxMessageLength: 1000,
  enableFileUploads: true,
  enableTypingIndicators: true,
  enableReactions: true,
  maxParticipants: 100,
  // Add your chat configuration here
};

/**
 * Chatbot GPT Configuration
 * Requires: OPENAI_API_KEY
 */
export const chatbotConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7,
  systemPrompt: 'You are a helpful assistant.',
  enableStreaming: true,
  enableFeedback: true,
  // Add your chatbot configuration here
};

/**
 * Support Ticket System Configuration
 */
export const supportConfig = {
  database: 'convex', // Using Convex for support tickets
  defaultPriority: 'medium' as const,
  emailNotifications: true,
  autoAssignment: false,
  enableFileUploads: true,
  maxFileSize: 10,
  allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx'],
};

/**
 * Feedback Widget Configuration
 */
export const feedbackConfig = {
  database: 'convex', // Using Convex for feedback storage
  categories: ['bug', 'feature', 'improvement', 'other'],
  enableScreenshots: true,
  emailNotifications: true,
  enableRatings: true,
  enableEmailCollection: true,
};

/**
 * Image Uploader Configuration
 * Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (for Cloudinary)
 */
export const imageUploaderConfig = {
  provider: 'cloudinary' as const,
  maxFileSize: 10, // MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  enableThumbnails: true,
  enableOptimization: true,
  // Add your image uploader configuration here
};

/**
 * Rich Text Editor Configuration
 */
export const richTextEditorConfig = {
  placeholder: 'Start writing...',
  enableWordCount: true,
  enableSpellCheck: true,
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  linkValidation: true,
  // Add your editor configuration here
};

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

/**
 * Get configuration for a specific module
 * This function provides backward compatibility for existing modules
 */
export function getModuleConfig(moduleName: string): any {
  switch (moduleName) {
    case 'auth':
      return authConfig;
    case 'stripe':
      return stripeConfig;
    case 'mailer':
      return mailerConfig;
    case 'waitlist':
      return waitlistConfig;
    case 'chat':
      return chatConfig;
    case 'chatbot':
      return chatbotConfig;
    case 'support':
    case 'tickets':
      return supportConfig;
    case 'feedback':
      return feedbackConfig;
    case 'imageUpload':
    case 'imageUploader':
      return imageUploaderConfig;
    case 'richTextEditor':
    case 'editor':
      return richTextEditorConfig;
    case 'convex':
      return convexConfig;
    default:
      throw new Error(`Configuration for module "${moduleName}" not found`);
  }
}

// ============================================================================
// ENVIRONMENT VARIABLES REFERENCE
// ============================================================================

/**
 * Required Environment Variables by Module:
 *
 * AUTH MODULE:
 * - BETTER_AUTH_SECRET
 * - GOOGLE_CLIENT_ID (if using Google)
 * - GOOGLE_CLIENT_SECRET (if using Google)
 * - GITHUB_CLIENT_ID (if using GitHub)
 * - GITHUB_CLIENT_SECRET (if using GitHub)
 *
 * STRIPE MODULES:
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 *
 * MAILER MODULE:
 * - RESEND_API_KEY (for Resend)
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (for Nodemailer)
 *
 *
 * CHATBOT GPT:
 * - OPENAI_API_KEY
 *
 * IMAGE UPLOADER:
 * - CLOUDINARY_CLOUD_NAME (for Cloudinary)
 * - CLOUDINARY_API_KEY (for Cloudinary)
 * - CLOUDINARY_API_SECRET (for Cloudinary)
 */
