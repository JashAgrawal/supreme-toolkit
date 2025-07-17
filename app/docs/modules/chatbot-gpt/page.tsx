import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptCopyBtn } from '@/components/magicui/script-copy-btn';
import Link from 'next/link';
import { Bot, ExternalLink, Code, Play, Settings, Zap } from 'lucide-react';

export default function ChatbotGptDocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Chatbot</h1>
            <p className="text-muted-foreground">AI chatbot widget with OpenAI integration and streaming responses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">AI</Badge>
          <Badge variant="outline">Advanced</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/preview/chatbot-gpt">
              <Play className="h-4 w-4 mr-2" />
              Live Preview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/JashAgrawal/supreme-toolkit" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Source
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is AI Chatbot?</CardTitle>
              <CardDescription>
                A powerful AI chatbot widget that integrates with OpenAI's GPT models to provide 
                intelligent conversational experiences with streaming responses and conversation management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✨ Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• OpenAI GPT integration</li>
                    <li>• Real-time streaming responses</li>
                    <li>• Conversation history</li>
                    <li>• Customizable system prompts</li>
                    <li>• Message regeneration</li>
                    <li>• Feedback collection</li>
                    <li>• Token usage tracking</li>
                    <li>• Error handling</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🛠️ Built With</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• OpenAI API</li>
                    <li>• Server-sent events (SSE)</li>
                    <li>• React hooks for state</li>
                    <li>• shadcn/ui components</li>
                    <li>• TypeScript for safety</li>
                    <li>• date-fns for formatting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                OpenAI API Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This module requires an OpenAI API key to function. You'll need to:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm">
                  • Sign up for OpenAI API access<br/>
                  • Get your API key from OpenAI dashboard<br/>
                  • Configure rate limits and usage monitoring<br/>
                  • Set up billing and usage alerts
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Installation */}
        <TabsContent value="installation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>
                Install the chatbot-gpt module and configure OpenAI integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Install the module</h4>
                <ScriptCopyBtn script="npx supreme-toolkit@latest add chatbot-gpt" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Install dependencies</h4>
                <ScriptCopyBtn script="npm install date-fns" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Configure OpenAI</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Add your OpenAI configuration to your config file:
                </p>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`// config.tsx
export const moduleConfigs = {
  chatbot: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant.',
    enableStreaming: true,
    enableFeedback: true,
  }
};`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Environment Variables</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`OPENAI_API_KEY=your_openai_api_key_here`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
              <CardDescription>
                How to integrate the AI chatbot into your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Simple Chatbot Widget</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`import { ChatbotWidget } from '@/components/chatbot-gpt/ui/chatbot-widget';

export default function HomePage() {
  return (
    <div>
      {/* Your page content */}

      <ChatbotWidget
        userId="user-123"
        position="bottom-right"
        enableStreaming={true}
        systemPrompt="You are a helpful customer support assistant."
      />
    </div>
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Custom Chatbot Interface</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`import { useChatbot } from '@/hooks/chatbot-gpt/use-chatbot';
import { ChatbotMessage } from '@/components/chatbot-gpt/ui/chatbot-message';
import { ChatbotInput } from '@/components/chatbot-gpt/ui/chatbot-input';

export default function CustomChatPage() {
  const {
    messages,
    isLoading,
    sendMessage,
    regenerateResponse,
    clearConversation,
  } = useChatbot({
    userId: 'user-123',
    systemPrompt: 'You are a coding assistant.',
    onError: (error) => console.error(error),
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatbotMessage
            key={message.id}
            message={message}
            onRegenerate={regenerateResponse}
          />
        ))}
      </div>

      <ChatbotInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">With Conversation Management</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`import { ChatbotWidget } from '@/components/chatbot-gpt/ui/chatbot-widget';

export default function SupportPage() {
  const handleConversationSave = (conversation) => {
    // Save conversation to your database
    console.log('Saving conversation:', conversation);
  };

  return (
    <ChatbotWidget
      userId="user-123"
      conversationId="support-session-456"
      systemPrompt="You are a technical support specialist."
      enableFeedback={true}
      enableConversationHistory={true}
      onConversationSave={handleConversationSave}
      maxTokens={1500}
      temperature={0.3}
    />
  );
}`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">ChatbotWidget Props</h4>
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 min-w-[120px]">Prop</th>
                          <th className="text-left p-2 min-w-[80px]">Type</th>
                          <th className="text-left p-2 min-w-[80px]">Default</th>
                          <th className="text-left p-2 min-w-[200px]">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="p-2 font-mono break-words">userId</td>
                          <td className="p-2 break-words">string</td>
                          <td className="p-2 break-words">-</td>
                          <td className="p-2 break-words">Unique identifier for the user</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono break-words">systemPrompt</td>
                          <td className="p-2 break-words">string</td>
                          <td className="p-2 break-words">default</td>
                          <td className="p-2 break-words">System prompt for the AI assistant</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono break-words">enableStreaming</td>
                          <td className="p-2 break-words">boolean</td>
                          <td className="p-2 break-words">true</td>
                          <td className="p-2 break-words">Enable real-time streaming responses</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono break-words">position</td>
                          <td className="p-2 break-words">string</td>
                          <td className="p-2 break-words">bottom-right</td>
                          <td className="p-2 break-words">Widget position on screen</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono break-words">maxTokens</td>
                          <td className="p-2 break-words">number</td>
                          <td className="p-2 break-words">1000</td>
                          <td className="p-2 break-words">Maximum tokens per response</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">useChatbot Hook</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`const {
  messages,              // ChatbotMessage[]
  isLoading,            // boolean
  isStreaming,          // boolean
  error,                // string | null
  sendMessage,          // (message: string) => Promise<void>
  regenerateResponse,   // (messageId: string) => Promise<void>
  clearConversation,    // () => void
  stopGeneration,       // () => void
} = useChatbot(options);`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
              <CardDescription>
                Common use cases and implementation examples
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Customer Support Bot</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`<ChatbotWidget
  userId={user.id}
  systemPrompt="You are a customer support specialist for our SaaS platform. Help users with account issues, billing questions, and feature explanations."
  enableFeedback={true}
  conversationId={supportTicket.id}
  maxTokens={1200}
  temperature={0.3}
/>`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Code Assistant</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`<ChatbotWidget
  userId={developer.id}
  systemPrompt="You are an expert programming assistant. Help with code reviews, debugging, and best practices for React, TypeScript, and Node.js."
  enableStreaming={true}
  maxTokens={2000}
  temperature={0.1}
/>`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Educational Tutor</h4>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-words"><code>{`<ChatbotWidget
  userId={student.id}
  systemPrompt="You are a patient and encouraging tutor. Explain concepts clearly, ask follow-up questions, and provide examples."
  enableFeedback={true}
  maxTokens={1500}
  temperature={0.7}
/>`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
