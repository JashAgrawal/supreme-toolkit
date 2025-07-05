"use server";

/**
 * Supreme Toolkit - Stripe Server Actions
 * 
 * Server actions for handling Stripe payment events and operations.
 * These actions are triggered by webhooks and user interactions.
 */

import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// ============================================================================
// TYPES
// ============================================================================

export interface PaymentCompleteData {
  paymentIntentId: string;
  customerId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionCreatedData {
  subscriptionId: string;
  customerId: string;
  priceId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  metadata?: Record<string, string>;
}

export interface SubscriptionCancelledData {
  subscriptionId: string;
  customerId: string;
  canceledAt: Date;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, string>;
}

export interface PaymentFailedData {
  paymentIntentId: string;
  customerId?: string;
  amount: number;
  currency: string;
  failureCode?: string;
  failureMessage?: string;
  metadata?: Record<string, string>;
}

export interface InvoiceGeneratedData {
  invoiceId: string;
  customerId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: Date;
  metadata?: Record<string, string>;
}

// ============================================================================
// PAYMENT EVENTS
// ============================================================================

/**
 * Called when a payment is successfully completed
 * Customize this function to handle successful payments in your app
 */
export async function onPaymentComplete(data: PaymentCompleteData) {
  try {
    console.log('Payment completed:', data);

    // Example: Update user's account status
    // await updateUserPremiumStatus(data.customerId, true);

    // Example: Send confirmation email
    // await sendPaymentConfirmationEmail(data.customerId, data.amount);

    // Example: Log the payment for analytics
    // await logPaymentEvent('payment_completed', data);

    // Example: Grant access to paid features
    // await grantPremiumAccess(data.customerId);

    // You can customize this function based on your app's needs
    return {
      success: true,
      message: 'Payment processed successfully',
      data,
    };
  } catch (error) {
    console.error('Error in onPaymentComplete:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Called when a payment fails
 * Customize this function to handle failed payments in your app
 */
export async function onPaymentFailed(data: PaymentFailedData) {
  try {
    console.log('Payment failed:', data);

    // Example: Send failure notification email
    // await sendPaymentFailureEmail(data.customerId, data.failureMessage);

    // Example: Log the failure for analytics
    // await logPaymentEvent('payment_failed', data);

    // Example: Retry payment logic
    // await schedulePaymentRetry(data.paymentIntentId);

    return {
      success: true,
      message: 'Payment failure handled',
      data,
    };
  } catch (error) {
    console.error('Error in onPaymentFailed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// SUBSCRIPTION EVENTS
// ============================================================================

/**
 * Called when a new subscription is created
 * Customize this function to handle new subscriptions in your app
 */
export async function onSubscriptionCreated(data: SubscriptionCreatedData) {
  try {
    console.log('Subscription created:', data);

    // Example: Update user's subscription status
    // await updateUserSubscription(data.customerId, {
    //   subscriptionId: data.subscriptionId,
    //   status: 'active',
    //   plan: data.priceId,
    //   currentPeriodEnd: data.currentPeriodEnd,
    // });

    // Example: Send welcome email
    // await sendSubscriptionWelcomeEmail(data.customerId);

    // Example: Grant subscription features
    // await grantSubscriptionAccess(data.customerId, data.priceId);

    // Example: Log subscription event
    // await logSubscriptionEvent('subscription_created', data);

    return {
      success: true,
      message: 'Subscription created successfully',
      data,
    };
  } catch (error) {
    console.error('Error in onSubscriptionCreated:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Called when a subscription is cancelled
 * Customize this function to handle subscription cancellations in your app
 */
export async function onSubscriptionCancelled(data: SubscriptionCancelledData) {
  try {
    console.log('Subscription cancelled:', data);

    // Example: Update user's subscription status
    // await updateUserSubscription(data.customerId, {
    //   subscriptionId: data.subscriptionId,
    //   status: 'cancelled',
    //   canceledAt: data.canceledAt,
    //   cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    // });

    // Example: Send cancellation confirmation email
    // await sendSubscriptionCancellationEmail(data.customerId);

    // Example: Schedule access removal (if cancel at period end)
    // if (data.cancelAtPeriodEnd) {
    //   await scheduleAccessRemoval(data.customerId, data.canceledAt);
    // } else {
    //   await revokeSubscriptionAccess(data.customerId);
    // }

    // Example: Log cancellation event
    // await logSubscriptionEvent('subscription_cancelled', data);

    return {
      success: true,
      message: 'Subscription cancellation handled',
      data,
    };
  } catch (error) {
    console.error('Error in onSubscriptionCancelled:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// INVOICE EVENTS
// ============================================================================

/**
 * Called when an invoice is generated
 * Customize this function to handle invoice generation in your app
 */
export async function onInvoiceGenerated(data: InvoiceGeneratedData) {
  try {
    console.log('Invoice generated:', data);

    // Example: Send invoice email to customer
    // await sendInvoiceEmail(data.customerId, data.invoiceId);

    // Example: Update billing records
    // await updateBillingRecord(data.customerId, {
    //   invoiceId: data.invoiceId,
    //   amount: data.amount,
    //   status: data.status,
    //   dueDate: data.dueDate,
    // });

    // Example: Log invoice event
    // await logInvoiceEvent('invoice_generated', data);

    return {
      success: true,
      message: 'Invoice generation handled',
      data,
    };
  } catch (error) {
    console.error('Error in onInvoiceGenerated:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a customer in Stripe
 */
export async function createStripeCustomer(email: string, name?: string, metadata?: Record<string, string>) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: metadata || {},
    });

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update a customer in Stripe
 */
export async function updateStripeCustomer(
  customerId: string, 
  updates: { email?: string; name?: string; metadata?: Record<string, string> }
) {
  try {
    const customer = await stripe.customers.update(customerId, updates);

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error updating Stripe customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get customer by email
 */
export async function getStripeCustomerByEmail(email: string) {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    const customer = customers.data.length > 0 ? customers.data[0] : null;

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Error getting Stripe customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cancel a subscription
 */
export async function cancelStripeSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true) {
  try {
    let subscription: Stripe.Subscription;

    if (cancelAtPeriodEnd) {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Error cancelling Stripe subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Reactivate a subscription
 */
export async function reactivateStripeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Error reactivating Stripe subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// WEBHOOK PROCESSING
// ============================================================================

/**
 * Process Stripe webhook events
 * This function routes webhook events to the appropriate handlers
 */
export async function processStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await onPaymentComplete({
          paymentIntentId: paymentIntent.id,
          customerId: paymentIntent.customer as string,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await onPaymentFailed({
          paymentIntentId: paymentIntent.id,
          customerId: paymentIntent.customer as string,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          failureCode: paymentIntent.last_payment_error?.code,
          failureMessage: paymentIntent.last_payment_error?.message,
          metadata: paymentIntent.metadata,
        });
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await onSubscriptionCreated({
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          priceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          metadata: subscription.metadata || {},
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await onSubscriptionCancelled({
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          canceledAt: new Date((subscription as any).canceled_at! * 1000),
          cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
          metadata: subscription.metadata || {},
        });
        break;
      }

      case 'invoice.finalized': {
        const invoice = event.data.object as Stripe.Invoice;
        await onInvoiceGenerated({
          invoiceId: invoice.id!,
          customerId: invoice.customer as string,
          subscriptionId: (invoice as any).subscription as string || undefined,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: invoice.status!,
          dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
          metadata: invoice.metadata || {},
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
