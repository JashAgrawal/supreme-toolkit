import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getModuleConfig } from "@/config";
import { Id } from "@/convex/_generated/dataModel";

// ============================================================================
// SUPPORT TICKET SYSTEM WITH CONVEX
// ============================================================================

// Initialize Convex client
const convexConfig = getModuleConfig('convex');
const convex = new ConvexHttpClient(convexConfig.url);

// ============================================================================
// TYPES
// ============================================================================

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_by: string;
  assigned_to?: string;
  tags: string[];
  attachments: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  resolved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  content: string;
  author_id: string;
  is_internal: boolean;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags?: string[];
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  assigned_to?: string;
  tags?: string[];
}

export interface TicketFilters {
  status?: ('open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed')[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  category?: string[];
  assigned_to?: string;
  created_by?: string;
  search?: string;
}

// ============================================================================
// TICKET OPERATIONS
// ============================================================================

/**
 * Create a new support ticket
 */
export async function createTicket(
  ticketData: CreateTicketRequest,
  userId: string
): Promise<SupportTicket> {
  try {
    const ticketId = await convex.mutation(api.support.createTicket, {
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      category: ticketData.category,
      createdBy: userId as Id<"users">,
      tags: ticketData.tags,
      attachments: ticketData.attachments,
    });

    const ticket = await convex.query(api.support.getTicket, {
      id: ticketId as Id<"supportTickets">
    });

    if (!ticket) {
      throw new Error('Failed to retrieve created ticket');
    }

    return transformConvexTicket(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw new Error('Failed to create support ticket');
  }
}

/**
 * Get a single ticket by ID
 */
export async function getTicket(ticketId: string): Promise<SupportTicket | null> {
  try {
    const ticket = await convex.query(api.support.getTicket, {
      id: ticketId as Id<"supportTickets">
    });

    return ticket ? transformConvexTicket(ticket) : null;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
}

/**
 * Get tickets with filters
 */
export async function getTickets(
  filters: TicketFilters = {},
  userId?: string,
  userRole?: 'customer' | 'agent' | 'admin'
): Promise<SupportTicket[]> {
  try {
    const tickets = await convex.query(api.support.getTickets, {
      status: filters.status?.[0],
      priority: filters.priority?.[0],
      category: filters.category?.[0],
      assignedTo: filters.assigned_to as Id<"users">,
      createdBy: filters.created_by as Id<"users">,
      limit: 50,
    });

    let filteredTickets = tickets || [];

    // Apply role-based filtering
    if (userRole === 'customer' && userId) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.creator?.email === userId || ticket.creator?._id === userId
      );
    } else if (userRole === 'agent' && userId) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.assignee?._id === userId || ticket.status !== 'closed'
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        (ticket.tags ?? []).some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filteredTickets.map(transformConvexTicket);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

/**
 * Update ticket
 */
export async function updateTicket(
  ticketId: string,
  updates: UpdateTicketRequest,
  userId: string
): Promise<SupportTicket | null> {
  try {
    await convex.mutation(api.support.updateTicket, {
      id: ticketId as Id<"supportTickets">,
      ...updates,
      assignedTo: updates.assigned_to as Id<"users">,
    });

    const updatedTicket = await convex.query(api.support.getTicket, {
      id: ticketId as Id<"supportTickets">
    });

    return updatedTicket ? transformConvexTicket(updatedTicket) : null;
  } catch (error) {
    console.error('Error updating ticket:', error);
    return null;
  }
}

/**
 * Delete ticket
 */
export async function deleteTicket(ticketId: string): Promise<boolean> {
  try {
    await convex.mutation(api.support.deleteTicket, {
      id: ticketId as Id<"supportTickets">,
    });
    return true;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return false;
  }
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

/**
 * Get comments for a ticket
 */
export async function getTicketComments(
  ticketId: string,
  includeInternal: boolean = false
): Promise<TicketComment[]> {
  try {
    const comments = await convex.query(api.support.getTicketComments, {
      ticketId: ticketId as any,
      includeInternal,
    });

    return (comments || []).map(transformConvexComment);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

/**
 * Add comment to ticket
 */
export async function addTicketComment(
  ticketId: string,
  content: string,
  authorId: string,
  isInternal: boolean = false,
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>
): Promise<TicketComment | null> {
  try {
    const commentId = await convex.mutation(api.support.addComment, {
      ticketId: ticketId as any,
      content,
      authorId: authorId as any,
      isInternal,
      attachments,
    });

    // Get the created comment (would need to implement getComment query)
    // For now, return a basic structure
    return {
      id: commentId,
      ticket_id: ticketId,
      content,
      author_id: authorId,
      is_internal: isInternal,
      attachments: attachments || [],
      created_at: new Date(),
      updated_at: new Date(),
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get ticket statistics
 */
export async function getTicketStats(
  userId?: string,
  timeRange?: number
): Promise<any> {
  try {
    return await convex.query(api.support.getTicketStats, {
      userId: userId as any,
      timeRange,
    });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      waitingForCustomer: 0,
      resolved: 0,
      closed: 0,
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
      averageResolutionTime: 0,
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transform Convex ticket to our format
 */
function transformConvexTicket(convexTicket: any): SupportTicket {
  return {
    id: convexTicket._id,
    title: convexTicket.title,
    description: convexTicket.description,
    status: convexTicket.status,
    priority: convexTicket.priority,
    category: convexTicket.category,
    created_by: convexTicket.creator?._id || convexTicket.createdBy,
    assigned_to: convexTicket.assignee?._id,
    tags: convexTicket.tags || [],
    attachments: convexTicket.attachments || [],
    resolved_at: convexTicket.resolvedAt ? new Date(convexTicket.resolvedAt) : undefined,
    created_at: new Date(convexTicket.createdAt),
    updated_at: new Date(convexTicket.updatedAt),
  };
}

/**
 * Transform Convex comment to our format
 */
function transformConvexComment(convexComment: any): TicketComment {
  return {
    id: convexComment._id,
    ticket_id: convexComment.ticketId,
    content: convexComment.content,
    author_id: convexComment.author?._id || convexComment.authorId,
    is_internal: convexComment.isInternal,
    attachments: convexComment.attachments || [],
    created_at: new Date(convexComment.createdAt),
    updated_at: new Date(convexComment.updatedAt),
  };
}
