"use server";

import { 
  createTicket, 
  getTicket, 
  getTickets, 
  updateTicket, 
  deleteTicket, 
  assignTicket,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getCategories,
  getTicketStats
} from '../lib/tickets';
import type { 
  SupportTicket, 
  TicketComment, 
  TicketCategory, 
  TicketStats,
  CreateTicketRequest, 
  UpdateTicketRequest,
  CreateCommentRequest,
  TicketFilters 
} from '../types';

// ============================================================================
// TICKET SERVER ACTIONS
// ============================================================================

/**
 * Create a new support ticket
 */
export async function createSupportTicket(
  ticketData: CreateTicketRequest,
  userId: string
): Promise<{
  success: boolean;
  ticket?: SupportTicket;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    if (!ticketData.title?.trim()) {
      return {
        success: false,
        error: 'Ticket title is required',
      };
    }

    if (!ticketData.description?.trim()) {
      return {
        success: false,
        error: 'Ticket description is required',
      };
    }

    if (!ticketData.category) {
      return {
        success: false,
        error: 'Ticket category is required',
      };
    }

    const ticket = await createTicket(ticketData, userId);

    // TODO: Send notification emails
    await onTicketCreated({
      ticket,
      userId,
      timestamp: new Date(),
    });

    return {
      success: true,
      ticket,
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return {
      success: false,
      error: 'Failed to create ticket',
    };
  }
}

/**
 * Get a single ticket by ID
 */
export async function getSupportTicket(
  ticketId: string,
  userId: string,
  userRole: 'customer' | 'agent' | 'admin'
): Promise<{
  success: boolean;
  ticket?: SupportTicket;
  error?: string;
}> {
  try {
    const ticket = await getTicket(ticketId);

    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found',
      };
    }

    // Check permissions
    if (userRole === 'customer' && ticket.created_by !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    return {
      success: true,
      ticket,
    };
  } catch (error) {
    console.error('Error getting ticket:', error);
    return {
      success: false,
      error: 'Failed to get ticket',
    };
  }
}

/**
 * Get tickets with filters
 */
export async function getSupportTickets(
  filters: TicketFilters,
  userId: string,
  userRole: 'customer' | 'agent' | 'admin'
): Promise<{
  success: boolean;
  tickets?: SupportTicket[];
  error?: string;
}> {
  try {
    const tickets = await getTickets(filters, userId, userRole);

    return {
      success: true,
      tickets,
    };
  } catch (error) {
    console.error('Error getting tickets:', error);
    return {
      success: false,
      error: 'Failed to get tickets',
    };
  }
}

/**
 * Update a ticket
 */
