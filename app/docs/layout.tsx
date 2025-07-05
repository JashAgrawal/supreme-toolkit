import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";
import { Footer } from "@/components/footer";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
    ]
  },
  {
    title: "Components",
    items: [
      { title: "Authentication", href: "/docs/components/authentication" },
      { title: "Mailer", href: "/docs/components/mailer" },
      { title: "Waitlist", href: "/docs/components/waitlist" },
      { title: "Theme Toggle", href: "/docs/components/theme-toggle" },
      { title: "One-time Payment", href: "/docs/components/one-time-payment" },
      { title: "Subscriptions", href: "/docs/components/subscriptions" },
      { title: "Customer Portal", href: "/docs/components/customer-portal" },
    ]
  },
  {
    title: "Coming Soon",
    items: [
      { title: "Realtime Chat", href: "/docs/components/chat-realtime", disabled: true },
      { title: "GPT Chatbot", href: "/docs/components/chatbot-gpt", disabled: true },
      { title: "Support Tickets", href: "/docs/components/support-tickets", disabled: true },
      { title: "Webhook Handler", href: "/docs/components/webhook-handler", disabled: true },
      { title: "Newsletter", href: "/docs/components/newsletter", disabled: true },
      { title: "Feedback Widget", href: "/docs/components/feedback-widget", disabled: true },
      { title: "Image Uploader", href: "/docs/components/image-uploader", disabled: true },
      { title: "Analytics", href: "/docs/components/analytics", disabled: true },
      { title: "Rich Text Editor", href: "/docs/components/rich-text-editor", disabled: true },
      { title: "Webhook Logger", href: "/docs/components/webhook-logger", disabled: true },
    ]
  }
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-black">
      <div className="min-h-screen bg-black">
        <Sidebar className="bg-black">
          <SidebarHeader className="border-b border-sidebar-border mt-12 bg-black">
            <div className="flex items-center gap-2 px-4 py-2">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-lg font-bold">🚀 Supreme</span>
                <Badge variant="secondary" className="text-xs">Beta</Badge>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-black">
            {sidebarItems.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild={!item.disabled} disabled={item.disabled}>
                          {item.disabled ? (
                            <span className="text-muted-foreground cursor-not-allowed">
                              {item.title} <span className="text-xs">(Coming Soon)</span>
                            </span>
                          ) : (
                            <Link href={item.href}>
                              {item.title}
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          {/* Header */}
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

          {/* Main content */}
          <main className="flex-1 p-6 pl-96">
            <div className="mx-auto max-w-4xl">
              {children}
            </div>
          </main>

          {/* Footer */}
          <div className="pl-96">
            <Footer />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
