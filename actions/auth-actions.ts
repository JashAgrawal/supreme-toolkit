"use server";

// Define a more specific user type for auth actions
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// AUTH SERVER ACTIONS
// ============================================================================

/**
 * Called when a user signs up for the first time
 * Customize this function with your own business logic
 */
export async function onUserSignup(params: {
  user: AuthUser;
  provider: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}) {
  // Add your custom logic here
  console.log('New user signup:', params);
  
  // Examples of what you might want to do:
  // - Send welcome email
  // - Create user profile
  // - Track analytics event
  // - Add to CRM
  // - Set up default preferences
  // - Create initial data
  
  // Example: Log the signup
  console.log(`New user signed up: ${params.user.email} via ${params.provider}`);
  
  // Example: You could send a welcome email here
  // await sendWelcomeEmail(params.user.email, params.user.name);
  
  // Example: Track analytics
  // await trackEvent('user_signup', { 
  //   userId: params.user.id,
  //   provider: params.provider,
  //   email: params.user.email 
  // });
  
  // Example: Create user profile
  // await createUserProfile(params.user.id, {
  //   name: params.user.name,
  //   email: params.user.email,
  //   avatar: params.user.avatar,
  //   role: params.user.role || 'user',
  // });
}

/**
 * Called when a user signs in
 */
export async function onUserLogin(params: {
  user: AuthUser;
  provider: string;
  isFirstLogin: boolean;
  timestamp: Date;
}) {
  console.log('User login:', params);
  
  // Add your custom logic here:
  // - Update last login timestamp
  // - Track login analytics
  // - Check for security alerts
  // - Update user activity
  // - Send login notifications (if enabled)
  
  // Example: Log the login
  console.log(`User logged in: ${params.user.email} via ${params.provider}`);
  
  // Example: Track analytics
  // await trackEvent('user_login', {
  //   userId: params.user.id,
  //   provider: params.provider,
  //   isFirstLogin: params.isFirstLogin,
  // });
  
  // Example: Update last seen
  // await updateUserLastSeen(params.user.id, params.timestamp);
  
  // Example: Check for suspicious activity
  // await checkLoginSecurity(params.user.id, {
  //   provider: params.provider,
  //   timestamp: params.timestamp,
  // });
}

/**
 * Called when a user signs out
 */
export async function onUserLogout(params: {
  userId: string;
  sessionId: string;
  timestamp: Date;
}) {
  console.log('User logout:', params);
  
  // Add your custom logic here:
  // - Clean up session data
  // - Track logout analytics
  // - Update user activity
  // - Clear temporary data
  
  // Example: Log the logout
  console.log(`User logged out: ${params.userId}`);
  
  // Example: Track analytics
  // await trackEvent('user_logout', {
  //   userId: params.userId,
  //   sessionId: params.sessionId,
  // });
  
  // Example: Clean up user data
  // await cleanupUserSession(params.sessionId);
}

/**
 * Called when a user requests a password reset
 */
export async function onPasswordReset(params: {
  user: AuthUser;
  resetToken: string;
  timestamp: Date;
}) {
  console.log('Password reset requested:', params);
  
  // Add your custom logic here:
  // - Send password reset email
  // - Log security event
  // - Track analytics
  // - Check for abuse
  
  // Example: Log the password reset
  console.log(`Password reset requested: ${params.user.email}`);
  
  // Example: Send password reset email
  // await sendPasswordResetEmail(params.user.email, params.resetToken);
  
  // Example: Track security event
  // await trackSecurityEvent('password_reset_requested', {
  //   userId: params.user.id,
  //   email: params.user.email,
  // });
}

/**
 * Called when a user's email is verified
 */
export async function onEmailVerification(params: {
  user: AuthUser;
  email: string;
  timestamp: Date;
}) {
  console.log('Email verified:', params);
  
  // Add your custom logic here:
  // - Update user verification status
  // - Send welcome email
  // - Enable additional features
  // - Track analytics
  
  // Example: Log the email verification
  console.log(`Email verified: ${params.email}`);
  
  // Example: Send welcome email after verification
  // await sendWelcomeEmail(params.email, params.user.name);
  
  // Example: Update user status
  // await updateUserVerificationStatus(params.user.id, true);
  
  // Example: Track analytics
  // await trackEvent('email_verified', {
  //   userId: params.user.id,
  //   email: params.email,
  // });
}

/**
 * Called when a user's account is deleted
 */
export async function onUserAccountDeleted(params: {
  user: AuthUser;
  deletedBy: string; // 'user' or 'admin'
  reason?: string;
  timestamp: Date;
}) {
  console.log('User account deleted:', params);
  
  // Add your custom logic here:
  // - Clean up user data
  // - Send confirmation email
  // - Update analytics
  // - Archive user information
  // - Cancel subscriptions
  
  // Example: Log the account deletion
  console.log(`Account deleted: ${params.user.email} by ${params.deletedBy}`);
  
  // Example: Clean up user data
  // await cleanupUserData(params.user.id);
  
  // Example: Send confirmation email
  // await sendAccountDeletionConfirmation(params.user.email);
  
  // Example: Track analytics
  // await trackEvent('account_deleted', {
  //   userId: params.user.id,
  //   deletedBy: params.deletedBy,
  //   reason: params.reason,
  // });
}
