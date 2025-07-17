"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bot, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Copy,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ChatbotMessageProps } from '../../types';
import { cn } from '@/lib/utils';

export function ChatbotMessage({
  message,
  isLast = false,
  onRegenerate,
  onFeedback,
  className,
}: ChatbotMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isStreaming = message.isStreaming;

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Handle feedback
  const handleFeedback = (feedbackType: 'positive' | 'negative') => {
    setFeedback(feedbackType);
    onFeedback?.(message.id, feedbackType);
  };

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <div className={cn("flex gap-3 group", className)}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback className={cn(
            "text-xs",
            isUser ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
          )}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Message Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          {isStreaming && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                Typing
              </div>
            </Badge>
          )}
          {message.metadata?.error && (
            <Badge variant="destructive" className="text-xs px-1 py-0">
              Error
            </Badge>
          )}
        </div>

        {/* Message Body */}
        <div className={cn(
          "prose prose-sm max-w-none",
          "text-sm leading-relaxed",
          isUser ? "text-foreground" : "text-foreground"
        )}>
          <div className={cn(
            "p-3 rounded-lg",
            isUser 
              ? "bg-blue-50 border border-blue-200" 
              : "bg-muted border"
          )}>
            {message.content ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                )}
              </div>
            ) : isStreaming ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs">Thinking...</span>
              </div>
            ) : (
              <div className="text-muted-foreground italic">No content</div>
            )}
          </div>
        </div>

        {/* Message Actions */}
        {!isStreaming && message.content && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              {copied ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>

            {/* Regenerate button (for assistant messages) */}
            {isAssistant && isLast && onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-6 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}

            {/* Feedback buttons (for assistant messages) */}
            {isAssistant && onFeedback && (
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className={cn(
                    "h-6 w-6 p-0",
                    feedback === 'positive' && "text-green-600 bg-green-50"
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('negative')}
                  className={cn(
                    "h-6 w-6 p-0",
                    feedback === 'negative' && "text-red-600 bg-red-50"
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        {message.metadata && (
          <div className="mt-2 text-xs text-muted-foreground">
            {message.metadata.model && (
              <span>Model: {message.metadata.model}</span>
            )}
            {message.metadata.tokens && (
              <span className="ml-2">Tokens: {message.metadata.tokens}</span>
            )}
            {message.metadata.cost && (
              <span className="ml-2">Cost: ${message.metadata.cost.toFixed(4)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
