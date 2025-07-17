"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, X, Reply } from 'lucide-react';
import type { ChatInputProps, ChatMessage } from '../../types';
import { cn } from '@/lib/utils';

export function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = "Type a message...",
  disabled = false,
  className,
  replyTo,
  onCancelReply,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Focus textarea when replying
  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCancelReply = () => {
    onCancelReply?.();
    textareaRef.current?.focus();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <Reply className="h-3 w-3" />
            <span className="text-muted-foreground">
              Replying to <strong>{replyTo.user?.name || 'Unknown User'}</strong>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelReply}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={disabled ? "Disconnected..." : placeholder}
            disabled={disabled || isLoading}
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
        </div>
        
        <Button
          type="submit"
          size="sm"
          disabled={!message.trim() || isLoading || disabled}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Status indicators */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-2">
          {disabled && (
            <Badge variant="destructive" className="text-xs">
              Disconnected
            </Badge>
          )}
          {isLoading && (
            <Badge variant="secondary" className="text-xs">
              Sending...
            </Badge>
          )}
        </div>
        
        <div className="text-right">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
