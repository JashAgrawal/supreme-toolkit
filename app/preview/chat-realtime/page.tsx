"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Settings, 
  Paperclip,
  Smile,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Mock data for preview
const mockMessages = [
  {
    id: '1',
    content: 'Hey everyone! Welcome to the chat room 👋',
    user: { id: '1', name: 'Alice Johnson', avatar: '/avatars/alice.jpg' },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    reactions: [{ emoji: '👋', count: 3, users: ['2', '3', '4'] }]
  },
  {
    id: '2',
    content: 'Thanks for setting this up! This looks great.',
    user: { id: '2', name: 'Bob Smith', avatar: '/avatars/bob.jpg' },
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    reactions: []
  },
  {
    id: '3',
    content: 'I love the real-time features. The typing indicators work perfectly!',
    user: { id: '3', name: 'Carol Davis', avatar: '/avatars/carol.jpg' },
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    reactions: [{ emoji: '❤️', count: 2, users: ['1', '2'] }]
  }
];

const mockParticipants = [
  { id: '1', name: 'Alice Johnson', avatar: '/avatars/alice.jpg', isOnline: true, isTyping: false },
  { id: '2', name: 'Bob Smith', avatar: '/avatars/bob.jpg', isOnline: true, isTyping: false },
  { id: '3', name: 'Carol Davis', avatar: '/avatars/carol.jpg', isOnline: true, isTyping: true },
  { id: '4', name: 'David Wilson', avatar: '/avatars/david.jpg', isOnline: false, isTyping: false },
];

export default function ChatRealtimePreview() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [currentUser] = useState({ id: 'current', name: 'You', avatar: '/avatars/you.jpg' });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      user: currentUser,
      timestamp: new Date(),
      reactions: []
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs/modules/chat-realtime">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Real-time Chat Preview</h1>
            <p className="text-muted-foreground">Interactive demo of the chat system</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live Demo</Badge>
          <Badge variant="outline">Interactive</Badge>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Participants Sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants ({mockParticipants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 p-4">
                    {mockParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{participant.name}</p>
                          {participant.isTyping && (
                            <p className="text-xs text-muted-foreground">typing...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg"># General Chat</CardTitle>
                    <CardDescription>Real-time messaging demo</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3 group">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={msg.user.avatar} />
                          <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm leading-relaxed mb-2">
                            {msg.content}
                          </div>
                          {msg.reactions.length > 0 && (
                            <div className="flex gap-1">
                              {msg.reactions.map((reaction, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  {reaction.emoji} {reaction.count}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Paperclip className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Smile className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
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
                <CardTitle className="text-lg">Real-time Messaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Messages appear instantly across all connected clients using Convex real-time queries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Presence Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See who's online and typing in real-time with visual indicators.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message Reactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  React to messages with emojis and see reaction counts from other users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share files, images, and documents with configurable size and type restrictions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Room Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create and manage multiple chat rooms with different participants and settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Persistent message storage with pagination and search capabilities.
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
                  Tailor the chat system to your specific needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">UI Customization</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Custom themes and colors</li>
                      <li>• Configurable layouts</li>
                      <li>• Custom message bubbles</li>
                      <li>• Branded avatars and icons</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Functional Options</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• File upload restrictions</li>
                      <li>• Message moderation</li>
                      <li>• Custom emoji sets</li>
                      <li>• Notification settings</li>
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
