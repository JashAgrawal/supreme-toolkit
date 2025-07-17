"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  ArrowLeft,
  Sparkles,
  Zap,
  MessageSquare,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

// Import actual chatbot components
import { ChatbotMessage } from '@/registry/supremetoolkit/chatbot-gpt/components/ui/chatbot-message';
import { ChatbotInput } from '@/registry/supremetoolkit/chatbot-gpt/components/ui/chatbot-input';
import { useChatbot } from '@/registry/supremetoolkit/chatbot-gpt/hooks/use-chatbot';

export default function ChatbotGptPreview() {
  // Use the actual chatbot hook
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
    userId: 'preview-user',
    systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions. This is a preview demo of the Supreme Toolkit chatbot module.',
    onError: (error) => console.error('Chatbot error:', error),
  });

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs/modules/chatbot-gpt">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Chatbot Preview</h1>
            <p className="text-muted-foreground">Interactive demo of the GPT-powered chatbot</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live Demo</Badge>
          <Badge variant="outline">Streaming</Badge>
          <Badge variant="outline">GPT-4</Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        {/* Demo */}
        <TabsContent value="demo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <Card className="lg:col-span-2 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">AI Assistant</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Online
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      disabled={messages.length === 0}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      GPT-4
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 max-w-full">
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
                      messages.map((message, index) => (
                        <ChatbotMessage
                          key={message.id}
                          message={message}
                          isLast={index === messages.length - 1}
                          onRegenerate={
                            message.role === 'assistant' && index === messages.length - 1
                              ? regenerateLastResponse
                              : undefined
                          }
                          onFeedback={(messageId, feedback) => {
                            console.log('Feedback:', messageId, feedback);
                          }}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t p-4 flex-shrink-0">
                  <ChatbotInput
                    onSendMessage={sendMessage}
                    isLoading={isLoading}
                    isStreaming={isStreaming}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    onStopGeneration={isStreaming ? stopGeneration : undefined}
                  />
                  {error && (
                    <p className="text-xs text-destructive mt-2">
                      Error: {error}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
                <CardDescription>Chatbot settings and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Model Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <Badge variant="outline">GPT-4</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span>0.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Tokens:</span>
                      <span>1000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streaming:</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Message History</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Response Regeneration</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Feedback Collection</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Copy to Clipboard</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">System Prompt</h4>
                  <div className="bg-muted p-3 rounded-lg text-xs">
                    You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Streaming Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time streaming of AI responses for better user experience and perceived performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversation Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Maintains conversation context and history for coherent multi-turn conversations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Regeneration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Allow users to regenerate AI responses if they're not satisfied with the initial answer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feedback Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in thumbs up/down feedback system to improve AI responses over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom System Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure the AI's personality and behavior with custom system prompts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Token Usage Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor and track OpenAI API token usage for cost management and optimization.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customization */}
        <TabsContent value="customization">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
                <CardDescription>
                  Tailor the AI chatbot to your specific use case
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">AI Configuration</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Custom system prompts</li>
                      <li>• Model selection (GPT-3.5, GPT-4)</li>
                      <li>• Temperature and creativity settings</li>
                      <li>• Token limits and cost control</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">UI Customization</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Custom themes and branding</li>
                      <li>• Widget positioning</li>
                      <li>• Message bubble styling</li>
                      <li>• Avatar customization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
