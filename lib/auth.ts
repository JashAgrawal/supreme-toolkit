/**
 * Supreme Toolkit - Better Auth Configuration
 * 
 * This file configures betterAuth for the Supreme Toolkit auth module.
 * It provides a complete authentication system with multiple providers.
 */

import { betterAuth } from "better-auth";
import { getModuleConfig } from "@/config";
import Database from "better-sqlite3";
import path from "path";

// Get auth configuration from Supreme Toolkit config
function getAuthConfig() {
  try {
    return getModuleConfig('auth');
  } catch {
    return {
      providers: ['email'] as ('google' | 'github' | 'email')[],
      sessionDuration: 60 * 60 * 24 * 30 // 30 days
    };
  }
}

const authConfig = getAuthConfig();

// Create SQLite database for demo purposes
// In production, you'd use PostgreSQL, MySQL, or another database
const dbPath = path.join(process.cwd(), 'auth.db');
const database = new Database(dbPath);

export const auth = betterAuth({
  // Database configuration
  database,
  
  // Base URL for the application
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Secret for encryption and signing
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  
  // Social providers configuration
  socialProviders: {
    // Google OAuth
    ...(authConfig?.providers?.includes('google') && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }
    }),
    
    // GitHub OAuth
    ...(authConfig?.providers?.includes('github') && {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      }
    }),
  },
  
  // Session configuration
  session: {
    expiresIn: authConfig?.sessionDuration || 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  
  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      avatar: {
        type: "string",
        required: false,
      },
    },
  },
  
  // Advanced configuration
  advanced: {
    generateId: () => {
      // Generate a custom ID (you can use nanoid, uuid, etc.)
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
  },
  
  // Callbacks for custom logic
  callbacks: {
    async signUp({ user, account }: { user: any; account: any }) {
      // Custom logic after user signs up
      console.log(`New user signed up: ${user.email}`);
      return { user, account };
    },

    async signIn({ user, account, session }: { user: any; account: any; session: any }) {
      // Custom logic after user signs in
      console.log(`User signed in: ${user.email}`);
      return { user, account, session };
    },
  },
});

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
