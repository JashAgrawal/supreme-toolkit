/**
 * Supreme Toolkit - Better Auth Client
 * 
 * This file configures the betterAuth client for React components.
 * It provides hooks and methods for client-side authentication.
 */

import { createAuthClient } from "better-auth/react";

// Create the auth client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export commonly used methods and hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
