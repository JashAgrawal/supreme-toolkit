"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  User,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { TicketListProps, SupportTicket } from '../../types';
import { cn } from '@/lib/utils';

export function TicketList({
  tickets,
  selectedTicketId,
  onTicketSelect,
  onCreateTicket,
  userRole = 'customer',
  className,
}: TicketListProps) {
  
  // Status icons and colors
  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Support Tickets</CardTitle>
          {onCreateTicket && (
            <Button onClick={onCreateTicket} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {tickets.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-center p-4">
              <div>
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No tickets found
                </p>
                {onCreateTicket && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onCreateTicket}
                    className="mt-2"
                  >
                    Create your first ticket
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onTicketSelect(ticket.id)}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-colors hover:bg-muted/50",
                    selectedTicketId === ticket.id && "bg-muted"
                  )}
                >
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Priority indicator */}
                      <div 
                        className={cn(
                          "w-1 h-6 rounded-full flex-shrink-0",
                          getPriorityColor(ticket.priority)
                        )}
                      />
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm truncate">
                          {ticket.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          #{ticket.id}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(ticket.status))}
                    >
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1 capitalize">
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>

                  {/* Ticket Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {/* Category */}
                      <span className="capitalize">{ticket.category}</span>
                      
                      {/* Priority */}
                      <span className="capitalize">{ticket.priority}</span>
                      
                      {/* Assigned agent (for customers and admins) */}
                      {ticket.assigned_to && userRole !== 'agent' && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Assigned</span>
                        </div>
                      )}
                    </div>

                    {/* Created date */}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatTime(ticket.created_at)}</span>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {ticket.description}
                  </p>

                  {/* Tags */}
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ticket.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs px-1 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {ticket.tags.length > 3 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-1 py-0"
                        >
                          +{ticket.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
