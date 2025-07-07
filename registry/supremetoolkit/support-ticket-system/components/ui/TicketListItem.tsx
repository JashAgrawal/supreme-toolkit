"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SupportTicket } from '@/types';
import { ArrowRight, Clock, Tag, Shield, MessageSquare } from 'lucide-react';

interface TicketListItemProps {
  ticket: SupportTicket;
  onViewTicket: (ticketId: string) => void;
  className?: string;
}

export function TicketListItem({ ticket, onViewTicket, className }: TicketListItemProps) {

  const formatDate = (dateInput?: Date | string): string => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'open': return 'default';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'outline'; // Success-like, but outline is distinct
      case 'closed': return 'destructive'; // Or outline, depending on visual preference for closed
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority?: string): "default" | "secondary" | "destructive" | "outline" => {
     switch (priority?.toLowerCase()) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'outline'; // Warning-like
      case 'urgent': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight hover:underline cursor-pointer" onClick={() => onViewTicket(ticket.id)}>
            {ticket.title}
          </CardTitle>
          <Badge variant={getStatusVariant(ticket.status)} className="capitalize text-xs whitespace-nowrap">
            {ticket.status || 'Unknown'}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          Ticket ID: {ticket.id.substring(0,8)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm pb-4">
        <p className="text-muted-foreground line-clamp-2">
          {ticket.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {ticket.category && (
            <Badge variant="outline" className="text-xs py-0.5">
              <Tag size={12} className="mr-1"/> {ticket.category}
            </Badge>
          )}
          {ticket.priority && (
             <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs py-0.5 capitalize">
               <Shield size={12} className="mr-1"/> {ticket.priority}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground bg-muted/50 p-3">
        <div className="flex items-center">
          <Clock size={14} className="mr-1.5" />
          <span>Last updated: {formatDate(ticket.updatedAt)}</span>
        </div>
        {/* Could show message count if available on ticket object */}
        {/* {ticket.messageCount && (
            <div className="flex items-center">
                <MessageSquare size={14} className="mr-1.5" /> {ticket.messageCount}
            </div>
        )} */}
        <Button variant="ghost" size="sm" onClick={() => onViewTicket(ticket.id)} className="text-xs h-auto py-1 px-2">
          View Details <ArrowRight size={14} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
