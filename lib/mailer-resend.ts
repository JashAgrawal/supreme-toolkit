/**
 * Supreme Toolkit - Resend Mailer
 * 
 * This module provides email functionality using Resend.
 * Resend is a modern email API that's easy to use and reliable.
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

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

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    const fromEmail = options.from || process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';

    const emailData: any = {
      from: fromEmail,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text || options.html || 'No content provided',
    };

    if (options.html) emailData.html = options.html;
    if (options.replyTo) emailData.replyTo = options.replyTo;
    if (options.cc) emailData.cc = options.cc;
    if (options.bcc) emailData.bcc = options.bcc;
    if (options.attachments) emailData.attachments = options.attachments;

    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Email sending failed:', error);
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
): Promise<{ success: boolean; error?: string }> {
  const subject = 'Welcome to our waitlist! 🎉';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to our waitlist</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to our waitlist!</h1>
        </div>
        
        <div class="content">
          <p>Hi ${name || 'there'},</p>
          
          <p>Thank you for joining our waitlist! We're excited to have you on board.</p>
          
          ${position ? `<p><strong>Your position:</strong> #${position}</p>` : ''}
          
          <p>We'll keep you updated on our progress and let you know as soon as we're ready to welcome you.</p>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Follow us on social media for updates</li>
            <li>Share with friends to move up in the waitlist</li>
            <li>Reply to this email if you have any questions</li>
          </ul>
          
          <p>Thanks again for your interest!</p>
          <p>The Team</p>
        </div>
        
        <div class="footer">
          <p>You're receiving this email because you signed up for our waitlist.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to our waitlist!
    
    Hi ${name || 'there'},
    
    Thank you for joining our waitlist! We're excited to have you on board.
    
    ${position ? `Your position: #${position}` : ''}
    
    We'll keep you updated on our progress and let you know as soon as we're ready to welcome you.
    
    Thanks again for your interest!
    The Team
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Send waitlist approval email
 */
export async function sendWaitlistApprovalEmail(
  email: string, 
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const subject = 'You\'re approved! Welcome aboard! 🚀';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're approved!</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { background: #f0f9ff; padding: 30px; border-radius: 8px; border: 2px solid #0ea5e9; }
        .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 You're approved!</h1>
        </div>
        
        <div class="content">
          <p>Hi ${name || 'there'},</p>
          
          <p><strong>Great news!</strong> You've been approved and can now access our platform.</p>
          
          <p>We're thrilled to welcome you aboard and can't wait to see what you'll create.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}" class="button">
              Get Started Now
            </a>
          </div>
          
          <p>If you have any questions or need help getting started, don't hesitate to reach out.</p>
          
          <p>Welcome to the community!</p>
          <p>The Team</p>
        </div>
        
        <div class="footer">
          <p>You're receiving this email because you were approved from our waitlist.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    You're approved!
    
    Hi ${name || 'there'},
    
    Great news! You've been approved and can now access our platform.
    
    We're thrilled to welcome you aboard and can't wait to see what you'll create.
    
    Get started: ${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}
    
    If you have any questions or need help getting started, don't hesitate to reach out.
    
    Welcome to the community!
    The Team
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY environment variable is not set' };
    }

    // Test with a simple email
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email Configuration',
      text: 'This is a test email to verify Resend configuration.',
      html: '<p>This is a test email to verify Resend configuration.</p>',
    });

    return result;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

const resendMailer = {
  sendEmail,
  sendWaitlistWelcomeEmail,
  sendWaitlistApprovalEmail,
  testEmailConfiguration,
};

export default resendMailer;
