/**
 * Database interaction layer for the Support Ticket System.
 * This file would typically use a Supabase client or other ORM/query builder.
 * For this example, we'll define function signatures and placeholders.
 * Actual implementation would involve Supabase client calls.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getModuleConfig } from '@/config';
import type { SupportTicket, TicketMessage, User as SupportUser } from '@/types'; // Global types
import type { CreateTicketInput, AddMessageInput, UpdateTicketAdminInput } from '@/types/support'; // Module specific types

let supabaseClient: SupabaseClient | null = null;
let serviceRoleClient: SupabaseClient | null = null; // For admin operations bypassing RLS if needed

function getSupabaseClient(useServiceRole: boolean = false): SupabaseClient {
  const supabaseConfig = getModuleConfig('supabase');
  if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.anonKey) {
    throw new Error('Supabase configuration is missing.');
  }

  if (useServiceRole) {
    if (!supabaseConfig.serviceRoleKey) {
      throw new Error('Supabase service_role_key is missing for admin operation.');
    }
    if (!serviceRoleClient) {
      serviceRoleClient = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey);
    }
    return serviceRoleClient;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }
  return supabaseClient;
}


// --- Ticket Operations ---

export async function dbCreateTicket(userId: string, input: CreateTicketInput): Promise<SupportTicket> {
  const client = getSupabaseClient();
  const supportConfig = getModuleConfig('support');

  const { data, error } = await client
    .from('support_tickets')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority || supportConfig?.defaultPriority || 'medium',
      status: 'open',
    })
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

export async function dbGetTicketById(ticketId: string, userId?: string, isAdmin: boolean = false): Promise<SupportTicket | null> {
  // If not admin, userId is required to enforce RLS for user access.
  // Admin can fetch any ticket.
  const client = getSupabaseClient(isAdmin); // Use service role for admin if needed to bypass RLS for specific joins

  let query = client
    .from('support_tickets')
    .select(`
      *,
      user:user_id (id, email, name:full_name, avatar:avatar_url),
      assignee:assigned_to (id, email, name:full_name, avatar:avatar_url)
    `)
    .eq('id', ticketId);

  if (!isAdmin && userId) {
    // RLS should handle this, but an explicit check can be added if not using service role
    // query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'Searched item was not found'
     console.error("Error fetching ticket by ID:", error);
     throw error;
  }
  return data ? mapToSupportTicket(data) : null;
}


export async function dbGetTicketsForUser(userId: string, page: number = 1, limit: number = 10): Promise<{ tickets: SupportTicket[], total: number }> {
  const client = getSupabaseClient();
  const offset = (page - 1) * limit;

  const { data, error, count } = await client
    .from('support_tickets')
    .select(`
      *,
      assignee:assigned_to (id, email, name:full_name, avatar:avatar_url)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { tickets: (data || []).map(mapToSupportTicket), total: count || 0 };
}

export async function dbGetAllTicketsAdmin(
  page: number = 1,
  limit: number = 10,
  filters: { status?: string; priority?: string; assignedTo?: string, category?: string } = {}
): Promise<{ tickets: SupportTicket[], total: number }> {
  const client = getSupabaseClient(true); // Use service role for admin view potentially
  const offset = (page - 1) * limit;

  let query = client
    .from('support_tickets')
    .select(`
      *,
      user:user_id (id, email, name:full_name, avatar:avatar_url),
      assignee:assigned_to (id, email, name:full_name, avatar:avatar_url)
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.priority) query = query.eq('priority', filters.priority);
  if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo);
  if (filters.category) query = query.eq('category', filters.category);

  const { data, error, count } = await query;

  if (error) throw error;
  return { tickets: (data || []).map(mapToSupportTicket), total: count || 0 };
}

export async function dbUpdateTicketAdmin(ticketId: string, updates: UpdateTicketAdminInput): Promise<SupportTicket> {
  const client = getSupabaseClient(true); // Admin action, potentially use service role

  const updateData: Partial<SupportTicket> = { ...updates, updated_at: new Date() };
  if (updates.status === 'resolved' || updates.status === 'closed') {
    updateData.resolved_at = new Date();
  }

  const { data, error } = await client
    .from('support_tickets')
    .update(updateData)
    .eq('id', ticketId)
    .select(`
        *,
        user:user_id (id, email, name:full_name, avatar:avatar_url),
        assignee:assigned_to (id, email, name:full_name, avatar:avatar_url)
    `)
    .single();

  if (error) throw error;
  return mapToSupportTicket(data);
}


// --- Message Operations ---

export async function dbAddMessageToTicket(ticketId: string, userId: string, input: AddMessageInput, isAdminMessage: boolean = false): Promise<TicketMessage> {
  const client = getSupabaseClient(isAdminMessage); // Admin might post as internal note

  const { data, error } = await client
    .from('ticket_messages')
    .insert({
      ticket_id: ticketId,
      user_id: userId,
      content: input.content,
      is_internal_note: isAdminMessage ? input.isInternalNote : false, // User cannot set internal note
    })
    .select(`
        *,
        user:user_id (id, email, name:full_name, avatar:avatar_url)
    `)
    .single();

  if (error) throw error;

  // Also update the ticket's updated_at timestamp
  await client.from('support_tickets').update({ updated_at: new Date() }).eq('id', ticketId);

  return mapToTicketMessage(data);
}

export async function dbGetMessagesForTicket(ticketId: string, userId?: string, isAdmin: boolean = false): Promise<TicketMessage[]> {
  const client = getSupabaseClient(isAdmin);
  let query = client
    .from('ticket_messages')
    .select(`
        *,
        user:user_id (id, email, name:full_name, avatar:avatar_url)
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (!isAdmin) {
    // RLS should ensure user only sees non-internal messages for their tickets.
    // query = query.eq('is_internal_note', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(mapToTicketMessage);
}

// --- Helper Mappers ---
// To transform Supabase data (with snake_case and joined user objects) to our TypeScript types.

function mapToSupportUser(dbUser: any): SupportUser | undefined {
    if (!dbUser) return undefined;
    return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name || dbUser.full_name,
        avatar: dbUser.avatar_url,
        // Fill other fields as needed, or leave them undefined if not available from join
        createdAt: dbUser.created_at ? new Date(dbUser.created_at) : new Date(), // Placeholder
        updatedAt: dbUser.updated_at ? new Date(dbUser.updated_at) : new Date(), // Placeholder
    };
}

function mapToSupportTicket(dbTicket: any): SupportTicket {
    return {
        ...dbTicket,
        createdAt: new Date(dbTicket.created_at),
        updatedAt: new Date(dbTicket.updated_at),
        resolvedAt: dbTicket.resolved_at ? new Date(dbTicket.resolved_at) : undefined,
        user: mapToSupportUser(dbTicket.user),
        assignee: mapToSupportUser(dbTicket.assignee),
        // Remove the separate user/assignee objects if they were joined
        user_id: dbTicket.user_id, // ensure base user_id is still there
        assigned_to: dbTicket.assigned_to, // ensure base assigned_to is still there
    } as SupportTicket;
}

function mapToTicketMessage(dbMessage: any): TicketMessage {
    return {
        ...dbMessage,
        createdAt: new Date(dbMessage.created_at),
        user: mapToSupportUser(dbMessage.user),
        // Remove the separate user object if it was joined
        user_id: dbMessage.user_id, // ensure base user_id is still there
    } as TicketMessage;
}
