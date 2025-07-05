"use client";

import { useState } from "react";
import { AuthSignIn } from "@/components/ui/auth-signin";
import { AuthSignUp } from "@/components/ui/auth-signup";
import { UserProfile } from "@/components/ui/user-profile";
import { AuthSignOut } from "@/components/ui/auth-signout";
import { SignedIn, SignedOut, AuthLoading, RoleGuard } from "@/components/ui/auth-guards";
import { useAuth } from "@/hooks/use-auth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthDemoPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Loading State */}
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </AuthLoading>

      {/* Authenticated State */}
      <SignedIn>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                You are successfully authenticated with Supreme Toolkit Auth
              </p>
            </div>

            <UserProfile className="mb-8" />

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🎉 Authentication Success!</CardTitle>
                <CardDescription>
                  Your Supreme Toolkit auth module is working perfectly. Here's what happened:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    User authenticated with betterAuth
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Session created and stored
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Server action triggered
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    User profile displayed
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Role-based content */}
            <RoleGuard roles={["admin", "moderator"]}>
              <Card className="mb-8 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">🔒 Admin Only</CardTitle>
                  <CardDescription>
                    This content is only visible to admins and moderators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You have elevated permissions! This demonstrates role-based access control.
                  </p>
                </CardContent>
              </Card>
            </RoleGuard>

            {/* Component showcase */}
            <Card>
              <CardHeader>
                <CardTitle>🧩 Auth Components Demo</CardTitle>
                <CardDescription>
                  These components automatically show/hide based on auth state
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      &lt;SignedIn&gt; Component
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      ✅ You can see this because you're signed in!
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      &lt;SignedOut&gt; Component
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ❌ Hidden because you're signed in
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <AuthSignOut onSignOut={() => window.location.reload()}>
                    Sign Out & Test Components
                  </AuthSignOut>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SignedIn>

      {/* Unauthenticated State */}
      <SignedOut>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🔐 Auth Module Demo
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Complete authentication system with betterAuth
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  betterAuth
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Email/Password
                </span>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  OAuth Ready
                </span>
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                  Server Actions
                </span>
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  Auth Guards
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Auth Forms */}
              <div>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <AuthSignIn
                      onSuccess={() => {
                        // User will be redirected automatically
                      }}
                      onSignUpClick={() => setActiveTab("signup")}
                    />
                  </TabsContent>

                  <TabsContent value="signup">
                    <AuthSignUp
                      onSuccess={() => {
                        // User will be redirected automatically
                      }}
                      onSignInClick={() => setActiveTab("signin")}
                    />
                  </TabsContent>
                </Tabs>

                {/* Component showcase for unauthenticated users */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>🧩 Auth Guards Demo</CardTitle>
                    <CardDescription>
                      These components show/hide based on auth state
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                          &lt;SignedIn&gt; Component
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ❌ Hidden because you're not signed in
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          &lt;SignedOut&gt; Component
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          ✅ You can see this because you're signed out!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Information Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🚀 Installation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <code className="text-sm bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded block">
                      npx shadcn@latest add "https://supreme.jashagrawal.in/r/auth"
                    </code>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>✨ Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Email/Password authentication
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        OAuth providers (Google, GitHub)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Session management
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Event-driven server actions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Auth guard components
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Role-based access control
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🧩 Auth Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                          &lt;SignedIn&gt;
                        </code>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          Shows content only when user is authenticated
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                          &lt;SignedOut&gt;
                        </code>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          Shows content only when user is not authenticated
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                          &lt;RoleGuard&gt;
                        </code>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          Shows content based on user roles
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                          &lt;ProtectedRoute&gt;
                        </code>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          Complete route protection with redirects
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🔧 Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Configure providers in <code>config.tsx</code>:
                    </p>
                    <code className="text-xs bg-gray-900 dark:bg-gray-800 text-blue-400 p-3 rounded block">
                      {`auth: {
  providers: ['email', 'google', 'github']
}`}
                    </code>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
