"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  getAllTicketsAdminAction,
  getTicketByIdAction,
  updateTicketAdminAction,
  addMessageToTicketAction
} from '@/actions/support-actions';
import type { SupportTicket, TicketMessage, User as SupportUser } from '@/types';
import type { UpdateTicketAdminInput, AddMessageInput } from '@/types/support';

export interface AdminTicketFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  category?: string;
  searchQuery?: string; // Not implemented in action yet, client-side or needs backend
}

export interface UseAdminSupportTicketsReturn {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  messages: TicketMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalTickets: number;
  currentPage: number;
  filters: AdminTicketFilters;
  fetchTickets: (page?: number, newFilters?: AdminTicketFilters) => Promise<void>;
  fetchTicketDetails: (ticketId: string) => Promise<void>;
  updateTicket: (ticketId: string, updates: UpdateTicketAdminInput) => Promise<SupportTicket | null>;
  addAdminMessage: (ticketId: string, input: AddMessageInput) => Promise<TicketMessage | null>;
  selectTicket: (ticket: SupportTicket | null) => void;
  setFilters: (filters: AdminTicketFilters) => void;
}

interface UseAdminSupportTicketsProps {
  adminUserId: string; // ID of the currently authenticated admin user
  initialPage?: number;
  limitPerPage?: number;
  initialFilters?: AdminTicketFilters;
}

export function useAdminSupportTickets({
  adminUserId,
  initialPage = 1,
  limitPerPage = 10,
  initialFilters = {}
}: UseAdminSupportTicketsProps): UseAdminSupportTicketsReturn {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filters, setInternalFilters] = useState<AdminTicketFilters>(initialFilters);

  const handleError = (err: any, defaultMessage: string) => {
    const message = err instanceof Error ? err.message : defaultMessage;
    console.error(defaultMessage, err);
    setError(message);
    return message;
  };

  const fetchTickets = useCallback(async (page: number = currentPage, newFilters: AdminTicketFilters = filters) => {
    page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
    setError(null);

    try {
      // Pass adminUserId for auth check in action, if needed, though actions should be protected routes
      const result = await getAllTicketsAdminAction(page, limitPerPage, newFilters);
      if (result.success && result.tickets !== undefined && result.total !== undefined) {
        setTickets(prev => (page === 1 || newFilters !== filters) ? result.tickets! : [...prev, ...result.tickets!]);
        setTotalTickets(result.total);
        setCurrentPage(page);
        if (newFilters !== filters) setInternalFilters(newFilters); // Update internal state if new filters applied
      } else {
        throw new Error(result.error || "Failed to fetch admin tickets");
      }
    } catch (err) {
      handleError(err, "Error fetching admin tickets");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [adminUserId, currentPage, limitPerPage, filters]); // adminUserId might not be needed if action is secure

  useEffect(() => {
    fetchTickets(initialPage, initialFilters);
  }, [fetchTickets, initialPage, initialFilters]); // Initial fetch

  const fetchTicketDetails = useCallback(async (ticketId: string) => {
    setIsLoading(true); // Consider a different loading state for selected ticket
    setError(null);
    try {
      const result = await getTicketByIdAction(ticketId, adminUserId, true); // true for isAdmin
      if (result.success && result.ticket && result.messages) {
        setSelectedTicket(result.ticket);
        setMessages(result.messages);
      } else {
        throw new Error(result.error || "Failed to fetch ticket details for admin");
      }
    } catch (err) {
      handleError(err, "Error fetching ticket details for admin");
      setSelectedTicket(null);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [adminUserId]);

  const updateTicket = async (ticketId: string, updates: UpdateTicketAdminInput): Promise<SupportTicket | null> => {
    // setIsLoading(true); // Or a specific ticket update loading state
    setError(null);
    try {
      const result = await updateTicketAdminAction(ticketId, updates, adminUserId);
      if (result.success && result.ticket) {
        // Update in list and selected ticket
        setTickets(prev => prev.map(t => t.id === ticketId ? result.ticket! : t));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(result.ticket);
        }
        return result.ticket;
      } else {
        throw new Error(result.error || "Failed to update ticket");
      }
    } catch (err) {
      return handleError(err, `Error updating ticket ${ticketId}`) as any; // Will be null
    } finally {
      // setIsLoading(false);
    }
  };

  const addAdminMessage = async (ticketId: string, input: AddMessageInput): Promise<TicketMessage | null> => {
    setError(null);
    try {
      // Ensure isInternalNote can be set if it's part of AddMessageInput for admins
      const result = await addMessageToTicketAction(ticketId, adminUserId, input, true); // true for isAdminMessage
      if (result.success && result.message) {
        setMessages(prev => [...prev, result.message!]);
         if(selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(prev => prev ? {...prev, updatedAt: new Date()} : null);
        }
        setTickets(prevTickets => prevTickets.map(t => t.id === ticketId ? {...t, updatedAt: new Date()} : t));
        return result.message;
      } else {
        throw new Error(result.error || "Failed to add admin message");
      }
    } catch (err) {
      return handleError(err, `Error adding admin message to ticket ${ticketId}`) as any; // Will be null
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

  const setFiltersAndRefetch = (newFilters: AdminTicketFilters) => {
    setInternalFilters(newFilters);
    fetchTickets(1, newFilters); // Fetch first page with new filters
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
    filters,
    fetchTickets,
    fetchTicketDetails,
    updateTicket,
    addAdminMessage,
    selectTicket,
    setFilters: setFiltersAndRefetch,
  };
}
