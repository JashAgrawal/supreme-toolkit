"use client";

/**
 * Supreme Toolkit - PayButton Component
 * 
 * A customizable payment button component that integrates with Stripe
 * for handling one-time payments and subscriptions.
 */

import React from 'react';
import { Button } from './button';
import { Loader2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface PayButtonProps {
  /** The price ID from Stripe */
  priceId: string;
  /** Payment mode - 'payment' for one-time, 'subscription' for recurring */
  mode?: 'payment' | 'subscription';
  /** Button text */
  children?: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Success URL after payment */
  successUrl?: string;
  /** Cancel URL if payment is cancelled */
  cancelUrl?: string;
  /** Custom metadata to attach to the payment */
  metadata?: Record<string, string>;
  /** Customer ID if user is already a customer */
  customerId?: string;
  /** Callback when payment is initiated */
  onPaymentStart?: () => void;
  /** Callback when payment succeeds */
  onPaymentSuccess?: (sessionId: string) => void;
  /** Callback when payment fails */
  onPaymentError?: (error: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PayButton({
  priceId,
  mode = 'payment',
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  successUrl,
  cancelUrl,
  metadata,
  customerId,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  ...props
}: PayButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      onPaymentStart?.();

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: successUrl || `${window.location.origin}/payment/success`,
          cancelUrl: cancelUrl || `${window.location.origin}/payment/cancel`,
          metadata,
          customerId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
        onPaymentSuccess?.(sessionId);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError?.(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonLoading = loading || isLoading;
  const isButtonDisabled = disabled || isButtonLoading;

  return (
    <Button
      onClick={handlePayment}
      disabled={isButtonDisabled}
      variant={variant}
      size={size}
      className={cn('relative', className)}
      {...props}
    >
      {isButtonLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || (mode === 'subscription' ? 'Subscribe Now' : 'Pay Now')}
        </>
      )}
    </Button>
  );
}

// ============================================================================
// QUICK PAY BUTTON VARIANTS
// ============================================================================

/**
 * Quick one-time payment button
 */
export function QuickPayButton(props: Omit<PayButtonProps, 'mode'>) {
  return <PayButton {...props} mode="payment" />;
}

/**
 * Quick subscription button
 */
export function SubscribeButton(props: Omit<PayButtonProps, 'mode'>) {
  return <PayButton {...props} mode="subscription" />;
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Basic usage
<PayButton priceId="price_1234567890">
  Buy Now - $29.99
</PayButton>

// Subscription button
<SubscribeButton 
  priceId="price_subscription_123"
  onPaymentSuccess={(sessionId) => {
    console.log('Subscription started:', sessionId);
  }}
>
  Start Subscription - $9.99/month
</SubscribeButton>

// Custom styling and callbacks
<PayButton
  priceId="price_1234567890"
  variant="outline"
  size="lg"
  className="w-full"
  successUrl="/dashboard"
  cancelUrl="/pricing"
  metadata={{ source: 'pricing-page' }}
  onPaymentStart={() => {
    // Track payment initiation
    analytics.track('payment_started');
  }}
  onPaymentError={(error) => {
    // Handle error
    toast.error(`Payment failed: ${error}`);
  }}
>
  <CreditCard className="mr-2 h-4 w-4" />
  Purchase Premium Plan
</PayButton>
*/
