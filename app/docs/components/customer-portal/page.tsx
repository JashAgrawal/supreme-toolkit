"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function CustomerPortalPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = `npx shadcn@latest add "https://supreme.jashagrawal.in/r/customer-portal"`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🏪 Customer Portal Module</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Self-service customer portal for managing billing, subscriptions, and payment methods with Stripe.
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
              <Badge variant="secondary" className="mt-0.5">Self-Service</Badge>
              <div>
                <p className="font-medium">Self-Service Portal</p>
                <p className="text-sm text-muted-foreground">Complete customer self-service with Stripe's portal</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Billing</Badge>
              <div>
                <p className="font-medium">Billing Management</p>
                <p className="text-sm text-muted-foreground">View invoices, payment history, and receipts</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Subscriptions</Badge>
              <div>
                <p className="font-medium">Subscription Control</p>
                <p className="text-sm text-muted-foreground">Cancel, pause, or modify subscriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Payment</Badge>
              <div>
                <p className="font-medium">Payment Methods</p>
                <p className="text-sm text-muted-foreground">Add, remove, and update payment methods</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Hooks</Badge>
              <div>
                <p className="font-medium">React Hooks</p>
                <p className="text-sm text-muted-foreground">useCustomerPortal hook for easy integration</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Secure</Badge>
              <div>
                <p className="font-medium">Secure Access</p>
                <p className="text-sm text-muted-foreground">Stripe-hosted secure portal sessions</p>
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
                <li>• Stripe customer portal configuration</li>
                <li>• useCustomerPortal hook for portal access</li>
                <li>• API route for creating portal sessions</li>
                <li>• Server actions for portal management</li>
                <li>• Secure session handling and validation</li>
                <li>• Required dependencies (stripe, @stripe/stripe-js)</li>
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
          <Tabs defaultValue="hooks" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="api">API Routes</TabsTrigger>
              <TabsTrigger value="features">Portal Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hooks" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useCustomerPortal</h4>
                  <p className="text-sm text-muted-foreground">Create and redirect to Stripe customer portal</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ redirectToPortal, loading, error }`} = useCustomerPortal()
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">createPortalSession</h4>
                  <p className="text-sm text-muted-foreground">Create portal session without redirect</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const url = await createPortalSession(customerId, returnUrl)
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">POST /api/stripe/customer-portal</h4>
                  <p className="text-sm text-muted-foreground">Create customer portal sessions</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`{ customerId, returnUrl }`}
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Subscription Management</h4>
                  <p className="text-sm text-muted-foreground">Cancel, pause, resume, and modify subscriptions</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Payment Methods</h4>
                  <p className="text-sm text-muted-foreground">Add, remove, and set default payment methods</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Billing History</h4>
                  <p className="text-sm text-muted-foreground">View invoices, receipts, and payment history</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Customer Information</h4>
                  <p className="text-sm text-muted-foreground">Update billing address and contact information</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Tax Information</h4>
                  <p className="text-sm text-muted-foreground">Manage tax IDs and billing addresses</p>
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
              <h4 className="font-medium mb-2">Environment Variables:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`# .env.local
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Optional: Configure in config.tsx
NEXT_PUBLIC_APP_URL=https://yourapp.com`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`# .env.local
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Optional: Configure in config.tsx
NEXT_PUBLIC_APP_URL=https://yourapp.com`, 'env-config')}
                >
                  {copiedCode === 'env-config' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Stripe Dashboard Setup:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Go to Stripe Dashboard → Settings → Customer Portal</p>
                <p>2. Configure portal features (subscriptions, payment methods, etc.)</p>
                <p>3. Set up business information and branding</p>
                <p>4. Configure allowed actions (cancel, pause, resume subscriptions)</p>
                <p>5. Set up email notifications and receipts</p>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Portal Configuration</h4>
              <p className="text-sm text-muted-foreground">
                The customer portal is fully managed by Stripe. You can customize its appearance, 
                features, and behavior through your Stripe Dashboard settings.
              </p>
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
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Simple portal access button:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useCustomerPortal } from '@/hooks/use-stripe';

export default function ManageBillingButton({ customerId }) {
  const { redirectToPortal, loading, error } = useCustomerPortal();

  const handleManageBilling = async () => {
    try {
      await redirectToPortal(customerId, '/account');
    } catch (err) {
      console.error('Failed to open customer portal:', err);
      alert('Failed to open billing portal. Please try again.');
    }
  };

  return (
    <div>
      <button
        onClick={handleManageBilling}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Opening...' : 'Manage Billing'}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          Error: {error}
        </p>
      )}
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useCustomerPortal } from '@/hooks/use-stripe';

