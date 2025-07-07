# OpenAI Chatbot Module (GPT)

This module provides a fully functional chatbot widget that integrates with OpenAI's GPT models (e.g., GPT-3.5 Turbo, GPT-4) to deliver conversational AI experiences. It includes a user interface, hooks for managing chat state, and backend logic for communicating with the OpenAI API, with support for streaming responses.

## Features

-   **Conversational UI**: A clean and modern chat widget for user interaction.
-   **OpenAI Integration**: Connects to specified GPT models via the OpenAI API.
-   **Streaming Responses**: Supports realtime streaming of responses from OpenAI for a more dynamic experience.
-   **Message History**: Maintains conversation history for context.
-   **Customizable**: Easily configure the OpenAI model, system prompt, and UI aspects.
-   **Hooks**:
    -   `useChatbot()`: Manages chat messages, sends user input to the backend, and handles streamed/complete responses from OpenAI.
-   **Backend Logic**:
    -   API Route (`app/api/chat-completion/route.ts`): Handles requests from the client, calls the OpenAI API, and streams responses back.
    -   Server Action (`actions/chatbot-actions.ts`): Alternative way to call OpenAI, potentially for non-streaming or specific server-side tasks.
-   **Configuration**: OpenAI API key and model settings are managed via `config.tsx`.
-   **Types**: Module-specific types are defined in `types/chatbot.ts`.

## Installation

```bash
npx shadcn@latest add "chatbot-gpt"
# Or via the supreme toolkit URL if hosted
# npx shadcn@latest add "https://supreme.jashagrawal.in/r/chatbot-gpt.json"
```

This will add the following files to your project:

-   `components/ui/chatbot-widget.tsx`
-   `hooks/use-chatbot.ts`
-   `actions/chatbot-actions.ts`
-   `app/api/chat-completion/route.ts`
-   `lib/openai-stream.ts` (utility for Vercel AI SDK streaming)
-   `types/chatbot.ts`
-   `docs/modules/chatbot-gpt.md` (this file)

## Setup

1.  **OpenAI API Key**:
    -   Obtain an API key from [OpenAI Platform](https://platform.openai.com/api-keys).
    -   Add your API key to your `.env` file:
        ```env
        OPENAI_API_KEY=your-openai-api-key
        ```

2.  **Configuration (`config.tsx`)**: Update your `toolkitConfig` in `config.tsx` with your OpenAI settings:
    ```ts
    export const toolkitConfig: ToolkitConfig = {
      // ... other configs
      openai: {
        apiKey: process.env.OPENAI_API_KEY!,
        model: "gpt-3.5-turbo", // Or "gpt-4", "gpt-4-turbo-preview", etc.
        // maxTokens: 1000, // Optional: default max tokens for responses
        // temperature: 0.7, // Optional: default temperature
      },
    };
    ```

3.  **Install Dependencies**: The module relies on the `openai` and `ai` (Vercel AI SDK) packages. Ensure they are installed:
    ```bash
    npm install openai ai
    # or
    yarn add openai ai
    # or
    pnpm add openai ai
    ```

## Usage

Embed the `ChatbotWidget` component in your application:

```tsx
"use client";
import { ChatbotWidget } from '@/components/ui/chatbot-widget';

export default function MyPageWithChatbot() {
  return (
    <div>
      {/* Your page content */}

      <ChatbotWidget
        triggerIcon={/* Optional: Your custom trigger icon component */}
        title="AI Assistant"
        systemPrompt="You are a helpful AI assistant. Answer questions concisely."
        // initialMessages={[{ id: '1', role: 'assistant', content: 'Hello! How can I help you today?' }]}
      />
    </div>
  );
}
```

### Props for `ChatbotWidget`

-   `title` (string, optional): Title displayed at the top of the chatbot. Defaults to "Chatbot".
-   `systemPrompt` (string, optional): The system message to guide the AI's behavior.
-   `initialMessages` (Message[], optional): An array of initial messages to populate the chat.
-   `triggerIcon` (ReactNode, optional): Custom icon for the chatbot trigger button.
-   `className` (string, optional): Custom CSS classes for the main widget container.
-   `defaultOpen` (boolean, optional): Whether the chatbot should be open by default. Defaults to `false`.
-   `inputPlaceholder` (string, optional): Placeholder for the message input field. Defaults to "Type your message...".

## Customization

-   **OpenAI Model**: Change the `model` in `config.tsx` under the `openai` section.
-   **System Prompt**: Pass a `systemPrompt` prop to `ChatbotWidget` to define the AI's persona and instructions.
-   **Styling**: Customize `ChatbotWidget.tsx` and its sub-components using Tailwind CSS.
-   **Streaming vs. Non-Streaming**: The default implementation uses an API route (`app/api/chat-completion/route.ts`) with the Vercel AI SDK for streaming. You can modify `hooks/use-chatbot.ts` to use `actions/chatbot-actions.ts` for non-streaming responses if preferred.
-   **Conversation History**: The `useChatbot` hook manages message history. You can extend this to persist history (e.g., to local storage or a database).

## Important Notes

-   **API Costs**: Be mindful of OpenAI API usage costs. Monitor your usage in the OpenAI dashboard.
-   **Rate Limits**: Implement appropriate error handling for API rate limits.
-   **Security**: Your `OPENAI_API_KEY` should be kept secret and only used on the server-side (as handled by the API route or server action).
-   **Context Management**: For longer conversations, consider strategies for managing context window limitations of GPT models. This might involve summarizing or truncating older messages.
```
