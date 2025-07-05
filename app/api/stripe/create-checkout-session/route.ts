/**
 * Supreme Toolkit - Create Checkout Session API Route
 * 
 * Creates a Stripe checkout session for payments and subscriptions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

// ============================================================================
// TYPES
// ============================================================================

interface CreateCheckoutSessionRequest {
  priceId: string;
  mode?: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateCheckoutSessionRequest = await request.json();
    
    // Validate required fields
    if (!body.priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    if (!body.successUrl) {
      return NextResponse.json(
        { error: 'Success URL is required' },
        { status: 400 }
      );
    }

    if (!body.cancelUrl) {
      return NextResponse.json(
        { error: 'Cancel URL is required' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await createCheckoutSession({
      priceId: body.priceId,
      customerId: body.customerId,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      mode: body.mode || 'payment',
      metadata: body.metadata,
    });

    // Return session data
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      mode: session.mode,
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create checkout session' 
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
