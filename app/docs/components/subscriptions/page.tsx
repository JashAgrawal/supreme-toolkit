"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function SubscriptionsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

   const copyToClipboard = (text: string, codeName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeName);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">🔄 Subscriptions Module</h1>
        <p className="text-base md:text-lg text-muted-foreground mt-2">
          Complete subscription management with pricing plans, subscription lifecycle, and recurring billing.
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
              <Badge variant="secondary" className="mt-0.5">Billing</Badge>
              <div>
                <p className="font-medium">Recurring Billing</p>
                <p className="text-sm text-muted-foreground">Automated subscription billing with Stripe</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Plans</Badge>
              <div>
                <p className="font-medium">Pricing Plans</p>
                <p className="text-sm text-muted-foreground">Flexible pricing configuration system</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Lifecycle</Badge>
              <div>
                <p className="font-medium">Subscription Lifecycle</p>
                <p className="text-sm text-muted-foreground">Complete subscription management and status tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Portal</Badge>
              <div>
                <p className="font-medium">Customer Portal</p>
                <p className="text-sm text-muted-foreground">Self-service subscription management</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Components</Badge>
              <div>
                <p className="font-medium">UI Components</p>
                <p className="text-sm text-muted-foreground">Pricing cards and subscription manager</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Webhooks</Badge>
              <div>
                <p className="font-medium">Event Handling</p>
                <p className="text-sm text-muted-foreground">Subscription event processing and notifications</p>
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
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: "npx shadcn@latest add \"https://supremetoolkit.in/r/subscriptions\"",
                yarn: "yarn dlx shadcn@latest add \"https://supremetoolkit.in/r/subscriptions\"",
                pnpm: "pnpm dlx shadcn@latest add \"https://supremetoolkit.in/r/subscriptions\""
              }}
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">This installs:</p>
              <ul className="space-y-1 ml-4">
                <li>• Stripe subscription configuration and client setup</li>
                <li>• PricingCard and SubscriptionManager components</li>
                <li>• Pricing configuration system with plans</li>
                <li>• useSubscription and useCustomerPortal hooks</li>
                <li>• Server actions for subscription events</li>
                <li>• API routes for subscription management</li>
                <li>• Required dependencies (stripe, @stripe/stripe-js)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Environment Variables & Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                Stripe Account Required
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You need a Stripe account with subscription products configured. Sign up at{' '}
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline">
                  stripe.com
                </a>{' '}
                and set up your subscription products.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">1. Add Stripe API Keys:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`# .env.local
