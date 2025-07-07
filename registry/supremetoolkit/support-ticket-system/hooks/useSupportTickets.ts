"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  createTicketAction,
  getTicketByIdAction,
  getTicketsForUserAction,
  addMessageToTicketAction
} from '@/actions/support-actions';
import type { SupportTicket, TicketMessage } from '@/types';
import type { CreateTicketInput, AddMessageInput } from '@/types/support';

export interface UseSupportTicketsReturn {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  messages: TicketMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalTickets: number;
  currentPage: number;
  fetchTickets: (page?: number) => Promise<void>;
  fetchTicketDetails: (ticketId: string) => Promise<void>;
  createTicket: (input: CreateTicketInput) => Promise<SupportTicket | null>;
  addMessage: (ticketId: string, input: AddMessageInput) => Promise<TicketMessage | null>;
  selectTicket: (ticket: SupportTicket | null) => void;
}

interface UseSupportTicketsProps {
  userId: string; // ID of the currently authenticated user
  initialPage?: number;
  limitPerPage?: number;
}

export function useSupportTickets({
  userId,
  initialPage = 1,
  limitPerPage = 10
}: UseSupportTicketsProps): UseSupportTicketsReturn {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const handleError = (err: any, defaultMessage: string) => {
    const message = err instanceof Error ? err.message : defaultMessage;
    console.error(defaultMessage, err);
    setError(message);
    return message;
  };

  const fetchTickets = useCallback(async (page: number = currentPage) => {
    if (!userId) {
      setError("User ID is required to fetch tickets.");
      return;
    }
    page === initialPage ? setIsLoading(true) : setIsLoadingMore(true);
    setError(null);

    try {
      const result = await getTicketsForUserAction(userId, page, limitPerPage);
      if (result.success && result.tickets !== undefined && result.total !== undefined) {
        setTickets(prev => page === 1 ? result.tickets! : [...prev, ...result.tickets!]);
        setTotalTickets(result.total);
        setCurrentPage(page);
      } else {
        throw new Error(result.error || "Failed to fetch tickets");
      }
    } catch (err) {
      handleError(err, "Error fetching user tickets");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [userId, currentPage, limitPerPage, initialPage]);

  useEffect(() => {
    fetchTickets(initialPage);
  }, [fetchTickets, initialPage]);

  const fetchTicketDetails = useCallback(async (ticketId: string) => {
    if (!userId) {
      setError("User ID is required to fetch ticket details.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTicketByIdAction(ticketId, userId, false); // false for isAdmin
      if (result.success && result.ticket && result.messages) {
        setSelectedTicket(result.ticket);
        setMessages(result.messages);
      } else {
        throw new Error(result.error || "Failed to fetch ticket details");
      }
    } catch (err) {
      handleError(err, "Error fetching ticket details");
      setSelectedTicket(null); // Clear if error
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createTicket = async (input: CreateTicketInput): Promise<SupportTicket | null> => {
    if (!userId) {
      setError("User ID is required to create a ticket.");
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await createTicketAction(userId, input);
      if (result.success && result.ticket) {
        // Prepend to list or refetch list
        setTickets(prev => [result.ticket!, ...prev]);
        setTotalTickets(prev => prev + 1);
        return result.ticket;
      } else {
        throw new Error(result.error || "Failed to create ticket");
      }
    } catch (err) {
      handleError(err, "Error creating ticket");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = async (ticketId: string, input: AddMessageInput): Promise<TicketMessage | null> => {
     if (!userId) {
      setError("User ID is required to add a message.");
      return null;
    }
    // Optimistic UI update could be added here
    // setIsLoading(true); // Or a specific message sending loading state
    setError(null);
    try {
      const result = await addMessageToTicketAction(ticketId, userId, input, false); // false for isAdminMessage
      if (result.success && result.message) {
        setMessages(prev => [...prev, result.message!]);
        // If selected ticket is the one message was added to, update its updatedAt
        if(selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(prev => prev ? {...prev, updatedAt: new Date()} : null);
        }
        // Also update in the main tickets list
        setTickets(prevTickets => prevTickets.map(t => t.id === ticketId ? {...t, updatedAt: new Date()} : t));

        return result.message;
      } else {
        throw new Error(result.error || "Failed to add message");
      }
    } catch (err) {
      handleError(err, `Error adding message to ticket ${ticketId}`);
      return null;
    } finally {
      // setIsLoading(false);
    }
  };

  const selectTicket = (ticket: SupportTicket | null) => {
    setSelectedTicket(ticket);
    if (ticket) {
        fetchTicketDetails(ticket.id);
    } else {
        setMessages([]);
    }
  };

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isLoadingMore,
    error,
    totalTickets,
    currentPage,
    fetchTickets,
    fetchTicketDetails,
    createTicket,
    addMessage,
    selectTicket,
  };
}
