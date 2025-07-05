# 💳 Stripe Payment Module

The Supreme Toolkit Stripe module provides a complete payment solution with beautiful UI components, secure server actions, and comprehensive subscription management.

## 🚀 Features

- **Payment Components**: Pre-built payment buttons and pricing cards
- **Subscription Management**: Full subscription lifecycle handling
- **Webhook Integration**: Secure webhook processing for real-time events
- **Customer Portal**: Integrated Stripe customer portal for self-service
- **Server Actions**: Event-driven server functions for payment processing
- **TypeScript Support**: Fully typed for better development experience

## 📦 Installation

The Stripe module is included in Supreme Toolkit. To use it:

1. **Install Dependencies** (already done in Phase 2.2):
   ```bash
   npm install stripe @types/stripe
   ```

2. **Configure Environment Variables**:
   ```env
   # Required
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   
   # Optional (for webhooks)
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Update Configuration** in `config.tsx`:
   ```typescript
   export const toolkitConfig: ToolkitConfig = {
     stripe: {
       apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
       productIds: ['prod_example1', 'prod_example2'],
       successUrl: '/payment/success',
       cancelUrl: '/payment/cancel',
       webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
     },
   };
   ```

## 🎨 Components

### PayButton

A customizable payment button for one-time payments and subscriptions.

```tsx
import { PayButton, SubscribeButton } from '@/components/ui/pay-button';

// One-time payment
<PayButton
  priceId="price_1234567890"
  mode="payment"
  onPaymentSuccess={(sessionId) => {
    console.log('Payment successful:', sessionId);
  }}
>
  Buy Now - $29.99
</PayButton>

// Subscription
<SubscribeButton
  priceId="price_subscription_123"
  metadata={{ source: 'pricing-page' }}
>
  Subscribe - $9.99/month
</SubscribeButton>
```

**Props:**
- `priceId` (string): Stripe price ID
- `mode` ('payment' | 'subscription'): Payment mode
- `successUrl` (string): Success redirect URL
- `cancelUrl` (string): Cancel redirect URL
- `metadata` (object): Custom metadata
- `onPaymentStart` (function): Payment initiation callback
- `onPaymentSuccess` (function): Success callback
- `onPaymentError` (function): Error callback

### PricingCard

Beautiful pricing cards with integrated payment functionality.

```tsx
import { PricingCard, PricingGrid } from '@/components/ui/pricing-card';

<PricingCard
  title="Pro Plan"
  description="Perfect for growing businesses"
  price={29.99}
  originalPrice={39.99}
  interval="month"
  priceId="price_1RhWNXSErasIwHrG0cjoxhBy"
  features={[
    { name: "Unlimited projects", included: true },
    { name: "24/7 support", included: true },
    { name: "Advanced analytics", included: false },
  ]}
  popular={true}
/>

// Multiple cards
<PricingGrid
  plans={[plan1, plan2, plan3]}
  columns={3}
/>
```

### SubscriptionManager

Manage existing subscriptions with customer portal integration.

```tsx
import { SubscriptionManager } from '@/components/ui/subscription-manager';

<SubscriptionManager
  subscription={userSubscription}
  onCustomerPortal={() => {
    // Handle portal access
  }}
  onCancelSubscription={() => {
    // Handle cancellation
  }}
/>
```

## 🔧 Hooks

### useCheckout

Handle checkout session creation and redirection.

```tsx
import { useCheckout } from '@/hooks/use-stripe';

const { redirectToCheckout, loading, error } = useCheckout();

const handlePurchase = async () => {
  try {
    await redirectToCheckout({
      priceId: 'price_1234567890',
      mode: 'payment',
      successUrl: '/success',
      cancelUrl: '/cancel',
    });
  } catch (err) {
    console.error('Checkout failed:', err);
  }
};
```

### useSubscription

Manage user subscriptions.

```tsx
import { useSubscription } from '@/hooks/use-stripe';

const { 
  subscription, 
  loading, 
  error, 
  cancelSubscription,
  reactivateSubscription 
} = useSubscription(customerId);
```

### useCustomerPortal

Access Stripe customer portal.

```tsx
import { useCustomerPortal } from '@/hooks/use-stripe';

const { redirectToPortal, loading } = useCustomerPortal();

