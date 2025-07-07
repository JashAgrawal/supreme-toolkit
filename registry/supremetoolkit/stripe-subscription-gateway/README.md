# Stripe Subscription Gateway Module

The Stripe Subscription Gateway module provides a comprehensive solution for integrating Stripe payments into your Next.js application. It supports one-time payments, recurring subscriptions, a customer portal for subscription management, and webhook handling for payment events.

## Features

-   **One-Time Payments**: Accept single payments using Stripe Checkout.
-   **Subscription Management**: Create and manage recurring subscriptions.
-   **Customer Portal**: Allow users to manage their subscriptions, payment methods, and view invoices.
-   **Webhook Handling**: Securely process Stripe webhook events for payment intents, subscriptions, and invoices.
-   **UI Components**:
    -   `PayButton`: A button to initiate Stripe Checkout for a specific price ID.
    -   `PricingCard`: A card component to display product pricing and features, with an integrated `PayButton`.
    -   `SubscriptionManager`: A component to display current subscription status and provide links to the customer portal or cancel/reactivate subscriptions.
-   **Hooks**:
    -   `useStripeConfig()`: Access Stripe configuration.
    -   `useCheckout()`: Create and redirect to Stripe Checkout sessions.
    -   `useSubscription()`: Fetch and manage user subscription data.
    -   `useCustomerPortal()`: Create and redirect to Stripe Customer Portal.
    -   `usePaymentIntent()`: Create payment intents (not directly used by UI components but available).
-   **Server Actions**:
    -   `onPaymentComplete`, `onPaymentFailed`: Handle payment status.
    -   `onSubscriptionCreated`, `onSubscriptionCancelled`: Handle subscription lifecycle events.
    -   `onInvoiceGenerated`: Handle invoice events.
    -   `processStripeWebhook`: Securely process incoming webhooks.
    -   Utility actions: `createStripeCustomer`, `updateStripeCustomer`, etc.
-   **API Routes**: Endpoints for creating checkout sessions, managing subscriptions, customer portal, and handling webhooks.
-   **Configuration**: Driven by `config.tsx` for API keys, webhook secrets, and product IDs.

## Installation

```bash
npx shadcn@latest add "stripe-subscription-gateway"
# Or via the supreme toolkit URL if hosted
# npx shadcn@latest add "https://supreme.jashagrawal.in/r/stripe-subscription-gateway.json"
```

This will add the following files to your project:

-   `lib/stripe.ts`
-   `lib/pricing.ts`
-   `hooks/use-stripe.ts`
-   `components/ui/pay-button.tsx`
-   `components/ui/pricing-card.tsx`
-   `components/ui/subscription-manager.tsx`
-   `actions/stripe-actions.ts`
-   `app/api/stripe/*` (multiple API routes)
-   `docs/modules/stripe-subscription-gateway.md` (this file)

## Setup

1.  **Environment Variables**: Add your Stripe API keys and webhook secret to your `.env` file:
    ```env
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
    STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
    STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
    ```

2.  **Configuration (`config.tsx`)**: Update your `toolkitConfig` in `config.tsx` with your Stripe settings:
    ```ts
    export const toolkitConfig: ToolkitConfig = {
      // ... other configs
      stripe: {
        apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        productIds: ["prod_YOUR_PRODUCT_ID_1", "prod_YOUR_PRODUCT_ID_2"], // Add your Stripe Product IDs
        successUrl: '/payment/success', // Customize as needed
        cancelUrl: '/payment/cancel',   // Customize as needed
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    };
    ```
    Ensure `productIds` in `config.tsx` are correctly mapped to your Stripe Product IDs. The `lib/pricing.ts` file contains example pricing plans that use `stripePriceId` which should correspond to Price IDs in your Stripe account.

3.  **Stripe Webhook**:
    -   In your Stripe Dashboard, go to Developers > Webhooks.
    -   Click "Add endpoint".
    -   Set the Endpoint URL to `https://yourdomain.com/api/stripe/webhooks`.
    -   Select the events to listen to (e.g., `payment_intent.succeeded`, `customer.subscription.created`, `customer.subscription.deleted`, `invoice.finalized`).
    -   Add the endpoint and copy the Webhook signing secret to `STRIPE_WEBHOOK_SECRET` in your `.env` file.

## Usage

### Pricing Cards & Pay Button

Use the `PricingCard` component to display your plans. It uses `PayButton` internally.

```tsx
import { PricingCard, PricingGrid } from '@/components/ui/pricing-card';
import { defaultPricingPlans } from '@/lib/pricing'; // Example plans

export default function PricingPage() {
  const plans = defaultPricingPlans.map(plan => ({
    ...plan,
    // You might want to fetch these from a CMS or define them here
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  }));

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Our Plans</h1>
      <PricingGrid plans={plans} columns={3} />
    </div>
  );
}
```

### Standalone Pay Button

```tsx
import { PayButton } from '@/components/ui/pay-button';

<PayButton
  priceId="price_YOUR_STRIPE_PRICE_ID"
  mode="payment" // or "subscription"
  successUrl="/payment/success"
  cancelUrl="/payment/cancel"
>
  Buy Now
</PayButton>
```

### Subscription Management

Use the `SubscriptionManager` component to allow users to manage their subscriptions. You'll need to fetch the user's current subscription status.

```tsx
"use client";
import { SubscriptionManager, SubscriptionData } from '@/components/ui/subscription-manager';
import { useSubscription } from '@/hooks/use-stripe'; // Assuming useAuth provides customerId
import { useAuth } from '@/hooks/use-auth'; // Or your own auth solution

export default function AccountPage() {
  const { user } = useAuth(); // Get the authenticated user
  // This is a conceptual example; you need to map your app's user to a Stripe Customer ID.
  // Typically, you would store the Stripe Customer ID with your user record.
  const stripeCustomerId = user?.stripeCustomerId; // Assuming you have this

  const { subscription, loading, refetch } = useSubscription(stripeCustomerId);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Manage Subscription</h1>
      <SubscriptionManager
        subscription={subscription as SubscriptionData | undefined} // Cast if types don't align perfectly
        loading={loading}
        onCancelSubscription={refetch} // Refetch after cancellation
        onReactivateSubscription={refetch} // Refetch after reactivation
        onCustomerPortal={() => console.log("Redirecting to portal...")}
      />
    </div>
  );
}
```

### Handling Server Actions

Customize the server actions in `actions/stripe-actions.ts` (e.g., `onPaymentComplete`, `onSubscriptionCreated`) to integrate with your application's logic, such as updating user roles, granting access, or sending emails.

```typescript
// Example: actions/stripe-actions.ts
export async function onPaymentComplete(data: PaymentCompleteData) {
  console.log('Payment completed:', data);
  // TODO: Add your business logic:
  // - Find user by data.customerId or metadata
  // - Update user's subscription status in your database
  // - Grant access to features
  // - Send a confirmation email
  return { success: true, message: 'Payment processed successfully', data };
}
```

## Important Notes

-   **Stripe Customer ID**: You need a system to associate your application's users with Stripe Customer IDs. Create a Stripe Customer when a user signs up or makes their first payment, and store the `cus_XYZ` ID with their user record in your database.
-   **Security**: Ensure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are kept confidential and are not exposed on the client-side.
-   **`useGateway()` Hook**: The PRD mentions a `useGateway()` hook. This module currently provides `useStripe()` which contains more specific hooks like `useCheckout()`, `useSubscription()`. You can alias or refactor this if needed.
-   **Error Handling**: Implement robust error handling for API calls and webhook processing.
-   **Testing**: Thoroughly test the payment flows in Stripe's test mode before going live.
```
