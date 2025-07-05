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

interface AuthSignUpProps {
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onSignInClick?: () => void;
  className?: string;
}

export function AuthSignUp({
  title = "Create Account",
  description = "Enter your information to create a new account",
  onSuccess,
  onSignInClick,
  className,
}: AuthSignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUp, signInWithProvider, isLoading, error } = useAuth();
  
  const authConfig = getModuleConfig('auth');
  const providers = authConfig?.providers || [];

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    if (password !== confirmPassword) {
      return;
    }
    
    const result = await signUp({ name, email, password });
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

  const passwordsMatch = password === confirmPassword;
  const showPasswordError = confirmPassword && !passwordsMatch;

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Sign Up */}
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

        {/* Email Sign Up */}
        {providers.includes('email') && (
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              {showPasswordError && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading || !name || !email || !password || !passwordsMatch} 
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        )}

        {/* Sign In Link */}
        {onSignInClick && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSignInClick}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
