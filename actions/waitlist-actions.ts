"use server";

import { WaitlistEntry } from "@/types";
import { sendWaitlistWelcomeEmail, sendWaitlistApprovalEmail } from "@/lib/mailer";

// ============================================================================
// WAITLIST SERVER ACTIONS
// ============================================================================

// Simple in-memory store for demo - replace with your database
const waitlistStore: WaitlistEntry[] = [];
let nextId = 1;

/**
 * Check if email is already in waitlist
 */
export async function checkIfAlreadyInWaitlist(email: string): Promise<{
  exists: boolean;
  entry?: WaitlistEntry;
}> {
  try {
    // In a real app, this would query your database
    const existingEntry = waitlistStore.find(entry => entry.email.toLowerCase() === email.toLowerCase());

    return {
      exists: !!existingEntry,
      entry: existingEntry,
    };
  } catch (error) {
    console.error('Error checking waitlist:', error);
    throw new Error('Failed to check waitlist status');
  }
}

/**
 * Add user to waitlist with proper validation and email confirmation
 */
export async function onAddWaitlist(params: {
  email: string;
  name?: string;
  referralCode?: string;
}): Promise<{
  success: boolean;
  entry?: WaitlistEntry;
  error?: string;
}> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // Check if already exists
    const existingCheck = await checkIfAlreadyInWaitlist(params.email);
    if (existingCheck.exists) {
      return {
        success: false,
        error: 'This email is already on the waitlist',
        entry: existingCheck.entry,
      };
    }

    // Create new waitlist entry
    const entry: WaitlistEntry = {
      id: nextId.toString(),
      email: params.email.toLowerCase(),
      name: params.name,
      referralCode: params.referralCode,
      status: 'pending',
      position: waitlistStore.length + 1,
      createdAt: new Date(),
    };

    // Add to store (replace with database save)
    waitlistStore.push(entry);
    nextId++;

    // Send welcome email
    try {
      const emailResult = await sendWaitlistWelcomeEmail(
        entry.email,
        entry.name,
        entry.position
      );

      if (!emailResult.success) {
        console.warn('Failed to send welcome email:', emailResult.error);
        // Don't fail the signup if email fails
      }
    } catch (emailError) {
      console.warn('Email sending error:', emailError);
      // Continue with signup even if email fails
    }

    // Call the signup event handler
    await onWaitlistSignup({
      email: entry.email,
      name: entry.name,
      referralCode: entry.referralCode,
      timestamp: entry.createdAt,
    });

    return {
      success: true,
      entry,
    };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return {
      success: false,
      error: 'Failed to add to waitlist. Please try again.',
    };
  }
}

/**
 * Called when a user signs up for the waitlist
 * Customize this function with your own business logic
 */
export async function onWaitlistSignup(params: {
  email: string;
  name?: string;
  referralCode?: string;
  timestamp: Date;
}) {
  console.log('New waitlist signup:', params);

  // Add your custom business logic here:

  // 1. Track analytics event
  try {
    // Example: await analytics.track('waitlist_signup', {
    //   email: params.email,
    //   name: params.name,
    //   referralCode: params.referralCode,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 2. Add to CRM/Marketing platform
  try {
    // Example: await crm.addContact({
    //   email: params.email,
    //   name: params.name,
    //   tags: ['waitlist'],
    //   customFields: {
    //     referralCode: params.referralCode,
    //     signupDate: params.timestamp,
    //   },
    // });
  } catch (error) {
    console.warn('CRM integration failed:', error);
  }

  // 3. Send notification to team
  try {
    // Example: await slack.sendMessage({
    //   channel: '#waitlist',
    //   text: `New waitlist signup: ${params.email} ${params.name ? `(${params.name})` : ''}`,
    // });
  } catch (error) {
    console.warn('Team notification failed:', error);
  }

  // 4. Update referral counts if applicable
  if (params.referralCode) {
    try {
      // Example: await updateReferralCount(params.referralCode);
    } catch (error) {
      console.warn('Referral tracking failed:', error);
    }
  }
}

/**
 * Approve a waitlist entry
 */
export async function approveWaitlistEntry(entryId: string, approvedBy?: string): Promise<{
  success: boolean;
  entry?: WaitlistEntry;
  error?: string;
}> {
  try {
    // Find the entry
    const entryIndex = waitlistStore.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) {
      return {
        success: false,
        error: 'Waitlist entry not found',
      };
    }

    const entry = waitlistStore[entryIndex];

    // Update entry status
    entry.status = 'approved';
    entry.approvedAt = new Date();

    // Send approval email
    try {
      const emailResult = await sendWaitlistApprovalEmail(entry.email, entry.name);
      if (!emailResult.success) {
        console.warn('Failed to send approval email:', emailResult.error);
      }
    } catch (emailError) {
      console.warn('Approval email error:', emailError);
    }

    // Call the approval event handler
    await onWaitlistApproval({
      entry,
      approvedBy,
      timestamp: new Date(),
    });

    return {
      success: true,
      entry,
    };
  } catch (error) {
    console.error('Error approving waitlist entry:', error);
    return {
      success: false,
      error: 'Failed to approve waitlist entry',
    };
  }
}

