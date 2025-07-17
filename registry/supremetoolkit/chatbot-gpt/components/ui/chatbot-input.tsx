"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Square, Paperclip } from 'lucide-react';
import type { ChatbotInputProps } from '../../types';
import { cn } from '@/lib/utils';

export function ChatbotInput({
  onSendMessage,
  isLoading = false,
  isStreaming = false,
  placeholder = "Type your message...",
  disabled = false,
  enableFileUpload = false,
  className,
  onStopGeneration,
}: ChatbotInputProps) {
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

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log('File upload clicked');
  };

  const canSend = message.trim() && !disabled && !isLoading;
  const showStopButton = isStreaming && onStopGeneration;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={disabled ? "AI is thinking..." : placeholder}
            disabled={disabled || isLoading}
            className="min-h-[40px] max-h-[120px] resize-none pr-10"
            rows={1}
          />
          
          {/* File upload button */}
          {enableFileUpload && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              disabled={disabled || isLoading}
              className="absolute right-2 top-2 h-6 w-6 p-0"
            >
              <Paperclip className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Send/Stop button */}
        {showStopButton ? (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={onStopGeneration}
            className="self-end"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="sm"
            disabled={!canSend}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Status indicators */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-2">
          {isLoading && !isStreaming && (
            <Badge variant="secondary" className="text-xs">
              Processing...
            </Badge>
          )}
          {isStreaming && (
            <Badge variant="secondary" className="text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                AI is typing...
              </div>
            </Badge>
          )}
          {disabled && !isLoading && !isStreaming && (
            <Badge variant="destructive" className="text-xs">
              Unavailable
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
