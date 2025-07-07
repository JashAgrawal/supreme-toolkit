"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Shadcn Form
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Shadcn Select
import { CreateTicketSchema, CreateTicketInput } from '@/types/support';
import { useSupportTickets } from '@/hooks/use-support-tickets'; // Assuming this hook has createTicket
import { Loader2, AlertCircle } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface CreateTicketFormProps {
  userId: string; // Current user's ID
  onTicketCreated?: (ticket: SupportTicket) => void;
  className?: string;
  defaultValues?: Partial<CreateTicketInput>;
}

export function CreateTicketForm({
  userId,
  onTicketCreated,
  className,
  defaultValues
}: CreateTicketFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If useSupportTickets hook is not solely for fetching, but also for creation:
  // const { createTicket } = useSupportTickets({ userId });
  // For simplicity, directly use the action if hook is more for data display
  const { createTicket } = useSupportTickets({ userId });


  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      priority: defaultValues?.priority || 'medium',
    },
  });

  async function onSubmit(values: CreateTicketInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const newTicket = await createTicket(values);
      if (newTicket) {
        onTicketCreated?.(newTicket);
        form.reset();
        // Optionally, show a success message or redirect
      } else {
        // Error should be caught by the hook or action and set via setError in hook
        // If createTicket directly returns an error message:
        setFormError("Failed to create ticket. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Create New Support Ticket</CardTitle>
        <CardDescription>Fill out the form below to submit a new support request.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Issue with login" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    The more detail you provide, the faster we can help.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical_issue">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Inquiry</SelectItem>
                        <SelectItem value="feature_request">Feature Request</SelectItem>
                        <SelectItem value="general_question">General Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "medium"} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {formError && (
              <div className="flex items-center p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {formError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