/**
 * Called when a waitlist entry is approved
 */
export async function onWaitlistApproval(params: {
  entry: WaitlistEntry;
  approvedBy?: string;
  timestamp: Date;
}) {
  console.log('Waitlist entry approved:', params.entry.email);

  // Add your custom business logic here:

  // 1. Create user account automatically
  try {
    // Example: await createUserAccount({
    //   email: params.entry.email,
    //   name: params.entry.name,
    //   source: 'waitlist',
    // });
  } catch (error) {
    console.warn('User account creation failed:', error);
  }

  // 2. Add to onboarding sequence
  try {
    // Example: await addToOnboardingSequence(params.entry.email);
  } catch (error) {
    console.warn('Onboarding sequence failed:', error);
  }

  // 3. Track analytics
  try {
    // Example: await analytics.track('waitlist_approved', {
    //   email: params.entry.email,
    //   approvedBy: params.approvedBy,
    //   waitTime: params.timestamp.getTime() - params.entry.createdAt.getTime(),
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 4. Notify team
  try {
    // Example: await slack.sendMessage({
    //   channel: '#approvals',
    //   text: `Waitlist entry approved: ${params.entry.email} by ${params.approvedBy || 'system'}`,
    // });
  } catch (error) {
    console.warn('Team notification failed:', error);
  }
}

/**
 * Get waitlist entry by email
 */
export async function getWaitlistEntry(email: string): Promise<{
  success: boolean;
  entry?: WaitlistEntry;
  error?: string;
}> {
  try {
    const entry = waitlistStore.find(e => e.email.toLowerCase() === email.toLowerCase());

    if (!entry) {
      return {
        success: false,
        error: 'Entry not found',
      };
    }

    return {
      success: true,
      entry,
    };
  } catch (error) {
    console.error('Error getting waitlist entry:', error);
    return {
      success: false,
      error: 'Failed to get waitlist entry',
    };
  }
}

/**
 * Get waitlist statistics
 */
export async function getWaitlistStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}> {
  try {
    return {
      total: waitlistStore.length,
      pending: waitlistStore.filter(e => e.status === 'pending').length,
      approved: waitlistStore.filter(e => e.status === 'approved').length,
      rejected: waitlistStore.filter(e => e.status === 'rejected').length,
    };
  } catch (error) {
    console.error('Error getting waitlist stats:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
}

/**
 * Called when a waitlist entry is rejected
 */
export async function onWaitlistRejection(params: {
  entry: WaitlistEntry;
  rejectedBy?: string;
  reason?: string;
  timestamp: Date;
}) {
  console.log('Waitlist entry rejected:', params.entry.email);

  // Add your custom business logic here:

  // 1. Send rejection email (optional)
  try {
    // Example: await sendRejectionEmail(params.entry.email, params.entry.name, params.reason);
  } catch (error) {
    console.warn('Rejection email failed:', error);
  }

  // 2. Track analytics with reason
  try {
    // Example: await analytics.track('waitlist_rejected', {
    //   email: params.entry.email,
    //   rejectedBy: params.rejectedBy,
    //   reason: params.reason,
    //   waitTime: params.timestamp.getTime() - params.entry.createdAt.getTime(),
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 3. Notify team
  try {
    // Example: await slack.sendMessage({
    //   channel: '#rejections',
    //   text: `Waitlist entry rejected: ${params.entry.email} by ${params.rejectedBy || 'system'}. Reason: ${params.reason || 'Not specified'}`,
    // });
  } catch (error) {
    console.warn('Team notification failed:', error);
  }
}