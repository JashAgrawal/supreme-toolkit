"use client";

/**
 * Supreme Toolkit - Stripe Hooks
 * 
 * Custom React hooks for managing Stripe payments, subscriptions,
 * and customer data in the Supreme Toolkit.
 */

import { useState, useEffect, useCallback } from 'react';
import { getModuleConfig } from '@/config';

// ============================================================================
// TYPES
// ============================================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: string;
  };
  customer: {
    id: string;
    email: string;
  };
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  subscriptions: Subscription[];
}

export interface CheckoutSession {
  id: string;
  url: string;
  mode: 'payment' | 'subscription';
  status: string;
}

// ============================================================================
// USE STRIPE CONFIG HOOK
// ============================================================================

/**
 * Hook to get Stripe configuration
 */
export function useStripeConfig() {
  const [config, setConfig] = useState(() => {
    try {
      return getModuleConfig('stripe');
    } catch {
      return null;
    }
  });

  return config;
}

// ============================================================================
// USE CHECKOUT HOOK
// ============================================================================

/**
 * Hook for managing Stripe checkout sessions
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = useCallback(async (params: {
    priceId: string;
    mode?: 'payment' | 'subscription';
    successUrl?: string;
    cancelUrl?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: params.priceId,
          mode: params.mode || 'payment',
          successUrl: params.successUrl || `${window.location.origin}/payment/success`,
          cancelUrl: params.cancelUrl || `${window.location.origin}/payment/cancel`,
          customerId: params.customerId,
          metadata: params.metadata,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create checkout session');
      }

      const session: CheckoutSession = await response.json();
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const redirectToCheckout = useCallback(async (params: {
    priceId: string;
    mode?: 'payment' | 'subscription';
    successUrl?: string;
    cancelUrl?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }) => {
    try {
      const session = await createCheckoutSession(params);
      if (session.url) {
        window.location.href = session.url;
      }
      return session;
    } catch (err) {
      throw err;
    }
  }, [createCheckoutSession]);

  return {
    createCheckoutSession,
    redirectToCheckout,
    loading,
    error,
  };
}

// ============================================================================
// USE SUBSCRIPTION HOOK
// ============================================================================

/**
 * Hook for managing user subscriptions
 */
export function useSubscription(customerId?: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stripe/subscription?customerId=${customerId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setSubscription(null);
          return;
        }
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Cancel subscription
  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Refresh subscription data
      await fetchSubscription();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSubscription]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      // Refresh subscription data
      await fetchSubscription();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reactivate subscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSubscription]);

  // Load subscription on mount and when customerId changes
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    cancelSubscription,
    reactivateSubscription,
  };
}

// ============================================================================
// USE CUSTOMER PORTAL HOOK
// ============================================================================

/**
 * Hook for managing Stripe customer portal
 */
export function useCustomerPortal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPortalSession = useCallback(async (customerId: string, returnUrl?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: returnUrl || window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer portal session');
      }

      const { url } = await response.json();
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create portal session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const redirectToPortal = useCallback(async (customerId: string, returnUrl?: string) => {
    try {
      const url = await createPortalSession(customerId, returnUrl);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      throw err;
    }
  }, [createPortalSession]);

  return {
    createPortalSession,
    redirectToPortal,
    loading,
    error,
  };
}

// ============================================================================
// USE PAYMENT INTENT HOOK
// ============================================================================

/**
 * Hook for managing payment intents
 */
export function usePaymentIntent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (params: {
    amount: number;
    currency?: string;
    customerId?: string;
    metadata?: Record<string, string>;
    description?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency || 'usd',
          customerId: params.customerId,
          metadata: params.metadata,
          description: params.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const paymentIntent: PaymentIntent = await response.json();
      return paymentIntent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment intent';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createPaymentIntent,
    loading,
    error,
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Using checkout hook
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

// Using subscription hook
const { subscription, loading, cancelSubscription } = useSubscription(customerId);

// Using customer portal hook
const { redirectToPortal } = useCustomerPortal();

const handleManageSubscription = async () => {
  try {
    await redirectToPortal(customerId);
  } catch (err) {
    console.error('Portal failed:', err);
  }
};
*/
