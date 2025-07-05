"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function OneTimePaymentPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = `npx shadcn@latest add "https://supreme.jashagrawal.in/r/one-time-payment"`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">💳 One-Time Payment Module</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Stripe integration for one-time payments with checkout sessions and secure payment processing.
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
              <Badge variant="secondary" className="mt-0.5">Stripe</Badge>
              <div>
                <p className="font-medium">Stripe Integration</p>
                <p className="text-sm text-muted-foreground">Secure payment processing with Stripe Checkout</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Components</Badge>
              <div>
                <p className="font-medium">Payment Components</p>
                <p className="text-sm text-muted-foreground">Pre-built PayButton with loading states</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Webhooks</Badge>
              <div>
                <p className="font-medium">Webhook Handling</p>
                <p className="text-sm text-muted-foreground">Secure webhook processing for payment events</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Hooks</Badge>
              <div>
                <p className="font-medium">React Hooks</p>
                <p className="text-sm text-muted-foreground">useCheckout and useStripe for easy integration</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Actions</Badge>
              <div>
                <p className="font-medium">Server Actions</p>
                <p className="text-sm text-muted-foreground">Payment event handlers and business logic</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Security</Badge>
              <div>
                <p className="font-medium">Secure Processing</p>
                <p className="text-sm text-muted-foreground">PCI-compliant payment handling</p>
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
                <li>• Stripe client and server configuration</li>
                <li>• PayButton component with loading states</li>
                <li>• useCheckout and useStripe hooks</li>
                <li>• Server actions for payment events</li>
                <li>• API routes for checkout sessions and webhooks</li>
                <li>• Secure webhook signature validation</li>
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
          <Tabs defaultValue="components" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="api">API Routes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">PayButton</h4>
                  <p className="text-sm text-muted-foreground">Customizable payment button with Stripe integration</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<PayButton priceId="price_xxx" mode="payment">Buy Now</PayButton>`}
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hooks" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useCheckout</h4>
                  <p className="text-sm text-muted-foreground">Handle checkout session creation and redirection</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ redirectToCheckout, loading, error }`} = useCheckout()
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useStripe</h4>
                  <p className="text-sm text-muted-foreground">Access Stripe instance and payment methods</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ stripe, elements, loading }`} = useStripe()
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">usePaymentIntent</h4>
                  <p className="text-sm text-muted-foreground">Create and manage payment intents</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ createPaymentIntent, confirmPayment }`} = usePaymentIntent()
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onPaymentComplete</h4>
                  <p className="text-sm text-muted-foreground">Triggered when payment is successfully completed</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onPaymentFailed</h4>
                  <p className="text-sm text-muted-foreground">Triggered when payment fails or is declined</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">processStripeWebhook</h4>
                  <p className="text-sm text-muted-foreground">Process incoming Stripe webhook events</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">createStripeCustomer</h4>
                  <p className="text-sm text-muted-foreground">Create new Stripe customer records</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">POST /api/stripe/create-checkout-session</h4>
                  <p className="text-sm text-muted-foreground">Create Stripe checkout sessions</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`{ priceId, mode, successUrl, cancelUrl }`}
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">POST /api/stripe/webhooks</h4>
                  <p className="text-sm text-muted-foreground">Handle Stripe webhook events securely</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">POST /api/stripe/create-payment-intent</h4>
                  <p className="text-sm text-muted-foreground">Create payment intents for custom flows</p>
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
              <h4 className="font-medium mb-2">Stripe Dashboard Setup:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Create products and prices in your Stripe Dashboard</p>
                <p>2. Set up webhook endpoint: <code className="bg-muted px-1 rounded">https://yourapp.com/api/stripe/webhooks</code></p>
                <p>3. Configure webhook events: <code className="bg-muted px-1 rounded">payment_intent.succeeded</code>, <code className="bg-muted px-1 rounded">payment_intent.payment_failed</code></p>
                <p>4. Copy webhook signing secret to your environment variables</p>
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
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="custom">Custom Checkout</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Simple payment button:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { PayButton } from '@/components/ui/pay-button';

