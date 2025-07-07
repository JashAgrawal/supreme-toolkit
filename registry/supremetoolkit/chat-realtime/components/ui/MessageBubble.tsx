"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatUser } from '@/types/chat';

export interface MessageBubbleProps {
  message: ChatMessage;
  currentUser: ChatUser; // To determine if the message is from the current user
  showAvatar?: boolean; // Control avatar visibility for consecutive messages
}

export function MessageBubble({ message, currentUser, showAvatar = true }: MessageBubbleProps) {
  const isCurrentUser = message.userId === currentUser.id;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        "flex items-end space-x-2 group",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar for received messages */}
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarImage src={message.user?.avatar || undefined} alt={message.user?.name || 'User'} />
          <AvatarFallback>{getInitials(message.user?.name)}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn("max-w-xs md:max-w-md lg:max-w-lg", isCurrentUser ? "order-1" : "order-2")}>
        <Card
          className={cn(
            "rounded-2xl p-0 shadow-sm",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-muted-foreground rounded-bl-none"
          )}
        >
          <CardContent className="p-3">
            {!isCurrentUser && showAvatar && (
                 <p className="text-xs font-semibold mb-1">
                {message.user?.name || 'Anonymous'}
              </p>
            )}
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </CardContent>
        </Card>
        <div
            className={cn(
                "text-xs text-muted-foreground mt-1 px-1 group-hover:opacity-100 opacity-0 transition-opacity duration-200",
                isCurrentUser ? "text-right" : "text-left"
            )}
        >
            {formatTime(message.createdAt)}
        </div>
      </div>

      {/* Avatar for sent messages (optional, less common) */}
      {/* {isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8 order-2 self-start">
          <AvatarImage src={currentUser.avatarUrl || undefined} alt={currentUser.name || 'User'} />
          <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
        </Avatar>
      )} */}
    </div>
  );
}
