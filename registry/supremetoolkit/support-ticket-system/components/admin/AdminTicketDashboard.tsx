"use client";

import React, { useState } from 'react';
import { useAdminSupportTickets, AdminTicketFilters } from '@/hooks/useAdminSupportTickets';
import { AdminTicketRow } from './AdminTicketRow';
import { TicketView } from '@/components/ui/TicketView'; // Re-use user-facing view, or make an AdminTicketView
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, AlertTriangle, Search, Filter, RefreshCcw } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface AdminTicketDashboardProps {
  adminUserId: string; // Needed for actions like assigning or logging who did what
  // Potentially pass list of admin users for assignment dropdowns
  // adminUsers: { id: string, name: string }[];
}

export function AdminTicketDashboard({ adminUserId }: AdminTicketDashboardProps) {
  const [currentFilters, setCurrentFilters] = useState<AdminTicketFilters>({});
  const {
    tickets,
    selectedTicket,
    messages, // For when a ticket is selected and viewed
    isLoading,
    error,
    totalTickets,
    currentPage,
    fetchTickets,
    fetchTicketDetails,
    selectTicket,
    // updateTicket, // For quick updates from dashboard, or use in TicketView
    // addAdminMessage, // For quick replies or notes from dashboard, or use in TicketView
    setFilters,
  } = useAdminSupportTickets({ adminUserId, initialFilters: currentFilters });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewTicket = (ticketId: string) => {
    selectTicket(tickets.find(t => t.id === ticketId) || null); // Pre-select from list for quick modal display
    // fetchTicketDetails(ticketId); // Hook's selectTicket should call this
    setIsViewModalOpen(true);
  };

  const handleFilterChange = (filterName: keyof AdminTicketFilters, value: string) => {
    const newFilters = { ...currentFilters, [filterName]: value || undefined };
    setCurrentFilters(newFilters);
    // Debounce or manual trigger for setFilters(newFilters) might be good
  };

  const applyFilters = () => {
    setFilters(currentFilters); // This will trigger fetchTickets in the hook
  };

  const clearFilters = () => {
    setCurrentFilters({});
    setFilters({});
  };

  const Pagination = () => {
    const totalPages = Math.ceil(totalTickets / 10); // Assuming limit is 10
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTickets(currentPage - 1, currentFilters)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTickets(currentPage + 1, currentFilters)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    );
  };


  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Ticket Dashboard</CardTitle>
          <CardDescription>Manage and respond to user support tickets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 border rounded-lg bg-muted/50">
            {/* <Input
              placeholder="Search by ID or title..."
              value={currentFilters.searchQuery || ""}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="lg:col-span-2"
            /> */}
            <Select value={currentFilters.status || ""} onValueChange={(val) => handleFilterChange('status', val)}>
              <SelectTrigger><SelectValue placeholder="Status: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={currentFilters.priority || ""} onValueChange={(val) => handleFilterChange('priority', val)}>
              <SelectTrigger><SelectValue placeholder="Priority: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            {/* Add more filters like category or assignedTo if needed */}
            <Button onClick={applyFilters} className="w-full" disabled={isLoading}>
              <Filter size={16} className="mr-2"/> Apply Filters
            </Button>
             <Button onClick={clearFilters} variant="outline" className="w-full" disabled={isLoading}>
              <RefreshCcw size={16} className="mr-2"/> Clear
            </Button>
          </div>

          {isLoading && tickets.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && (
            <div className="text-destructive p-4 bg-destructive/10 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" /> Error: {error}
            </div>
          )}

          {!isLoading && tickets.length === 0 && !error && (
            <p className="text-center text-muted-foreground py-10">No tickets found matching your criteria.</p>
          )}

          {tickets.length > 0 && (
            <Table>
              <TableCaption>Total Tickets: {totalTickets}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] md:w-[250px]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead className="hidden lg:table-cell">Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <AdminTicketRow key={ticket.id} ticket={ticket} onViewTicket={handleViewTicket} />
                ))}
              </TableBody>
            </Table>
          )}
          <Pagination />
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col p-0">
          {selectedTicket ? (
            <>
            <DialogHeader className="p-4 border-b">
                <DialogTitle>Ticket Details: {selectedTicket.title.substring(0,50)}...</DialogTitle>
            </DialogHeader>
            {/* Use a specialized AdminTicketView or adapt TicketView */}
            <div className="flex-1 overflow-y-auto">
              <TicketView
                ticketId={selectedTicket.id}
                userId={adminUserId} // Admin's ID for posting messages as admin
                // isAdminView={true} // Prop to enable admin-specific features in TicketView
                className="border-0 shadow-none h-full"
              />
            </div>
            </>
          ) : (
            <div className="p-6 flex justify-center items-center h-full">
                {isLoading ? <Loader2 className="h-8 w-8 animate-spin"/> : <p>Loading ticket...</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
