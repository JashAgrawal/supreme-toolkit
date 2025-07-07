// Re-export global webhook types and define any module-specific types.
export {
  type WebhookEvent as GlobalWebhookEvent, // Original event from a 3rd party before saving
  type WebhookEndpoint // For configuring outbound webhooks if this module were to send them
} from '@/types';


// Type for webhook data as stored in our database (e.g., Supabase table)
// This might be slightly different from the raw incoming WebhookEvent if we transform/add metadata.
export interface WebhookEventDataFromDb {
  id: string; // UUID from DB
  source: string;
  event_type?: string | null; // Event type from the source service
  payload: Record<string, any> | Array<any>; // Parsed JSON payload
  headers?: Record<string, string | string[]> | null; // HTTP headers from the incoming request
  query_params?: Record<string, string | string[]> | null; // Query parameters from the incoming request
  processed: boolean;
  processed_at?: string | null; // ISO date string
  error?: string | null; // Error message if processing failed
  retry_count: number;
  received_at: string; // ISO date string
}

// For the hook to fetch and display logged webhooks
export interface UseWebhooksOptions {
  initialPage?: number;
  limitPerPage?: number;
  initialFilters?: WebhookLogFilters;
}

export interface WebhookLogFilters {
  source?: string;
  processed?: 'true' | 'false' | ''; // String for query param compatibility
  dateFrom?: string; // ISO Date string
  dateTo?: string; // ISO Date string
  searchQuery?: string; // Search in payload (complex, might need specific DB functions)
}

// Input for logging a new webhook event (used by API route before saving to DB)
export interface LogWebhookInput {
  source: string;
  eventType?: string;
  payload: any; // Raw body, will be parsed to JSONB
  headers?: Record<string, string | string[]>;
  queryParams?: Record<string, string | string[]>;
}
