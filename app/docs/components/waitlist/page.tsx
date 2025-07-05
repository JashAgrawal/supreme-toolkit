"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function WaitlistPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = `npx shadcn@latest add "https://supreme.jashagrawal.in/r/waitlist-modul.json"`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📝 Waitlist Module</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Complete waitlist system with email collection, validation, duplicate checking, and email confirmations.
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
              <Badge variant="secondary" className="mt-0.5">Validation</Badge>
              <div>
                <p className="font-medium">Email Validation</p>
                <p className="text-sm text-muted-foreground">Built-in email format validation with Zod</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Duplicates</Badge>
              <div>
                <p className="font-medium">Duplicate Prevention</p>
                <p className="text-sm text-muted-foreground">Automatic duplicate email checking</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Position</Badge>
              <div>
                <p className="font-medium">Queue Position</p>
                <p className="text-sm text-muted-foreground">Automatic position tracking in waitlist</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Email</Badge>
              <div>
                <p className="font-medium">Email Confirmations</p>
                <p className="text-sm text-muted-foreground">Welcome and approval email notifications</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Hooks</Badge>
              <div>
                <p className="font-medium">React Hooks</p>
                <p className="text-sm text-muted-foreground">useWaitlist hook for easy integration</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">API</Badge>
              <div>
                <p className="font-medium">REST API</p>
                <p className="text-sm text-muted-foreground">Complete API endpoints for waitlist management</p>
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
                <li>• WaitlistForm component with validation</li>
                <li>• useWaitlist hook for state management</li>
                <li>• Server actions for waitlist operations</li>
                <li>• API routes for REST endpoints</li>
                <li>• Email integration for confirmations</li>
                <li>• Duplicate checking and position tracking</li>
                <li>• Required dependencies (zod for validation)</li>
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
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">WaitlistForm</h4>
                  <p className="text-sm text-muted-foreground">Complete waitlist signup form with validation and success states</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<WaitlistForm title="Join the Waitlist" />`}
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hooks" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useWaitlist</h4>
                  <p className="text-sm text-muted-foreground">Complete waitlist functionality with state management</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ subscribe, checkStatus, isLoading, error }`} = useWaitlist()
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onAddWaitlist</h4>
                  <p className="text-sm text-muted-foreground">Add user to waitlist with validation and email confirmation</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">checkIfAlreadyInWaitlist</h4>
                  <p className="text-sm text-muted-foreground">Check if email already exists in waitlist</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">getWaitlistEntry</h4>
                  <p className="text-sm text-muted-foreground">Get waitlist entry details by email</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">getWaitlistStats</h4>
                  <p className="text-sm text-muted-foreground">Get waitlist statistics and analytics</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">POST /api/waitlist</h4>
                  <p className="text-sm text-muted-foreground">Add user to waitlist</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`{ email, name?, referralCode? }`}
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">GET /api/waitlist?email=user@example.com</h4>
                  <p className="text-sm text-muted-foreground">Get waitlist entry details</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">GET /api/waitlist</h4>
                  <p className="text-sm text-muted-foreground">Get waitlist statistics (admin)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="custom">Custom Form</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Simple waitlist form:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { WaitlistForm } from '@/components/ui/waitlist-form';

