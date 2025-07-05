/**
 * Supreme Toolkit - Unified Mailer
 * 
 * This module automatically detects and uses the appropriate mailer
 * based on what's available in the user's environment.
 * 
 * Priority:
 * 1. Resend (if RESEND_API_KEY is set)
 * 2. Nodemailer (if SMTP/Gmail config is set)
 * 3. Fallback to Resend with warning
 */

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface MailerResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Detect which mailer to use based on environment variables
 */
function detectMailer(): 'resend' | 'nodemailer' | 'none' {
  // Check for Resend
  if (process.env.RESEND_API_KEY) {
    return 'resend';
  }
  
  // Check for Nodemailer configurations
  if (
    process.env.SMTP_HOST || 
    process.env.GMAIL_USER || 
    process.env.EMAIL_PROVIDER
  ) {
    return 'nodemailer';
  }
  
  return 'none';
}

/**
 * Get the appropriate mailer module
 */
async function getMailer() {
  const mailerType = detectMailer();
  
  switch (mailerType) {
    case 'resend':
      try {
        const resendMailer = await import('./mailer-resend');
        return { type: 'resend', mailer: resendMailer.default };
      } catch {
        console.warn('Resend mailer not available, falling back to nodemailer');
        const nodemailerMailer = await import('./mailer-nodemailer');
        return { type: 'nodemailer', mailer: nodemailerMailer.default };
      }
      
    case 'nodemailer':
      try {
        const nodemailerMailer = await import('./mailer-nodemailer');
        return { type: 'nodemailer', mailer: nodemailerMailer.default };
      } catch {
        console.warn('Nodemailer not available, falling back to resend');
        const resendMailer = await import('./mailer-resend');
        return { type: 'resend', mailer: resendMailer.default };
      }
      
    case 'none':
    default:
      console.warn('No mailer configuration found, using Resend as default. Please set RESEND_API_KEY or SMTP configuration.');
      try {
        const resendMailer = await import('./mailer-resend');
        return { type: 'resend', mailer: resendMailer.default };
      } catch {
        throw new Error('No mailer available. Please install and configure either Resend or Nodemailer.');
      }
  }
}

/**
 * Send an email using the detected mailer
 */
export async function sendEmail(options: EmailOptions): Promise<MailerResult> {
  try {
    const { mailer } = await getMailer();
    return await mailer.sendEmail(options);
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Send a welcome email to waitlist subscribers
 */
export async function sendWaitlistWelcomeEmail(
  email: string, 
  name?: string, 
  position?: number
): Promise<MailerResult> {
  try {
    const { mailer } = await getMailer();
    return await mailer.sendWaitlistWelcomeEmail(email, name, position);
  } catch (error) {
    console.error('Failed to send waitlist welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Send waitlist approval email
 */
export async function sendWaitlistApprovalEmail(
  email: string, 
  name?: string
): Promise<MailerResult> {
  try {
    const { mailer } = await getMailer();
    return await mailer.sendWaitlistApprovalEmail(email, name);
  } catch (error) {
    console.error('Failed to send waitlist approval email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(): Promise<MailerResult & { mailerType?: string }> {
  try {
    const { type, mailer } = await getMailer();
    const result = await mailer.testEmailConfiguration();
    return { ...result, mailerType: type };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get mailer configuration info
 */
export function getMailerInfo(): { 
  type: 'resend' | 'nodemailer' | 'none';
  configured: boolean;
  details: string;
} {
  const type = detectMailer();
  
  switch (type) {
    case 'resend':
      return {
        type: 'resend',
        configured: true,
        details: 'Using Resend API for email delivery'
      };
      
    case 'nodemailer':
      const provider = process.env.EMAIL_PROVIDER || 'smtp';
      return {
        type: 'nodemailer',
        configured: true,
        details: `Using Nodemailer with ${provider.toUpperCase()} configuration`
      };
      
    case 'none':
    default:
      return {
        type: 'none',
        configured: false,
        details: 'No email configuration found. Please set RESEND_API_KEY or SMTP configuration.'
      };
  }
}

/**
 * Send a test email to verify configuration
 */
export async function sendTestEmail(to: string): Promise<MailerResult> {
  const subject = 'Supreme Toolkit - Email Configuration Test';
  const html = `
    <h2>Email Configuration Test</h2>
    <p>This is a test email to verify your Supreme Toolkit email configuration.</p>
    <p><strong>Mailer:</strong> ${getMailerInfo().details}</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    <p>If you received this email, your configuration is working correctly! 🎉</p>
  `;
  
  const text = `
    Email Configuration Test
    
    This is a test email to verify your Supreme Toolkit email configuration.
    
    Mailer: ${getMailerInfo().details}
    Timestamp: ${new Date().toISOString()}
    
    If you received this email, your configuration is working correctly!
  `;

  return await sendEmail({
    to,
    subject,
    html,
    text,
  });
}

const mailer = {
  sendEmail,
  sendWaitlistWelcomeEmail,
  sendWaitlistApprovalEmail,
  testEmailConfiguration,
  getMailerInfo,
  sendTestEmail,
};

export default mailer;
