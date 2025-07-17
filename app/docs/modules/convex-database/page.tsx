import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";

export const metadata: Metadata = {
  title: "Convex Database Integration",
  description: "Complete database solution for Supreme Toolkit using Convex",
};

export default function ConvexDatabasePage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold">Convex Database Integration</h1>
          <Badge variant="secondary">Production Ready</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete database solution for Supreme Toolkit using Convex for real-time, scalable data management.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Convex Database Integration?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Convex Database Integration provides a complete, production-ready database solution for all Supreme Toolkit modules. 
                It replaces dummy data and in-memory storage with a real-time, scalable database that automatically handles:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Real-time updates</strong> - All data changes are automatically synchronized across clients</li>
                <li><strong>Type safety</strong> - Full TypeScript support with generated types</li>
                <li><strong>Scalability</strong> - Handles thousands of concurrent users</li>
                <li><strong>ACID transactions</strong> - Ensures data consistency</li>
                <li><strong>Built-in caching</strong> - Optimized performance out of the box</li>
                <li><strong>Offline support</strong> - Works seamlessly with poor network conditions</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Supported Modules</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Waitlist Management</div>
                  <div>• Support Tickets</div>
                  <div>• Feedback Widget</div>
                  <div>• Real-time Chat</div>
                  <div>• User Management</div>
                  <div>• Analytics & Tracking</div>
                  <div>• Notifications</div>
                  <div>• File Storage</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Real-time Synchronization</h4>
                    <p className="text-sm text-muted-foreground">
                      All data changes are instantly synchronized across all connected clients without manual polling.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Type-safe Queries</h4>
                    <p className="text-sm text-muted-foreground">
                      Generated TypeScript types ensure compile-time safety for all database operations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Optimistic Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      UI updates immediately while changes are processed in the background.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Automatic Caching</h4>
                    <p className="text-sm text-muted-foreground">
                      Intelligent caching reduces database load and improves performance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Serverless Functions</h4>
                    <p className="text-sm text-muted-foreground">
                      Business logic runs in secure, scalable serverless functions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Built-in Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Seamless integration with authentication providers and user management.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Install the Convex database module</h4>
                <ScriptCopyBtn script="npx supreme-toolkit@latest add convex-database" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Install Convex CLI (if not already installed)</h4>
                <ScriptCopyBtn script="npm install -g convex" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Initialize Convex in your project</h4>
                <ScriptCopyBtn script="npx convex dev" />
                <p className="text-sm text-muted-foreground mt-2">
                  This will create a Convex project and generate the necessary configuration files.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Set up environment variables</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-mono space-y-1">
                    <div># .env.local</div>
                    <div>NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url</div>
                    <br />
                    <div># Optional: For development</div>
                    <div>CONVEX_DEPLOY_KEY=your_deploy_key</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">5. Update your app with Convex provider</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-mono space-y-1">
                    <div>// app/layout.tsx</div>
                    <div>import &#123; ConvexProvider, ConvexReactClient &#125; from &quot;convex/react&quot;;</div>
                    <br />
                    <div>const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);</div>
                    <br />
                    <div>export default function RootLayout(&#123; children &#125;) &#123;</div>
                    <div className="ml-2">return (</div>
                    <div className="ml-4">&lt;ConvexProvider client=&#123;convex&#125;&gt;</div>
                    <div className="ml-6">&#123;children&#125;</div>
                    <div className="ml-4">&lt;/ConvexProvider&gt;</div>
                    <div className="ml-2">);</div>
                    <div>&#125;</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Environment Variables</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Required</Badge>
                    <code className="text-sm">NEXT_PUBLIC_CONVEX_URL</code>
                    <span className="text-sm text-muted-foreground">- Your Convex deployment URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Optional</Badge>
                    <code className="text-sm">CONVEX_DEPLOY_KEY</code>
                    <span className="text-sm text-muted-foreground">- For automated deployments</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Module Configuration</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Update your config.tsx to use Convex for all modules:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-mono space-y-1">
                    <div>// config.tsx</div>
                    <div>export const convexConfig = &#123;</div>
                    <div className="ml-2">url: process.env.NEXT_PUBLIC_CONVEX_URL || &quot;&quot;,</div>
                    <div>&#125;;</div>
                    <br />
                    <div>export const waitlistConfig = &#123;</div>
                    <div className="ml-2">database: &apos;convex&apos;,</div>
                    <div className="ml-2">successRedirect: &apos;/thanks&apos;,</div>
                    <div className="ml-2">emailNotifications: true,</div>
                    <div>&#125;;</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The Convex integration includes a comprehensive schema that supports all Supreme Toolkit modules:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold mb-2">Core Tables</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• users - User management</li>
                    <li>• waitlist - Waitlist entries</li>
                    <li>• supportTickets - Support tickets</li>
                    <li>• supportComments - Ticket comments</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Additional Tables</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• feedback - User feedback</li>
                    <li>• chatRooms - Chat rooms</li>
                    <li>• chatMessages - Chat messages</li>
                    <li>• analytics - Event tracking</li>
                    <li>• notifications - User notifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Using Convex in Your Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Query Data</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Use the useQuery hook to fetch data with real-time updates:
                  </p>
                  <div className="text-sm font-mono">
                    <div>import &#123; useQuery &#125; from &quot;convex/react&quot;;</div>
                    <div>import &#123; api &#125; from &quot;@/convex/_generated/api&quot;;</div>
                    <br />
                    <div>const stats = useQuery(api.waitlist.getWaitlistStats);</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Mutate Data</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Use the useMutation hook to modify data:
                  </p>
                  <div className="text-sm font-mono">
                    <div>import &#123; useMutation &#125; from &quot;convex/react&quot;;</div>
                    <div>import &#123; api &#125; from &quot;@/convex/_generated/api&quot;;</div>
                    <br />
                    <div>const addToWaitlist = useMutation(api.waitlist.addToWaitlist);</div>
                    <div>await addToWaitlist(&#123; email, name &#125;);</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Real-time Updates</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    All queries automatically update when data changes:
                  </p>
                  <div className="text-sm font-mono">
                    <div>const messages = useQuery(api.chat.getMessages, &#123; roomId &#125;);</div>
                    <div>// Component re-renders when new messages arrive</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Hooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Supreme Toolkit provides custom hooks that wrap Convex functionality:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold mb-2">Waitlist Hooks</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• useWaitlistConvex</li>
                    <li>• useWaitlistEntries</li>
                    <li>• useWaitlistStats</li>
                    <li>• useWaitlistPosition</li>
                    <li>• useWaitlistMutations</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Support Hooks</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• useSupportTickets</li>
                    <li>• useTicketComments</li>
                    <li>• useTicketStats</li>
                    <li>• useTicketMutations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
