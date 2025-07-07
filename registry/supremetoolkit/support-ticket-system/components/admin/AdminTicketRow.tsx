"use client";

import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SupportTicket } from '@/types'; // Assuming global SupportTicket type
import { ArrowRight, UserCircle } from 'lucide-react';

interface AdminTicketRowProps {
  ticket: SupportTicket;
  onViewTicket: (ticketId: string) => void;
  // onAssignTicket?: (ticketId: string, adminId: string) => void; // For quick assignment
  // adminUsers?: { id: string; name: string }[]; // List of admins for assignment dropdown
}

export function AdminTicketRow({ ticket, onViewTicket }: AdminTicketRowProps) {

  const formatDate = (dateInput?: Date | string): string => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeAgo = (dateInput?: Date | string): string => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'open': return 'default'; // Blue/Primary
      case 'in_progress': return 'secondary'; // Yellow/Orange-ish - secondary might be gray, adjust if needed
      case 'resolved': return 'outline'; // Green-ish
      case 'closed': return 'destructive'; // Or gray
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority?: string): "default" | "secondary" | "destructive" | "outline" => {
     switch (priority?.toLowerCase()) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'outline'; // Or a specific color like warning
      case 'urgent': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => onViewTicket(ticket.id)}>
      <TableCell className="font-medium">
        <div className="truncate w-40 md:w-64" title={ticket.title}>{ticket.title}</div>
        <div className="text-xs text-muted-foreground">{ticket.id.substring(0,8)}...</div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(ticket.status)} className="capitalize text-xs whitespace-nowrap">
          {ticket.status || 'Unknown'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {ticket.user ? (
          <div className="flex items-center space-x-2">
            {/* <UserCircle size={16} className="text-muted-foreground" /> */}
            <div>
              <div className="text-sm truncate w-32" title={ticket.user.name || ticket.user.email}>{ticket.user.name || ticket.user.email}</div>
              {/* <div className="text-xs text-muted-foreground">{ticket.user.email}</div> */}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Badge variant={getPriorityVariant(ticket.priority)} className="capitalize text-xs">
          {ticket.priority || 'N/A'}
        </Badge>
      </TableCell>
       <TableCell className="hidden md:table-cell">
        {ticket.assignee ? (
          <div className="text-sm truncate w-28" title={ticket.assignee.name || ticket.assignee.email}>{ticket.assignee.name || 'N/A'}</div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <div className="text-sm">{formatDate(ticket.updatedAt)}</div>
        <div className="text-xs text-muted-foreground">{formatTimeAgo(ticket.updatedAt)}</div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewTicket(ticket.id); }}>
          View <ArrowRight size={14} className="ml-1" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
