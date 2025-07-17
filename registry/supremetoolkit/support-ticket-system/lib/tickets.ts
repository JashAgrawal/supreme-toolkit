import { getModuleConfig } from '@/config';
import type { 
  SupportTicket, 
  TicketComment, 
  TicketCategory, 
  TicketStats,
  TicketFilters,
  CreateTicketRequest,
  UpdateTicketRequest,
  CreateCommentRequest,
  TicketSystemConfig
} from '../types';

// ============================================================================
// TICKET SYSTEM CONFIGURATION
// ============================================================================

const config = getModuleConfig('tickets') as TicketSystemConfig;

export const ticketConfig = {
  enableFileUploads: config?.enableFileUploads ?? true,
  maxFileSize: config?.maxFileSize ?? 10, // MB
  allowedFileTypes: config?.allowedFileTypes ?? ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  enableInternalComments: config?.enableInternalComments ?? true,
  enableEmailNotifications: config?.enableEmailNotifications ?? true,
  autoAssignTickets: config?.autoAssignTickets ?? false,
  defaultPriority: config?.defaultPriority ?? 'medium',
  enableSatisfactionSurvey: config?.enableSatisfactionSurvey ?? true,
};

// ============================================================================
// IN-MEMORY STORAGE (Replace with your database)
// ============================================================================

const ticketStore: Map<string, SupportTicket> = new Map();
const commentStore: Map<string, TicketComment[]> = new Map();
const categoryStore: Map<string, TicketCategory> = new Map();

// Initialize default categories
const defaultCategories: TicketCategory[] = [
  {
    id: 'general',
    name: 'General Support',
    description: 'General questions and support requests',
    color: '#6B7280',
    is_active: true,
    created_at: new Date(),
  },
  {
    id: 'technical',
    name: 'Technical Issue',
    description: 'Technical problems and bugs',
    color: '#EF4444',
    is_active: true,
    created_at: new Date(),
  },
  {
    id: 'billing',
    name: 'Billing & Payments',
    description: 'Billing questions and payment issues',
    color: '#10B981',
    is_active: true,
    created_at: new Date(),
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'Requests for new features or improvements',
    color: '#3B82F6',
    is_active: true,
    created_at: new Date(),
  },
];

defaultCategories.forEach(category => {
  categoryStore.set(category.id, category);
});

// ============================================================================
// TICKET OPERATIONS
// ============================================================================

/**
 * Generate unique ticket ID
 */
export function generateTicketId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

/**
 * Create a new support ticket
 */
export async function createTicket(
  ticketData: CreateTicketRequest,
  userId: string
): Promise<SupportTicket> {
  const ticketId = generateTicketId();
  
  const ticket: SupportTicket = {
    id: ticketId,
    title: ticketData.title.trim(),
    description: ticketData.description.trim(),
    status: 'open',
    priority: ticketData.priority,
    category: ticketData.category,
    created_by: userId,
    created_at: new Date(),
    updated_at: new Date(),
    tags: ticketData.tags || [],
    attachments: [], // TODO: Handle file uploads
  };

  ticketStore.set(ticketId, ticket);
  commentStore.set(ticketId, []);

  // Auto-assign if enabled
  if (ticketConfig.autoAssignTickets) {
    // TODO: Implement auto-assignment logic
  }

  return ticket;
}

/**
 * Get ticket by ID
 */
export async function getTicket(ticketId: string): Promise<SupportTicket | null> {
  return ticketStore.get(ticketId) || null;
}

/**
 * Get tickets with filters
 */
export async function getTickets(
  filters: TicketFilters = {},
  userId?: string,
  userRole?: 'customer' | 'agent' | 'admin'
): Promise<SupportTicket[]> {
  let tickets = Array.from(ticketStore.values());

  // Filter by user role
  if (userRole === 'customer' && userId) {
    tickets = tickets.filter(ticket => ticket.created_by === userId);
  } else if (userRole === 'agent' && userId) {
    tickets = tickets.filter(ticket => 
      ticket.assigned_to === userId || ticket.status !== 'closed'
    );
  }

  // Apply filters
  if (filters.status?.length) {
    tickets = tickets.filter(ticket => filters.status!.includes(ticket.status));
  }

  if (filters.priority?.length) {
    tickets = tickets.filter(ticket => filters.priority!.includes(ticket.priority));
  }

  if (filters.category?.length) {
    tickets = tickets.filter(ticket => filters.category!.includes(ticket.category));
  }

  if (filters.assigned_to?.length) {
    tickets = tickets.filter(ticket => 
      ticket.assigned_to && filters.assigned_to!.includes(ticket.assigned_to)
    );
  }

  if (filters.created_by?.length) {
    tickets = tickets.filter(ticket => filters.created_by!.includes(ticket.created_by));
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    tickets = tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm) ||
      ticket.id.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.date_range) {
    tickets = tickets.filter(ticket =>
      ticket.created_at >= filters.date_range!.start &&
      ticket.created_at <= filters.date_range!.end
    );
  }

  // Sort by updated_at (newest first)
  return tickets.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
}

