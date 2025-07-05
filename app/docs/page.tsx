import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Introduction
        </h1>
        <p className="text-xl text-muted-foreground">
          A shadcn-like CLI tool for installing complete full-stack modules with API routes, server actions, hooks, and configuration.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          What is Supreme Toolkit?
        </h2>
        <p className="leading-7">
          Supreme Toolkit is a full-stack component registry that works seamlessly with{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            shadcn/ui
          </code>{" "}
          and Next.js. It allows developers to add complete, production-ready modules with one command.
        </p>
        <p className="leading-7">
          Each module includes not only UI components but also server actions, API routes, hooks, and configuration,
          enabling instant integration of powerful features into any modern full-stack app.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Features
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Beautiful UI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pre-built components with Tailwind CSS and shadcn/ui styling that look great out of the box.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Full-Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete with API routes, server actions, and database integration for immediate functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Customizable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Event-driven server actions and configurable components you can customize for your needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Modular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Install only what you need. Each module is independent and can be used standalone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Available Modules
        </h2>
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="font-medium">🔐 Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Complete auth system with betterAuth, multiple providers, and guards
              </p>
            </div>
            <Badge>Ready</Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="font-medium">📧 Mailer</h3>
              <p className="text-sm text-muted-foreground">
                Universal email system with Resend and Nodemailer support
              </p>
            </div>
            <Badge>Ready</Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="font-medium">📝 Waitlist</h3>
              <p className="text-sm text-muted-foreground">
                Complete waitlist system with validation and email confirmations
              </p>
            </div>
            <Badge>Ready</Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="font-medium">🌙 Theme Toggle</h3>
              <p className="text-sm text-muted-foreground">
                Complete dark mode solution with theme provider and toggle variants
              </p>
            </div>
            <Badge>Ready</Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="font-medium">💳 Stripe Modules</h3>
              <p className="text-sm text-muted-foreground">
                One-time payments, subscriptions, and customer portal
              </p>
            </div>
            <Badge>Ready</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Quick Start
        </h2>
        <p className="leading-7">
          Get started by installing your first module. All modules work with the existing shadcn/ui setup.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/installation">
              Get Started
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/components/authentication">
              Browse Components
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