const handleManageSubscription = async () => {
  await redirectToPortal(customerId);
};
```

## ⚡ Server Actions

### Payment Events

```typescript
import { 
  onPaymentComplete,
  onPaymentFailed,
  onSubscriptionCreated,
  onSubscriptionCancelled,
  onInvoiceGenerated
} from '@/actions/stripe-actions';

// Customize these functions for your app's needs
export async function onPaymentComplete(data: PaymentCompleteData) {
  // Handle successful payment
  // - Update user account
  // - Send confirmation email
  // - Grant access to features
}

export async function onSubscriptionCreated(data: SubscriptionCreatedData) {
  // Handle new subscription
  // - Update user subscription status
  // - Send welcome email
  // - Grant subscription features
}
```

### Utility Functions

```typescript
import { 
  createStripeCustomer,
  cancelStripeSubscription,
  reactivateStripeSubscription
} from '@/actions/stripe-actions';

// Create customer
const result = await createStripeCustomer(
  'user@example.com',
  'John Doe',
  { userId: '123' }
);

// Cancel subscription
await cancelStripeSubscription('sub_123', true); // Cancel at period end
```

## 🌐 API Routes

### Webhook Handler

Processes Stripe webhook events securely.

**Endpoint:** `POST /api/stripe/webhooks`

**Setup:**
1. Configure webhook endpoint in Stripe Dashboard
2. Add webhook secret to environment variables
3. Select events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.finalized`

### Checkout Session

Creates checkout sessions for payments.

**Endpoint:** `POST /api/stripe/create-checkout-session`

```typescript
// Request
{
  "priceId": "price_1234567890",
  "mode": "payment",
  "successUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/cancel",
  "customerId": "cus_123", // optional
  "metadata": { "userId": "123" } // optional
}

// Response
{
  "sessionId": "cs_123",
  "url": "https://checkout.stripe.com/..."
}
```

### Customer Portal

Creates customer portal sessions.

**Endpoint:** `POST /api/stripe/customer-portal`

```typescript
// Request
{
  "customerId": "cus_123",
  "returnUrl": "https://yourapp.com/account"
}

// Response
{
  "url": "https://billing.stripe.com/..."
}
```

## 💰 Pricing Configuration

Use the pricing configuration system for centralized plan management.

```typescript
import { 
  getPricingPlans,
  getPricingComparison,
  planToPricingCardProps
} from '@/lib/pricing';

// Get monthly plans
const monthlyPlans = getPricingPlans('month');

// Get yearly plans with discount
const yearlyPlans = getPricingPlans('year');

// Convert to pricing card props
const pricingCards = monthlyPlans.map(plan => 
  planToPricingCardProps(plan, {
    successUrl: '/dashboard',
    metadata: { source: 'pricing-page' }
  })
);
```

## 🔒 Security

### Webhook Verification

All webhooks are verified using Stripe's signature verification:

```typescript
import { validateWebhookSignature } from '@/lib/stripe';

const event = validateWebhookSignature(
  requestBody,
  stripeSignature,
  webhookSecret
);
```

### Environment Variables

Keep sensitive keys secure:

```env
# Server-side only
STRIPE_SECRET_KEY=sk_live_...

# Client-side safe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Webhook verification
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🎯 Best Practices

1. **Always use server-side keys** for sensitive operations
2. **Verify webhook signatures** to ensure authenticity
3. **Handle errors gracefully** in payment flows
4. **Use metadata** to track additional information
5. **Test with Stripe test mode** before going live
6. **Implement proper logging** for debugging
7. **Use TypeScript** for better type safety

## 🧪 Testing

Test your Stripe integration using Stripe's test mode:

```bash
# Test card numbers
4242424242424242  # Visa (succeeds)
4000000000000002  # Visa (declined)
4000000000009995  # Visa (insufficient funds)
```

## 📚 Examples

Check out the demo page at `/stripe-demo` for complete examples of:
- Pricing cards with different plans
- One-time payment buttons
- Subscription management
- Customer portal integration

## 🆘 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL in Stripe Dashboard
   - Verify webhook secret is correct
   - Ensure endpoint is publicly accessible

2. **Payment button not working**
   - Verify Stripe publishable key is set
   - Check browser console for errors
   - Ensure price ID exists in Stripe

3. **Customer portal not loading**
   - Verify customer ID is valid
   - Check return URL is accessible
   - Ensure customer has payment method

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will log detailed information about Stripe operations.

## 📖 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Customer Portal Guide](https://stripe.com/docs/billing/subscriptions/customer-portal)