/**
 * Update ticket
 */
export async function updateTicket(
  ticketId: string,
  updates: UpdateTicketRequest,
  userId: string
): Promise<SupportTicket | null> {
  const ticket = ticketStore.get(ticketId);
  if (!ticket) return null;

  const updatedTicket: SupportTicket = {
    ...ticket,
    ...updates,
    updated_at: new Date(),
  };

  // Set resolved_at when status changes to resolved
  if (updates.status === 'resolved' && ticket.status !== 'resolved') {
    updatedTicket.resolved_at = new Date();
  }

  ticketStore.set(ticketId, updatedTicket);
  return updatedTicket;
}

/**
 * Delete ticket
 */
export async function deleteTicket(ticketId: string): Promise<boolean> {
  const deleted = ticketStore.delete(ticketId);
  if (deleted) {
    commentStore.delete(ticketId);
  }
  return deleted;
}

/**
 * Assign ticket to agent
 */
export async function assignTicket(
  ticketId: string,
  agentId: string
): Promise<SupportTicket | null> {
  return updateTicket(ticketId, { assigned_to: agentId }, agentId);
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

/**
 * Add comment to ticket
 */
export async function addComment(
  ticketId: string,
  commentData: CreateCommentRequest,
  userId: string,
  userRole: 'customer' | 'agent' | 'admin'
): Promise<TicketComment> {
  const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const comment: TicketComment = {
    id: commentId,
    ticket_id: ticketId,
    user_id: userId,
    content: commentData.content.trim(),
    is_internal: commentData.is_internal || false,
    created_at: new Date(),
    updated_at: new Date(),
    attachments: [], // TODO: Handle file uploads
    user: {
      id: userId,
      name: 'User', // TODO: Get actual user data
      email: 'user@example.com',
      role: userRole,
    },
  };

  const comments = commentStore.get(ticketId) || [];
  comments.push(comment);
  commentStore.set(ticketId, comments);

  // Update ticket's updated_at
  const ticket = ticketStore.get(ticketId);
  if (ticket) {
    ticket.updated_at = new Date();
    ticketStore.set(ticketId, ticket);
  }

  return comment;
}

/**
 * Get comments for ticket
 */
export async function getComments(
  ticketId: string,
  userRole?: 'customer' | 'agent' | 'admin'
): Promise<TicketComment[]> {
  const comments = commentStore.get(ticketId) || [];
  
  // Filter internal comments for customers
  if (userRole === 'customer') {
    return comments.filter(comment => !comment.is_internal);
  }
  
  return comments.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
}

/**
 * Update comment
 */
export async function updateComment(
  ticketId: string,
  commentId: string,
  content: string
): Promise<TicketComment | null> {
  const comments = commentStore.get(ticketId) || [];
  const commentIndex = comments.findIndex(c => c.id === commentId);
  
  if (commentIndex === -1) return null;
  
  comments[commentIndex].content = content.trim();
  comments[commentIndex].updated_at = new Date();
  
  commentStore.set(ticketId, comments);
  return comments[commentIndex];
}

/**
 * Delete comment
 */
export async function deleteComment(
  ticketId: string,
  commentId: string
): Promise<boolean> {
  const comments = commentStore.get(ticketId) || [];
  const filteredComments = comments.filter(c => c.id !== commentId);
  
  if (filteredComments.length === comments.length) return false;
  
  commentStore.set(ticketId, filteredComments);
  return true;
}

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

/**
 * Get all categories
 */
export async function getCategories(): Promise<TicketCategory[]> {
  return Array.from(categoryStore.values())
    .filter(category => category.is_active)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ============================================================================
// STATS OPERATIONS
// ============================================================================

/**
 * Get ticket statistics
 */
export async function getTicketStats(
  userId?: string,
  userRole?: 'customer' | 'agent' | 'admin'
): Promise<TicketStats> {
  let tickets = Array.from(ticketStore.values());

  // Filter by user role
  if (userRole === 'customer' && userId) {
    tickets = tickets.filter(ticket => ticket.created_by === userId);
  } else if (userRole === 'agent' && userId) {
    tickets = tickets.filter(ticket => ticket.assigned_to === userId);
  }

  const stats: TicketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    by_priority: {
      low: tickets.filter(t => t.priority === 'low').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      high: tickets.filter(t => t.priority === 'high').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length,
    },
    by_category: {},
    avg_resolution_time: 0,
  };

  // Calculate by category
  tickets.forEach(ticket => {
    stats.by_category[ticket.category] = (stats.by_category[ticket.category] || 0) + 1;
  });

  // Calculate average resolution time
  const resolvedTickets = tickets.filter(t => t.resolved_at);
  if (resolvedTickets.length > 0) {
    const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
      const resolutionTime = ticket.resolved_at!.getTime() - ticket.created_at.getTime();
      return sum + resolutionTime;
    }, 0);
    stats.avg_resolution_time = totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60); // Convert to hours
  }

  return stats;
}
