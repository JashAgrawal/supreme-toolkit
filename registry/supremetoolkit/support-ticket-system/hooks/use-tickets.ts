"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket, assignTicket } from '../lib/tickets';
import type { 
  SupportTicket, 
  UseTicketsOptions, 
  UseTicketsReturn, 
  CreateTicketRequest,
  TicketFilters 
} from '../types';

export function useTickets({
  userId,
  userRole = 'customer',
  status,
  priority,
  category,
  assignedTo,
  onError,
}: UseTicketsOptions): UseTicketsReturn {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build filters from options
  const filters: TicketFilters = {
    ...(status && { status: [status] }),
    ...(priority && { priority: [priority] }),
    ...(category && { category: [category] }),
    ...(assignedTo && { assigned_to: [assignedTo] }),
  };

  // Load tickets
  const loadTickets = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const fetchedTickets = await getTickets(filters, userId, userRole);
      setTickets(fetchedTickets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tickets';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole, status, priority, category, assignedTo, onError]);

  // Create new ticket
  const createNewTicket = useCallback(async (
    ticketData: CreateTicketRequest
  ): Promise<SupportTicket | null> => {
    if (!userId) {
      const errorMessage = 'User ID is required to create a ticket';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    }

    try {
      setError(null);
      
      const newTicket = await createTicket(ticketData, userId);
      
      // Add to local state
      setTickets(prev => [newTicket, ...prev]);
      
      return newTicket;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    }
  }, [userId, onError]);

  // Update existing ticket
  const updateExistingTicket = useCallback(async (
    ticketId: string,
    updates: Partial<SupportTicket>
  ) => {
    if (!userId) {
      const errorMessage = 'User ID is required to update a ticket';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    try {
      setError(null);
      
      const updatedTicket = await updateTicket(ticketId, updates, userId);
      
      if (updatedTicket) {
        // Update local state
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === ticketId ? updatedTicket : ticket
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [userId, onError]);

  // Delete ticket
  const deleteExistingTicket = useCallback(async (ticketId: string) => {
    try {
      setError(null);
      
      const success = await deleteTicket(ticketId);
      
      if (success) {
        // Remove from local state
        setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete ticket';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  // Assign ticket to agent
  const assignTicketToAgent = useCallback(async (
    ticketId: string,
    agentId: string
  ) => {
    try {
      setError(null);
      
      const updatedTicket = await assignTicket(ticketId, agentId);
      
      if (updatedTicket) {
        // Update local state
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === ticketId ? updatedTicket : ticket
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign ticket';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  // Refresh tickets
  const refreshTickets = useCallback(async () => {
    await loadTickets();
  }, [loadTickets]);

  // Load tickets on mount and when dependencies change
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return {
    tickets,
    isLoading,
    error,
    createTicket: createNewTicket,
    updateTicket: updateExistingTicket,
    deleteTicket: deleteExistingTicket,
    assignTicket: assignTicketToAgent,
    refreshTickets,
  };
}
