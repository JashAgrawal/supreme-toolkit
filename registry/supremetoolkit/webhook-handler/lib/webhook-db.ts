/**
 * Database interaction layer for the Webhook Handler module.
 * Uses Supabase client for storing and retrieving webhook events.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getModuleConfig } from '@/config';
import type { WebhookEventDataFromDb, LogWebhookInput, WebhookLogFilters } from '@/types/webhook';

let supabaseServiceRoleClient: SupabaseClient | null = null;

function getSupabaseServiceRoleClient(): SupabaseClient {
  if (supabaseServiceRoleClient) {
    return supabaseServiceRoleClient;
  }

  const supabaseConfig = getModuleConfig('supabase');
  if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    // serviceRoleKey is essential for the webhook API route to write logs
    throw new Error('Supabase URL or serviceRoleKey configuration is missing.');
  }

  supabaseServiceRoleClient = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    // auth: { persistSession: false } // Recommended for server-side clients
  });
  return supabaseServiceRoleClient;
}

export async function dbLogWebhookEvent(input: LogWebhookInput): Promise<WebhookEventDataFromDb> {
  const client = getSupabaseServiceRoleClient();
  const { source, eventType, payload, headers, queryParams } = input;

  const { data, error } = await client
    .from('webhook_events')
    .insert({
      source,
      event_type: eventType,
      payload, // Assuming payload is already a JS object/array
      headers,
      query_params: queryParams,
      received_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error logging webhook event to DB:', error);
    throw error;
  }
  return data as WebhookEventDataFromDb;
}

export async function dbGetLoggedWebhooks(
  filters: WebhookLogFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<{ events: WebhookEventDataFromDb[], total: number }> {
  const client = getSupabaseServiceRoleClient(); // Admin/service role to view logs
  const offset = (page - 1) * limit;

  let query = client
    .from('webhook_events')
    .select('*', { count: 'exact' })
    .order('received_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.source) {
    query = query.eq('source', filters.source);
  }
  if (filters.processed === 'true' || filters.processed === 'false') {
    query = query.eq('processed', filters.processed === 'true');
  }
  if (filters.dateFrom) {
    query = query.gte('received_at', filters.dateFrom);
  }
  if (filters.dateTo) {
    // Adjust dateTo to include the whole day if only date is provided
    const dateToObj = new Date(filters.dateTo);
    dateToObj.setDate(dateToObj.getDate() + 1);
    query = query.lt('received_at', dateToObj.toISOString().substring(0,10));
  }
  // Note: filters.searchQuery in payload is complex and usually requires full-text search setup in Postgres or specific JSONB queries.
  // Example for JSONB search (requires specific indexing and might be slow):
  // if (filters.searchQuery) {
  //   query = query.ilike('payload::text', `%${filters.searchQuery}%`); // Simple text cast, not ideal for performance
  // }


  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching logged webhooks:', error);
    throw error;
  }
  return { events: (data || []) as WebhookEventDataFromDb[], total: count || 0 };
}

export async function dbGetWebhookEventById(id: string): Promise<WebhookEventDataFromDb | null> {
  const client = getSupabaseServiceRoleClient();
  const { data, error } = await client
    .from('webhook_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 'Searched item was not found'
    console.error('Error fetching webhook event by ID:', error);
    throw error;
  }
  return data ? data as WebhookEventDataFromDb : null;
}

export async function dbMarkWebhookAsProcessed(
  id: string,
  processed: boolean,
  errorMessage?: string | null
): Promise<WebhookEventDataFromDb | null> {
    const client = getSupabaseServiceRoleClient();
    const updateData: Partial<WebhookEventDataFromDb> = {
        processed,
        processed_at: new Date().toISOString(),
        error: errorMessage,
    };

    const { data, error } = await client
        .from('webhook_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error marking webhook ${id} as processed:`, error);
        throw error;
    }
    return data as WebhookEventDataFromDb;
}

// Function to re-queue or retry a webhook (conceptual)
// export async function dbRetryWebhookProcessing(id: string): Promise<WebhookEventDataFromDb | null> {
//   const client = getSupabaseServiceRoleClient();
//   const { data, error } = await client
//     .from('webhook_events')
//     .update({ processed: false, error: null, retry_count: supabase.sql('retry_count + 1') })
//     .eq('id', id)
//     .select()
//     .single();
//   if (error) throw error;
//   // After this, some worker process would pick it up again.
//   return data as WebhookEventDataFromDb;
// }