# Required - Get these from your Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Required for webhooks (essential for subscriptions)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`# .env.local
# Required - Get these from your Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Required for webhooks (essential for subscriptions)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here`, 'subs-env')}
                >
                  {copiedCode === 'subs-env' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. Create Subscription Products in Stripe:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Go to Stripe Dashboard → Products</p>
                <p>• Create products with recurring pricing (monthly/yearly)</p>
                <p>• Copy the price IDs (starts with 'price_')</p>
                <p>• Note: Use price IDs, not product IDs for subscriptions</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. Configure Pricing in lib/pricing.ts:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    interval: 'month',
    stripePriceId: 'price_your_starter_monthly_price_id',
    features: ['Feature 1', 'Feature 2'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_your_pro_monthly_price_id',
    features: ['All Starter features', 'Feature 3', 'Feature 4'],
  },
];`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    interval: 'month',
    stripePriceId: 'price_your_starter_monthly_price_id',
    features: ['Feature 1', 'Feature 2'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_your_pro_monthly_price_id',
    features: ['All Starter features', 'Feature 3', 'Feature 4'],
  },
];`, 'pricing-config')}
                >
                  {copiedCode === 'pricing-config' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">4. Set up Webhooks (Required for Subscriptions):</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Go to Stripe Dashboard → Webhooks</p>
                <p>• Add endpoint: <code className="bg-muted px-1 rounded">https://yourdomain.com/api/stripe/webhooks</code></p>
                <p>• Select events:</p>
                <ul className="ml-4 space-y-1">
                  <li>- <code className="bg-muted px-1 rounded">customer.subscription.created</code></li>
                  <li>- <code className="bg-muted px-1 rounded">customer.subscription.updated</code></li>
                  <li>- <code className="bg-muted px-1 rounded">customer.subscription.deleted</code></li>
                  <li>- <code className="bg-muted px-1 rounded">invoice.payment_succeeded</code></li>
                  <li>- <code className="bg-muted px-1 rounded">invoice.payment_failed</code></li>
                </ul>
                <p>• Copy the webhook signing secret to your .env.local file</p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">
                Webhooks Are Essential
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Unlike one-time payments, subscriptions require webhooks to handle recurring billing,
                failed payments, and subscription status changes. Make sure to set up webhooks before going live.
              </p>
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">PricingCard</h4>
                  <p className="text-sm text-muted-foreground">Beautiful pricing cards with integrated subscription functionality</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<PricingCard plan={plan} onSubscribe={handleSubscribe} />`}
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">SubscriptionManager</h4>
                  <p className="text-sm text-muted-foreground">Complete subscription management interface</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<SubscriptionManager subscription={userSub} />`}
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">PricingGrid</h4>
                  <p className="text-sm text-muted-foreground">Grid layout for multiple pricing plans</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<PricingGrid plans={plans} columns={3} />`}
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hooks" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useSubscription</h4>
                  <p className="text-sm text-muted-foreground">Manage user subscriptions and status</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ subscription, loading, cancelSubscription }`} = useSubscription()
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useCustomerPortal</h4>
                  <p className="text-sm text-muted-foreground">Access Stripe customer portal</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ redirectToPortal, loading }`} = useCustomerPortal()
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useCheckout</h4>
                  <p className="text-sm text-muted-foreground">Handle subscription checkout sessions</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ redirectToCheckout, loading }`} = useCheckout()
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Pricing Configuration</h4>
                  <p className="text-sm text-muted-foreground">Centralized pricing plan management</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    getPricingPlans('month') | getPricingPlans('year')
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Plan Comparison</h4>
                  <p className="text-sm text-muted-foreground">Feature comparison utilities</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    getPricingComparison(plans)
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Plan Conversion</h4>
                  <p className="text-sm text-muted-foreground">Convert plans to component props</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    planToPricingCardProps(plan, options)
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onSubscriptionCreated</h4>
                  <p className="text-sm text-muted-foreground">Triggered when new subscription is created</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onSubscriptionCancelled</h4>
                  <p className="text-sm text-muted-foreground">Triggered when subscription is cancelled</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onInvoiceGenerated</h4>
                  <p className="text-sm text-muted-foreground">Triggered when invoice is generated</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">cancelStripeSubscription</h4>
                  <p className="text-sm text-muted-foreground">Cancel subscription with options</p>
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
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

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
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional: Configure in config.tsx
NEXT_PUBLIC_APP_URL=https://yourapp.com`, 'env-config')}
                >
                  {copiedCode === 'env-config' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Pricing Plans Configuration:</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// lib/pricing.ts - Customize your pricing plans

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_starter',
    stripePriceId: 'price_your_stripe_price_id',
    features: [
      { name: 'Up to 5 projects', included: true },
      { name: 'Basic support', included: true },
      { name: 'Advanced features', included: false },
    ],
  },
  // Add more plans...
];`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`// lib/pricing.ts - Customize your pricing plans

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_starter',
    stripePriceId: 'price_your_stripe_price_id',
    features: [
      { name: 'Up to 5 projects', included: true },
      { name: 'Basic support', included: true },
      { name: 'Advanced features', included: false },
    ],
  },
  // Add more plans...
];`, 'pricing-config')}
                >
                  {copiedCode === 'pricing-config' ? '✓' : <Copy className="h-4 w-4" />}
                </Button>
              </div>
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
          <Tabs defaultValue="pricing" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pricing">Pricing Page</TabsTrigger>
              <TabsTrigger value="management">Subscription Management</TabsTrigger>
              <TabsTrigger value="webhooks">Event Handling</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Simple pricing page:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { PricingCard, PricingGrid } from '@/components/ui/pricing-card';
import { getPricingPlans } from '@/lib/pricing';

export default function PricingPage() {
  const monthlyPlans = getPricingPlans('month');
  const yearlyPlans = getPricingPlans('year');
  const [billingInterval, setBillingInterval] = useState('month');

  const currentPlans = billingInterval === 'month' ? monthlyPlans : yearlyPlans;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the perfect plan for your needs</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => setBillingInterval('month')}
            className={\`px-4 py-2 \${billingInterval === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={\`px-4 py-2 \${billingInterval === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      <PricingGrid
        plans={currentPlans}
        columns={3}
        onSubscribe={(plan) => {
          console.log('Subscribing to:', plan.name);
        }}
      />
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { PricingCard, PricingGrid } from '@/components/ui/pricing-card';
import { getPricingPlans } from '@/lib/pricing';

export default function PricingPage() {
  const monthlyPlans = getPricingPlans('month');
  const yearlyPlans = getPricingPlans('year');
  const [billingInterval, setBillingInterval] = useState('month');

  const currentPlans = billingInterval === 'month' ? monthlyPlans : yearlyPlans;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the perfect plan for your needs</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => setBillingInterval('month')}
            className={\`px-4 py-2 \${billingInterval === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={\`px-4 py-2 \${billingInterval === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      <PricingGrid
        plans={currentPlans}
        columns={3}
        onSubscribe={(plan) => {
          console.log('Subscribing to:', plan.name);
        }}
      />
    </div>
  );
}`, 'pricing-page')}
                    >
                      {copiedCode === 'pricing-page' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Custom subscription checkout:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useCheckout } from '@/hooks/use-stripe';
