"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Loader2 } from "lucide-react";

interface AuthSignOutProps {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSignOut?: () => void;
  showIcon?: boolean;
}

/**
 * AuthSignOut Component
 * 
 * A simple sign-out button that handles the sign-out process.
 * 
 * @example
 * <AuthSignOut>Sign Out</AuthSignOut>
 * 
 * @example
 * <AuthSignOut variant="outline" size="sm" onSignOut={() => router.push('/')}>
 *   Log Out
 * </AuthSignOut>
 */
export function AuthSignOut({
  children = "Sign Out",
  variant = "outline",
  size = "default",
  className,
  onSignOut,
  showIcon = true,
}: AuthSignOutProps) {
  const { signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="mr-2 h-4 w-4" />
      )}
      {children}
    </Button>
  );
}
