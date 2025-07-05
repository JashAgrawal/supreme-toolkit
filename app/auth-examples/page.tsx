"use client";

import { SignedIn, SignedOut, RoleGuard } from "@/components/ui/auth-guards";
import { AuthSignOut } from "@/components/ui/auth-signout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AuthExamplesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧩 Auth Components Examples
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Real-world examples of using Supreme Toolkit auth components
            </p>
            <Link 
              href="/auth-demo"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Auth Demo
            </Link>
          </div>

          <div className="space-y-8">
            {/* Basic Auth Guards */}
            <Card>
              <CardHeader>
                <CardTitle>1. Basic Auth Guards</CardTitle>
                <CardDescription>
                  Show different content based on authentication status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">For Authenticated Users:</h4>
                    <SignedIn>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-green-800 dark:text-green-200">
                        ✅ Welcome! You are signed in.
                        <div className="mt-2">
                          <AuthSignOut size="sm" variant="outline">
                            Sign Out
                          </AuthSignOut>
                        </div>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-gray-600 dark:text-gray-400">
                        ❌ This content is hidden because you're not signed in.
                      </div>
                    </SignedOut>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">For Unauthenticated Users:</h4>
                    <SignedOut>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-blue-800 dark:text-blue-200">
                        👋 Please sign in to access premium features.
                        <div className="mt-2">
                          <Link 
                            href="/auth-demo"
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Sign In
                          </Link>
                        </div>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-gray-600 dark:text-gray-400">
                        ❌ This content is hidden because you're signed in.
                      </div>
                    </SignedIn>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Code Example:</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<SignedIn>
  <WelcomeDashboard />
  <AuthSignOut>Sign Out</AuthSignOut>
</SignedIn>

<SignedOut>
  <AuthSignIn />
</SignedOut>`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle>2. User Information Access</CardTitle>
                <CardDescription>
                  Access user data with the useAuth hook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Dynamic User Content:</h4>
                  {isLoading ? (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      Loading user information...
                    </div>
                  ) : isAuthenticated && user ? (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-green-800 dark:text-green-200">
                      <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Role:</strong> {(user as any).role || 'user'}</p>
                      <p><strong>ID:</strong> {user.id}</p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-blue-800 dark:text-blue-200">
                      No user information available. Please sign in.
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Code Example:</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`const { user, isAuthenticated } = useAuth();

return (
  isAuthenticated ? (
    <div>Welcome, {user.name}!</div>
  ) : (
    <div>Please sign in</div>
  )
);`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Role-Based Access */}
            <Card>
              <CardHeader>
                <CardTitle>3. Role-Based Access Control</CardTitle>
                <CardDescription>
                  Show content based on user roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Admin Only Content:</h4>
                    <RoleGuard 
                      roles={["admin"]}
                      fallback={
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-red-800 dark:text-red-200">
                          🚫 Admin access required
                        </div>
                      }
                    >
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded text-purple-800 dark:text-purple-200">
                        🔒 Admin Panel Access Granted!
                      </div>
                    </RoleGuard>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Moderator+ Content:</h4>
                    <RoleGuard 
                      roles={["admin", "moderator"]}
                      fallback={
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded text-orange-800 dark:text-orange-200">
                          🚫 Moderator access required
                        </div>
                      }
                    >
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded text-indigo-800 dark:text-indigo-200">
                        🛡️ Moderation Tools Available
                      </div>
                    </RoleGuard>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Code Example:</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<RoleGuard 
  roles={["admin", "moderator"]}
  fallback={<div>Access denied</div>}
>
  <AdminPanel />
</RoleGuard>`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Example */}
            <Card>
              <CardHeader>
                <CardTitle>4. Navigation Menu Example</CardTitle>
                <CardDescription>
                  Dynamic navigation based on auth state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                  <nav className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold">MyApp</span>
                      <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                        Home
                      </Link>
                      <SignedIn>
                        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                          Dashboard
                        </Link>
                        <RoleGuard roles={["admin"]}>
                          <Link href="/admin" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
                            Admin
                          </Link>
                        </RoleGuard>
                      </SignedIn>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <SignedOut>
                        <Link 
                          href="/auth-demo"
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Sign In
                        </Link>
                      </SignedOut>
                      
                      <SignedIn>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {user?.name || user?.email}
                        </span>
                        <AuthSignOut size="sm" variant="outline">
                          Sign Out
                        </AuthSignOut>
                      </SignedIn>
                    </div>
                  </nav>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Code Example:</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<nav>
  <SignedIn>
    <Link href="/dashboard">Dashboard</Link>
    <RoleGuard roles={["admin"]}>
      <Link href="/admin">Admin</Link>
    </RoleGuard>
    <AuthSignOut>Sign Out</AuthSignOut>
  </SignedIn>
  
  <SignedOut>
    <Link href="/login">Sign In</Link>
  </SignedOut>
</nav>`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
