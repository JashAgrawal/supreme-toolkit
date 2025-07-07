"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare, X, Send, User, Bot, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatbot, ExtendedMessage } from "@/hooks/use-chatbot"; // Assuming ExtendedMessage is defined
import type { Message } from 'ai';

export interface ChatbotWidgetProps {
  title?: string;
  systemPrompt?: string;
  initialMessages?: Message[];
  triggerIcon?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  inputPlaceholder?: string;
  apiEndpoint?: string; // Allow overriding the API endpoint
}

export function ChatbotWidget({
  title = "AI Chatbot",
  systemPrompt = "You are a helpful AI assistant.",
  initialMessages,
  triggerIcon,
  className,
  defaultOpen = false,
  inputPlaceholder = "Type your message...",
  apiEndpoint = "/api/chat-completion",
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    // reload, // If you want a reload button
    // stop, // If you want a stop button
    setMessages, // To potentially clear chat or load history
  } = useChatbot({
    api: apiEndpoint,
    initialMessages,
    systemPrompt, // This is passed to the body of the API request via useChatbot hook
    onResponseCompleted: () => {
      // console.log("Response completed");
    },
    onError: (err) => {
      console.error("Chatbot widget error:", err);
    }
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div'); // Target the viewport div
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && initialMessages && messages.length === 0) { // Restore initial messages if provided and chat is empty
        setMessages(initialMessages);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const ChatMessageBubble = ({ msg }: { msg: ExtendedMessage }) => {
    const isUser = msg.role === 'user';
    const isError = (msg as any).isError; // Example if you add custom error flag

    return (
      <div className={cn("flex items-start space-x-3 my-3", isUser ? "justify-end" : "")}>
        {!isUser && (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback><Bot size={18} /></AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "p-3 rounded-lg max-w-[70%] shadow-sm",
            isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none",
            isError ? "bg-destructive/20 border border-destructive text-destructive-foreground" : ""
          )}
        >
          {typeof msg.content === 'string' ? (
            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
          ) : (
            // Vercel AI SDK can have ReactNode in msg.ui
             msg.ui || <p className="text-sm italic text-muted-foreground">[Unsupported message format]</p>
          )}
           {msg.role === 'assistant' && isLoading && messages[messages.length -1]?.id === msg.id && (
             <Loader2 className="h-4 w-4 animate-spin inline-block ml-1" />
           )}
        </div>
        {isUser && (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback><User size={18}/></AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };


  if (!isOpen) {
    return (
      <Button
        onClick={toggleOpen}
        className={cn("fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50", className)}
        aria-label="Open Chatbot"
      >
        {triggerIcon || <MessageSquare size={24} />}
      </Button>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px] z-50", className)}>
      <Card className="flex flex-col h-full shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback><Bot size={18} /></AvatarFallback>
            </Avatar>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleOpen} aria-label="Close Chatbot">
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden bg-muted/20">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} msg={msg as ExtendedMessage} />
            ))}
            {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                 <div className={cn("flex items-start space-x-3 my-3")}>
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot size={18} /></AvatarFallback>
                    </Avatar>
                    <div className={cn("p-3 rounded-lg max-w-[70%] shadow-sm bg-muted rounded-bl-none")}>
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                 </div>
            )}
          </ScrollArea>
        </CardContent>

        {error && (
            <div className="p-3 border-t bg-destructive/10 text-destructive text-xs flex items-center space-x-2">
                <AlertTriangle size={16} />
                <span>Error: {error.message || "Could not connect to AI."}</span>
            </div>
        )}

        <CardFooter className="p-3 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder={inputPlaceholder}
              value={input}
              onChange={handleInputChange}
              className="flex-1"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send Message">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
