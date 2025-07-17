import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptCopyBtn } from '@/components/magicui/script-copy-btn';
import Link from 'next/link';
import { MessageSquare, ExternalLink, Code, Play, Settings, Database } from 'lucide-react';

export default function ChatRealtimeDocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Real-time Chat</h1>
            <p className="text-muted-foreground">Complete real-time chat system with Convex backend</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Communication</Badge>
          <Badge variant="outline">Intermediate</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/preview/chat-realtime">
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
              <CardTitle>What is Real-time Chat?</CardTitle>
              <CardDescription>
                A complete real-time chat system built with Convex that provides instant messaging, 
                presence indicators, room management, and message history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✨ Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Real-time messaging with Convex</li>
                    <li>• User presence indicators</li>
                    <li>• Multiple chat rooms</li>
                    <li>• Message history and pagination</li>
                    <li>• Typing indicators</li>
                    <li>• Message reactions</li>
                    <li>• File attachments</li>
                    <li>• User authentication</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🛠️ Built With</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Convex (Real-time database)</li>
                    <li>• React hooks for state management</li>
                    <li>• shadcn/ui components</li>
                    <li>• TypeScript for type safety</li>
                    <li>• date-fns for date formatting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Setup Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This module requires Convex setup. You'll need to deploy the Convex schema for chat:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm">
                  • chatRooms (id, name, description, createdAt, ...)<br/>
                  • chatMessages (id, roomId, userId, content, createdAt, ...)<br/>
                  • chatPresence (roomId, userId, name, avatar, onlineAt, ...)
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
                Install the chat-realtime module and its dependencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Install the module</h4>
                <ScriptCopyBtn script="npx supreme-toolkit@latest add chat-realtime" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Install dependencies</h4>
                <ScriptCopyBtn script="npm install convex date-fns" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Configure Convex</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Add your Convex configuration to your config file:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`// config.tsx
export const chatConfig = {
  database: 'convex',
  enableFileUploads: true,
  maxParticipants: 100,
  // ...other config
};`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Environment Variables</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`CONVEX_DEPLOYMENT_URL=your_convex_url
CONVEX_DEPLOYMENT_KEY=your_convex_key`}</code></pre>
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
                How to use the chat components in your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Simple Chat Room</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { ChatRoom } from '@/components/chat-realtime/ui/chat-room';

export default function ChatPage() {
  return (
    <div className="h-screen">
      <ChatRoom
        roomId="general"
        userId="user-123"
        userName="John Doe"
        userAvatar="/avatar.jpg"
      />
    </div>
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">With Custom Configuration</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { ChatRoom } from '@/components/chat-realtime/ui/chat-room';

export default function CustomChatPage() {
  return (
    <ChatRoom
      roomId="support"
      userId="user-123"
      userName="John Doe"
      userAvatar="/avatar.jpg"
      enableFileUploads={true}
      enableReactions={true}
      enableTypingIndicators={true}
      maxMessages={100}
      onMessageSent={(message) => {
        console.log('Message sent:', message);
      }}
      onUserJoined={(user) => {
        console.log('User joined:', user);
      }}
    />
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Using the Hook</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { useChat } from '@/hooks/chat-realtime/use-chat';

export default function CustomChatComponent() {
  const {
    messages,
    participants,
    isLoading,
    sendMessage,
    joinRoom,
    leaveRoom,
  } = useChat({
    roomId: 'general',
    userId: 'user-123',
    onError: (error) => console.error(error),
  });

  return (
    <div>
      {/* Your custom chat UI */}
    </div>
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
                <h4 className="font-semibold mb-3">ChatRoom Props</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Prop</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Default</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="p-2 font-mono">roomId</td>
                        <td className="p-2">string</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Unique identifier for the chat room</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono">userId</td>
                        <td className="p-2">string</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Current user's unique identifier</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono">userName</td>
                        <td className="p-2">string</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Display name for the current user</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono">enableFileUploads</td>
                        <td className="p-2">boolean</td>
                        <td className="p-2">false</td>
                        <td className="p-2">Allow file attachments in messages</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono">enableReactions</td>
                        <td className="p-2">boolean</td>
                        <td className="p-2">true</td>
                        <td className="p-2">Enable message reactions</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">useChat Hook</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`const {
  messages,           // ChatMessage[]
  participants,       // ChatParticipant[]
  isLoading,         // boolean
  error,             // string | null
  sendMessage,       // (content: string) => Promise<void>
  joinRoom,          // () => Promise<void>
  leaveRoom,         // () => Promise<void>
  deleteMessage,     // (messageId: string) => Promise<void>
  addReaction,       // (messageId: string, emoji: string) => Promise<void>
} = useChat(options);`}</code></pre>
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
                <h4 className="font-semibold mb-2">Customer Support Chat</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<ChatRoom
  roomId="support-ticket-123"
  userId={user.id}
  userName={user.name}
  userAvatar={user.avatar}
  enableFileUploads={true}
  maxFileSize={5}
  allowedFileTypes={['image/*', '.pdf']}
  placeholder="Describe your issue..."
  onMessageSent={handleSupportMessage}
/>`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Team Collaboration</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<ChatRoom
  roomId="team-general"
  userId={employee.id}
  userName={employee.name}
  userAvatar={employee.avatar}
  enableReactions={true}
  enableTypingIndicators={true}
  enableFileUploads={true}
  showParticipantsList={true}
/>`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Public Community Chat</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<ChatRoom
  roomId="community-general"
  userId={user.id}
  userName={user.displayName}
  userAvatar={user.avatar}
  enableReactions={true}
  enableFileUploads={false}
  maxMessages={50}
  moderationEnabled={true}
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
