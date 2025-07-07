# Realtime Chat Module (Supabase)

This module provides a realtime chat system powered by Supabase. It includes UI components for a chat interface, hooks for managing chat state and interactions, and server actions for chat-related events.

## Features

-   **Realtime Messaging**: Send and receive messages instantly using Supabase Realtime subscriptions.
-   **Message Persistence**: Messages are stored in a Supabase table.
-   **User Presence**: (Basic implementation, can be extended)
-   **Typing Indicators**: (Basic implementation, can be extended)
-   **UI Components**:
    -   `ChatInterface`: A complete chat UI with message display area, input field, and send button.
    -   `MessageBubble`: Component to render individual chat messages.
-   **Hooks**:
    -   `useChat()`: Manages chat channels, messages, sending new messages, and subscribing to realtime updates.
-   **Server Actions**:
    -   `onNewMessageSent`: Placeholder for actions to take when a new message is sent (e.g., notifications, logging).
    -   `onUserJoinedChannel`: Placeholder for actions when a user joins a channel.
-   **Configuration**: Configurable via `config.tsx` (Supabase URL, anon key, chat settings).
-   **Types**: Uses global chat types from `types/index.ts` and can have module-specific types in `types/chat.ts`.

## Installation

```bash
npx shadcn@latest add "chat-realtime"
# Or via the supreme toolkit URL if hosted
# npx shadcn@latest add "https://supreme.jashagrawal.in/r/chat-realtime.json"
```

This will add the following files to your project:

-   `components/ui/chat-interface.tsx`
-   `components/ui/message-bubble.tsx`
-   `hooks/use-chat.ts`
-   `actions/chat-actions.ts`
-   `lib/chat-supabase.ts`
-   `types/chat.ts`
-   `docs/modules/chat-realtime.md` (this file)

## Setup

1.  **Supabase Project**:
    -   Create a Supabase project at [supabase.com](https://supabase.com).
    -   In your Supabase project, go to SQL Editor and run the following SQL to create the necessary tables:
        ```sql
        -- Chat Channels
        CREATE TABLE chat_channels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          created_by UUID REFERENCES auth.users(id),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow public read access to channels" ON chat_channels FOR SELECT USING (true);
        CREATE POLICY "Allow authenticated users to create channels" ON chat_channels FOR INSERT TO authenticated WITH CHECK (true);
        CREATE POLICY "Allow channel owner to update channels" ON chat_channels FOR UPDATE USING (auth.uid() = created_by);

        -- Chat Messages
        CREATE TABLE chat_messages (
          id BIGSERIAL PRIMARY KEY,
          channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE NOT NULL,
          user_id UUID REFERENCES auth.users(id) NOT NULL, -- Assumes you use Supabase Auth
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          metadata JSONB -- For reactions, read receipts, etc.
        );
        ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow read access to messages in joined channels" ON chat_messages FOR SELECT USING (
          EXISTS (SELECT 1 FROM chat_channel_members WHERE channel_id = chat_messages.channel_id AND user_id = auth.uid()) -- More advanced: requires channel members table
          OR true -- Simplified for now: allow all authenticated to read. Refine this.
        );
        CREATE POLICY "Allow authenticated users to insert messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (true);
        CREATE POLICY "Allow message owner to update/delete messages" ON chat_messages FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "Allow message owner to delete messages" ON chat_messages FOR DELETE USING (auth.uid() = user_id);

        -- Enable realtime for chat_messages table
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

        -- Optional: User Profiles (if not already using Supabase Auth profiles)
        -- CREATE TABLE user_profiles (
        --   id UUID PRIMARY KEY REFERENCES auth.users(id),
        --   username TEXT UNIQUE,
        --   avatar_url TEXT,
        --   full_name TEXT
        -- );
        -- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        -- CREATE POLICY "Public profiles are viewable by everyone." ON user_profiles FOR SELECT USING (true);
        -- CREATE POLICY "Users can insert their own profile." ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
        -- CREATE POLICY "Users can update own profile." ON user_profiles FOR UPDATE USING (auth.uid() = id);
        ```
    -   **Important**: Review and customize Row Level Security (RLS) policies according to your application's security requirements. The policies above are examples.

2.  **Environment Variables**: Add your Supabase URL and Anon Key to your `.env` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    # SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key (if needed for admin actions)
    ```

3.  **Configuration (`config.tsx`)**: Update your `toolkitConfig` in `config.tsx` with your Supabase and chat settings:
    ```ts
    export const toolkitConfig: ToolkitConfig = {
      // ... other configs
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        // serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // Optional
      },
      chat: {
        provider: 'supabase', // Ensure this is set
        maxMessageLength: 1000,
        enableTypingIndicators: true,
        // enableFileUploads: false, // File uploads not included in this basic module
      },
    };
    ```

## Usage

```tsx
"use client";
import { ChatInterface } from '@/components/ui/chat-interface';
import { useAuth } from '@/hooks/use-auth'; // Assuming you have an auth hook

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth(); // Get authenticated user

  if (!isAuthenticated || !user) {
    return <p>Please sign in to chat.</p>;
  }

  // Example: Use a fixed channel ID or allow users to select/create channels
  const channelId = "your-default-chat-channel-uuid";
  // You would typically fetch or create channel IDs dynamically.
  // For simplicity, ensure this channel ID exists in your `chat_channels` table.

  return (
    <div className="container mx-auto h-[calc(100vh-100px)] py-4">
      <ChatInterface
        channelId={channelId}
        currentUser={{ // Map your user object
          id: user.id,
          name: user.name || user.email,
          avatarUrl: (user as any).avatar || undefined, // Adjust as per your user type
        }}
      />
    </div>
  );
}
```

### Creating a Channel
You'll need a way to create channels. This can be done via a UI or directly in Supabase for testing. The `chat-supabase.ts` library will include a function `createChannel`.

### Customization
-   **Styling**: Customize `ChatInterface.tsx` and `MessageBubble.tsx` using Tailwind CSS.
-   **Functionality**: Extend `hooks/useChat.ts` and `lib/chat-supabase.ts` to add features like editing/deleting messages, user presence, read receipts, file uploads, etc.
-   **Server Actions**: Implement logic in `actions/chat-actions.ts` for notifications, logging, or other side effects.

## Important Notes
-   **Authentication**: This module assumes you have an authentication system in place (e.g., the `auth` module from Supreme Toolkit, or Supabase Auth). The `user_id` in `chat_messages` should correspond to your authenticated user's ID.
-   **Supabase RLS**: Row Level Security is crucial for securing your chat data. Ensure your policies are correctly configured.
-   **Scalability**: For very high-traffic chat applications, consider Supabase's performance characteristics and potential need for optimization or alternative solutions like dedicated chat services (e.g., Pusher, if you choose that provider).
-   **Error Handling**: Implement robust error handling in UI components and hooks.
```