export default function LandingPage() {
  return (
    <div className="max-w-md mx-auto">
      <WaitlistForm 
        title="Join the Waitlist"
        description="Be the first to know when we launch!"
        placeholder="Enter your email address"
        buttonText="Join Waitlist"
      />
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { WaitlistForm } from '@/components/ui/waitlist-form';

export default function LandingPage() {
  return (
    <div className="max-w-md mx-auto">
      <WaitlistForm 
        title="Join the Waitlist"
        description="Be the first to know when we launch!"
        placeholder="Enter your email address"
        buttonText="Join Waitlist"
      />
    </div>
  );
}`, 'basic-form')}
                    >
                      {copiedCode === 'basic-form' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Custom form with useWaitlist hook:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useWaitlist } from '@/hooks/use-waitlist';
import { useState } from 'react';

export default function CustomWaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  const { subscribe, isLoading, error, success, data } = useWaitlist({
    onSuccess: (data) => {
      console.log('Joined waitlist!', data);
    },
    onError: (error) => {
      console.error('Failed to join:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await subscribe({ email, name, referralCode });
  };

  if (success) {
    return (
      <div className="text-center">
        <h2>Welcome to the waitlist!</h2>
        <p>You're #{data?.position} in line.</p>
        <p>We'll email you at {email} when it's your turn!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
      />
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
      />
      <input 
        type="text" 
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        placeholder="Referral code (optional)"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Joining...' : 'Join Waitlist'}
      </button>
    </form>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useWaitlist } from '@/hooks/use-waitlist';
import { useState } from 'react';

export default function CustomWaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  const { subscribe, isLoading, error, success, data } = useWaitlist({
    onSuccess: (data) => {
      console.log('Joined waitlist!', data);
    },
    onError: (error) => {
      console.error('Failed to join:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await subscribe({ email, name, referralCode });
  };

  if (success) {
    return (
      <div className="text-center">
        <h2>Welcome to the waitlist!</h2>
        <p>You're #{data?.position} in line.</p>
        <p>We'll email you at {email} when it's your turn!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
      />
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
      />
      <input 
        type="text" 
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        placeholder="Referral code (optional)"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Joining...' : 'Join Waitlist'}
      </button>
    </form>
  );
}`, 'custom-form')}
                    >
                      {copiedCode === 'custom-form' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Direct API usage:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Add to waitlist
const response = await fetch('/api/waitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    referralCode: 'FRIEND123'
  }),
});

const result = await response.json();

if (result.success) {
  console.log('Added to waitlist:', result.data);
  // { id: '1', position: 42, status: 'pending' }
} else {
  console.error('Error:', result.error);
}

// Check waitlist status
const statusResponse = await fetch('/api/waitlist?email=user@example.com');
const statusResult = await statusResponse.json();

if (statusResult.success) {
  console.log('Waitlist status:', statusResult.data);
  // { id: '1', position: 42, status: 'pending', createdAt: '...' }
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// Add to waitlist
const response = await fetch('/api/waitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    referralCode: 'FRIEND123'
  }),
});

const result = await response.json();

if (result.success) {
  console.log('Added to waitlist:', result.data);
  // { id: '1', position: 42, status: 'pending' }
} else {
  console.error('Error:', result.error);
}

// Check waitlist status
const statusResponse = await fetch('/api/waitlist?email=user@example.com');
const statusResult = await statusResponse.json();

