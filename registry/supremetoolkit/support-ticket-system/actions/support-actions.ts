"use server";

import {
  dbCreateTicket,
  dbGetTicketById,
  dbGetTicketsForUser,
  dbGetAllTicketsAdmin,
  dbUpdateTicketAdmin,
  dbAddMessageToTicket,
  dbGetMessagesForTicket
} from '@/lib/support-db';
import type { CreateTicketInput, AddMessageInput, UpdateTicketAdminInput } from '@/types/support';
import type { SupportTicket, TicketMessage } from '@/types';
// import { sendNewTicketEmailToAdmin, sendTicketReplyEmailToUser } from '@/lib/mailer'; // If mailer is integrated

// --- Ticket Actions ---

export async function createTicketAction(userId: string, input: CreateTicketInput): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    // Add validation here if not handled by form (e.g., using Zod schema from types/support.ts)
    // const validation = CreateTicketSchema.safeParse(input);
    // if (!validation.success) {
    //   return { success: false, error: validation.error.flatten().fieldErrors };
    // }

    const ticket = await dbCreateTicket(userId, input);

    // Optional: Send email notification to admin
    // await sendNewTicketEmailToAdmin(ticket);

    return { success: true, ticket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create ticket" };
  }
}

export async function getTicketByIdAction(ticketId: string, userId?: string, isAdmin: boolean = false): Promise<{ success: boolean; ticket?: SupportTicket; messages?: TicketMessage[]; error?: string }> {
  try {
    const ticket = await dbGetTicketById(ticketId, userId, isAdmin);
    if (!ticket) {
      return { success: false, error: "Ticket not found or access denied." };
    }
    // RLS should handle user access, but explicit check for non-admins
    if (!isAdmin && userId && ticket.userId !== userId) {
         return { success: false, error: "Access denied." };
    }

    const messages = await dbGetMessagesForTicket(ticketId, userId, isAdmin);
    return { success: true, ticket, messages };
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch ticket" };
  }
}

export async function getTicketsForUserAction(userId: string, page: number = 1, limit: number = 10): Promise<{ success: boolean; tickets?: SupportTicket[]; total?: number; error?: string }> {
  try {
    const { tickets, total } = await dbGetTicketsForUser(userId, page, limit);
    return { success: true, tickets, total };
  } catch (error) {
    console.error("Error fetching tickets for user:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch tickets" };
  }
}

// --- Admin Actions ---
export async function getAllTicketsAdminAction(
  page: number = 1,
  limit: number = 10,
  filters: { status?: string; priority?: string; assignedTo?: string, category?: string } = {}
): Promise<{ success: boolean; tickets?: SupportTicket[]; total?: number; error?: string }> {
  // Ensure this action is protected and only callable by admins
  // Add admin role check here based on your auth system
  // const { session } = await auth(); if using NextAuth
  // if (!session?.user?.isAdmin) return { success: false, error: "Unauthorized" };

  try {
    const { tickets, total } = await dbGetAllTicketsAdmin(page, limit, filters);
    return { success: true, tickets, total };
  } catch (error) {
    console.error("Error fetching all tickets for admin:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch tickets" };
  }
}

export async function updateTicketAdminAction(ticketId: string, updates: UpdateTicketAdminInput, adminUserId: string): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  // Add admin role check here
  try {
    const ticket = await dbUpdateTicketAdmin(ticketId, updates);

    // Optional: Log who made the change
    // await dbLogTicketUpdate(ticketId, adminUserId, updates);

    // Optional: Send notification to user if status changed
    // if (updates.status && ticket.userId) {
    //   await sendTicketStatusUpdateEmailToUser(ticket.userId, ticket);
    // }
    return { success: true, ticket };
  } catch (error) {
    console.error("Error updating ticket (admin):", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update ticket" };
  }
}


// --- Message Actions ---

export async function addMessageToTicketAction(ticketId: string, userId: string, input: AddMessageInput, isAdminMessage: boolean = false): Promise<{ success: boolean; message?: TicketMessage; error?: string }> {
  try {
    // Add validation here if not handled by form
    // const validation = AddMessageSchema.safeParse(input);
    // if (!validation.success) { /* return error */ }

    // Check if user is allowed to post to this ticket (owner or admin)
    const ticket = await dbGetTicketById(ticketId, userId, isAdminMessage);
    if (!ticket) return { success: false, error: "Ticket not found." };
    if (!isAdminMessage && ticket.userId !== userId) return { success: false, error: "Access denied to post message." };
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
        // Optionally allow admins to post to closed tickets as internal notes
        if (!isAdminMessage || !input.isInternalNote) {
            return { success: false, error: "Cannot add messages to resolved or closed tickets." };
        }
    }

    const message = await dbAddMessageToTicket(ticketId, userId, input, isAdminMessage);

    // Optional: Send email notification
    // if (!isAdminMessage || !input.isInternalNote) { // Don't notify for internal notes
    //   if (isAdminMessage && ticket.user?.email) { // Admin replied, notify user
    //     await sendTicketReplyEmailToUser(ticket.user.email, ticket, message);
    //   } else if (!isAdminMessage && ticket.assignee?.email) { // User replied, notify assigned admin
    //     await sendTicketUpdateEmailToAdmin(ticket.assignee.email, ticket, message);
    //   }
    // }

    return { success: true, message };
  } catch (error) {
    console.error("Error adding message to ticket:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add message" };
  }
}
