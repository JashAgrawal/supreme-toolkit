import { WaitlistForm } from "@/components/ui/waitlist-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-50 w-full border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
              <div className="flex flex-1 items-center justify-between">
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                  <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60 font-extrabold text-xl">
                    {"{</>}"}
                  </Link>
                  <Link href="/docs" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Docs
                  </Link>
                  <Link href="/docs/components/authentication" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Components
                  </Link>
                  <Link href="/docs/installation" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Installation
                  </Link>
                </nav>
                <div className="flex items-center">
                  <ThemeToggleDropdown />
                </div>
              </div>
            </div>
          </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build SaaS Features
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A shadcn-like CLI tool for installing complete full-stack modules with UI components,
            API routes, server actions, and hooks. Build production-ready SaaS features instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/docs">
                🚀 Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/docs">
                📚 View Docs
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Badge variant="secondary" className="px-3 py-1">⚡ Next.js 15</Badge>
            <Badge variant="secondary" className="px-3 py-1">🎨 Tailwind CSS</Badge>
            <Badge variant="secondary" className="px-3 py-1">🔧 TypeScript</Badge>
            <Badge variant="secondary" className="px-3 py-1">📦 shadcn/ui</Badge>
            <Badge variant="secondary" className="px-3 py-1">🔐 betterAuth</Badge>
            <Badge variant="secondary" className="px-3 py-1">💳 Stripe</Badge>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Install Any Module in One Command
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Works seamlessly with your existing shadcn/ui setup
            </p>
          </div>

          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Terminal</span>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Copy
              </Button>
            </div>
            <code className="text-green-400 text-lg block">
              npx shadcn@latest add "https://supreme.jashagrawal.in/r/auth-module.json"
            </code>
          </div>
        </div>

        {/* Available Modules */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Available Modules
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Production-ready modules for common SaaS features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Auth Module */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🔐 Authentication
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Complete auth system with betterAuth, multiple providers, and guards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Google OAuth</Badge>
                    <Badge variant="secondary" className="text-xs">GitHub OAuth</Badge>
                    <Badge variant="secondary" className="text-xs">Email/Password</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/auth-module.json"
                  </code>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/auth-demo">View Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mailer Module */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📧 Universal Mailer
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Auto-detecting email system with Resend and Nodemailer support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Resend</Badge>
                    <Badge variant="secondary" className="text-xs">Nodemailer</Badge>
                    <Badge variant="secondary" className="text-xs">Templates</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/mailer-module.json"
                  </code>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/docs/mailer">View Docs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Waitlist Module */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📝 Waitlist
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Complete waitlist system with validation and email confirmations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Validation</Badge>
                    <Badge variant="secondary" className="text-xs">Duplicates</Badge>
                    <Badge variant="secondary" className="text-xs">Email Confirm</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/waitlist-module.json"
                  </code>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/waitlist-demo">View Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Theme Toggle Module */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🌙 Theme Toggle
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Complete dark mode solution with theme provider and toggle variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Dark Mode</Badge>
                    <Badge variant="secondary" className="text-xs">System Theme</Badge>
                    <Badge variant="secondary" className="text-xs">SSR Safe</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/theme-toggle.json"
                  </code>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/theme-demo">View Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stripe Modules Row */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              💳 Stripe Payment Modules
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Modular payment solutions - install only what you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* One-Time Payment */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    💳 One-Time Payment
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Simple Stripe integration for one-time payments and purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Checkout</Badge>
                    <Badge variant="secondary" className="text-xs">Webhooks</Badge>
                    <Badge variant="secondary" className="text-xs">Pay Button</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/one-time-payment.json"
                  </code>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/docs/payments">View Docs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🔄 Subscriptions
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Complete subscription management with pricing and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Pricing</Badge>
                    <Badge variant="secondary" className="text-xs">Cancel</Badge>
                    <Badge variant="secondary" className="text-xs">Reactivate</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/subscriptions.json"
                  </code>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/docs/subscriptions">View Docs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Portal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🏪 Customer Portal
                  </CardTitle>
                  <Badge variant="default">Ready</Badge>
                </div>
                <CardDescription>
                  Self-service portal for billing and subscription management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Self-Service</Badge>
                    <Badge variant="secondary" className="text-xs">Billing</Badge>
                    <Badge variant="secondary" className="text-xs">Invoices</Badge>
                  </div>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    npx shadcn@latest add "https://supreme.jashagrawal.in/r/customer-portal.json"
                  </code>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/docs/customer-portal">View Docs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Coming Soon Modules */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Coming Soon Modules
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              More powerful modules in development - stay tuned!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Realtime Chat */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    💬 Realtime Chat
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Realtime chat system with Supabase or Pusher backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Realtime</Badge>
                    <Badge variant="outline" className="text-xs">Supabase</Badge>
                    <Badge variant="outline" className="text-xs">Pusher</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Full-featured chat with typing indicators, message history, and user presence
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GPT Chatbot */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🤖 GPT Chatbot
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  AI chatbot widget with OpenAI integration and backend logic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">OpenAI</Badge>
                    <Badge variant="outline" className="text-xs">Widget</Badge>
                    <Badge variant="outline" className="text-xs">Streaming</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Embeddable AI assistant with conversation history and custom prompts
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Tickets */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🎫 Support Tickets
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  End-to-end ticketing interface with API and management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Ticketing</Badge>
                    <Badge variant="outline" className="text-xs">Management</Badge>
                    <Badge variant="outline" className="text-xs">API</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Complete support system with ticket creation, assignment, and tracking
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Handler */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🔗 Webhook Handler
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Generic webhook endpoint with logger UI and event processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Webhooks</Badge>
                    <Badge variant="outline" className="text-xs">Logger</Badge>
                    <Badge variant="outline" className="text-xs">Events</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Receive, log, and process webhooks from any third-party service
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Subscription */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📰 Newsletter
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Email capture with MailerLite/Postmark integration and automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">MailerLite</Badge>
                    <Badge variant="outline" className="text-xs">Postmark</Badge>
                    <Badge variant="outline" className="text-xs">Automation</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Newsletter signup with automated email sequences and analytics
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Widget */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    💭 Feedback Widget
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  User feedback form with webhook/email integration and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Feedback</Badge>
                    <Badge variant="outline" className="text-xs">Analytics</Badge>
                    <Badge variant="outline" className="text-xs">Widget</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Collect user feedback with customizable forms and reporting
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Uploader */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🖼️ Image Uploader
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Drag/drop image uploader with Cloudinary/S3 backend integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Cloudinary</Badge>
                    <Badge variant="outline" className="text-xs">S3</Badge>
                    <Badge variant="outline" className="text-xs">Drag & Drop</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Upload images with progress indicators, validation, and cloud storage
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Snippet */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📊 Analytics
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Drop-in analytics with server and client-side event logging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Events</Badge>
                    <Badge variant="outline" className="text-xs">Tracking</Badge>
                    <Badge variant="outline" className="text-xs">Dashboard</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Custom analytics solution with event tracking and reporting
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rich Text Editor */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    ✍️ Rich Text Editor
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Notion-like rich text editor powered by Tiptap with collaborative features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Tiptap</Badge>
                    <Badge variant="outline" className="text-xs">Collaborative</Badge>
                    <Badge variant="outline" className="text-xs">Rich Text</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Advanced text editor with formatting, collaboration, and export features
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Logger */}
            <Card className="hover:shadow-lg transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🔍 Webhook Logger
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Log and inspect third-party webhooks with debugging interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Logging</Badge>
                    <Badge variant="outline" className="text-xs">Debug</Badge>
                    <Badge variant="outline" className="text-xs">Inspect</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Debug webhook payloads with detailed logging and inspection tools
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

          {/* Live Demo Section */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <WaitlistForm
                title="Join Our Beta"
                description="Be among the first to experience Supreme Toolkit's full potential!"
                placeholder="Enter your email to get early access"
                buttonText="Get Early Access"
              />

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What happens when you submit:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Email is validated and stored
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Server action is triggered
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Custom business logic runs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Success state is displayed
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Installation Command:</h3>
              <code className="text-green-400 text-sm block bg-gray-800 dark:bg-gray-700 p-4 rounded">
                npx shadcn@latest add "https://supreme.jashagrawal.in/r/waitlist-component.json"
              </code>

              <h3 className="text-white font-semibold mb-2 mt-6">Usage:</h3>
              <code className="text-blue-400 text-sm block bg-gray-800 dark:bg-gray-700 p-4 rounded">
                {`import { WaitlistForm } from "@/components/ui/waitlist-form";

export default function Page() {
  return <WaitlistForm />;
}`}
              </code>
            </div>
          </div>

          {/* Demo Links */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🚀 Try More Modules
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth-demo"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🔐 Auth Module Demo
              </Link>
              <Link
                href="/auth-examples"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🧩 Auth Components Examples
              </Link>
              <Link
                href="/waitlist-demo"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📧 Waitlist Module Demo
              </Link>
              <Link
                href="/stripe-demo"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                💳 Stripe Modules Demo
              </Link>
              <Link
                href="/theme-demo"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🌙 Theme Toggle Demo
              </Link>
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium">
                💬 Chat Module (Coming Soon)
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium">
                🤖 GPT Chatbot (Coming Soon)
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium">
                🎫 Support Tickets (Coming Soon)
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium">
                🖼️ Image Uploader (Coming Soon)
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium">
                ✍️ Rich Text Editor (Coming Soon)
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                🎨 Beautiful UI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Pre-built components with Tailwind CSS and shadcn/ui styling
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                ⚡ Full-Stack
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete with API routes, server actions, and database integration
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                🔧 Customizable
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Event-driven server actions you can customize for your needs
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl text-white">
                  Ready to Build Faster?
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Start building production-ready SaaS features in minutes, not days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
                    <Link href="/docs">
                      🚀 Get Started Now
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
                    <Link href="/docs">
                      📚 Read Documentation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      {/* </div> */}

      <Footer />
    </div>
  );
}
