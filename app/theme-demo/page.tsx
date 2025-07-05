import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";

export default function ThemeDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                🚀 Supreme Toolkit
              </Link>
              <Badge variant="secondary" className="text-xs">
                Theme Demo
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
              <Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Documentation
              </Link>
              <ThemeToggleDropdown />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            🌙 Theme Toggle
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Demo
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the smooth theme switching with our comprehensive dark mode solution.
            Try the different toggle variants and see the seamless transitions.
          </p>
        </div>

        {/* Toggle Variants */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Simple Toggle
                <ThemeToggle />
              </CardTitle>
              <CardDescription>
                Clean sun/moon toggle with smooth icon transitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Perfect for minimal interfaces where you want a simple light/dark switch.
                  Features animated icons with smooth rotation transitions.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    {`import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle />`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Dropdown Toggle
                <ThemeToggleDropdown />
              </CardTitle>
              <CardDescription>
                Advanced dropdown with Light, Dark, and System options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ideal for applications where users want full control over theme preferences,
                  including automatic system theme detection.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    {`import { ThemeToggleDropdown } from '@/components/ui/theme-toggle-dropdown';

<ThemeToggleDropdown />`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Installation */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>🚀 Installation</CardTitle>
            <CardDescription>
              Add the complete theme toggle module to your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Terminal</span>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Copy
                </Button>
              </div>
              <code className="text-green-400 text-lg block">
                npx shadcn@latest add "https://supremetoolkit.in/r/theme-toggle"
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 Beautiful Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Smooth icon animations and theme transitions that feel natural and responsive.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔒 SSR Safe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Prevents hydration mismatches with proper mounting checks and server-side rendering support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💾 Persistent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Remembers user preferences across sessions and automatically detects system theme changes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Theme Showcase */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Light Theme
            </h3>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-900">Primary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <span className="text-gray-600">Secondary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                  <span className="text-gray-500">Muted Color</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dark Theme
            </h3>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span className="text-white">Primary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-300">Secondary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                  <span className="text-gray-400">Muted Color</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Ready to Add Dark Mode?
              </CardTitle>
              <CardDescription className="text-blue-100">
                Install the theme toggle module and enhance your user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/docs/theme-toggle-module">
                    📚 View Documentation
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/">
                    🏠 Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
