import { WaitlistForm } from "@/components/ui/waitlist-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown"
import { Footer } from "@/components/footer"
import { Sparkles, Zap, Rocket, Copy, ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-black">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <div className="flex flex-1 items-center justify-between">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/"
                className="hover:text-foreground/80 text-foreground font-extrabold text-xl hover:scale-105 transition-transform"
              >
                {"{</>}"}
              </Link>
              <Link
                href="/docs"
                className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-blue-600"
              >
                Docs
              </Link>
              <Link
                href="/docs/components/authentication"
                className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-purple-600"
              >
                Components
              </Link>
              <Link
                href="/docs/installation"
                className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-green-600"
              >
                Installation
              </Link>
            </nav>
            <div className="flex items-center">
              <ThemeToggleDropdown />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The future of SaaS development is here
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build SaaS Features
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent inline-flex items-center gap-3">
              In Seconds
              <Zap className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 animate-pulse" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop reinventing the wheel. Install complete full-stack modules with one command.
            <br />
            <span className="text-blue-600 dark:text-blue-400 font-medium">UI + API + Logic = Done ✨</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/docs" className="inline-flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Get Started Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/docs">View Docs</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {["⚡ Next.js 15", "🎨 Tailwind", "🔧 TypeScript", "📦 shadcn/ui", "🔐 Auth", "💳 Payments"].map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="px-3 py-1 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Demo */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              One Command. Full Feature. 🎯
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Works with your existing shadcn/ui setup</p>
          </div>

          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 max-w-3xl mx-auto shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-2">Terminal</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="font-mono">
              <span className="text-gray-400">$ </span>
              <span className="text-green-400 text-lg">npx shadcn@latest add</span>
              <br />
              <span className="text-blue-400 ml-4">"https://supreme.jashagrawal.in/r/auth-module.json"</span>
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Installing authentication module...
              </div>
              <div className="ml-4 text-xs">✅ Components, API routes, hooks, and types added!</div>
            </div>
          </div>
        </div>

        {/* Featured Modules */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Production-Ready Modules 🚀
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Copy, paste, customize. That's it.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Auth Module */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200 dark:hover:border-blue-800 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    🔐 Authentication
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ready</Badge>
                </div>
                <CardDescription>Complete auth with Google, GitHub, email + password</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Google
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      GitHub
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Email
                    </Badge>
                  </div>
                  <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/auth-demo">Try Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200 dark:hover:border-purple-800 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                    💳 Stripe Payments
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ready</Badge>
                </div>
                <CardDescription>One-time payments, subscriptions, customer portal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Checkout
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Webhooks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Portal
                    </Badge>
                  </div>
                  <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href="/stripe-demo">Try Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Waitlist */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-green-200 dark:hover:border-green-800 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 group-hover:text-green-600 transition-colors">
                    📝 Waitlist
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ready</Badge>
                </div>
                <CardDescription>Email capture with validation and confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      Validation
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Email
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Analytics
                    </Badge>
                  </div>
                  <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="/waitlist-demo">Try Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent">
              <ChevronDown className="w-4 h-4 mr-2" />
              View All Modules
            </Button>
          </div>
        </div>

        {/* Live Demo */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Try It Live 🎮</h2>
            <p className="text-gray-600 dark:text-gray-300">This waitlist form was built with our module</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <WaitlistForm
                title="Join the Beta"
                description="Get early access to all modules!"
                placeholder="your@email.com"
                buttonText="Get Early Access"
              />

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  What happens when you submit:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Email validated & stored
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Server action triggered
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Custom logic executed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Success state shown
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Installation:
              </h3>
              <code className="text-green-400 text-sm block bg-gray-800 dark:bg-gray-700 p-4 rounded mb-4">
                npx shadcn@latest add "https://supreme.jashagrawal.in/r/waitlist-component.json"
              </code>

              <h3 className="text-white font-semibold mb-2">Usage:</h3>
              <code className="text-blue-400 text-sm block bg-gray-800 dark:bg-gray-700 p-4 rounded">
                {`import { WaitlistForm } from "@/components/ui/waitlist-form";

export default function Page() {
  return <WaitlistForm />;
}`}
              </code>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Developers Love Us 💝</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">From idea to production in minutes, not days</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Beautiful UI</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Pre-styled with Tailwind & shadcn/ui</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Full-Stack Ready</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">API routes, server actions, hooks included</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 max-w-3xl mx-auto shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl text-white flex items-center justify-center gap-3">
                Ready to Ship Faster?
                <Rocket className="w-8 h-8" />
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Join thousands of developers building better SaaS products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-lg px-8 py-6 hover:scale-105 transition-transform"
                >
                  <Link href="/docs" className="inline-flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Start Building Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all bg-transparent"
                >
                  <Link href="/docs">View All Modules</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
