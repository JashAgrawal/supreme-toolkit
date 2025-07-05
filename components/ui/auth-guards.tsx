"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";



// ============================================================================
// AUTH GUARD COMPONENTS
// ============================================================================

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

/**
 * SignedIn Component
 * 
 * Renders children only when user is authenticated.
 * Optionally shows a fallback component when user is not authenticated.
 * 
 * @example
 * <SignedIn fallback={<div>Please sign in</div>}>
 *   <UserDashboard />
 * </SignedIn>
 */
export function SignedIn({ children, fallback = null, loading = null }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return loading ? <>{loading}</> : null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * SignedOut Component
 * 
 * Renders children only when user is NOT authenticated.
 * Optionally shows a fallback component when user is authenticated.
 * 
 * @example
 * <SignedOut fallback={<div>You are already signed in</div>}>
 *   <AuthSignIn />
 * </SignedOut>
 */
export function SignedOut({ children, fallback = null, loading = null }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return loading ? <>{loading}</> : null;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * AuthLoading Component
 * 
 * Renders children only when authentication state is loading.
 * Useful for showing loading spinners during auth checks.
 * 
 * @example
 * <AuthLoading>
 *   <div>Checking authentication...</div>
 * </AuthLoading>
 */
export function AuthLoading({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <>{children}</>;
  }

  return null;
}

/**
 * ProtectedRoute Component
 * 
 * A more comprehensive route protection component that handles
 * authentication, loading states, and redirects.
 * 
 * @example
 * <ProtectedRoute
 *   loading={<LoadingSpinner />}
 *   fallback={<AuthSignIn />}
 *   redirectTo="/login"
 * >
 *   <Dashboard />
 * </ProtectedRoute>
 */
interface ProtectedRouteProps extends AuthGuardProps {
  redirectTo?: string;
  requireRole?: string | string[];
}

export function ProtectedRoute({ 
  children, 
  fallback = null, 
  loading = null,
  redirectTo,
  requireRole
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state
  if (isLoading) {
    return loading ? <>{loading}</> : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
      return null;
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Handle role-based access
  if (requireRole && user) {
    const userRole = (user as any).role || 'user';
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];

    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

/**
 * RoleGuard Component
 * 
 * Renders children only if user has the required role(s).
 * 
 * @example
 * <RoleGuard roles={['admin', 'moderator']}>
 *   <AdminPanel />
 * </RoleGuard>
 */
interface RoleGuardProps {
  children: ReactNode;
  roles: string | string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const userRole = (user as any).role || 'user';
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * UserInfo Component
 *
 * A simple component that displays basic user information.
 * For more complex use cases, use the useAuth hook directly.
 *
 * @example
 * <UserInfo />
 */
export function UserInfo() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <span className="text-sm text-gray-500">Loading...</span>;
  }

  if (!isAuthenticated || !user) {
    return <span className="text-sm text-gray-500">Not signed in</span>;
  }

  return (
    <span className="text-sm text-gray-600 dark:text-gray-300">
      {user.name || user.email}
    </span>
  );
}
