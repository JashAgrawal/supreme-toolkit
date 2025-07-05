/**
 * Supreme Toolkit - Reactivate Subscription API Route
 * 
 * Handles subscription reactivation requests.
 */

import { NextRequest, NextResponse } from 'next/server';
import { reactivateStripeSubscription } from '@/actions/stripe-actions';

// ============================================================================
// TYPES
// ============================================================================

interface ReactivateSubscriptionRequest {
  subscriptionId: string;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ReactivateSubscriptionRequest = await request.json();
    
    // Validate required fields
    if (!body.subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Reactivate the subscription
    const result = await reactivateStripeSubscription(body.subscriptionId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      message: 'Subscription reactivated successfully',
    });

  } catch (error) {
    console.error('Reactivate subscription error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to reactivate subscription' 
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
