"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useChat } from '../../hooks/use-chat';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ChatUserList } from './chat-user-list';
import type { ChatRoomProps, ChatMessage as ChatMessageType } from '../../types';
import { cn } from '@/lib/utils';

export function ChatRoom({
  roomId,
  userId,
  userInfo,
  className,
  showHeader = true,
  showUserList = true,
  maxHeight = "600px",
  onError,
}: ChatRoomProps) {
  const [replyTo, setReplyTo] = useState<ChatMessageType | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages,
    hasMoreMessages,
    onlineUsers,
    isConnected,
  } = useChat({
    roomId,
    userId,
    userInfo,
    onError,
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
    setReplyTo(undefined);
  };

  // Handle message actions
  const handleEditMessage = async (messageId: string, content: string) => {
    await editMessage(messageId, content);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  const handleReplyToMessage = (message: ChatMessageType) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(undefined);
  };

  // Handle scroll to load more messages
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMoreMessages && !isLoading) {
      loadMoreMessages();
    }
  };

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full flex flex-col", className)} style={{ maxHeight }}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat Room</CardTitle>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Badge variant="secondary" className="text-green-600">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              {showUserList && (
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {onlineUsers.length}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <CardContent className="flex-1 p-4 min-h-0">
            <ScrollArea 
              className="h-full pr-4" 
              ref={scrollAreaRef}
              onScrollCapture={handleScroll}
            >
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hasMoreMessages && (
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadMoreMessages}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Load more messages'}
                      </Button>
                    </div>
                  )}
                  
                  {messages.map((message, index) => {
                    const showAvatar = index === 0 || messages[index - 1].user_id !== message.user_id;
                    const showTimestamp = index === messages.length - 1 || 
                      messages[index + 1].user_id !== message.user_id ||
                      (new Date(messages[index + 1].created_at).getTime() - new Date(message.created_at).getTime()) > 300000; // 5 minutes
                    
                    return (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        currentUserId={userId}
                        showAvatar={showAvatar}
                        showTimestamp={showTimestamp}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        onReply={handleReplyToMessage}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {/* Chat Input */}
          <div className="p-4 pt-0">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!isConnected}
              replyTo={replyTo}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>

        {/* User List Sidebar */}
        {showUserList && (
          <>
            <Separator orientation="vertical" className="mx-0" />
            <div className="w-64 flex-shrink-0">
              <CardContent className="p-4 h-full">
                <ChatUserList
                  users={onlineUsers}
                  currentUserId={userId}
                />
              </CardContent>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
