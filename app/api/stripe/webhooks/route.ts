/**
 * Supreme Toolkit - Stripe Webhooks API Route
 * 
 * Handles incoming Stripe webhook events securely.
 * This endpoint processes payment and subscription events from Stripe.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateWebhookSignature } from '@/lib/stripe';
import { processStripeWebhook } from '@/actions/stripe-actions';
import { getModuleConfig } from '@/config';

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text();
    
    // Get the signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Get webhook secret from config
    const stripeConfig = getModuleConfig('stripe');
    const webhookSecret = stripeConfig?.webhookSecret;
    
    if (!webhookSecret) {
      console.error('Missing webhook secret in configuration');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Validate the webhook signature
    let event;
    try {
      event = validateWebhookSignature(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Log the event for debugging
    console.log(`Received Stripe webhook: ${event.type}`);

    // Process the webhook event
    const result = await processStripeWebhook(event);
    
    if (!result.success) {
      console.error('Webhook processing failed:', result.error);
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// SUPPORTED METHODS
// ============================================================================

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
