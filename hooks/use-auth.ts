"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { onUserSignup, onUserLogin, onUserLogout } from "@/actions/auth-actions";

interface UseAuthOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get session from authClient
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const signIn = async (params: SignInParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.email({
        email: params.email,
        password: params.password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign in failed');
      }

      // Call server action for custom logic
      if (result.data?.user) {
        await onUserLogin({
          user: result.data.user,
          provider: 'email',
          isFirstLogin: false, // You might want to track this
          timestamp: new Date(),
        });
      }

      options.onSuccess?.(result.data);
      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (params: SignUpParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        email: params.email,
        password: params.password,
        name: params.name,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Sign up failed');
      }

      // Call server action for custom logic
      if (result.data?.user) {
        await onUserSignup({
          user: result.data.user,
          provider: 'email',
          metadata: { name: params.name },
          timestamp: new Date(),
        });
      }

      options.onSuccess?.(result.data);
      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider: provider as any,
        callbackURL: window.location.origin + '/dashboard',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Social sign in failed');
      }

      // Note: For social sign-in, the callback will handle the server action
      options.onSuccess?.(result.data);
      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server action before signing out
      if (session?.user) {
        await onUserLogout({
          userId: session.user.id,
          sessionId: session.session.id,
          timestamp: new Date(),
        });
      }

      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || 'Sign out failed');
      }

      options.onSuccess?.(result.data);
      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return {
    // State
    session,
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: isLoading || sessionLoading,
    error,

    // Actions
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    reset,
  };
}