export default function ProductPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1>Premium Plan</h1>
      <p>Get access to all premium features</p>

      <PayButton
        priceId="price_1234567890"
        mode="payment"
        successUrl="/dashboard"
        cancelUrl="/pricing"
        onPaymentSuccess={(sessionId) => {
          console.log('Payment successful!', sessionId);
        }}
        onPaymentError={(error) => {
          console.error('Payment failed:', error);
        }}
      >
        Buy Now - $29.99
      </PayButton>
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { PayButton } from '@/components/ui/pay-button';

export default function ProductPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1>Premium Plan</h1>
      <p>Get access to all premium features</p>

      <PayButton
        priceId="price_1234567890"
        mode="payment"
        successUrl="/dashboard"
        cancelUrl="/pricing"
        onPaymentSuccess={(sessionId) => {
          console.log('Payment successful!', sessionId);
        }}
        onPaymentError={(error) => {
          console.error('Payment failed:', error);
        }}
      >
        Buy Now - $29.99
      </PayButton>
    </div>
  );
}`, 'basic-payment')}
                    >
                      {copiedCode === 'basic-payment' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Multiple payment options:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { PayButton } from '@/components/ui/pay-button';

const products = [
  { id: 'basic', name: 'Basic Plan', price: '$9.99', priceId: 'price_basic' },
  { id: 'pro', name: 'Pro Plan', price: '$19.99', priceId: 'price_pro' },
  { id: 'enterprise', name: 'Enterprise', price: '$49.99', priceId: 'price_enterprise' }
];

export default function PricingPage() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-6">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-600">{product.price}</p>

          <PayButton
            priceId={product.priceId}
            mode="payment"
            className="w-full mt-4"
            metadata={{ plan: product.id }}
          >
            Choose {product.name}
          </PayButton>
        </div>
      ))}
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { PayButton } from '@/components/ui/pay-button';

const products = [
  { id: 'basic', name: 'Basic Plan', price: '$9.99', priceId: 'price_basic' },
  { id: 'pro', name: 'Pro Plan', price: '$19.99', priceId: 'price_pro' },
  { id: 'enterprise', name: 'Enterprise', price: '$49.99', priceId: 'price_enterprise' }
];

export default function PricingPage() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-6">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-600">{product.price}</p>

          <PayButton
            priceId={product.priceId}
            mode="payment"
            className="w-full mt-4"
            metadata={{ plan: product.id }}
          >
            Choose {product.name}
          </PayButton>
        </div>
      ))}
    </div>
  );
}`, 'multiple-payments')}
                    >
                      {copiedCode === 'multiple-payments' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Custom checkout with useCheckout hook:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useCheckout } from '@/hooks/use-stripe';
import { useState } from 'react';

