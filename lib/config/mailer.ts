/**
 * Mailer Configuration
 * 
 * Configure email providers (Resend, Nodemailer)
 */

export interface MailerConfig {
  provider: 'resend' | 'nodemailer';
  fromEmail?: string;
  fromName?: string;
  // Resend specific
  resendApiKey?: string;
  // Nodemailer specific
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

export const defaultMailerConfig: Partial<MailerConfig> = {
  provider: 'resend',
  fromEmail: 'noreply@yourapp.com',
  fromName: 'Your App',
};

/**
 * Get mailer configuration with defaults
 */
export function getMailerConfig(userConfig?: Partial<MailerConfig>): MailerConfig {
  // Ensure provider is set to a valid value
  const provider = process.env.EMAIL_PROVIDER as 'resend' | 'nodemailer' || 
                  userConfig?.provider || 
                  defaultMailerConfig.provider || 
                  'resend';
                  
  return {
    provider,
    ...defaultMailerConfig,
    ...userConfig,
    resendApiKey: process.env.RESEND_API_KEY,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
  };
}

/**
 * Validate mailer environment variables
 */
export function validateMailerConfig(config: MailerConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.provider === 'resend' && !process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required for Resend provider');
  }
  
  if (config.provider === 'nodemailer') {
    if (!process.env.SMTP_HOST) errors.push('SMTP_HOST is required for Nodemailer');
    if (!process.env.SMTP_USER) errors.push('SMTP_USER is required for Nodemailer');
    if (!process.env.SMTP_PASS) errors.push('SMTP_PASS is required for Nodemailer');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
