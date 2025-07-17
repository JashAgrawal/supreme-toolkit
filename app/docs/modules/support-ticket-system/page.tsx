import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptCopyBtn } from '@/components/magicui/script-copy-btn';
import Link from 'next/link';
import { Ticket, ExternalLink, Play, Database, Users } from 'lucide-react';

export default function SupportTicketSystemDocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Support Ticket System</h1>
            <p className="text-muted-foreground">Complete support ticket management with comments and admin dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Support</Badge>
          <Badge variant="outline">Advanced</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/preview/support-ticket-system">
              <Play className="h-4 w-4 mr-2" />
              Live Preview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/JashAgrawal/supreme-toolkit" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Source
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Support Ticket System?</CardTitle>
              <CardDescription>
                A comprehensive support ticket management system with ticket creation, status tracking, 
                comment system, categories, priority management, and admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✨ Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Ticket creation and management</li>
                    <li>• Status tracking (open, in progress, resolved)</li>
                    <li>• Priority levels (low, medium, high, urgent)</li>
                    <li>• Comment system with internal notes</li>
                    <li>• Category organization</li>
                    <li>• File attachments</li>
                    <li>• Admin dashboard</li>
                    <li>• Email notifications</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🛠️ Built With</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• React hooks for state management</li>
                    <li>• shadcn/ui components</li>
                    <li>• TypeScript for type safety</li>
                    <li>• date-fns for date formatting</li>
                    <li>• Server actions for backend</li>
                    <li>• API routes for integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>Install the support-ticket-system module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Install the module</h4>
                <ScriptCopyBtn script="npx supreme-toolkit@latest add support-ticket-system" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Install dependencies</h4>
                <ScriptCopyBtn script="npm install date-fns" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Configure the module</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`// config.tsx
export const moduleConfigs = {
  tickets: {
    enableFileUploads: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx'],
    enableInternalComments: true,
    enableEmailNotifications: true,
    autoAssignTickets: false,
    defaultPriority: 'medium',
  }
};`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Ticket Creation</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { TicketForm } from '@/components/support-ticket-system/ui/ticket-form';
import { useTickets } from '@/hooks/support-ticket-system/use-tickets';

export default function SupportPage() {
  const { createTicket, isLoading } = useTickets({
    userId: user.id,
    userRole: 'customer',
  });

  return (
    <TicketForm
      onSubmit={createTicket}
      isLoading={isLoading}
      categories={categories}
    />
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Admin Dashboard</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { TicketList } from '@/components/support-ticket-system/ui/ticket-list';

export default function AdminDashboard() {
  const { tickets, updateTicket } = useTickets({
    userId: admin.id,
    userRole: 'admin',
  });

  return (
    <TicketList
      tickets={tickets}
      onTicketSelect={handleTicketSelect}
      onUpdateTicket={updateTicket}
      userRole="admin"
    />
  );
}`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Component</th>
                      <th className="text-left p-2">Props</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="p-2 font-mono">TicketForm</td>
                      <td className="p-2">onSubmit, categories, isLoading</td>
                      <td className="p-2">Form for creating new tickets</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">TicketList</td>
                      <td className="p-2">tickets, onTicketSelect, userRole</td>
                      <td className="p-2">List of tickets with filtering</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">useTickets</td>
                      <td className="p-2">userId, userRole, filters</td>
                      <td className="p-2">Hook for ticket management</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Customer Support Portal</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<TicketForm
  onSubmit={createTicket}
  categories={supportCategories}
  enableFileUploads={true}
  maxFileSize={5}
  allowedFileTypes={['image/*', '.pdf']}
/>`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
