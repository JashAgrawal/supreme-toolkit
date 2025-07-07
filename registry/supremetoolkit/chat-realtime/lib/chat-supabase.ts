import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getModuleConfig } from '@/config';
import { ChatMessage, ChatChannel }
from '@/types'; // Assuming global types

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseConfig = getModuleConfig('supabase');
  if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.anonKey) {
    throw new Error('Supabase configuration is missing. Please check your config.tsx file.');
  }

  supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  return supabaseClient;
}

export async function fetchInitialMessages(channelId: string, limit: number = 50): Promise<ChatMessage[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('chat_messages')
    .select(`
      id,
      channel_id,
      user_id,
      content,
      created_at,
      user_profiles ( id, username, avatar_url, full_name )
    `)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  // Transform data to match ChatMessage structure, especially user details
  return data ? data.map(msg => ({
    id: msg.id.toString(),
    channelId: msg.channel_id,
    userId: msg.user_id,
    content: msg.content,
    createdAt: new Date(msg.created_at),
    // @ts-ignore
    user: msg.user_profiles ? {
       // @ts-ignore
      id: msg.user_profiles.id,
       // @ts-ignore
      name: msg.user_profiles.full_name || msg.user_profiles.username,
       // @ts-ignore
      avatar: msg.user_profiles.avatar_url,
       // @ts-ignore
      email: '', // Supabase profiles might not expose email directly here
       // @ts-ignore
      emailVerified: false,
       // @ts-ignore
      createdAt: new Date(), // Placeholder
       // @ts-ignore
      updatedAt: new Date(), // Placeholder
    } : { id: msg.user_id, name: 'Unknown User' }
  })).reverse() : [];
}

export async function sendMessage(
  channelId: string,
  userId: string,
  content: string,
  metadata?: Record<string, any>
): Promise<ChatMessage> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('chat_messages')
    .insert([{ channel_id: channelId, user_id: userId, content, metadata }])
    .select(`
      id,
      channel_id,
      user_id,
      content,
      created_at,
      user_profiles ( id, username, avatar_url, full_name )
    `)
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to send message, no data returned.');
  }

  // Transform data
  const message = data;
  return {
    id: message.id.toString(),
    channelId: message.channel_id,
    userId: message.user_id,
    content: message.content,
    createdAt: new Date(message.created_at),
    // @ts-ignore
    user: message.user_profiles ? {
      // @ts-ignore
      id: message.user_profiles.id,
      // @ts-ignore
      name: message.user_profiles.full_name || message.user_profiles.username,
      // @ts-ignore
      avatar: message.user_profiles.avatar_url,
      // @ts-ignore
      email: '',
      // @ts-ignore
      emailVerified: false,
      // @ts-ignore
      createdAt: new Date(),
      // @ts-ignore
      updatedAt: new Date(),
    } : { id: message.user_id, name: 'Unknown User' }
  };
}

export function subscribeToChannel(
  channelId: string,
  onNewMessage: (message: ChatMessage) => void,
  onMessageUpdated?: (message: ChatMessage) => void, // For reactions, edits
  onMessageDeleted?: (messageId: string) => void    // For deletions
) {
  const client = getSupabaseClient();
  const subscription = client
    .channel(`chat:${channelId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${channelId}` },
      async (payload) => {
        // Fetch the full message details including user profile
        const { data: msg, error } = await client
          .from('chat_messages')
          .select(`
            id,
            channel_id,
            user_id,
            content,
            created_at,
            user_profiles ( id, username, avatar_url, full_name )
          `)
          .eq('id', payload.new.id)
          .single();

        if (error || !msg) {
          console.error('Error fetching new message details:', error);
          return;
        }

        const transformedMsg: ChatMessage = {
          id: msg.id.toString(),
          channelId: msg.channel_id,
          userId: msg.user_id,
          content: msg.content,
          createdAt: new Date(msg.created_at),
          // @ts-ignore
          user: msg.user_profiles ? {
            // @ts-ignore
            id: msg.user_profiles.id,
            // @ts-ignore
            name: msg.user_profiles.full_name || msg.user_profiles.username,
            // @ts-ignore
            avatar: msg.user_profiles.avatar_url,
            // @ts-ignore
            email: '',
            // @ts-ignore
            emailVerified: false,
            // @ts-ignore
            createdAt: new Date(),
            // @ts-ignore
            updatedAt: new Date(),
          } : { id: msg.user_id, name: 'Unknown User' }
        };
        onNewMessage(transformedMsg);
      }
    )
    // Add listeners for UPDATE and DELETE if needed
    // .on(
    //   'postgres_changes',
    //   { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${channelId}` },
    //   (payload) => {
    //     // Handle message updates (e.g., reactions, edits)
    //     // const updatedMessage = payload.new as ChatMessage; // Adjust type
    //     // onMessageUpdated?.(updatedMessage);
    //   }
    // )
    // .on(
    //   'postgres_changes',
    //   { event: 'DELETE', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${channelId}` },
    //   (payload) => {
    //     // Handle message deletions
    //     // const deletedMessageId = payload.old.id as string; // Adjust type
    //     // onMessageDeleted?.(deletedMessageId);
    //   }
    // )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to channel: ${channelId}`);
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || err) {
        console.error(`Subscription error on channel ${channelId}:`, status, err);
      }
    });

  return subscription;
}

// Optional: Function to create a new channel
export async function createChannel(name: string, description?: string, created_by?: string): Promise<ChatChannel | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('chat_channels')
    .insert({ name, description, created_by })
    .select()
    .single();

  if (error) {
    console.error('Error creating channel:', error);
    return null;
  }
  return data as ChatChannel;
}

// Optional: Function to list channels
export async function listChannels(limit: number = 20): Promise<ChatChannel[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('chat_channels')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error listing channels:', error);
    return [];
  }
  return data as ChatChannel[];
}

// Placeholder for typing indicators and presence (more complex)
// export function sendTypingIndicator(channelId: string, userId: string, isTyping: boolean) {
//   const client = getSupabaseClient();
//   // Supabase Realtime has presence and broadcast features that can be used for this
// }

// export function subscribeToPresence(channelId: string, onPresenceChange: (presence: any) => void) {
//   const client = getSupabaseClient();
// }
