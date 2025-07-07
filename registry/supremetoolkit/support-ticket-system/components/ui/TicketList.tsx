"use client";

import React from 'react';
import { useSupportTickets } from '@/hooks/use-support-tickets';
import { TicketListItem } from './TicketListItem'; // Assuming you have this component
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketListProps {
  userId: string;
  onViewTicket: (ticketId: string) => void; // Callback to handle navigation/modal display
  className?: string;
}

export function TicketList({ userId, onViewTicket, className }: TicketListProps) {
  const {
    tickets,
    isLoading,
    error,
    fetchTickets,
    currentPage,
    totalTickets,
    isLoadingMore
  } = useSupportTickets({ userId });

  const limitPerPage = 10; // Or get from hook if configurable there
  const hasMore = tickets.length < totalTickets;

  if (isLoading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-10 text-destructive">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>Error loading tickets: {error}</p>
        <Button variant="outline" onClick={() => fetchTickets(1)} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
        <p className="text-muted-foreground">You haven't created any support tickets yet.</p>
        {/* Optional: Add a button to create a new ticket */}
        {/* <Button onClick={onCreateNewTicket} className="mt-4">Create New Ticket</Button> */}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            ticket={ticket}
            onViewTicket={onViewTicket}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => fetchTickets(currentPage + 1)}
            variant="outline"
            disabled={isLoadingMore}
          >
            {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More Tickets
          </Button>
        </div>
      )}
    </div>
  );
}
