import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getModuleConfig } from '@/config'; // Your toolkit's config system

// Optional: Set the runtime to edge for best performance
export const runtime = 'edge';

let openai: OpenAI;

function getOpenAIClient() {
  if (openai) {
    return openai;
  }
  const openAIConfig = getModuleConfig('openai');
  if (!openAIConfig || !openAIConfig.apiKey) {
    throw new Error('OpenAI API key not configured in toolkitConfig.openai');
  }
  openai = new OpenAI({
    apiKey: openAIConfig.apiKey,
  });
  return openai;
}

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt: reqSystemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 });
    }

    const client = getOpenAIClient();
    const openAIConfig = getModuleConfig('openai');

    const systemMessageContent = reqSystemPrompt || openAIConfig?.systemPrompt || "You are a helpful AI assistant.";

    const processedMessages = [
      { role: "system", content: systemMessageContent },
      ...messages.map((msg: { role: 'user' | 'assistant' | 'system'; content: string; name?:string }) => ({
        role: msg.role,
        content: msg.content,
        ...(msg.name && {name: msg.name}) // Include name if present (for function/tool calls later)
      }))
    ];

    // Ask OpenAI for a streaming chat completion
    const response = await client.chat.completions.create({
      model: openAIConfig?.model || 'gpt-3.5-turbo',
      stream: true,
      messages: processedMessages,
      max_tokens: openAIConfig?.maxTokens || 1024,
      temperature: openAIConfig?.temperature || 0.7,
      // ... other OpenAI parameters
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('[CHATBOT API ERROR]', error);
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 500;

    if (error instanceof OpenAI.APIError) {
      errorMessage = error.message || 'Error from OpenAI API';
      errorCode = error.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), { status: errorCode });
  }
}
