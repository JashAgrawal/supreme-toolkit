/**
 * Supreme Toolkit - Customer Portal API Route
 * 
 * Creates a Stripe customer portal session for subscription management.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe';

// ============================================================================
// TYPES
// ============================================================================

interface CreatePortalSessionRequest {
  customerId: string;
  returnUrl: string;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreatePortalSessionRequest = await request.json();
    
    // Validate required fields
    if (!body.customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    if (!body.returnUrl) {
      return NextResponse.json(
        { error: 'Return URL is required' },
        { status: 400 }
      );
    }

    // Create customer portal session
    const session = await createCustomerPortalSession(
      body.customerId,
      body.returnUrl
    );

    // Return session URL
    return NextResponse.json({
      url: session.url,
    });

  } catch (error) {
    console.error('Create customer portal session error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create customer portal session' 
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