export async function updateSupportTicket(
  ticketId: string,
  updates: UpdateTicketRequest,
  userId: string,
  userRole: 'customer' | 'agent' | 'admin'
): Promise<{
  success: boolean;
  ticket?: SupportTicket;
  error?: string;
}> {
  try {
    const existingTicket = await getTicket(ticketId);

    if (!existingTicket) {
      return {
        success: false,
        error: 'Ticket not found',
      };
    }

    // Check permissions
    if (userRole === 'customer' && existingTicket.created_by !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    const updatedTicket = await updateTicket(ticketId, updates, userId);

    if (!updatedTicket) {
      return {
        success: false,
        error: 'Failed to update ticket',
      };
    }

    // TODO: Send notification emails for status changes
    await onTicketUpdated({
      ticket: updatedTicket,
      previousTicket: existingTicket,
      updatedBy: userId,
      timestamp: new Date(),
    });

    return {
      success: true,
      ticket: updatedTicket,
    };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return {
      success: false,
      error: 'Failed to update ticket',
    };
  }
}

/**
 * Assign ticket to an agent
 */
export async function assignSupportTicket(
  ticketId: string,
  agentId: string,
  assignedBy: string
): Promise<{
  success: boolean;
  ticket?: SupportTicket;
  error?: string;
}> {
  try {
    const updatedTicket = await assignTicket(ticketId, agentId);

    if (!updatedTicket) {
      return {
        success: false,
        error: 'Failed to assign ticket',
      };
    }

    // TODO: Send notification emails
    await onTicketAssigned({
      ticket: updatedTicket,
      agentId,
      assignedBy,
      timestamp: new Date(),
    });

    return {
      success: true,
      ticket: updatedTicket,
    };
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return {
      success: false,
      error: 'Failed to assign ticket',
    };
  }
}

// ============================================================================
// COMMENT SERVER ACTIONS
// ============================================================================

/**
 * Add a comment to a ticket
 */
export async function addTicketComment(
  ticketId: string,
  commentData: CreateCommentRequest,
  userId: string,
  userRole: 'customer' | 'agent' | 'admin'
): Promise<{
  success: boolean;
  comment?: TicketComment;
  error?: string;
}> {
  try {
    if (!commentData.content?.trim()) {
      return {
        success: false,
        error: 'Comment content is required',
      };
    }

    const ticket = await getTicket(ticketId);
    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found',
      };
    }

    // Check permissions
    if (userRole === 'customer' && ticket.created_by !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    const comment = await addComment(ticketId, commentData, userId, userRole);

    // TODO: Send notification emails
    await onCommentAdded({
      comment,
      ticket,
      userId,
      timestamp: new Date(),
    });

    return {
      success: true,
      comment,
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return {
      success: false,
      error: 'Failed to add comment',
    };
  }
}

/**
 * Get comments for a ticket
 */
export async function getTicketComments(
  ticketId: string,
  userId: string,
  userRole: 'customer' | 'agent' | 'admin'
): Promise<{
  success: boolean;
  comments?: TicketComment[];
  error?: string;
}> {
  try {
    const ticket = await getTicket(ticketId);
    if (!ticket) {
      return {
        success: false,
        error: 'Ticket not found',
      };
    }

    // Check permissions
    if (userRole === 'customer' && ticket.created_by !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    const comments = await getComments(ticketId, userRole);

    return {
      success: true,
      comments,
    };
  } catch (error) {
    console.error('Error getting comments:', error);
    return {
      success: false,
      error: 'Failed to get comments',
    };
  }
}

// ============================================================================
// CATEGORY AND STATS ACTIONS
// ============================================================================

/**
 * Get all ticket categories
 */
export async function getTicketCategories(): Promise<{
  success: boolean;
  categories?: TicketCategory[];
  error?: string;
}> {
  try {
    const categories = await getCategories();

    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return {
      success: false,
      error: 'Failed to get categories',
    };
  }
}

/**
 * Get ticket statistics
 */
export async function getSupportTicketStats(
  userId?: string,
  userRole?: 'customer' | 'agent' | 'admin'
): Promise<{
  success: boolean;
  stats?: TicketStats;
  error?: string;
}> {
  try {
    const stats = await getTicketStats(userId, userRole);

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      success: false,
      error: 'Failed to get stats',
    };
  }
}

// ============================================================================
// EVENT HANDLERS (Customize these for your business logic)
// ============================================================================

/**
 * Called when a ticket is created
 */
async function onTicketCreated(params: {
  ticket: SupportTicket;
  userId: string;
  timestamp: Date;
}) {
  console.log('Ticket created:', params.ticket.id);

  // Add your custom business logic here:
  // 1. Send email notifications
  // 2. Create Slack notifications
  // 3. Track analytics
  // 4. Auto-assign based on category
}

/**
 * Called when a ticket is updated
 */
async function onTicketUpdated(params: {
  ticket: SupportTicket;
  previousTicket: SupportTicket;
  updatedBy: string;
  timestamp: Date;
}) {
  console.log('Ticket updated:', params.ticket.id);

  // Add your custom business logic here:
  // 1. Send status change notifications
  // 2. Track resolution times
  // 3. Update analytics
}

/**
 * Called when a ticket is assigned
 */
async function onTicketAssigned(params: {
  ticket: SupportTicket;
  agentId: string;
  assignedBy: string;
  timestamp: Date;
}) {
  console.log('Ticket assigned:', params.ticket.id, 'to', params.agentId);

  // Add your custom business logic here:
  // 1. Notify the assigned agent
  // 2. Update workload tracking
  // 3. Send customer notification
}

/**
 * Called when a comment is added
 */
async function onCommentAdded(params: {
  comment: TicketComment;
  ticket: SupportTicket;
  userId: string;
  timestamp: Date;
}) {
  console.log('Comment added to ticket:', params.ticket.id);

  // Add your custom business logic here:
  // 1. Send email notifications to relevant parties
  // 2. Update ticket activity
  // 3. Track response times
}