export default function CustomCheckout() {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const { redirectToCheckout, loading, error } = useCheckout();

  const plans = {
    basic: { priceId: 'price_basic', name: 'Basic Plan', price: 9.99 },
    pro: { priceId: 'price_pro', name: 'Pro Plan', price: 19.99 },
  };

  const handlePurchase = async () => {
    const plan = plans[selectedPlan];

    try {
      await redirectToCheckout({
        priceId: plan.priceId,
        mode: 'payment',
        successUrl: '/payment/success?plan=' + selectedPlan,
        cancelUrl: '/pricing',
        metadata: {
          plan: selectedPlan,
          source: 'custom-checkout'
        }
      });
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2>Choose Your Plan</h2>

      <div className="space-y-2 mb-4">
        {Object.entries(plans).map(([key, plan]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="radio"
              value={key}
              checked={selectedPlan === key}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
            <span>{plan.name} - \${plan.price}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : \`Purchase \${plans[selectedPlan].name}\`}
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

export default function CustomCheckout() {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const { redirectToCheckout, loading, error } = useCheckout();

  const plans = {
    basic: { priceId: 'price_basic', name: 'Basic Plan', price: 9.99 },
    pro: { priceId: 'price_pro', name: 'Pro Plan', price: 19.99 },
  };

  const handlePurchase = async () => {
    const plan = plans[selectedPlan];

    try {
      await redirectToCheckout({
        priceId: plan.priceId,
        mode: 'payment',
        successUrl: '/payment/success?plan=' + selectedPlan,
        cancelUrl: '/pricing',
        metadata: {
          plan: selectedPlan,
          source: 'custom-checkout'
        }
      });
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2>Choose Your Plan</h2>

      <div className="space-y-2 mb-4">
        {Object.entries(plans).map(([key, plan]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="radio"
              value={key}
              checked={selectedPlan === key}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
            <span>{plan.name} - \${plan.price}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : \`Purchase \${plans[selectedPlan].name}\`}
      </button>
    </div>
  );
}`, 'custom-checkout')}
                    >
                      {copiedCode === 'custom-checkout' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Customizing payment event handlers:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// actions/stripe-actions.ts

export async function onPaymentComplete(data: PaymentCompleteData) {
  console.log('Payment completed:', data);

  // 1. Update user's account status
  await updateUserPremiumStatus(data.customerId, true);

  // 2. Send confirmation email
  await sendPaymentConfirmationEmail(data.customerId, {
    amount: data.amount,
    currency: data.currency,
    productName: data.metadata?.plan || 'Premium Plan'
  });

  // 3. Grant access to paid features
  await grantPremiumAccess(data.customerId);

  // 4. Track analytics
  await trackEvent('payment_completed', {
    customerId: data.customerId,
    amount: data.amount,
    plan: data.metadata?.plan,
    source: data.metadata?.source
  });

  // 5. Integration with other services
  await addToMailchimpList(data.customerEmail, 'premium-customers');

  return { success: true };
}

export async function onPaymentFailed(data: PaymentFailedData) {
  console.log('Payment failed:', data);

  // 1. Log the failure for analysis
  await logPaymentFailure(data);

  // 2. Send failure notification (optional)
  if (data.customerEmail) {
    await sendPaymentFailureEmail(data.customerEmail, data.failureReason);
  }

  // 3. Track analytics
  await trackEvent('payment_failed', {
    customerId: data.customerId,
    amount: data.amount,
    failureReason: data.failureReason
  });

  return { success: true };
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// actions/stripe-actions.ts

export async function onPaymentComplete(data: PaymentCompleteData) {
  console.log('Payment completed:', data);

  // 1. Update user's account status
  await updateUserPremiumStatus(data.customerId, true);

  // 2. Send confirmation email
  await sendPaymentConfirmationEmail(data.customerId, {
    amount: data.amount,
    currency: data.currency,
    productName: data.metadata?.plan || 'Premium Plan'
  });

  // 3. Grant access to paid features
  await grantPremiumAccess(data.customerId);

  // 4. Track analytics
  await trackEvent('payment_completed', {
    customerId: data.customerId,
    amount: data.amount,
    plan: data.metadata?.plan,
    source: data.metadata?.source
  });

  // 5. Integration with other services
  await addToMailchimpList(data.customerEmail, 'premium-customers');

  return { success: true };
}

export async function onPaymentFailed(data: PaymentFailedData) {
  console.log('Payment failed:', data);

  // 1. Log the failure for analysis
  await logPaymentFailure(data);

  // 2. Send failure notification (optional)
  if (data.customerEmail) {
    await sendPaymentFailureEmail(data.customerEmail, data.failureReason);
  }

  // 3. Track analytics
  await trackEvent('payment_failed', {
    customerId: data.customerId,
    amount: data.amount,
    failureReason: data.failureReason
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
              <h4 className="font-medium">Test Mode First</h4>
              <p className="text-sm text-muted-foreground">Always test with Stripe test keys before going live. Use test card numbers for thorough testing.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Webhook Security</h4>
              <p className="text-sm text-muted-foreground">Always verify webhook signatures to ensure events are from Stripe. Never trust webhook data without verification.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Error Handling</h4>
              <p className="text-sm text-muted-foreground">Implement comprehensive error handling for payment failures, network issues, and user cancellations.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">User Experience</h4>
              <p className="text-sm text-muted-foreground">Provide clear loading states, success confirmations, and helpful error messages to users.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Security</h4>
              <p className="text-sm text-muted-foreground">Never expose secret keys in client-side code. Use environment variables and secure server-side processing.</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-medium">Monitoring</h4>
              <p className="text-sm text-muted-foreground">Monitor payment success rates, failure reasons, and webhook delivery to identify and resolve issues quickly.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
