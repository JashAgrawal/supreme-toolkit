import { NextRequest, NextResponse } from 'next/server';
import { createTicketAction, getTicketsForUserAction, getAllTicketsAdminAction } from '@/actions/support-actions';
import { CreateTicketSchema } from '@/types/support';
// Assume a way to get current user's ID and role, e.g., from a session utility
// import { getCurrentUser } from '@/lib/session'; // Placeholder

export async function POST(request: NextRequest) {
  // const user = await getCurrentUser(); // Placeholder for getting authenticated user
  // For now, let's assume userId is passed in body or handled by RLS if not.
  // This should be properly authenticated in a real app.
  let userIdFromBody: string | undefined;

  try {
    const body = await request.json();
    userIdFromBody = body.userId; // TEMPORARY: Client should not send this. Server should get it from session.

    if (!userIdFromBody) { // Replace with actual session check
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const validation = CreateTicketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await createTicketAction(userIdFromBody, validation.data); // Use actual user ID from session

    if (result.success && result.ticket) {
      return NextResponse.json(result.ticket, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to create ticket' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error creating ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // const user = await getCurrentUser(); // Placeholder
  // if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  // This is a simplified example. In a real app, you'd get userId from session.
  // For admin, you'd check role.
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); // For user fetching their tickets
  const scope = searchParams.get('scope'); // e.g., 'admin'
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  // Admin filters
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;

  // THIS IS A PLACEHOLDER FOR PROPER AUTH AND ROLE CHECKS
  const MOCK_IS_ADMIN = scope === 'admin';
  const MOCK_USER_ID = userId || 'mock-user-id-from-session';


  if (MOCK_IS_ADMIN) {
    // Admin fetching all tickets
    const result = await getAllTicketsAdminAction(page, limit, { status, priority });
    if (result.success) {
      return NextResponse.json({ tickets: result.tickets, total: result.total, page, limit });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to fetch tickets' }, { status: 500 });
    }
  } else {
    // User fetching their own tickets
    if (!MOCK_USER_ID) { // Should be actual user ID from session
        return NextResponse.json({ error: 'User ID is required or not authenticated' }, { status: 400 });
    }
    const result = await getTicketsForUserAction(MOCK_USER_ID, page, limit);
     if (result.success) {
      return NextResponse.json({ tickets: result.tickets, total: result.total, page, limit });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to fetch user tickets' }, { status: 500 });
    }
  }
}
