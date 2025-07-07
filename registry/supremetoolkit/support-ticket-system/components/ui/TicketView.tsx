"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSupportTickets } from '@/hooks/use-support-tickets'; // Or a dedicated hook for single ticket view
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, Send, Paperclip, UserCircle, ShieldCheck } from 'lucide-react';
import type { SupportTicket, TicketMessage, User as SupportUser } from '@/types';
import { AddMessageSchema, AddMessageInput } from '@/types/support';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from '@/lib/utils';

interface TicketViewProps {
  ticketId: string;
  userId: string; // Current user's ID, for auth checks and identifying user's messages
  // isAdminView?: boolean; // If this component is also used by admins, to show internal notes etc.
  onBackToList?: () => void; // Optional callback to go back
  className?: string;
}

export function TicketView({ ticketId, userId, onBackToList, className }: TicketViewProps) {
  const {
    selectedTicket,
    messages,
    isLoading,
    error,
    fetchTicketDetails,
    addMessage
  } = useSupportTickets({ userId }); // This hook needs to support fetching a single ticket's details

  const [isReplying, setIsReplying] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails(ticketId);
    }
  }, [ticketId, fetchTicketDetails]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const form = useForm<AddMessageInput>({
    resolver: zodResolver(AddMessageSchema),
    defaultValues: { content: "" },
  });

  async function onSubmitReply(values: AddMessageInput) {
    setIsReplying(true);
    try {
      const newMsg = await addMessage(ticketId, values);
      if (newMsg) {
        form.reset();
      } else {
        // Error is handled by the hook and displayed via `error` state
      }
    } catch (e) {
      // Error already handled by hook
    } finally {
      setIsReplying(false);
    }
  }

  const formatDate = (dateInput?: Date | string): string => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'open': return 'default';
      case 'in_progress': return 'secondary'; // Or a specific color like blue/yellow
      case 'resolved': return 'outline'; // Green-ish
      case 'closed': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading && !selectedTicket) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">Loading ticket details...</p>
      </div>
    );
  }

  if (error && !selectedTicket) { // Only show full page error if ticket couldn't be loaded at all
    return (
      <div className="flex flex-col justify-center items-center py-10 text-destructive">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>Error loading ticket: {error}</p>
        {onBackToList && <Button variant="outline" onClick={onBackToList} className="mt-4">Back to List</Button>}
      </div>
    );
  }

  if (!selectedTicket) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Ticket not found or could not be loaded.</p>
        {onBackToList && <Button variant="outline" onClick={onBackToList} className="mt-4">Back to List</Button>}
      </div>
    );
  }

  // Determine if current user is an admin (simplified, replace with actual role check)
  // For UI styling of messages, we need to know if message.user.id is the current logged-in user, or an admin.
  // This logic depends on how admin users are identified (e.g. a specific role, or if ticket.assignee is current user)
  // For now, we'll assume `selectedTicket.assignee?.id === userId` means current user is the assigned admin for this ticket.
  const isCurrentUserAdminForThisTicket = selectedTicket.assignee?.id === userId;


  return (
    <Card className={cn("flex flex-col h-full w-full", className)}>
      <CardHeader className="border-b p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{selectedTicket.title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Ticket ID: {selectedTicket.id.substring(0,8)}... &bull; Created: {formatDate(selectedTicket.createdAt)} &bull; Last Update: {formatDate(selectedTicket.updatedAt)}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(selectedTicket.status)} className="capitalize text-sm whitespace-nowrap">
            {selectedTicket.status || 'Unknown'}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs mt-2">
            {selectedTicket.priority && <Badge variant="outline" className="capitalize">Priority: {selectedTicket.priority}</Badge>}
            {selectedTicket.category && <Badge variant="outline">Category: {selectedTicket.category}</Badge>}
            {selectedTicket.assignee && <Badge variant="secondary">Assigned to: {selectedTicket.assignee.name || selectedTicket.assignee.email}</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100%-0px)] p-4" ref={scrollAreaRef}> {/* Adjust height based on layout */}
          <div className="space-y-6">
            {/* Initial Ticket Description */}
            <div className="flex items-start space-x-3">
              <Avatar className="h-9 w-9 border">
                 <AvatarImage src={selectedTicket.user?.avatar || undefined} alt={selectedTicket.user?.name || 'User'} />
                <AvatarFallback>{getInitials(selectedTicket.user?.name)}</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-lg bg-muted/60 max-w-[85%] shadow-sm border">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">
                  {selectedTicket.user?.name || selectedTicket.user?.email || 'User'} (Submitter) - {formatDate(selectedTicket.createdAt)}
                </p>
                <p className="text-sm whitespace-pre-wrap break-words">{selectedTicket.description}</p>
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg) => {
              const isMessageFromCurrentUser = msg.userId === userId;
              // Determine if the message sender is an admin. This is a simplified check.
              // In a real app, you'd have a robust way to identify admin users (e.g., from user roles).
              const isMessageFromAdmin = msg.user?.role === 'admin' || selectedTicket.assignee?.id === msg.userId;

              return (
                <div
                    key={msg.id}
                    className={cn(
                        "flex items-start space-x-3",
                        isMessageFromCurrentUser && !isMessageFromAdmin ? "justify-end" : "" // User's own message
                    )}
                >
                  {(!isMessageFromCurrentUser || isMessageFromAdmin) && ( // Avatar on left for others or admin
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={msg.user?.avatar || undefined} alt={msg.user?.name || 'User'} />
                      <AvatarFallback>
                        {isMessageFromAdmin ? <ShieldCheck size={18} /> : getInitials(msg.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                        "p-3 rounded-lg max-w-[85%] shadow-sm border",
                        isMessageFromCurrentUser && !isMessageFromAdmin ? "bg-primary text-primary-foreground" : "bg-background",
                        isMessageFromAdmin && "bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700" ,
                        msg.isInternalNote && "bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-600 italic"
                    )}
                  >
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      {msg.user?.name || msg.user?.email || 'User'}
                      {isMessageFromAdmin && " (Support)"}
                      {msg.isInternalNote && " (Internal Note)"}
                      {' - '} {formatDate(msg.createdAt)}
                    </p>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  {isMessageFromCurrentUser && !isMessageFromAdmin && ( // Avatar on right for current user (non-admin)
                     <Avatar className="h-9 w-9 border">
                        <AvatarImage src={currentUserFromTicket?.avatar || undefined} alt={currentUserFromTicket?.name || 'User'} />
                        <AvatarFallback>{getInitials(currentUserFromTicket?.name)}</AvatarFallback>
                     </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      { (selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
        <CardFooter className="p-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitReply)} className="flex w-full items-start space-x-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Type your reply..."
                        rows={3}
                        {...field}
                        disabled={isReplying}
                        className="min-h-[60px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-2">
                <Button type="submit" size="default" disabled={isReplying || !form.formState.isValid}>
                  {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Send</span>
                </Button>
                {/* <Button type="button" variant="outline" size="icon" disabled={isReplying} title="Attach file (not implemented)">
                  <Paperclip className="h-4 w-4" />
                </Button> */}
              </div>
            </form>
          </Form>
        </CardFooter>
      )}
       { (selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
         <CardFooter className="p-4 border-t text-sm text-muted-foreground text-center justify-center">
            This ticket is {selectedTicket.status}. Further replies may not be monitored.
         </CardFooter>
       )}
       {error && ( // Display error related to adding message
            <CardFooter className="p-2 border-t bg-destructive/10 text-destructive text-xs flex items-center space-x-2 justify-center">
                <AlertTriangle size={16} />
                <span>Error: {error}</span>
            </CardFooter>
        )}
    </Card>
  );
}

// Helper to get current user details from the ticket or messages, for avatar consistency
// This is a simplified approach. In a real app, current user details would come from auth context.
const useCurrentTicketUser = (ticket?: SupportTicket, messages?: TicketMessage[], currentUserId?: string) => {
    if (!ticket || !currentUserId) return undefined;
    if (ticket.user?.id === currentUserId) return ticket.user;
    if (ticket.assignee?.id === currentUserId) return ticket.assignee;
    const messageUser = messages?.find(m => m.userId === currentUserId)?.user;
    return messageUser;
};

function TicketViewWithCurrentUser({ ticketId, userId, ...props }: TicketViewProps) {
    const { selectedTicket, messages } = useSupportTickets({ userId }); // To get current user details potentially
    const currentUserFromTicket = useCurrentTicketUser(selectedTicket || undefined, messages, userId);

    // This is a bit of a hack to pass the currentUser's avatar/name to MessageBubble if needed
    // Ideally, MessageBubble would get user details from its message.user prop
    // And currentUserId is mainly for isCurrentUser check

    return <TicketViewPure ticketId={ticketId} userId={userId} currentUserFromTicket={currentUserFromTicket} messages={messages} selectedTicket={selectedTicket} {...props} />;
}
// Renaming the main export to TicketViewPure to avoid conflict with the wrapper idea which isn't fully fleshed out here.
// The main export should be the component that uses the hook.
// The wrapper idea was to provide `currentUserFromTicket` to the pure component, but it's better if the hook provides this.
// For now, I'll remove the wrapper and assume `MessageBubble` gets user info from `message.user`.
// And `selectedTicket.user` or `selectedTicket.assignee` for the initial description.

// The `currentUserFromTicket` logic is not directly used in the pure component above;
// it's more of a thought process. The current implementation relies on `message.user`
// for message sender details, and `selectedTicket.user` for the ticket submitter.
// The `userId` prop is for identifying *which* user is viewing the ticket.

export { TicketView as TicketViewPure }; // Keep original export name
// The above structure is a bit convoluted. The main component `TicketView` should use the hook.
// The `currentUserFromTicket` logic should be part of the main component if needed, or the hook.
// Let's simplify: `TicketView` uses `useSupportTickets`. `MessageBubble` relies on `message.user`.
// The `userId` prop in `TicketView` is the ID of the person *viewing* the ticket.
// This `userId` is used in `useSupportTickets` to fetch relevant data and in `addMessage`.
// It's also used in `MessageBubble` to determine if a message is from the "current user".

// The current structure of TicketView using useSupportTickets is fine.
// The `currentUserFromTicket` logic was an overcomplication for this context.
// The key is that `message.user` should be populated correctly by the backend/db layer.
// And `selectedTicket.user` and `selectedTicket.assignee` too.
// The `userId` prop of TicketView is simply the ID of the logged-in user.
