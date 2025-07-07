# Generic Webhook Handler Module

This module provides a generic endpoint for receiving webhooks from various third-party services. It includes functionality to log these webhooks (payload, headers, source) and a UI component to view and inspect the logged events.

## Features

-   **Generic Endpoint**: A dynamic API route (`/api/webhooks/[source]`) to accept POST requests from any service.
-   **Webhook Logging**: Persists webhook events (payload, headers, source, timestamp) to a database (Supabase).
-   **Logger UI**: A component (`WebhookLoggerView`) to display logged webhook events, allowing inspection of details.
-   **Custom Processing**: Server actions (`actions/webhook-actions.ts`) can be extended to process webhooks based on their source or event type.
-   **Security**: Basic signature verification can be added (though specific verification logic depends on the source service).
-   **Configuration**: Settings for logging, retries (future), and timeouts via `config.tsx`.

## Installation

```bash
npx shadcn@latest add "webhook-handler"
# Or via the supreme toolkit URL if hosted
# npx shadcn@latest add "https://supreme.jashagrawal.in/r/webhook-handler.json"
```

This installs the API route, UI component, hook, actions, and library files.

## Setup

1.  **Supabase Project & Schema**:
    -   Ensure you have a Supabase project.
    -   In your Supabase project SQL Editor, run the following SQL:
        ```sql
        -- Webhook Events Log Table
        CREATE TABLE webhook_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source TEXT NOT NULL, -- e.g., 'github', 'lemonsqueezy', 'custom'
          event_type TEXT, -- Specific event type from the source, if available
          payload JSONB NOT NULL,
          headers JSONB,
          query_params JSONB, -- Store query parameters if any
          processed BOOLEAN DEFAULT FALSE,
          processed_at TIMESTAMPTZ,
          error TEXT, -- If processing failed
          retry_count INT DEFAULT 0,
          received_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
        -- RLS Policies: Typically, only service_role or specific admin roles should access this table directly.
        -- Reading logs might be through a secure API or admin dashboard.
        CREATE POLICY "Allow service_role full access to webhook_events"
          ON webhook_events FOR ALL
          USING ( (SELECT rolname FROM pg_roles WHERE oid = auth.role()::oid) = 'service_role' )
          WITH CHECK ( (SELECT rolname FROM pg_roles WHERE oid = auth.role()::oid) = 'service_role' );

        -- Create indexes for faster querying
        CREATE INDEX idx_webhook_events_source ON webhook_events(source);
        CREATE INDEX idx_webhook_events_received_at ON webhook_events(received_at);
        CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
        ```

2.  **Environment Variables**: Ensure Supabase URL, Anon Key, and Service Role Key (for writing logs) are in `.env`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    ```
    The Service Role Key is important here as the generic webhook endpoint will typically operate with elevated privileges to write to the log table.

3.  **Configuration (`config.tsx`)**:
    ```ts
    export const toolkitConfig: ToolkitConfig = {
      // ... other configs
      supabase: { /* ... */ },
      webhook: {
        enableLogging: true, // Default to true for this module's purpose
        // retryAttempts: 3, // Future: for processing logic
        // timeout: 30000,   // Future: for processing logic
      },
    };
    ```

## Usage

### Receiving Webhooks

-   Configure third-party services to send POST webhooks to:
    `https://yourdomain.com/api/webhooks/[source_name]`
    Replace `[source_name]` with a unique identifier for the service (e.g., `github`, `lemonsqueezy`, `stripe-custom`). This `source_name` will be available in the API route and can be used for logging and routing to specific processors.

### Viewing Logged Webhooks

-   Use the `WebhookLoggerView` component, typically on an admin-protected page:
    ```tsx
    "use client";
    import { WebhookLoggerView } from '@/components/ui/webhook-logger-view';

    export default function AdminWebhookLogsPage() {
      // Add authentication and authorization for admin access here
      return (
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6">Webhook Event Logs</h1>
          <WebhookLoggerView />
        </div>
      );
    }
    ```

### Processing Webhooks

-   The primary logic for handling specific webhooks resides in `actions/webhook-actions.ts` in the `processWebhookEvent` function.
-   Modify this function to add case statements or handlers for different `source` and `event_type` values.

    ```typescript
    // Example in actions/webhook-actions.ts
    export async function processWebhookEvent(event: WebhookEventDataFromDb) {
      console.log(`Processing webhook ${event.id} from source: ${event.source}`);

      try {
        switch (event.source) {
          case 'lemonsqueezy':
            // const payload = event.payload as LemonSqueezyPayload; // Define this type
            // if (event.event_type === 'order_created') {
            //   await handleLemonSqueezyOrder(payload);
            // }
            break;
          case 'github':
            // const payload = event.payload as GitHubWebhookPayload; // Define this type
            // if (event.headers?.['x-github-event'] === 'push') {
            //   await handleGitHubPush(payload);
            // }
            break;
          // Add more cases for other sources
          default:
            console.warn(`No specific processor for webhook source: ${event.source}`);
        }

        // Mark as processed if handled successfully (or if no specific handler is needed)
        await markWebhookAsProcessed(event.id, true);
        return { success: true };

      } catch (error) {
        console.error(`Error processing webhook ${event.id}:`, error);
        await markWebhookAsProcessed(event.id, false, error instanceof Error ? error.message : "Unknown processing error");
        return { success: false, error: error instanceof Error ? error.message : "Processing failed" };
      }
    }
    ```

## Security Considerations

-   **Signature Verification**: For critical webhooks, implement signature verification. The generic endpoint itself doesn't enforce this as verification methods vary per service (e.g., `X-Hub-Signature-256` for GitHub, `X-Signature` for Lemon Squeezy). You can add verification logic within the `app/api/webhooks/[source]/route.ts` before logging, or within the `processWebhookEvent` action. Store secrets for verification securely.
-   **Idempotency**: Design your processing logic to be idempotent, as webhooks can sometimes be delivered multiple times.
-   **Access Control**: The `WebhookLoggerView` should be restricted to authorized admin users. The API endpoint is public by nature but relies on obscurity or signature verification for security.
-   **Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` is powerful. Ensure it's well-protected.
```
