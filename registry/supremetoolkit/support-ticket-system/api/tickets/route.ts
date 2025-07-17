import { NextRequest, NextResponse } from 'next/server';
import {
  createSupportTicket,
  getSupportTicket,
  getSupportTickets,
  updateSupportTicket,
  assignSupportTicket,
  addTicketComment,
  getTicketComments,
  getTicketCategories,
  getSupportTicketStats
} from '../../actions/ticket-actions';

// ============================================================================
// SUPPORT TICKETS API ROUTES
// ============================================================================

/**
 * POST /api/tickets - Create ticket, add comment, or perform actions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, userRole = 'customer', ...data } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create_ticket': {
        const result = await createSupportTicket(data, userId);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.ticket,
        });
      }

      case 'update_ticket': {
        const { ticketId, updates } = data;
        
        if (!ticketId) {
          return NextResponse.json(
            { error: 'Ticket ID is required' },
            { status: 400 }
          );
        }

        const result = await updateSupportTicket(ticketId, updates, userId, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Ticket not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.ticket,
        });
      }

      case 'assign_ticket': {
        const { ticketId, agentId } = data;
        
        if (!ticketId || !agentId) {
          return NextResponse.json(
            { error: 'Ticket ID and Agent ID are required' },
            { status: 400 }
          );
        }

        const result = await assignSupportTicket(ticketId, agentId, userId);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.ticket,
        });
      }

      case 'add_comment': {
        const { ticketId, content, isInternal } = data;
        
        if (!ticketId || !content) {
          return NextResponse.json(
            { error: 'Ticket ID and content are required' },
            { status: 400 }
          );
        }

        const result = await addTicketComment(
          ticketId,
          { content, is_internal: isInternal },
          userId,
          userRole
        );
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Ticket not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.comment,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Tickets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tickets - Get tickets, comments, categories, or stats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = (searchParams.get('userRole') as 'customer' | 'agent' | 'admin') || 'customer';
    const ticketId = searchParams.get('ticketId');
    const type = searchParams.get('type'); // 'tickets', 'comments', 'categories', 'stats'

    if (!userId && type !== 'categories') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'comments': {
        if (!ticketId) {
          return NextResponse.json(
            { error: 'Ticket ID is required for comments' },
            { status: 400 }
          );
        }

        const result = await getTicketComments(ticketId, userId!, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Ticket not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.comments,
        });
      }

      case 'categories': {
        const result = await getTicketCategories();
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.categories,
        });
      }

      case 'stats': {
        const result = await getSupportTicketStats(userId!, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.stats,
        });
      }

      case 'single': {
        if (!ticketId) {
          return NextResponse.json(
            { error: 'Ticket ID is required' },
            { status: 400 }
          );
        }

        const result = await getSupportTicket(ticketId, userId!, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Ticket not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.ticket,
        });
      }

      default: {
        // Get tickets with filters
        const filters = {
          status: searchParams.get('status')?.split(',') as any,
          priority: searchParams.get('priority')?.split(',') as any,
          category: searchParams.get('category')?.split(','),
          assigned_to: searchParams.get('assignedTo')?.split(','),
          search: searchParams.get('search') || undefined,
        };

        // Remove undefined values
        Object.keys(filters).forEach(key => {
          if (filters[key as keyof typeof filters] === undefined) {
            delete filters[key as keyof typeof filters];
          }
        });

        const result = await getSupportTickets(filters, userId!, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.tickets,
        });
      }
    }
  } catch (error) {
    console.error('Tickets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
