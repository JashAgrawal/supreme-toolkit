import { NextRequest, NextResponse } from 'next/server';
import { addMessageToTicketAction, getTicketByIdAction } from '@/actions/support-actions';
import { AddMessageSchema } from '@/types/support';
// import { getCurrentUser } from '@/lib/session'; // Placeholder

export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const ticketId = params.ticketId;
  // const user = await getCurrentUser(); // Placeholder
  // if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  // THIS IS A PLACEHOLDER FOR PROPER AUTH AND ROLE CHECKS
  const MOCK_IS_ADMIN = request.headers.get('X-Admin-Role') === 'true';
  const MOCK_USER_ID = request.headers.get('X-User-Id') || 'mock-user-id-from-session';

  if (!MOCK_USER_ID) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (!ticketId) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = AddMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    // The action `addMessageToTicketAction` itself should verify if the user (MOCK_USER_ID)
    // is allowed to post to this ticket (either as owner or as admin).
    const result = await addMessageToTicketAction(ticketId, MOCK_USER_ID, validation.data, MOCK_IS_ADMIN);

    if (result.success && result.message) {
      return NextResponse.json(result.message, { status: 201 });
    } else {
      // Distinguish between auth error and other errors if possible from action
      if (result.error === "Access denied to post message." || result.error === "Ticket not found.") {
        return NextResponse.json({ error: result.error }, { status: 403 });
      }
      return NextResponse.json({ error: result.error || 'Failed to add message' }, { status: 500 });
    }
  } catch (error) {
    console.error(`API Error adding message to ticket ${ticketId}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const ticketId = params.ticketId;
  // const user = await getCurrentUser(); // Placeholder
  // if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  // THIS IS A PLACEHOLDER FOR PROPER AUTH AND ROLE CHECKS
  const MOCK_IS_ADMIN = request.headers.get('X-Admin-Role') === 'true';
  const MOCK_USER_ID = request.headers.get('X-User-Id') || 'mock-user-id-from-session';

  if (!MOCK_USER_ID) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }


  if (!ticketId) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    // Re-use getTicketByIdAction which also fetches messages
    // The action handles auth check (user can only get their ticket, admin can get any)
    const result = await getTicketByIdAction(ticketId, MOCK_USER_ID, MOCK_IS_ADMIN);

    if (result.success && result.ticket) {
       // RLS in dbGetTicketById should handle access control.
      // Additional check here if necessary:
      // if (!MOCK_IS_ADMIN && result.ticket.userId !== MOCK_USER_ID) {
      //   return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      // }
      return NextResponse.json(result.messages || []);
    } else {
      return NextResponse.json({ error: result.error || 'Could not retrieve messages for ticket' }, { status: 404 });
    }
  } catch (error) {
    console.error(`API Error fetching messages for ticket ${ticketId}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