export default function ManageBillingButton({ customerId }) {
  const { redirectToPortal, loading, error } = useCustomerPortal();

  const handleManageBilling = async () => {
    try {
      await redirectToPortal(customerId, '/account');
    } catch (err) {
      console.error('Failed to open customer portal:', err);
      alert('Failed to open billing portal. Please try again.');
    }
  };

  return (
    <div>
      <button
        onClick={handleManageBilling}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Opening...' : 'Manage Billing'}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          Error: {error}
        </p>
      )}
    </div>
  );
}`, 'basic-portal')}
                    >
                      {copiedCode === 'basic-portal' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Portal session without redirect:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useCustomerPortal } from '@/hooks/use-stripe';

export default function CustomPortalHandler({ customerId }) {
  const { createPortalSession, loading } = useCustomerPortal();

  const handleGetPortalUrl = async () => {
    try {
      const portalUrl = await createPortalSession(customerId, '/dashboard');

      // You can now use the URL as needed
      console.log('Portal URL:', portalUrl);

      // Open in new tab
      window.open(portalUrl, '_blank');

      // Or save for later use
      localStorage.setItem('portalUrl', portalUrl);

    } catch (err) {
      console.error('Failed to create portal session:', err);
    }
  };

  return (
    <button
      onClick={handleGetPortalUrl}
      disabled={loading}
      className="border border-gray-300 px-4 py-2 rounded"
    >
      {loading ? 'Creating...' : 'Get Portal URL'}
    </button>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useCustomerPortal } from '@/hooks/use-stripe';

export default function CustomPortalHandler({ customerId }) {
  const { createPortalSession, loading } = useCustomerPortal();

  const handleGetPortalUrl = async () => {
    try {
      const portalUrl = await createPortalSession(customerId, '/dashboard');

      // You can now use the URL as needed
      console.log('Portal URL:', portalUrl);

      // Open in new tab
      window.open(portalUrl, '_blank');

      // Or save for later use
      localStorage.setItem('portalUrl', portalUrl);

    } catch (err) {
      console.error('Failed to create portal session:', err);
    }
  };

  return (
    <button
      onClick={handleGetPortalUrl}
      disabled={loading}
      className="border border-gray-300 px-4 py-2 rounded"
    >
      {loading ? 'Creating...' : 'Get Portal URL'}
    </button>
  );
}`, 'portal-url')}
                    >
                      {copiedCode === 'portal-url' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Integration with subscription manager:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { SubscriptionManager } from '@/components/ui/subscription-manager';
import { useCustomerPortal } from '@/hooks/use-stripe';

export default function AccountPage({ subscription }) {
  const { redirectToPortal } = useCustomerPortal();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {subscription ? (
        <SubscriptionManager
          subscription={subscription}
          onCustomerPortal={async () => {
            // Track portal access
            analytics.track('customer_portal_accessed', {
              customerId: subscription.customer.id,
              subscriptionId: subscription.id,
            });

            // Redirect to portal
            await redirectToPortal(
              subscription.customer.id,
              '/account?tab=subscription'
            );
          }}
          onCancelSubscription={() => {
            // Handle cancellation confirmation
            console.log('Subscription cancelled');
          }}
        />
      ) : (
        <div className="text-center">
          <h2>No Active Subscription</h2>
          <p>You don't have an active subscription.</p>
          <a href="/pricing" className="btn btn-primary mt-4">
            View Plans
          </a>
        </div>
      )}
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { SubscriptionManager } from '@/components/ui/subscription-manager';
import { useCustomerPortal } from '@/hooks/use-stripe';

export default function AccountPage({ subscription }) {
  const { redirectToPortal } = useCustomerPortal();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {subscription ? (
        <SubscriptionManager
          subscription={subscription}
          onCustomerPortal={async () => {
            // Track portal access
            analytics.track('customer_portal_accessed', {
              customerId: subscription.customer.id,
              subscriptionId: subscription.id,
            });

            // Redirect to portal
            await redirectToPortal(
              subscription.customer.id,
              '/account?tab=subscription'
            );
          }}
          onCancelSubscription={() => {
            // Handle cancellation confirmation
            console.log('Subscription cancelled');
          }}
        />
      ) : (
        <div className="text-center">
          <h2>No Active Subscription</h2>
          <p>You don't have an active subscription.</p>
          <a href="/pricing" className="btn btn-primary mt-4">
            View Plans
          </a>
        </div>
      )}
    </div>
  );
}`, 'integration')}
                    >
                      {copiedCode === 'integration' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Advanced portal integration with analytics:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useCustomerPortal } from '@/hooks/use-stripe';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';

export default function BillingSection() {
  const { user } = useAuth();
  const { redirectToPortal, loading, error } = useCustomerPortal();
  const [portalAccess, setPortalAccess] = useState(null);

  // Track portal access attempts
  const handlePortalAccess = async () => {
    try {
      // Pre-portal analytics
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_portal_attempt',
          userId: user.id,
          timestamp: new Date().toISOString(),
        }),
      });

      // Create portal session
      await redirectToPortal(user.stripeCustomerId, '/account');

      // Track successful access
      setPortalAccess({ success: true, timestamp: new Date() });

    } catch (err) {
      console.error('Portal access failed:', err);

      // Track failed access
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_portal_error',
          userId: user.id,
          error: err.message,
          timestamp: new Date().toISOString(),
        }),
      });

      setPortalAccess({ success: false, error: err.message });
    }
  };

  // Handle return from portal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('portal') === 'return') {
      // User returned from portal
      console.log('User returned from customer portal');

      // Track return
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_portal_return',
          userId: user.id,
          timestamp: new Date().toISOString(),
        }),
      });

      // Clean up URL
      window.history.replaceState({}, '', '/account');
    }
  }, [user.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Billing & Subscriptions</h3>
          <p className="text-sm text-muted-foreground">
            Manage your billing information and subscriptions
          </p>
        </div>

        <button
          onClick={handlePortalAccess}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Opening...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Manage Billing
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">
            Failed to open billing portal: {error}
          </p>
        </div>
      )}

      {portalAccess && (
        <div className={\`border rounded-md p-3 \${portalAccess.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}\`}>
          <p className={\`text-sm \${portalAccess.success ? 'text-green-800' : 'text-red-800'}\`}>
            {portalAccess.success
              ? 'Portal accessed successfully'
              : \`Portal access failed: \${portalAccess.error}\`
            }
          </p>
        </div>
      )}
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useCustomerPortal } from '@/hooks/use-stripe';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';

export default function BillingSection() {
  const { user } = useAuth();
  const { redirectToPortal, loading, error } = useCustomerPortal();
  const [portalAccess, setPortalAccess] = useState(null);

  // Track portal access attempts
  const handlePortalAccess = async () => {
    try {
      // Pre-portal analytics
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_portal_attempt',
          userId: user.id,
          timestamp: new Date().toISOString(),
        }),
      });

      // Create portal session
      await redirectToPortal(user.stripeCustomerId, '/account');

      // Track successful access
      setPortalAccess({ success: true, timestamp: new Date() });

    } catch (err) {
      console.error('Portal access failed:', err);

      // Track failed access
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_portal_error',
          userId: user.id,
          error: err.message,
          timestamp: new Date().toISOString(),
        }),
      });

      setPortalAccess({ success: false, error: err.message });
    }
  };

  // Handle return from portal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('portal') === 'return') {
      // User returned from portal
      console.log('User returned from customer portal');

      // Track return
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_portal_return',
          userId: user.id,
          timestamp: new Date().toISOString(),
        }),
      });

      // Clean up URL
      window.history.replaceState({}, '', '/account');
    }
  }, [user.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Billing & Subscriptions</h3>
          <p className="text-sm text-muted-foreground">
            Manage your billing information and subscriptions
          </p>
        </div>

        <button
          onClick={handlePortalAccess}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Opening...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Manage Billing
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">
            Failed to open billing portal: {error}
          </p>
        </div>
      )}

      {portalAccess && (
        <div className={\`border rounded-md p-3 \${portalAccess.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}\`}>
          <p className={\`text-sm \${portalAccess.success ? 'text-green-800' : 'text-red-800'}\`}>
            {portalAccess.success
              ? 'Portal accessed successfully'
              : \`Portal access failed: \${portalAccess.error}\`
            }
          </p>
        </div>
      )}
    </div>
  );
}`, 'advanced-portal')}
                    >
                      {copiedCode === 'advanced-portal' ? '✓' : <Copy className="h-4 w-4" />}
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
              <h4 className="font-medium">Portal Configuration</h4>
              <p className="text-sm text-muted-foreground">Configure the customer portal in your Stripe Dashboard to match your brand and enable only the features your customers need.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Return URLs</h4>
              <p className="text-sm text-muted-foreground">Always provide meaningful return URLs that bring users back to relevant pages in your application.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Error Handling</h4>
              <p className="text-sm text-muted-foreground">Implement proper error handling for portal access failures and provide clear feedback to users.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Analytics Tracking</h4>
              <p className="text-sm text-muted-foreground">Track portal usage to understand customer behavior and identify potential issues or opportunities.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Security</h4>
              <p className="text-sm text-muted-foreground">Never expose customer IDs in URLs or client-side code. Always validate customer access server-side.</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-medium">User Experience</h4>
              <p className="text-sm text-muted-foreground">Provide clear context about what users can do in the portal and what to expect when they access it.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portal Features */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 What Customers Can Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Subscription Management:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cancel subscriptions</li>
                <li>• Pause and resume subscriptions</li>
                <li>• Change subscription plans</li>
                <li>• Update billing frequency</li>
                <li>• View subscription history</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Management:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Add new payment methods</li>
                <li>• Update existing cards</li>
                <li>• Set default payment method</li>
                <li>• Remove old payment methods</li>
                <li>• Update billing address</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Billing History:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View all invoices</li>
                <li>• Download receipts</li>
                <li>• See payment history</li>
                <li>• Track upcoming charges</li>
                <li>• View failed payments</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Account Information:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Update contact information</li>
                <li>• Manage tax information</li>
                <li>• Set billing preferences</li>
                <li>• Configure email notifications</li>
                <li>• View account details</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
