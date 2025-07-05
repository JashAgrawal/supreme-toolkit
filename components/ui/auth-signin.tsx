"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, Github } from "lucide-react";
import { getModuleConfig } from "@/config";

interface AuthSignInProps {
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onSignUpClick?: () => void;
  className?: string;
}

export function AuthSignIn({
  title = "Sign In",
  description = "Enter your credentials to access your account",
  onSuccess,
  onSignUpClick,
  className,
}: AuthSignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signInWithProvider, isLoading, error } = useAuth();
  
  const authConfig = getModuleConfig('auth');
  const providers = authConfig?.providers || [];

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const result = await signIn({ email, password });
    if (result.success) {
      onSuccess?.();
    }
  };

  const handleProviderSignIn = async (provider: string) => {
    const result = await signInWithProvider(provider);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Sign In */}
        {providers.length > 0 && (
          <div className="space-y-2">
            {providers.includes('google') && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleProviderSignIn('google')}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            )}
            
            {providers.includes('github') && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleProviderSignIn('github')}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            )}
          </div>
        )}

        {/* Separator */}
        {providers.length > 0 && providers.includes('email') && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        )}

        {/* Email Sign In */}
        {providers.includes('email') && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button type="submit" disabled={isLoading || !email || !password} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        )}

        {/* Sign Up Link */}
        {onSignUpClick && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSignUpClick}
              disabled={isLoading}
            >
              Sign up
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
