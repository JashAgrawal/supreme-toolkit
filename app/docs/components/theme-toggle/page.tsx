"use client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function ThemeTogglePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = `npx shadcn@latest add "https://supreme.jashagrawal.in/r/theme-toggle.json"`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🌙 Theme Toggle Module</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A comprehensive dark mode solution with theme provider and multiple toggle variants.
        </p>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✨ Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Toggle</Badge>
              <div>
                <p className="font-medium">Multiple Variants</p>
                <p className="text-sm text-muted-foreground">Simple toggle and dropdown with system detection</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Provider</Badge>
              <div>
                <p className="font-medium">Theme Provider</p>
                <p className="text-sm text-muted-foreground">Complete theme management with persistence</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">System</Badge>
              <div>
                <p className="font-medium">System Detection</p>
                <p className="text-sm text-muted-foreground">Automatic system theme detection and sync</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Smooth</Badge>
              <div>
                <p className="font-medium">Smooth Transitions</p>
                <p className="text-sm text-muted-foreground">Beautiful animations and icon transitions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Installation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{installCommand}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(installCommand, 'install')}
              >
                {copiedCode === 'install' ? '✓' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">This installs:</p>
              <ul className="space-y-1 ml-4">
                <li>• ThemeProvider component for app-wide theme management</li>
                <li>• ThemeToggle component with sun/moon icons</li>
                <li>• ThemeToggleDropdown with Light/Dark/System options</li>
                <li>• Complete theme configuration and CSS variables</li>
                <li>• Required dependencies (next-themes)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
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
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>📦 What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="components" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">ThemeToggle</h4>
                  <p className="text-sm text-muted-foreground">Simple sun/moon toggle button with smooth transitions</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<ThemeToggle />`}
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">ThemeToggleDropdown</h4>
                  <p className="text-sm text-muted-foreground">Advanced dropdown with Light, Dark, and System options</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<ThemeToggleDropdown />`}
                  </code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="provider" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">ThemeProvider</h4>
                  <p className="text-sm text-muted-foreground">App-wide theme management with persistence</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    {`<ThemeProvider attribute="class" defaultTheme="system">`}
                  </code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">CSS Variables</h4>
                  <p className="text-sm text-muted-foreground">Complete dark/light theme CSS variable system</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Tailwind Configuration</h4>
                  <p className="text-sm text-muted-foreground">Pre-configured Tailwind CSS theme integration</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="provider">Provider Setup</TabsTrigger>
              <TabsTrigger value="custom">Customization</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Simple theme toggle:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}`, 'simple-toggle')}
                    >
                      {copiedCode === 'simple-toggle' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Dropdown theme toggle:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";

export default function Navigation() {
  return (
    <nav className="flex items-center gap-4">
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <ThemeToggleDropdown />
    </nav>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";

export default function Navigation() {
  return (
    <nav className="flex items-center gap-4">
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <ThemeToggleDropdown />
    </nav>
  );
}`, 'dropdown-toggle')}
                    >
                      {copiedCode === 'dropdown-toggle' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="provider" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Setting up the theme provider:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`, 'provider-setup')}
                    >
                      {copiedCode === 'provider-setup' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Using the theme hook:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useTheme } from "next-themes";

export default function CustomThemeComponent() {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>

      <div className="flex gap-2">
        <button onClick={() => setTheme("light")}>
          Light
        </button>
        <button onClick={() => setTheme("dark")}>
          Dark
        </button>
        <button onClick={() => setTheme("system")}>
          System
        </button>
      </div>
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useTheme } from "next-themes";

export default function CustomThemeComponent() {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>

      <div className="flex gap-2">
        <button onClick={() => setTheme("light")}>
          Light
        </button>
        <button onClick={() => setTheme("dark")}>
          Dark
        </button>
        <button onClick={() => setTheme("system")}>
          System
        </button>
      </div>
    </div>
  );
}`, 'custom-theme')}
                    >
                      {copiedCode === 'custom-theme' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Usage
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">1. Add the theme provider to your layout</h3>
            <div className="rounded-md bg-muted p-4">
              <code className="text-sm whitespace-pre">
{`// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2. Use the toggle components</h3>
            <div className="rounded-md bg-muted p-4">
              <code className="text-sm whitespace-pre">
{`import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div>Your Logo</div>
      <div className="flex items-center space-x-4">
        {/* Simple toggle */}
        <ThemeToggle />
        
        {/* Or dropdown toggle */}
        <ThemeToggleDropdown />
      </div>
    </nav>
  );
}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          API Reference
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">ThemeProvider</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Wrap your app with the theme provider to enable theme management.
              </p>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Prop</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Default</th>
                      <th className="p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-mono">attribute</td>
                      <td className="p-2">string</td>
                      <td className="p-2">"class"</td>
                      <td className="p-2">HTML attribute to use for theme</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">defaultTheme</td>
                      <td className="p-2">string</td>
                      <td className="p-2">"system"</td>
                      <td className="p-2">Default theme ("light" | "dark" | "system")</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">enableSystem</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">true</td>
                      <td className="p-2">Enable system theme detection</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">disableTransitionOnChange</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">false</td>
                      <td className="p-2">Disable CSS transitions during theme change</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">ThemeToggle</h3>
            <p className="text-muted-foreground mb-2">
              Simple toggle button that switches between light and dark themes.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">No props</Badge>
              <Badge variant="secondary">Animated icons</Badge>
              <Badge variant="secondary">Accessible</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">ThemeToggleDropdown</h3>
            <p className="text-muted-foreground mb-2">
              Advanced dropdown with all theme options including system preference.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">No props</Badge>
              <Badge variant="secondary">Light/Dark/System</Badge>
              <Badge variant="secondary">SSR safe</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Examples
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Custom Hook Usage</h3>
            <div className="rounded-md bg-muted p-4">
              <code className="text-sm whitespace-pre">
{`import { useTheme } from "next-themes";

export function CustomComponent() {
  const { theme, setTheme, systemTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Conditional Rendering</h3>
            <div className="rounded-md bg-muted p-4">
              <code className="text-sm whitespace-pre">
{`import { useTheme } from "next-themes";

export function ThemedContent() {
  const { theme } = useTheme();

  return (
    <div>
      {theme === 'dark' ? (
        <p>🌙 Dark mode is active</p>
      ) : (
        <p>☀️ Light mode is active</p>
      )}
    </div>
  );
}`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Theme Aware Component</h3>
            <div className="rounded-md bg-muted p-4">
              <code className="text-sm whitespace-pre">
{`import { ThemeAware } from "@/components/ui/theme-aware";

export function Example() {
  return (
    <ThemeAware
      light={<span>☀️ Light mode content</span>}
      dark={<span>🌙 Dark mode content</span>}
      system={<span>🖥️ System mode content</span>}
    />
  );
}`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">useThemeAware Hook</h3>
            <div className="rounded-md bg-muted p-4">
              <code className="text-sm whitespace-pre">
{`import { useThemeAware } from "@/components/ui/theme-aware";

export function Example() {
  const { isDark, isLight, isSystem, resolvedTheme } = useThemeAware();

  return (
    <div className={isDark ? 'bg-black text-white' : 'bg-white text-black'}>
      <p>Current theme: {resolvedTheme}</p>
      <p>Is dark: {isDark ? 'Yes' : 'No'}</p>
      <p>Is system: {isSystem ? 'Yes' : 'No'}</p>
    </div>
  );
}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
