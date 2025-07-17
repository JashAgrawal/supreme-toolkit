"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

const mockTickets = [
  {
    id: 'TK-001',
    title: 'Login issues with 2FA',
    description: 'Unable to login with two-factor authentication enabled',
    status: 'open',
    priority: 'high',
    category: 'authentication',
    created_by: 'john.doe@example.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    comments: 3,
  },
  {
    id: 'TK-002', 
    title: 'Feature request: Dark mode',
    description: 'Would love to have a dark mode option for the dashboard',
    status: 'in_progress',
    priority: 'medium',
    category: 'feature',
    created_by: 'jane.smith@example.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    comments: 1,
  },
  {
    id: 'TK-003',
    title: 'Payment processing error',
    description: 'Getting error 500 when trying to process payment',
    status: 'resolved',
    priority: 'urgent',
    category: 'billing',
    created_by: 'mike.wilson@example.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48),
    comments: 5,
  },
];

export default function SupportTicketSystemPreview() {
  const [tickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs/modules/support-ticket-system">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Support Ticket System Preview</h1>
            <p className="text-muted-foreground">Interactive demo of the ticket management system</p>
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
        </TabsList>

        <TabsContent value="demo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Ticket List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Support Tickets</CardTitle>
                  <Button size="sm" onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tickets..." className="pl-8" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedTicket.id === ticket.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-6 rounded-full ${getPriorityColor(ticket.priority)}`} />
                          <div>
                            <h3 className="font-medium text-sm">{ticket.title}</h3>
                            <p className="text-xs text-muted-foreground">{ticket.id}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{ticket.created_by}</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{ticket.comments}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.title}</CardTitle>
                    <CardDescription>Ticket #{selectedTicket.id}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue={selectedTicket.status}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue={selectedTicket.priority}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedTicket.status)}
                      <span className="text-sm capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedTicket.priority)}`} />
                      <span className="text-sm capitalize">{selectedTicket.priority}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <span className="text-sm capitalize">{selectedTicket.category}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <span className="text-sm">{selectedTicket.created_at.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="font-semibold mb-4">Comments ({selectedTicket.comments})</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">Support Agent</span>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-sm">Thank you for reporting this issue. I'm looking into the 2FA problem and will update you shortly.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add Comment */}
                  <div className="mt-4 space-y-2">
                    <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="internal" />
                        <label htmlFor="internal" className="text-sm">Internal comment</label>
                      </div>
                      <Button size="sm">Add Comment</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create, update, and track support tickets with status management and priority levels.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Internal and public comments with rich text support and file attachments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive admin interface for managing tickets, users, and system settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