if (statusResult.success) {
  console.log('Waitlist status:', statusResult.data);
  // { id: '1', position: 42, status: 'pending', createdAt: '...' }
}`, 'api-usage')}
                    >
                      {copiedCode === 'api-usage' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
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
            <div>
              <h4 className="font-medium mb-2">Email Integration:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// The waitlist module automatically integrates with the mailer module
// Make sure you have email configured (Resend or SMTP)

// .env.local
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com

// Or for SMTP
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// The waitlist module automatically integrates with the mailer module
// Make sure you have email configured (Resend or SMTP)

// .env.local
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com

// Or for SMTP
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password`, 'email-config')}
                >
                  {copiedCode === 'email-config' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Database Storage:</h4>
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> The current implementation uses in-memory storage for demo purposes.
                  In production, replace the waitlistStore in actions/waitlist-actions.ts with your database (PostgreSQL, MySQL, etc.).
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Customizing Email Templates:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// Modify the email templates in lib/mailer-resend.ts or lib/mailer-nodemailer.ts

export async function sendWaitlistWelcomeEmail(
  email: string,
  name?: string,
  position?: number
) {
  const html = WaitlistWelcomeTemplate({
    name,
    position,
    companyName: "Your Company Name",
    // Add your custom template variables
  });

  return await sendEmail({
    to: email,
    subject: "Welcome to our waitlist!",
    html
  });
}`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// Modify the email templates in lib/mailer-resend.ts or lib/mailer-nodemailer.ts

export async function sendWaitlistWelcomeEmail(
  email: string,
  name?: string,
  position?: number
) {
  const html = WaitlistWelcomeTemplate({
    name,
    position,
    companyName: "Your Company Name",
    // Add your custom template variables
  });

  return await sendEmail({
    to: email,
    subject: "Welcome to our waitlist!",
    html
  });
}`, 'email-templates')}
                >
                  {copiedCode === 'email-templates' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Actions */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Server Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Customizing server actions:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// actions/waitlist-actions.ts

export async function onAddWaitlist(params: {
  email: string;
  name?: string;
  referralCode?: string;
}) {
  // Add your custom business logic here:

  // 1. Custom validation
  if (params.email.includes('spam')) {
    return { success: false, error: 'Invalid email domain' };
  }

  // 2. Referral code processing
  if (params.referralCode) {
    // Process referral code, give priority position, etc.
    console.log('Processing referral:', params.referralCode);
  }

  // 3. Analytics tracking
  // await trackEvent('waitlist_signup', { email: params.email });

  // 4. Integration with other services
  // await addToMailchimpList(params.email);
  // await notifySlack(\`New waitlist signup: \${params.email}\`);

  // ... rest of the function
}`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// actions/waitlist-actions.ts

export async function onAddWaitlist(params: {
  email: string;
  name?: string;
  referralCode?: string;
}) {
  // Add your custom business logic here:

  // 1. Custom validation
  if (params.email.includes('spam')) {
    return { success: false, error: 'Invalid email domain' };
  }

  // 2. Referral code processing
  if (params.referralCode) {
    // Process referral code, give priority position, etc.
    console.log('Processing referral:', params.referralCode);
  }

  // 3. Analytics tracking
  // await trackEvent('waitlist_signup', { email: params.email });

  // 4. Integration with other services
  // await addToMailchimpList(params.email);
  // await notifySlack(\`New waitlist signup: \${params.email}\`);

  // ... rest of the function
}`, 'server-actions')}
                >
                  {copiedCode === 'server-actions' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
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
              <h4 className="font-medium">Database Storage</h4>
              <p className="text-sm text-muted-foreground">Replace in-memory storage with a proper database (PostgreSQL, MySQL) for production use.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Email Configuration</h4>
              <p className="text-sm text-muted-foreground">Set up email properly before deploying. Test with the mailer module to ensure emails are delivered.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Validation</h4>
              <p className="text-sm text-muted-foreground">Add custom validation rules for your specific use case (domain restrictions, etc.).</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-muted-foreground">Track waitlist signups and conversions to measure the effectiveness of your waitlist.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Privacy</h4>
              <p className="text-sm text-muted-foreground">Ensure compliance with privacy laws (GDPR, CCPA) when collecting email addresses.</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-medium">User Experience</h4>
              <p className="text-sm text-muted-foreground">Provide clear feedback about waitlist position and expected timeline to manage user expectations.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Advanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Referral System:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The waitlist module supports referral codes. You can implement custom logic to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Give priority positions to referred users</li>
                <li>• Track referral sources and effectiveness</li>
                <li>• Reward users who refer others</li>
                <li>• Create viral growth loops</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Status Management:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Each waitlist entry has a status that you can update:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <strong>pending</strong> - Default status for new signups</li>
                <li>• <strong>approved</strong> - User has been approved and notified</li>
                <li>• <strong>rejected</strong> - User has been rejected (optional)</li>
                <li>• <strong>converted</strong> - User has completed signup/purchase</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Integration Ideas:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Connect to your CRM (HubSpot, Salesforce)</li>
                <li>• Add to email marketing lists (Mailchimp, ConvertKit)</li>
                <li>• Send notifications to Slack or Discord</li>
                <li>• Track events in analytics (Google Analytics, Mixpanel)</li>
                <li>• Create admin dashboard for waitlist management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
