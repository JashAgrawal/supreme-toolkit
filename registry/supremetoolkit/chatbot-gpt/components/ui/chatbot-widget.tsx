"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  Bot, 
  AlertCircle,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useChatbot } from '../../hooks/use-chatbot';
import { ChatbotMessage } from './chatbot-message';
import { ChatbotInput } from './chatbot-input';
import type { ChatbotWidgetProps } from '../../types';
import { cn } from '@/lib/utils';

export function ChatbotWidget({
  userId,
  systemPrompt,
  placeholder = "Ask me anything...",
  className,
  maxHeight = "600px",
  showHeader = true,
  enableFileUpload = false,
  enableFeedback = false,
  theme = 'auto',
  position = 'bottom-right',
  triggerButton,
  onError,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearConversation,
    regenerateLastResponse,
    stopGeneration,
  } = useChatbot({
    userId,
    systemPrompt,
    onError,
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // Handle message feedback
  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    // TODO: Implement feedback storage
    console.log('Feedback:', { messageId, feedback });
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50',
  };

  // Trigger button
  const defaultTriggerButton = (
    <Button
      onClick={() => setIsOpen(true)}
      size="lg"
      className="rounded-full h-14 w-14 shadow-lg"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );

  if (!isOpen) {
    return (
      <div className={cn(positionClasses[position], className)}>
        {triggerButton || defaultTriggerButton}
      </div>
    );
  }

  return (
    <div className={cn(positionClasses[position], className)}>
      <Card 
        className={cn(
          "w-96 flex flex-col shadow-xl",
          isMinimized ? "h-16" : ""
        )}
        style={{ maxHeight: isMinimized ? "64px" : maxHeight }}
      >
        {/* Header */}
        {showHeader && (
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                {isStreaming && (
                  <Badge variant="secondary" className="text-xs">
                    Typing...
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={regenerateLastResponse}
                      disabled={isLoading || isStreaming}
                      className="h-8 w-8 p-0"
                      title="Regenerate last response"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      disabled={isLoading || isStreaming}
                      className="h-8 w-8 p-0"
                      title="Clear conversation"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3" />
                  ) : (
                    <Minimize2 className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        )}

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-4 min-h-0">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <ScrollArea className="h-full pr-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Bot className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Hi! I'm your AI assistant. How can I help you today?
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <ChatbotMessage
                        key={message.id}
                        message={message}
                        isLast={index === messages.length - 1}
                        onRegenerate={
                          message.role === 'assistant' && index === messages.length - 1
                            ? regenerateLastResponse
                            : undefined
                        }
                        onFeedback={enableFeedback ? handleFeedback : undefined}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="p-4 pt-0 flex-shrink-0">
              <ChatbotInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isStreaming={isStreaming}
                placeholder={placeholder}
                disabled={isLoading}
                enableFileUpload={enableFileUpload}
                onStopGeneration={isStreaming ? stopGeneration : undefined}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
