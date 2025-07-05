/**
 * Supreme Toolkit - Cancel Subscription API Route
 * 
 * Handles subscription cancellation requests.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cancelStripeSubscription } from '@/actions/stripe-actions';

// ============================================================================
// TYPES
// ============================================================================

interface CancelSubscriptionRequest {
  subscriptionId: string;
  cancelAtPeriodEnd?: boolean;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CancelSubscriptionRequest = await request.json();
    
    // Validate required fields
    if (!body.subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Cancel the subscription
    const result = await cancelStripeSubscription(
      body.subscriptionId, 
      body.cancelAtPeriodEnd ?? true
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      message: body.cancelAtPeriodEnd 
        ? 'Subscription will be cancelled at the end of the current period'
        : 'Subscription cancelled immediately',
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
// SUPPORTED METHODS
// ============================================================================

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
