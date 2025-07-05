/**
 * Supreme Toolkit - Subscription API Route
 * 
 * Handles subscription-related operations like fetching, canceling, and reactivating subscriptions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveSubscription } from '@/lib/stripe';
import { cancelStripeSubscription, reactivateStripeSubscription } from '@/actions/stripe-actions';

// ============================================================================
// GET SUBSCRIPTION
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get active subscription for customer
    const subscription = await getActiveSubscription(customerId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Format subscription data
    const subscriptionData = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : undefined,
      plan: {
        id: subscription.items.data[0].price.id,
        name: subscription.items.data[0].price.nickname || 'Subscription',
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.items.data[0].price.currency,
        interval: subscription.items.data[0].price.recurring?.interval || 'month',
      },
      customer: {
        id: subscription.customer as string,
        email: typeof subscription.customer === 'object' && 'email' in subscription.customer ? subscription.customer.email || '' : '',
      },
    };

    return NextResponse.json(subscriptionData);

  } catch (error) {
    console.error('Get subscription error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch subscription' 
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, cancelAtPeriodEnd = true } = body;
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Cancel the subscription
    const result = await cancelStripeSubscription(subscriptionId, cancelAtPeriodEnd);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to cancel subscription' 
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// UPDATE SUBSCRIPTION (for reactivation)
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, action } = body;
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    if (action === 'reactivate') {
      // Reactivate the subscription
      const result = await reactivateStripeSubscription(subscriptionId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        subscription: result.subscription,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update subscription error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update subscription' 
      },
      { status: 500 }
    );
  }
}
