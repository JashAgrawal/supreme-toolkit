"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function MailerPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = `npx shadcn@latest add "https://supreme.jashagrawal.in/r/mailer-module.json"`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📧 Mailer Module</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Universal email system with auto-detection for Resend and Nodemailer, email templates, and testing components.
        </p>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✨ Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Auto</Badge>
              <div>
                <p className="font-medium">Auto-Detection</p>
                <p className="text-sm text-muted-foreground">Automatically detects and uses Resend or Nodemailer</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Templates</Badge>
              <div>
                <p className="font-medium">Email Templates</p>
                <p className="text-sm text-muted-foreground">Pre-built templates for common email types</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Providers</Badge>
              <div>
                <p className="font-medium">Multiple Providers</p>
                <p className="text-sm text-muted-foreground">Resend, SMTP, Gmail, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Testing</Badge>
              <div>
                <p className="font-medium">Testing Components</p>
                <p className="text-sm text-muted-foreground">Built-in email testing and validation</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Hooks</Badge>
              <div>
                <p className="font-medium">React Hooks</p>
                <p className="text-sm text-muted-foreground">useMailer hook for easy email sending</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Actions</Badge>
              <div>
                <p className="font-medium">Server Actions</p>
                <p className="text-sm text-muted-foreground">Email event handlers and analytics</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Installation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{installCommand}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(installCommand, 'install')}
              >
                {copiedCode === 'install' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">This installs:</p>
              <ul className="space-y-1 ml-4">
                <li>• Universal mailer with auto-detection</li>
                <li>• Resend and Nodemailer implementations</li>
                <li>• Pre-built email templates</li>
                <li>• useMailer hook for React components</li>
                <li>• Email testing and validation components</li>
                <li>• Server actions for email events</li>
                <li>• Required dependencies (resend, nodemailer, @react-email/components)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>📦 What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="components" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">MailerTest</h4>
                  <p className="text-sm text-muted-foreground">Email testing component with configuration validation</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">EmailTemplates</h4>
                  <p className="text-sm text-muted-foreground">Pre-built email template components</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Universal Mailer</h4>
                  <p className="text-sm text-muted-foreground">Auto-detecting email service</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">WelcomeEmailTemplate</h4>
                  <p className="text-sm text-muted-foreground">Welcome email for new users</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">EmailVerificationTemplate</h4>
                  <p className="text-sm text-muted-foreground">Email address verification</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">PasswordResetTemplate</h4>
                  <p className="text-sm text-muted-foreground">Password reset instructions</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">WaitlistTemplate</h4>
                  <p className="text-sm text-muted-foreground">Waitlist confirmation and updates</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">BaseEmailTemplate</h4>
                  <p className="text-sm text-muted-foreground">Base template for consistent styling</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hooks" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useMailer</h4>
                  <p className="text-sm text-muted-foreground">Complete email sending functionality</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ send, sendTest, isLoading, error }`} = useMailer()
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="providers" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Resend</h4>
                  <p className="text-sm text-muted-foreground">Modern email API (recommended)</p>
                  <Badge variant="outline" className="mt-1">Priority 1</Badge>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Nodemailer SMTP</h4>
                  <p className="text-sm text-muted-foreground">Traditional SMTP configuration</p>
                  <Badge variant="outline" className="mt-1">Priority 2</Badge>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Gmail</h4>
                  <p className="text-sm text-muted-foreground">Gmail with App Passwords</p>
                  <Badge variant="outline" className="mt-1">Via Nodemailer</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Auto-Detection Priority</h4>
              <p className="text-sm text-muted-foreground mb-2">The mailer automatically detects and uses providers in this order:</p>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. <strong>Resend</strong> - if RESEND_API_KEY is set</li>
                <li>2. <strong>Nodemailer</strong> - if SMTP/Gmail config is set</li>
                <li>3. <strong>Fallback</strong> - defaults to Resend with warning</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Environment Variables (Resend):</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# .env.local - Resend Configuration (Recommended)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`# .env.local - Resend Configuration (Recommended)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com`, 'resend-env')}
                    >
                      {copiedCode === 'resend-env' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Environment Variables (SMTP):</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# .env.local - SMTP Configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`# .env.local - SMTP Configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com`, 'smtp-env')}
                    >
                      {copiedCode === 'smtp-env' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Environment Variables (Gmail):</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# .env.local - Gmail Configuration
EMAIL_PROVIDER=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`# .env.local - Gmail Configuration
EMAIL_PROVIDER=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com`, 'gmail-env')}
                    >
                      {copiedCode === 'gmail-env' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Server-side email sending:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { sendEmail } from '@/lib/mailer';

// Server action or API route
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const result = await sendEmail({
    to: userEmail,
    subject: 'Welcome to Our Platform!',
    html: \`
      <h1>Welcome, \${userName}!</h1>
      <p>Thank you for joining our platform.</p>
      <a href="https://yourapp.com/dashboard">Get Started</a>
    \`,
    text: \`Welcome, \${userName}! Thank you for joining our platform.\`
  });

  if (result.success) {
    console.log('Email sent successfully:', result.id);
  } else {
    console.error('Failed to send email:', result.error);
  }

  return result;
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { sendEmail } from '@/lib/mailer';

// Server action or API route
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const result = await sendEmail({
    to: userEmail,
    subject: 'Welcome to Our Platform!',
    html: \`
      <h1>Welcome, \${userName}!</h1>
      <p>Thank you for joining our platform.</p>
      <a href="https://yourapp.com/dashboard">Get Started</a>
    \`,
    text: \`Welcome, \${userName}! Thank you for joining our platform.\`
  });

  if (result.success) {
    console.log('Email sent successfully:', result.id);
  } else {
    console.error('Failed to send email:', result.error);
  }

  return result;
}`, 'server-email')}
                    >
                      {copiedCode === 'server-email' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Client-side with useMailer hook:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useMailer } from '@/hooks/use-mailer';
import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { send, isLoading, error } = useMailer({
    onSuccess: () => {
      alert('Email sent successfully!');
      setEmail('');
      setMessage('');
    },
    onError: (error) => {
      alert(\`Failed to send email: \${error}\`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await send({
      to: 'support@yourcompany.com',
      subject: 'New Contact Form Submission',
      html: \`
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> \${email}</p>
        <p><strong>Message:</strong></p>
        <p>\${message}</p>
      \`
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useMailer } from '@/hooks/use-mailer';
import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { send, isLoading, error } = useMailer({
    onSuccess: () => {
      alert('Email sent successfully!');
      setEmail('');
      setMessage('');
    },
    onError: (error) => {
      alert(\`Failed to send email: \${error}\`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await send({
      to: 'support@yourcompany.com',
      subject: 'New Contact Form Submission',
      html: \`
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> \${email}</p>
        <p><strong>Message:</strong></p>
        <p>\${message}</p>
      \`
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}`, 'client-email')}
                    >
                      {copiedCode === 'client-email' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Using pre-built templates:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { sendEmail } from '@/lib/mailer';
import { WelcomeEmailTemplate, EmailVerificationTemplate } from '@/components/ui/email-templates';

// Welcome email
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const html = WelcomeEmailTemplate({
    name: userName,
    ctaUrl: 'https://yourapp.com/dashboard',
    ctaText: 'Get Started',
    companyName: 'Your Company'
  });

  return await sendEmail({
    to: userEmail,
    subject: 'Welcome to Your Company!',
    html
  });
}

// Email verification
export async function sendVerificationEmail(userEmail: string, verificationUrl: string) {
  const html = EmailVerificationTemplate({
    name: userName,
    verificationUrl,
    companyName: 'Your Company'
  });

  return await sendEmail({
    to: userEmail,
    subject: 'Verify Your Email Address',
    html
  });
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { sendEmail } from '@/lib/mailer';
import { WelcomeEmailTemplate, EmailVerificationTemplate } from '@/components/ui/email-templates';

// Welcome email
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const html = WelcomeEmailTemplate({
    name: userName,
    ctaUrl: 'https://yourapp.com/dashboard',
    ctaText: 'Get Started',
    companyName: 'Your Company'
  });

  return await sendEmail({
    to: userEmail,
    subject: 'Welcome to Your Company!',
    html
  });
}

// Email verification
export async function sendVerificationEmail(userEmail: string, verificationUrl: string) {
  const html = EmailVerificationTemplate({
    name: userName,
    verificationUrl,
    companyName: 'Your Company'
  });

  return await sendEmail({
    to: userEmail,
    subject: 'Verify Your Email Address',
    html
  });
}`, 'templates')}
                    >
                      {copiedCode === 'templates' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Using the MailerTest component:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { MailerTest } from '@/components/ui/mailer-test';

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1>Email Configuration Test</h1>
      <MailerTest />
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { MailerTest } from '@/components/ui/mailer-test';

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1>Email Configuration Test</h1>
      <MailerTest />
    </div>
  );
}`, 'test-component')}
                    >
                      {copiedCode === 'test-component' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Programmatic testing:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { testEmailConfiguration } from '@/lib/mailer';

// Test email configuration
export async function testEmailSetup() {
  const result = await testEmailConfiguration();

  if (result.success) {
    console.log('Email configuration is working!');
  } else {
    console.error('Email configuration failed:', result.error);
  }

  return result;
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { testEmailConfiguration } from '@/lib/mailer';

// Test email configuration
export async function testEmailSetup() {
  const result = await testEmailConfiguration();

  if (result.success) {
    console.log('Email configuration is working!');
  } else {
    console.error('Email configuration failed:', result.error);
  }

  return result;
}`, 'test-programmatic')}
                    >
                      {copiedCode === 'test-programmatic' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>🌟 Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Provider Choice</h4>
              <p className="text-sm text-muted-foreground">Use Resend for modern applications - it's more reliable and easier to set up than traditional SMTP.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Environment Variables</h4>
              <p className="text-sm text-muted-foreground">Always use environment variables for API keys and credentials. Never commit them to version control.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Email Templates</h4>
              <p className="text-sm text-muted-foreground">Use the pre-built templates for consistency and better deliverability. Customize them to match your brand.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Testing</h4>
              <p className="text-sm text-muted-foreground">Always test your email configuration before deploying. Use the MailerTest component during development.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Error Handling</h4>
              <p className="text-sm text-muted-foreground">Implement proper error handling and logging for email failures. Consider retry mechanisms for critical emails.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