import { useState } from 'react';

export default function SubscriptionCheckout() {
  const [selectedPlan, setSelectedPlan] = useState('pro-monthly');
  const { redirectToCheckout, loading, error } = useCheckout();

  const plans = {
    'starter-monthly': { priceId: 'price_starter_monthly', name: 'Starter Monthly' },
    'pro-monthly': { priceId: 'price_pro_monthly', name: 'Pro Monthly' },
    'enterprise-monthly': { priceId: 'price_enterprise_monthly', name: 'Enterprise Monthly' },
  };

  const handleSubscribe = async () => {
    const plan = plans[selectedPlan];

    try {
      await redirectToCheckout({
        priceId: plan.priceId,
        mode: 'subscription',
        successUrl: '/dashboard?subscription=success',
        cancelUrl: '/pricing',
        metadata: {
          plan: selectedPlan,
          source: 'pricing-page'
        }
      });
    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2>Subscribe to {plans[selectedPlan].name}</h2>

      <div className="space-y-2 mb-4">
        {Object.entries(plans).map(([key, plan]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="radio"
              value={key}
              checked={selectedPlan === key}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
            <span>{plan.name}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useCheckout } from '@/hooks/use-stripe';
import { useState } from 'react';

export default function SubscriptionCheckout() {
  const [selectedPlan, setSelectedPlan] = useState('pro-monthly');
  const { redirectToCheckout, loading, error } = useCheckout();

  const plans = {
    'starter-monthly': { priceId: 'price_starter_monthly', name: 'Starter Monthly' },
    'pro-monthly': { priceId: 'price_pro_monthly', name: 'Pro Monthly' },
    'enterprise-monthly': { priceId: 'price_enterprise_monthly', name: 'Enterprise Monthly' },
  };

  const handleSubscribe = async () => {
    const plan = plans[selectedPlan];

    try {
      await redirectToCheckout({
        priceId: plan.priceId,
        mode: 'subscription',
        successUrl: '/dashboard?subscription=success',
        cancelUrl: '/pricing',
        metadata: {
          plan: selectedPlan,
          source: 'pricing-page'
        }
      });
    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2>Subscribe to {plans[selectedPlan].name}</h2>

      <div className="space-y-2 mb-4">
        {Object.entries(plans).map(([key, plan]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="radio"
              value={key}
              checked={selectedPlan === key}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
            <span>{plan.name}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </div>
  );
}`, 'subscription-checkout')}
                    >
                      {copiedCode === 'subscription-checkout' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">User subscription dashboard:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { SubscriptionManager } from '@/components/ui/subscription-manager';
import { useSubscription, useCustomerPortal } from '@/hooks/use-stripe';

export default function AccountPage() {
  const { subscription, loading, error, cancelSubscription } = useSubscription('cus_customer_id');
  const { redirectToPortal } = useCustomerPortal();

  if (loading) {
    return <div>Loading subscription...</div>;
  }

  if (error) {
    return <div>Error loading subscription: {error}</div>;
  }

  if (!subscription) {
    return (
      <div className="text-center">
        <h2>No Active Subscription</h2>
        <p>You don't have an active subscription.</p>
        <a href="/pricing" className="btn btn-primary">
          View Plans
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>

      <SubscriptionManager
        subscription={subscription}
        onCustomerPortal={async () => {
          await redirectToPortal(subscription.customer.id);
        }}
        onCancelSubscription={async () => {
          const confirmed = confirm('Are you sure you want to cancel your subscription?');
          if (confirmed) {
            await cancelSubscription(subscription.id);
            // Refresh the page or update state
            window.location.reload();
          }
        }}
        onReactivateSubscription={async () => {
          // Handle reactivation logic
          console.log('Reactivating subscription...');
        }}
      />
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { SubscriptionManager } from '@/components/ui/subscription-manager';
import { useSubscription, useCustomerPortal } from '@/hooks/use-stripe';

export default function AccountPage() {
  const { subscription, loading, error, cancelSubscription } = useSubscription('cus_customer_id');
  const { redirectToPortal } = useCustomerPortal();

  if (loading) {
    return <div>Loading subscription...</div>;
  }

  if (error) {
    return <div>Error loading subscription: {error}</div>;
  }

  if (!subscription) {
    return (
      <div className="text-center">
        <h2>No Active Subscription</h2>
        <p>You don't have an active subscription.</p>
        <a href="/pricing" className="btn btn-primary">
          View Plans
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>

      <SubscriptionManager
        subscription={subscription}
        onCustomerPortal={async () => {
          await redirectToPortal(subscription.customer.id);
        }}
        onCancelSubscription={async () => {
          const confirmed = confirm('Are you sure you want to cancel your subscription?');
          if (confirmed) {
            await cancelSubscription(subscription.id);
            // Refresh the page or update state
            window.location.reload();
          }
        }}
        onReactivateSubscription={async () => {
          // Handle reactivation logic
          console.log('Reactivating subscription...');
        }}
      />
    </div>
  );
}`, 'subscription-management')}
                    >
                      {copiedCode === 'subscription-management' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Customizing subscription event handlers:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// actions/stripe-actions.ts

export async function onSubscriptionCreated(data: SubscriptionCreatedData) {
  console.log('Subscription created:', data);

  // 1. Update user's subscription status in database
  await updateUserSubscription(data.customerId, {
    subscriptionId: data.subscriptionId,
    status: 'active',
    plan: data.priceId,
    currentPeriodEnd: data.currentPeriodEnd,
  });

  // 2. Send welcome email
  await sendSubscriptionWelcomeEmail(data.customerEmail, {
    planName: data.planName,
    amount: data.amount,
    currency: data.currency,
    nextBillingDate: data.currentPeriodEnd,
  });

  // 3. Grant subscription features
  await grantSubscriptionAccess(data.customerId, data.priceId);

  // 4. Track analytics
  await trackEvent('subscription_created', {
    customerId: data.customerId,
    plan: data.priceId,
    amount: data.amount,
    source: data.metadata?.source,
  });

  return { success: true };
}

export async function onSubscriptionCancelled(data: SubscriptionCancelledData) {
  console.log('Subscription cancelled:', data);

  // 1. Update user's subscription status
  await updateUserSubscription(data.customerId, {
    status: 'cancelled',
    cancelledAt: new Date(),
    accessUntil: data.currentPeriodEnd, // Grace period
  });

  // 2. Send cancellation confirmation
  await sendSubscriptionCancellationEmail(data.customerEmail, {
    planName: data.planName,
    accessUntil: data.currentPeriodEnd,
  });

  // 3. Schedule access revocation
  await scheduleAccessRevocation(data.customerId, data.currentPeriodEnd);

  // 4. Track analytics
  await trackEvent('subscription_cancelled', {
    customerId: data.customerId,
    plan: data.priceId,
    reason: data.cancellationReason,
  });

  return { success: true };
}

export async function onInvoiceGenerated(data: InvoiceGeneratedData) {
  console.log('Invoice generated:', data);

  // 1. Send invoice email (if not handled by Stripe)
  if (!data.stripeEmailSent) {
    await sendInvoiceEmail(data.customerEmail, {
      invoiceUrl: data.invoiceUrl,
      amount: data.amount,
      dueDate: data.dueDate,
    });
  }

  // 2. Track billing analytics
  await trackEvent('invoice_generated', {
    customerId: data.customerId,
    amount: data.amount,
    subscriptionId: data.subscriptionId,
  });

  return { success: true };
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// actions/stripe-actions.ts

export async function onSubscriptionCreated(data: SubscriptionCreatedData) {
  console.log('Subscription created:', data);

  // 1. Update user's subscription status in database
  await updateUserSubscription(data.customerId, {
    subscriptionId: data.subscriptionId,
    status: 'active',
    plan: data.priceId,
    currentPeriodEnd: data.currentPeriodEnd,
  });

  // 2. Send welcome email
  await sendSubscriptionWelcomeEmail(data.customerEmail, {
    planName: data.planName,
    amount: data.amount,
    currency: data.currency,
    nextBillingDate: data.currentPeriodEnd,
  });

  // 3. Grant subscription features
  await grantSubscriptionAccess(data.customerId, data.priceId);

  // 4. Track analytics
  await trackEvent('subscription_created', {
    customerId: data.customerId,
    plan: data.priceId,
    amount: data.amount,
    source: data.metadata?.source,
  });

  return { success: true };
}

export async function onSubscriptionCancelled(data: SubscriptionCancelledData) {
  console.log('Subscription cancelled:', data);

  // 1. Update user's subscription status
  await updateUserSubscription(data.customerId, {
    status: 'cancelled',
    cancelledAt: new Date(),
    accessUntil: data.currentPeriodEnd, // Grace period
  });

  // 2. Send cancellation confirmation
  await sendSubscriptionCancellationEmail(data.customerEmail, {
    planName: data.planName,
    accessUntil: data.currentPeriodEnd,
  });

  // 3. Schedule access revocation
  await scheduleAccessRevocation(data.customerId, data.currentPeriodEnd);

  // 4. Track analytics
  await trackEvent('subscription_cancelled', {
    customerId: data.customerId,
    plan: data.priceId,
    reason: data.cancellationReason,
  });

  return { success: true };
}

export async function onInvoiceGenerated(data: InvoiceGeneratedData) {
  console.log('Invoice generated:', data);

  // 1. Send invoice email (if not handled by Stripe)
  if (!data.stripeEmailSent) {
    await sendInvoiceEmail(data.customerEmail, {
      invoiceUrl: data.invoiceUrl,
      amount: data.amount,
      dueDate: data.dueDate,
    });
  }

  // 2. Track billing analytics
  await trackEvent('invoice_generated', {
    customerId: data.customerId,
    amount: data.amount,
    subscriptionId: data.subscriptionId,
  });

  return { success: true };
}`, 'webhook-handlers')}
                    >
                      {copiedCode === 'webhook-handlers' ? '✓' : <Copy className="h-4 w-4" />}
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
              <h4 className="font-medium">Pricing Strategy</h4>
              <p className="text-sm text-muted-foreground">Offer annual discounts (typically 15-20%) to improve customer lifetime value and reduce churn.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Trial Periods</h4>
              <p className="text-sm text-muted-foreground">Consider offering free trials to reduce friction and let users experience value before committing.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Webhook Reliability</h4>
              <p className="text-sm text-muted-foreground">Implement idempotent webhook handlers and proper retry logic to handle webhook delivery failures.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Customer Experience</h4>
              <p className="text-sm text-muted-foreground">Provide clear billing information, easy cancellation, and proactive communication about subscription changes.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Dunning Management</h4>
              <p className="text-sm text-muted-foreground">Implement smart retry logic for failed payments and communicate with customers about payment issues.</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-medium">Analytics & Metrics</h4>
              <p className="text-sm text-muted-foreground">Track key metrics like MRR, churn rate, LTV, and conversion rates to optimize your subscription business.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
