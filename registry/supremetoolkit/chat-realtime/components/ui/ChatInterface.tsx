"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageBubble } from "./MessageBubble";
import { useChat, UseChatProps } from "@/hooks/use-chat";
import { SendHorizonal, UserCircle, Loader2, AlertTriangle } from "lucide-react";
import { ChatMessage, ChatUser } from '@/types/chat';

export interface ChatInterfaceProps extends UseChatProps {
  // Props from UseChatProps are inherited: channelId, currentUser
  // Additional UI-specific props can be added here
  placeholder?: string;
  title?: string;
  className?: string;
}

export function ChatInterface({
  channelId,
  currentUser,
  placeholder = "Type your message...",
  title, // Default title can be channel name or generic
  className,
  onMessagesReceived, // Pass down to useChat
  onErrorOccurred,    // Pass down to useChat
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const { messages, sendMessage, isLoading, error } = useChat({
    channelId,
    currentUser,
    onMessagesReceived,
    onErrorOccurred
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div'); // Target the viewport div
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (sendError) {
      console.error("Failed to send message from UI:", sendError);
      // Error is also handled by useChat's onErrorOccurred if provided
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const shouldShowAvatar = (currentMsg: ChatMessage, prevMsg?: ChatMessage): boolean => {
    if (!prevMsg) return true; // Always show for the first message
    if (currentMsg.userId !== prevMsg.userId) return true; // Show if sender changes
    // Optional: Hide if same sender and messages are close in time (e.g., within 1 minute)
    const timeDiff = new Date(currentMsg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
    if (timeDiff > 60000) return true; // More than 1 minute apart
    return false;
  };

  return (
    <Card className={cn("flex flex-col h-full w-full shadow-xl", className)}>
      <CardHeader className="border-b p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border">
            {/* Future: Fetch channel avatar or use generic icon */}
            <AvatarFallback><UserCircle size={24}/></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{title || `Channel: ${channelId.substring(0, 8)}...`}</CardTitle>
            {/* Future: Channel description or member count */}
            {/* <p className="text-sm text-muted-foreground">Active members: ...</p> */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {isLoading && messages.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Loading messages...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col justify-center items-center h-full text-destructive">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p>Error loading messages: {error.message}</p>
              <p className="text-sm text-muted-foreground">Please try again later.</p>
            </div>
          )}
          {!isLoading && !error && messages.length === 0 && (
             <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          )}
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                currentUser={currentUser}
                showAvatar={shouldShowAvatar(msg, messages[index-1])}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={isLoading || !!error}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isLoading || !!error || !newMessage.trim()}>
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
