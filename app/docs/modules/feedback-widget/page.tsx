import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptCopyBtn } from '@/components/magicui/script-copy-btn';
import Link from 'next/link';
import { MessageCircle, ExternalLink, Play, Star } from 'lucide-react';

export default function FeedbackWidgetDocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Feedback Widget</h1>
            <p className="text-muted-foreground">User feedback collection with ratings, screenshots, and analytics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Feedback</Badge>
          <Badge variant="outline">Beginner</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/preview/feedback-widget">
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
              <CardTitle>What is Feedback Widget?</CardTitle>
              <CardDescription>
                A comprehensive feedback collection system that allows users to submit feedback with ratings, 
                screenshots, categories, and provides an admin dashboard for managing responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✨ Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Star rating system (1-5 stars)</li>
                    <li>• Screenshot capture</li>
                    <li>• Feedback categories</li>
                    <li>• Email collection</li>
                    <li>• Custom fields</li>
                    <li>• Admin dashboard</li>
                    <li>• Analytics and reporting</li>
                    <li>• Webhook notifications</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🛠️ Built With</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• React hooks for state</li>
                    <li>• shadcn/ui components</li>
                    <li>• TypeScript for safety</li>
                    <li>• Screen capture API</li>
                    <li>• Server actions</li>
                    <li>• API routes</li>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Install the module</h4>
                <ScriptCopyBtn script="npx supreme-toolkit@latest add feedback-widget" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Configure the module</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`// config.tsx
export const moduleConfigs = {
  feedback: {
    enableScreenshots: true,
    enableRatings: true,
    enableEmailCollection: true,
    requireEmail: false,
    allowAnonymous: true,
    webhookUrl: process.env.FEEDBACK_WEBHOOK_URL,
    emailNotifications: true,
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
                <h4 className="font-semibold mb-2">Simple Feedback Widget</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { FeedbackWidget } from '@/components/feedback-widget/ui/feedback-widget';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      
      <FeedbackWidget
        userId={user?.id}
        userEmail={user?.email}
        userName={user?.name}
        position="bottom-right"
        showRating={true}
        showScreenshot={true}
      />
    </div>
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
                      <th className="text-left p-2">Prop</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Default</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="p-2 font-mono">position</td>
                      <td className="p-2">string</td>
                      <td className="p-2">bottom-right</td>
                      <td className="p-2">Widget position on screen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">showRating</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">true</td>
                      <td className="p-2">Show star rating input</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">showScreenshot</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">true</td>
                      <td className="p-2">Enable screenshot capture</td>
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
                <h4 className="font-semibold mb-2">Product Feedback</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<FeedbackWidget
  userId={user.id}
  showRating={true}
  showScreenshot={true}
  customFields={[
    {
      id: 'feature',
      name: 'feature',
      type: 'select',
      label: 'Which feature?',
      options: ['Dashboard', 'Reports', 'Settings'],
      required: true,
    }
  ]}
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
