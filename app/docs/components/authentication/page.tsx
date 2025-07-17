"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function AuthenticationPage() {
const [copiedCode, setCopiedCode] = useState<string | null>(null);

   const copyToClipboard = (text: string, codeName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeName);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1000);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">🔐 Authentication Module</h1>
        <p className="text-base md:text-lg text-muted-foreground mt-2">
          Complete authentication system with betterAuth, multiple providers, and auth guards for Next.js applications.
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
              <Badge variant="secondary" className="mt-0.5">Auth</Badge>
              <div>
                <p className="font-medium">Multiple Providers</p>
                <p className="text-sm text-muted-foreground">Google, GitHub, and email/password authentication</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Guards</Badge>
              <div>
                <p className="font-medium">Auth Guards</p>
                <p className="text-sm text-muted-foreground">SignedIn, SignedOut, and RoleGuard components</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Session</Badge>
              <div>
                <p className="font-medium">Session Management</p>
                <p className="text-sm text-muted-foreground">Secure session handling with betterAuth</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Hooks</Badge>
              <div>
                <p className="font-medium">React Hooks</p>
                <p className="text-sm text-muted-foreground">useAuth hook for easy state management</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">Actions</Badge>
              <div>
                <p className="font-medium">Server Actions</p>
                <p className="text-sm text-muted-foreground">Customizable auth event handlers</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">UI</Badge>
              <div>
                <p className="font-medium">Pre-built Components</p>
                <p className="text-sm text-muted-foreground">Sign-in, sign-up, and user profile components</p>
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
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: "npx shadcn@latest add \"https://supremetoolkit.in/r/auth-module\"",
                yarn: "yarn dlx shadcn@latest add \"https://supremetoolkit.in/r/auth-module\"",
                pnpm: "pnpm dlx shadcn@latest add \"https://supremetoolkit.in/r/auth-module\""
              }}
            />

            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              showMultiplePackageOptions={false}
              commandMap={{
                cli: "npx @better-auth/cli@latest generate"
              }}
            />

            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              showMultiplePackageOptions={false}
              commandMap={{
                cli: "npx @better-auth/cli@latest migrate"
              }}
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">This installs:</p>
              <ul className="space-y-1 ml-4">
                <li>• Authentication configuration and client setup</li>
                <li>• Sign-in, sign-up, and user profile components</li>
                <li>• Auth guards (SignedIn, SignedOut, RoleGuard)</li>
                <li>• useAuth hook for state management</li>
                <li>• Server actions for auth events</li>
                <li>• API routes for authentication endpoints</li>
                <li>• Required dependencies (better-auth, better-sqlite3)</li>
              </ul>
            </div>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="config">Config</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">AuthSignIn</h4>
                  <p className="text-sm text-muted-foreground">Complete sign-in form with provider buttons</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">AuthSignUp</h4>
                  <p className="text-sm text-muted-foreground">User registration form with validation</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">SignedIn / SignedOut</h4>
                  <p className="text-sm text-muted-foreground">Conditional rendering based on auth state</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">RoleGuard</h4>
                  <p className="text-sm text-muted-foreground">Role-based access control component</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">UserProfile</h4>
                  <p className="text-sm text-muted-foreground">User profile display and management</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hooks" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useAuth</h4>
                  <p className="text-sm text-muted-foreground">Complete auth state and methods</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ user, isAuthenticated, signIn, signUp, signOut }`} = useAuth()
                  </code>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">useSession</h4>
                  <p className="text-sm text-muted-foreground">Direct session access from betterAuth</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                    const {`{ data: session, isPending }`} = useSession()
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onUserSignup</h4>
                  <p className="text-sm text-muted-foreground">Triggered when new user registers</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onUserLogin</h4>
                  <p className="text-sm text-muted-foreground">Triggered on successful login</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onUserLogout</h4>
                  <p className="text-sm text-muted-foreground">Triggered when user signs out</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">onPasswordReset</h4>
                  <p className="text-sm text-muted-foreground">Triggered on password reset request</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="config" className="space-y-3">
              <div className="grid gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">betterAuth Configuration</h4>
                  <p className="text-sm text-muted-foreground">Complete auth server setup</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">Auth Client</h4>
                  <p className="text-sm text-muted-foreground">React client configuration</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium">API Routes</h4>
                  <p className="text-sm text-muted-foreground">Next.js API route handlers</p>
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
              <TabsTrigger value="basic">Basic Setup</TabsTrigger>
              <TabsTrigger value="guards">Auth Guards</TabsTrigger>
              <TabsTrigger value="hooks">Using Hooks</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Configure providers in config.tsx:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`export const toolkitConfig: ToolkitConfig = {
  auth: {
    providers: ['email', 'google', 'github'],
    sessionDuration: 60 * 60 * 24 * 30, // 30 days
  },
  // ... other config
};`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`export const toolkitConfig: ToolkitConfig = {
  auth: {
    providers: ['email', 'google', 'github'],
    sessionDuration: 60 * 60 * 24 * 30, // 30 days
  },
  // ... other config
};`, 'config')}
                    >
                      {copiedCode === 'config' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Add environment variables:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# .env.local
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`# .env.local
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret`, 'env')}
                    >
                      {copiedCode === 'env' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Use auth components:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { AuthSignIn } from '@/components/ui/auth-signin';
import { AuthSignUp } from '@/components/ui/auth-signup';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <AuthSignIn />
      {/* or */}
      <AuthSignUp />
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { AuthSignIn } from '@/components/ui/auth-signin';
import { AuthSignUp } from '@/components/ui/auth-signup';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <AuthSignIn />
      {/* or */}
      <AuthSignUp />
    </div>
  );
}`, 'components')}
                    >
                      {copiedCode === 'components' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guards" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">SignedIn / SignedOut Components:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { SignedIn, SignedOut } from '@/components/ui/auth-guards';
import { AuthSignIn } from '@/components/ui/auth-signin';
import { UserProfile } from '@/components/ui/user-profile';

export default function HomePage() {
  return (
    <div>
      <SignedIn>
        <UserProfile />
        <p>Welcome back! You are signed in.</p>
      </SignedIn>

      <SignedOut>
        <AuthSignIn />
        <p>Please sign in to continue.</p>
      </SignedOut>
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { SignedIn, SignedOut } from '@/components/ui/auth-guards';
import { AuthSignIn } from '@/components/ui/auth-signin';
import { UserProfile } from '@/components/ui/user-profile';

export default function HomePage() {
  return (
    <div>
      <SignedIn>
        <UserProfile />
        <p>Welcome back! You are signed in.</p>
      </SignedIn>

      <SignedOut>
        <AuthSignIn />
        <p>Please sign in to continue.</p>
      </SignedOut>
    </div>
  );
}`, 'guards')}
                    >
                      {copiedCode === 'guards' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Role-based Access Control:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { RoleGuard } from '@/components/ui/auth-guards';

export default function AdminPage() {
  return (
    <div>
      <RoleGuard
        roles={['admin']}
        fallback={<p>Access denied. Admin role required.</p>}
      >
        <AdminPanel />
      </RoleGuard>

      <RoleGuard roles={['admin', 'moderator']}>
        <ModeratorTools />
      </RoleGuard>
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { RoleGuard } from '@/components/ui/auth-guards';

export default function AdminPage() {
  return (
    <div>
      <RoleGuard
        roles={['admin']}
        fallback={<p>Access denied. Admin role required.</p>}
      >
        <AdminPanel />
      </RoleGuard>

      <RoleGuard roles={['admin', 'moderator']}>
        <ModeratorTools />
      </RoleGuard>
    </div>
  );
}`, 'roles')}
                    >
                      {copiedCode === 'roles' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hooks" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Using the useAuth hook:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useAuth } from '@/hooks/use-auth';

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    isLoading,
    signOut
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name || user?.email}!</h1>
      <button onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useAuth } from '@/hooks/use-auth';

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    isLoading,
    signOut
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name || user?.email}!</h1>
      <button onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}`, 'useauth')}
                    >
                      {copiedCode === 'useauth' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Custom sign-in with error handling:</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function CustomSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isLoading, error } = useAuth({
    onSuccess: () => {
      console.log('Signed in successfully!');
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function CustomSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isLoading, error } = useAuth({
    onSuccess: () => {
      console.log('Signed in successfully!');
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}`, 'custom')}
                    >
                      {copiedCode === 'custom' ? '✓' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>🌟 Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Environment Variables</h4>
              <p className="text-sm text-muted-foreground">Always use strong, unique secrets in production and never commit them to version control.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Email Verification</h4>
              <p className="text-sm text-muted-foreground">Enable email verification in production by setting requireEmailVerification: true in auth config.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Database</h4>
              <p className="text-sm text-muted-foreground">Replace SQLite with PostgreSQL or MySQL for production applications.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Error Handling</h4>
              <p className="text-sm text-muted-foreground">Always handle authentication errors gracefully and provide clear feedback to users.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Security</h4>
              <p className="text-sm text-muted-foreground">Implement rate limiting, CSRF protection, and secure session management for production apps.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
