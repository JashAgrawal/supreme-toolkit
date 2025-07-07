// Re-export global support types and define any module-specific types/forms.
export {
  type SupportTicket,
  type TicketMessage,
  type TicketAttachment, // If used
  type User as SupportUser // Alias User for context
} from '@/types';

import { z } from 'zod';

// Schema for creating a new ticket
export const CreateTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(5000),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

// Schema for adding a message to a ticket
export const AddMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty.").max(5000),
  isInternalNote: z.boolean().optional().default(false),
});
export type AddMessageInput = z.infer<typeof AddMessageSchema>;

// Schema for updating ticket status or assignment (Admin)
export const UpdateTicketAdminSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedTo: z.string().uuid().optional().nullable(), // User ID of the admin/agent
  category: z.string().optional(),
});
export type UpdateTicketAdminInput = z.infer<typeof UpdateTicketAdminSchema>;

// API response types (examples)
export interface TicketResponse extends SupportTicket {
  messages?: TicketMessage[]; // Optionally include messages
  user?: SupportUser; // Submitter details
  assignee?: SupportUser; // Assignee details
}

export interface PaginatedTicketsResponse {
  tickets: TicketResponse[];
  total: number;
  page: number;
  limit: number;
}
