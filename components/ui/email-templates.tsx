/**
 * Supreme Toolkit - Email Templates
 * 
 * Reusable email template components for consistent email design.
 * These components generate HTML strings for email content.
 */

export interface EmailTemplateProps {
  [key: string]: any;
}

/**
 * Base Email Template
 * Provides consistent styling and structure for all emails
 */
export function BaseEmailTemplate({
  title,
  children,
  footerText = "You're receiving this email because you signed up for our service.",
  unsubscribeUrl,
  companyName = "Your Company",
  _companyUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourcompany.com",
}: {
  title: string;
  children: string;
  footerText?: string;
  unsubscribeUrl?: string;
  companyName?: string;
  _companyUrl?: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 0;
        }
        .header {
          background-color: #ffffff;
          padding: 30px 40px 20px;
          text-align: center;
          border-bottom: 1px solid #e5e5e5;
        }
        .content {
          padding: 40px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 30px 40px;
          text-align: center;
          color: #666666;
          font-size: 14px;
          border-top: 1px solid #e5e5e5;
        }
        .button {
          display: inline-block;
          background-color: #007bff;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #0056b3;
        }
        h1 {
          color: #333333;
          font-size: 24px;
          margin: 0 0 20px;
        }
        h2 {
          color: #333333;
          font-size: 20px;
          margin: 30px 0 15px;
        }
        p {
          margin: 0 0 15px;
        }
        .highlight {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
          margin: 20px 0;
        }
        .text-center {
          text-align: center;
        }
        .text-muted {
          color: #666666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${companyName}</h1>
        </div>
        
        <div class="content">
          ${children}
        </div>
        
        <div class="footer">
          <p>${footerText}</p>
          ${unsubscribeUrl ? `<p><a href="${unsubscribeUrl}" style="color: #666666;">Unsubscribe</a></p>` : ''}
          <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Welcome Email Template
 */
export function WelcomeEmailTemplate({
  name,
  ctaUrl,
  ctaText = "Get Started",
  companyName = "Your Company",
}: {
  name?: string;
  ctaUrl?: string;
  ctaText?: string;
  companyName?: string;
}) {
  const content = `
    <h1>Welcome${name ? `, ${name}` : ''}! 🎉</h1>
    
    <p>Thank you for joining ${companyName}! We're excited to have you on board.</p>
    
    <p>Here's what you can do next:</p>
    
    <ul>
      <li>Complete your profile setup</li>
      <li>Explore our features</li>
      <li>Connect with our community</li>
    </ul>
    
    ${ctaUrl ? `
      <div class="text-center">
        <a href="${ctaUrl}" class="button">${ctaText}</a>
      </div>
    ` : ''}
    
    <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
    
    <p>Welcome to the community!</p>
    
    <p>Best regards,<br>The ${companyName} Team</p>
  `;

  return BaseEmailTemplate({
    title: `Welcome to ${companyName}`,
    children: content,
    companyName,
  });
}

/**
 * Password Reset Email Template
 */
export function PasswordResetEmailTemplate({
  name,
  resetUrl,
  expiryHours = 24,
  companyName = "Your Company",
}: {
  name?: string;
  resetUrl: string;
  expiryHours?: number;
  companyName?: string;
}) {
  const content = `
    <h1>Password Reset Request</h1>
    
    <p>Hi${name ? ` ${name}` : ''},</p>
    
    <p>We received a request to reset your password for your ${companyName} account.</p>
    
    <div class="highlight">
      <p><strong>If you didn't request this password reset, please ignore this email.</strong></p>
    </div>
    
    <p>To reset your password, click the button below:</p>
    
    <div class="text-center">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <p>This link will expire in ${expiryHours} hours for security reasons.</p>
    
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666666;">${resetUrl}</p>
    
    <p>Best regards,<br>The ${companyName} Team</p>
  `;

  return BaseEmailTemplate({
    title: "Password Reset Request",
    children: content,
    companyName,
  });
}

/**
 * Email Verification Template
 */
export function EmailVerificationTemplate({
  name,
  verificationUrl,
  companyName = "Your Company",
}: {
  name?: string;
  verificationUrl: string;
  companyName?: string;
}) {
  const content = `
    <h1>Verify Your Email Address</h1>
    
    <p>Hi${name ? ` ${name}` : ''},</p>
    
    <p>Thank you for signing up for ${companyName}! To complete your registration, please verify your email address.</p>
    
    <div class="text-center">
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </div>
    
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666666;">${verificationUrl}</p>
    
    <div class="highlight">
      <p><strong>This verification link will expire in 24 hours.</strong></p>
    </div>
    
    <p>If you didn't create an account with ${companyName}, please ignore this email.</p>
    
    <p>Best regards,<br>The ${companyName} Team</p>
  `;

  return BaseEmailTemplate({
    title: "Verify Your Email Address",
    children: content,
    companyName,
  });
}

/**
 * Notification Email Template
 */
export function NotificationEmailTemplate({
  title,
  message,
  ctaUrl,
  ctaText,
  priority = "normal",
  companyName = "Your Company",
}: {
  title: string;
  message: string;
  ctaUrl?: string;
  ctaText?: string;
  priority?: "low" | "normal" | "high";
  companyName?: string;
}) {
  const priorityColors = {
    low: "#28a745",
    normal: "#007bff",
    high: "#dc3545",
  };

  const content = `
    <h1>${title}</h1>
    
    <div class="highlight" style="border-left-color: ${priorityColors[priority]};">
      <p>${message}</p>
    </div>
    
    ${ctaUrl && ctaText ? `
      <div class="text-center">
        <a href="${ctaUrl}" class="button" style="background-color: ${priorityColors[priority]};">${ctaText}</a>
      </div>
    ` : ''}
    
    <p>Best regards,<br>The ${companyName} Team</p>
  `;

  return BaseEmailTemplate({
    title,
    children: content,
    companyName,
  });
}
