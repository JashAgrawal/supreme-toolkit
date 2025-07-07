# Support Ticket System Module

This module provides an end-to-end support ticketing system. Users can create tickets, view their status, and communicate with support agents. Admins have a dashboard to view, manage, and reply to tickets. It uses Supabase for data persistence.

## Features

-   **Ticket Creation**: Users can submit new support tickets via a form.
-   **Ticket Management**: Users can view their submitted tickets and their statuses. Admins can manage all tickets.
-   **Ticket Communication**: Users and admins can add messages/replies to tickets.
-   **Status & Priority**: Tickets have statuses (open, in_progress, resolved, closed) and priorities (low, medium, high, urgent).
-   **Admin Dashboard**: A basic dashboard for admins to view and manage tickets.
-   **API Endpoints**: For CRUD operations on tickets and messages.
-   **Server Actions**: Encapsulate business logic for ticket operations.
-   **Hooks**: For fetching and interacting with ticket data.
-   **Configuration**: Settings managed via `config.tsx`.
-   **Database**: Uses Supabase for backend, with SQL schema provided.

## Installation

```bash
npx shadcn@latest add "support-ticket-system"
# Or via the supreme toolkit URL if hosted
# npx shadcn@latest add "https://supreme.jashagrawal.in/r/support-ticket-system.json"
```

This will add necessary components, hooks, actions, API routes, and library files to your project.

## Setup

1.  **Supabase Project & Schema**:
    -   Ensure you have a Supabase project.
    -   In your Supabase project SQL Editor, run the following SQL to create tables:
        ```sql
        -- Support Tickets Table
        CREATE TABLE support_tickets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) NOT NULL, -- Assumes Supabase Auth
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT DEFAULT 'open' NOT NULL, -- open, in_progress, resolved, closed
          priority TEXT DEFAULT 'medium' NOT NULL, -- low, medium, high, urgent
          category TEXT,
          assigned_to UUID REFERENCES auth.users(id), -- Admin/Agent user ID
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          resolved_at TIMESTAMPTZ
        );
        ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
        -- Users can see their own tickets
        CREATE POLICY "Allow users to view their own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
        -- Users can create tickets for themselves
        CREATE POLICY "Allow users to create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
        -- Users can update certain fields of their open tickets (e.g., add more info - define granularly)
        CREATE POLICY "Allow users to update their open tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id AND status = 'open') WITH CHECK (auth.uid() = user_id);
        -- Admin policies (example - you might have an 'admin' role in auth.users or a separate table)
        CREATE POLICY "Allow admins to manage all tickets" ON support_tickets FOR ALL USING ( (SELECT rolname FROM pg_roles WHERE oid = auth.role()::oid) = 'service_role' OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') ); -- Adjust role check

        -- Ticket Messages Table
        CREATE TABLE ticket_messages (
          id BIGSERIAL PRIMARY KEY,
          ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
          user_id UUID REFERENCES auth.users(id) NOT NULL, -- User who sent the message
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          is_internal_note BOOLEAN DEFAULT FALSE -- For admin-only notes
          -- attachments JSONB -- For file attachments (more complex, consider Supabase Storage)
        );
        ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
        -- Users can see messages on their own tickets (if not internal)
        CREATE POLICY "Allow users to view messages on their tickets" ON ticket_messages FOR SELECT USING (
          EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()) AND is_internal_note = FALSE
        );
        -- Admins can see all messages on any ticket
        CREATE POLICY "Allow admins to view all messages" ON ticket_messages FOR SELECT USING ( (SELECT rolname FROM pg_roles WHERE oid = auth.role()::oid) = 'service_role' OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') ); -- Adjust role check
        -- Users can add messages to their own open/in_progress tickets
        CREATE POLICY "Allow users to add messages to their tickets" ON ticket_messages FOR INSERT WITH CHECK (
          EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid() AND (status = 'open' OR status = 'in_progress'))
        );
        -- Admins can add messages (including internal notes) to any ticket
        CREATE POLICY "Allow admins to add messages" ON ticket_messages FOR INSERT WITH CHECK ( (SELECT rolname FROM pg_roles WHERE oid = auth.role()::oid) = 'service_role' OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') ); -- Adjust role check


        -- Enable Realtime (Optional, if you want live updates on dashboards/ticket views)
        -- ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
        -- ALTER PUBLICATION supabase_realtime ADD TABLE ticket_messages;
        ```
    -   **Important**: Customize RLS policies based on your application's user roles and security needs. The admin role check is a placeholder.

2.  **Environment Variables**: Ensure your Supabase URL and Anon Key are in `.env`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    # SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key (Needed for admin actions that bypass RLS)
    ```

3.  **Configuration (`config.tsx`)**:
    ```ts
    export const toolkitConfig: ToolkitConfig = {
      // ... other configs
      supabase: { /* ... */ },
      support: {
        defaultPriority: 'medium',
        // autoAssignment: false, // Future feature
        emailNotifications: false, // Future feature: integrate with mailer
      },
    };
    ```

## Usage

### User-Facing Components

-   **Create Ticket**:
    ```tsx
    import { CreateTicketForm } from '@/components/ui/create-ticket-form';
    // ...
    <CreateTicketForm
      userId="current-user-id"
      onTicketCreated={(ticket) => console.log('Ticket created:', ticket.id)}
    />
    ```
-   **View User's Tickets**:
    ```tsx
    import { TicketList } from '@/components/ui/ticket-list';
    // ...
    <TicketList userId="current-user-id" />
    ```
-   **View Single Ticket**:
    ```tsx
    import { TicketView } from '@/components/ui/ticket-view';
    // ...
    <TicketView ticketId="ticket-uuid" userId="current-user-id" />
    ```

### Admin Components

-   **Admin Dashboard**:
    ```tsx
    import { AdminTicketDashboard } from '@/components/admin/admin-ticket-dashboard';
    // ...
    // This component would typically be on a protected admin route
    <AdminTicketDashboard />
    ```

### Hooks

-   `useSupportTickets`: For fetching and managing tickets (e.g., for the user's list or viewing a single ticket).
-   `useAdminSupportTickets`: For admin dashboard functionalities like fetching all tickets, filtering, assigning, etc.

### Server Actions (`actions/support-actions.ts`)

Contains functions like:
-   `createTicket`
-   `addMessageToTicket`
-   `updateTicketStatus`
-   `assignTicketToAdmin`
-   `getTicketById`
-   `getTicketsForUser`
-   `getAllTicketsAdmin`

These actions are used by the UI components and hooks, and interact with `lib/support-db.ts`.

## Important Notes
-   **Authentication & Authorization**: This module assumes an existing auth system. User IDs are crucial. Admin functionalities need to be protected by appropriate role checks.
-   **Database Setup**: The provided SQL is a starting point. You may need to add indexes, further tables (e.g., for categories, attachments), or adjust RLS policies.
-   **Admin Role**: The SQL policies use a placeholder for admin role checks (`EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')`). Adapt this to your user profile and role management system. You might use Supabase's built-in roles or custom claims in JWTs.
-   **File Attachments**: Not included in the basic version but can be added using Supabase Storage.
-   **Email Notifications**: Not included but can be integrated by calling mailer functions from server actions.
```
