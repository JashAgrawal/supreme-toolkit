import { NextRequest, NextResponse } from 'next/server';
import { dbLogWebhookEvent } from '@/lib/webhook-db';
import { processWebhookEventAction } from '@/actions/webhook-actions';
import { getModuleConfig } from '@/config';
import type { LogWebhookInput } from '@/types/webhook';

export const runtime = 'edge'; // Optional: Edge runtime for quick responses

// This function will try to parse the body based on content-type
async function parseRequestBody(request: NextRequest): Promise<any> {
  const contentType = request.headers.get('content-type')?.toLowerCase();
  if (contentType?.includes('application/json')) {
    return await request.json();
  } else if (contentType?.includes('application/x-www-form-urlencoded') || contentType?.includes('text/plain')) {
    return await request.text(); // Could be parsed further if needed, or stored as text
  }
  // Add more parsers if needed, e.g., for XML
  try {
    // Default attempt to parse as JSON, then text
    return await request.json();
  } catch (e) {
    return await request.text(); // Fallback to text if JSON parsing fails
  }
}


export async function POST(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  const source = params.source;
  if (!source) {
    return NextResponse.json({ error: 'Webhook source parameter is missing.' }, { status: 400 });
  }

  const webhookConfig = getModuleConfig('webhook');
  let eventId: string | undefined = undefined;

  try {
    const payload = await parseRequestBody(request);

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const queryParams: Record<string, string> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Determine event_type (this is source-specific)
    // Examples:
    // GitHub: headers['x-github-event']
    // Stripe: payload.type
    // LemonSqueezy: headers['x-event-name']
    // You might want a helper function to extract this based on source
    let eventType: string | undefined;
    if (source === 'github') eventType = headers['x-github-event'];
    else if (source === 'stripe') eventType = payload?.type;
    else if (source === 'lemonsqueezy') eventType = headers['x-event-name'];
    // ... add more source-specific event type extractions

    if (webhookConfig?.enableLogging) {
      const logInput: LogWebhookInput = {
        source,
        eventType,
        payload,
        headers,
        queryParams,
      };
      const loggedEvent = await dbLogWebhookEvent(logInput);
      eventId = loggedEvent.id;
      console.log(`Webhook event logged: ID ${eventId}, Source ${source}, Type ${eventType || 'N/A'}`);

      // Asynchronous processing (fire-and-forget, or use a queue system in a real app)
      // Don't await this if you want to send a quick 200 OK response
      processWebhookEventAction({ ...loggedEvent, id: eventId }) // Pass the full logged event data
          .then(result => {
              if(result.success) console.log(`Webhook ID ${eventId} processed successfully by action.`);
              else console.error(`Error processing webhook ID ${eventId} by action: ${result.error}`);
          })
          .catch(err => console.error(`Unhandled error processing webhook ID ${eventId} by action:`, err));

    } else {
      // If logging is disabled, you might still want to process it directly
      // This is less common for a generic handler, as logging is usually key.
      // For direct processing without DB logging:
      // await directProcess({ source, eventType, payload, headers, queryParams });
      console.log(`Received webhook from ${source}, logging disabled. Manual processing required.`);
    }

    // Respond quickly to the webhook sender
    return NextResponse.json({ message: 'Webhook received.', eventId: eventId || 'NotLogged' }, { status: 200 });

  } catch (error) {
    console.error(`Error handling webhook from source ${source}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error processing webhook.';
    // Optionally log this failure to a simpler error log if dbLogWebhookEvent itself failed
    return NextResponse.json({ error: 'Failed to process webhook.', details: errorMessage }, { status: 500 });
  }
}

// GET, PUT, DELETE methods are typically not used for webhook endpoints,
// but you can add them if your specific use case requires it.
export async function GET(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  return NextResponse.json({ message: `Method GET not allowed for webhook source ${params.source}. Use POST.` }, { status: 405 });
}
