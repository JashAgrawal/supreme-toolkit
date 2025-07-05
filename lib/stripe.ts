/**
 * Supreme Toolkit - Stripe Configuration
 * 
 * This file contains the Stripe client configuration and utilities
 * for the Supreme Toolkit payment module.
 */

import Stripe from 'stripe';
import { getModuleConfig } from '@/config';

// ============================================================================
// STRIPE CLIENT CONFIGURATION
// ============================================================================

/**
 * Server-side Stripe instance
 * Only use this on the server side (API routes, server actions)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
  maxNetworkRetries: 2, // Retry failed requests up to 2 times
  timeout: 20 * 1000, // 20 second timeout
  appInfo: {
    name: 'Supreme Toolkit',
    version: '1.0.0',
    url: 'https://github.com/supreme-toolkit/supreme-toolkit',
  },
});

/**
 * Get Stripe configuration from the toolkit config
 */
export function getStripeConfig() {
  return getModuleConfig('stripe');
}

// ============================================================================
// STRIPE UTILITIES
// ============================================================================

/**
 * Format price for display (converts cents to dollars)
 */
export function formatPrice(priceInCents: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceInCents / 100);
}

/**
 * Convert dollars to cents for Stripe
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Validate webhook signature
 */
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`);
  }
}

// ============================================================================
// STRIPE TYPES
// ============================================================================

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  customerId?: string;
  description?: string;
}

export interface SubscriptionData {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}

export interface CustomerData {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface PriceData {
  productId: string;
  unitAmount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
  };
}

// ============================================================================
// STRIPE HELPER FUNCTIONS
// ============================================================================

/**
 * Create a payment intent
 */
export async function createPaymentIntent(data: PaymentIntentData): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: data.amount,
    currency: data.currency,
    customer: data.customerId,
    description: data.description,
    metadata: data.metadata || {},
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Create a customer
 */
export async function createCustomer(data: CustomerData): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email: data.email,
    name: data.name,
    metadata: data.metadata || {},
  });
}

/**
 * Create a subscription
 */
export async function createSubscription(data: SubscriptionData): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.create({
    customer: data.customerId,
    items: [{ price: data.priceId }],
    metadata: data.metadata || {},
    trial_period_days: data.trialPeriodDays,
  });
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Create a checkout session
 */
export async function createCheckoutSession(params: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'payment' | 'subscription';
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    mode: params.mode || 'payment',
    customer: params.customerId,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
  });
}

/**
 * Create a customer portal session
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Retrieve a customer by email
 */
export async function getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  const customers = await stripe.customers.list({
    email: email,
    limit: 1,
  });
  
  return customers.data.length > 0 ? customers.data[0] : null;
}

/**
 * Get customer subscriptions
 */
export async function getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
  });
  
  return subscriptions.data;
}

/**
 * Get active subscription for customer
 */
export async function getActiveSubscription(customerId: string): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });
  
  return subscriptions.data.length > 0 ? subscriptions.data[0] : null;
}

// ============================================================================
// STRIPE WEBHOOK EVENTS
// ============================================================================

export const STRIPE_WEBHOOK_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  INVOICE_FINALIZED: 'invoice.finalized',
} as const;

export type StripeWebhookEvent = typeof STRIPE_WEBHOOK_EVENTS[keyof typeof STRIPE_WEBHOOK_EVENTS];
