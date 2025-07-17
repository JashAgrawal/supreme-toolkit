"use server";

import { FeedbackEntry } from "@/types";
import { sendFeedbackNotificationEmail } from "@/lib/mailer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getModuleConfig } from "@/config";
import { Id } from "@/convex/_generated/dataModel";

// ============================================================================
// FEEDBACK SERVER ACTIONS WITH CONVEX
// ============================================================================

// Initialize Convex client for server actions
const convexConfig = getModuleConfig('convex');
const convex = new ConvexHttpClient(convexConfig.url);

// ============================================================================
// TYPES
// ============================================================================

export interface CreateFeedbackRequest {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  rating?: number;
  email?: string;
  name?: string;
  screenshot?: string;
  browserInfo?: {
    userAgent: string;
    url: string;
    viewport: {
      width: number;
      height: number;
    };
  };
  metadata?: {
    userId?: string;
    sessionId?: string;
    version?: string;
  };
}

export interface UpdateFeedbackRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'in_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  tags?: string[];
}

// ============================================================================
// FEEDBACK OPERATIONS
// ============================================================================

/**
 * Submit new feedback
 */
export async function submitFeedback(params: CreateFeedbackRequest): Promise<{
  success: boolean;
  feedback?: FeedbackEntry;
  error?: string;
}> {
  try {
    // Validate required fields
    if (!params.title?.trim() || !params.description?.trim()) {
      return {
        success: false,
        error: 'Title and description are required',
      };
    }

    // Validate email if provided
    if (params.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // Create feedback in Convex
    const feedbackId = await convex.mutation(api.feedback.createFeedback, {
      type: params.type,
      title: params.title.trim(),
      description: params.description.trim(),
      rating: params.rating,
      email: params.email?.toLowerCase(),
      name: params.name,
      screenshot: params.screenshot,
      browserInfo: params.browserInfo,
      metadata: params.metadata,
    });

    // Get the created feedback
    const createdFeedback = await convex.query(api.feedback.getFeedback, {
      id: feedbackId
    });

    if (!createdFeedback) {
      throw new Error('Failed to retrieve created feedback');
    }

    const feedback: FeedbackEntry = {
      id: createdFeedback._id,
      type: createdFeedback.type,
      title: createdFeedback.title,
      message: createdFeedback.description, // Map description to message
      rating: createdFeedback.rating,
      email: createdFeedback.email,
      name: createdFeedback.name,
      status: createdFeedback.status,
      priority: createdFeedback.priority,
      tags: createdFeedback.tags,
      screenshot: createdFeedback.screenshot,
      metadata: createdFeedback.metadata,
      created_at: new Date(createdFeedback.createdAt),
      updated_at: new Date(createdFeedback.updatedAt),
    };

    // Send notification email
    try {
      if (params.email) {
        const emailResult = await sendFeedbackNotificationEmail(
          params.email,
          params.name || 'User',
          feedback
        );

        if (!emailResult.success) {
          console.warn('Failed to send feedback notification email:', emailResult.error);
        }
      }
    } catch (emailError) {
      console.warn('Email sending error:', emailError);
    }

    // Call the feedback submission event handler
    await onFeedbackSubmitted({
      feedback,
      userId: params.metadata?.userId,
      timestamp: new Date(),
    });

    return {
      success: true,
      feedback,
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      error: 'Failed to submit feedback',
    };
  }
}

/**
 * Get feedback by ID
 */
export async function getFeedbackById(id: string): Promise<{
  success: boolean;
  feedback?: FeedbackEntry;
  error?: string;
}> {
  try {
    const convexFeedback = await convex.query(api.feedback.getFeedback, {
      id: id as Id<"feedback">
    });

    if (!convexFeedback) {
      return {
        success: false,
        error: 'Feedback not found',
      };
    }

    const feedback: FeedbackEntry = {
      id: convexFeedback._id,
      type: convexFeedback.type,
      title: convexFeedback.title,
      message: convexFeedback.description, // Map description to message
      rating: convexFeedback.rating,
      email: convexFeedback.email,
      name: convexFeedback.name,
      status: convexFeedback.status,
      priority: convexFeedback.priority,
      tags: convexFeedback.tags,
      screenshot: convexFeedback.screenshot,
      metadata: convexFeedback.metadata,
      created_at: new Date(convexFeedback.createdAt),
      updated_at: new Date(convexFeedback.updatedAt),
    };

    return {
      success: true,
      feedback,
    };
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return {
      success: false,
      error: 'Failed to fetch feedback',
    };
  }
}

/**
 * Update feedback
 */
export async function updateFeedbackEntry(
  id: string,
  updates: UpdateFeedbackRequest,
  updatedBy: string
): Promise<{
  success: boolean;
  feedback?: FeedbackEntry;
  error?: string;
}> {
  try {
    // Get the current feedback for comparison
    const currentResult = await getFeedbackById(id);
    if (!currentResult.success || !currentResult.feedback) {
      return {
        success: false,
        error: 'Feedback not found',
      };
    }

    // Update feedback in Convex
    await convex.mutation(api.feedback.updateFeedback, {
      id: id as Id<"feedback">,
      ...updates,
      status: updates.status === 'open' ? 'new' : updates.status, // Convert 'open' to 'new'
      assignedTo: updates.assignedTo as Id<"users">,
    });

    // Get the updated feedback
    const updatedResult = await getFeedbackById(id);
    if (!updatedResult.success || !updatedResult.feedback) {
      return {
        success: false,
        error: 'Failed to retrieve updated feedback',
      };
    }

    // Call the feedback updated event handler
    await onFeedbackUpdated({
      feedback: updatedResult.feedback,
      previousFeedback: currentResult.feedback,
      updatedBy,
      timestamp: new Date(),
    });

    return {
      success: true,
      feedback: updatedResult.feedback,
    };
  } catch (error) {
    console.error('Error updating feedback:', error);
    return {
      success: false,
      error: 'Failed to update feedback',
    };
  }
}

/**
 * Delete feedback
 */
export async function deleteFeedbackEntry(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await convex.mutation(api.feedback.deleteFeedback, {
      id: id as any
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return {
      success: false,
      error: 'Failed to delete feedback',
    };
  }
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats(timeRange?: number): Promise<{
  success: boolean;
  stats?: any;
  error?: string;
}> {
  try {
    const stats = await convex.query(api.feedback.getFeedbackStats, {
      timeRange,
    });

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return {
      success: false,
      error: 'Failed to fetch feedback statistics',
    };
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Called when feedback is submitted
 */
async function onFeedbackSubmitted(params: {
  feedback: FeedbackEntry;
  userId?: string;
  timestamp: Date;
}) {
  console.log('Feedback submitted:', params.feedback.id);

  // Add your custom business logic here:

  // 1. Send notification to team
  try {
    // Example: await sendTeamNotification({
    //   type: 'new_feedback',
    //   feedback: params.feedback,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Team notification failed:', error);
  }

  // 2. Track analytics event
  try {
    // Example: await analytics.track('feedback_submitted', {
    //   feedback_id: params.feedback.id,
    //   feedback_type: params.feedback.type,
    //   rating: params.feedback.rating,
    //   user_id: params.userId,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 3. Auto-assign based on type
  try {
    if (params.feedback.type === 'bug') {
      // Example: await autoAssignToBugTeam(params.feedback.id);
    } else if (params.feedback.type === 'feature') {
      // Example: await autoAssignToProductTeam(params.feedback.id);
    }
  } catch (error) {
    console.warn('Auto-assignment failed:', error);
  }
}

/**
 * Called when feedback is updated
 */
async function onFeedbackUpdated(params: {
  feedback: FeedbackEntry;
  previousFeedback: FeedbackEntry;
  updatedBy: string;
  timestamp: Date;
}) {
  console.log('Feedback updated:', params.feedback.id);

  // Add your custom business logic here:

  // 1. Send status update email to user
  if (params.feedback.email && params.feedback.status !== params.previousFeedback.status) {
    try {
      // Example: await sendStatusUpdateEmail({
      //   email: params.feedback.email,
      //   name: params.feedback.name,
      //   feedback_id: params.feedback.id,
      //   old_status: params.previousFeedback.status,
      //   new_status: params.feedback.status,
      // });
    } catch (error) {
      console.warn('Status update email failed:', error);
    }
  }

  // 2. Track analytics
  try {
    // Example: await analytics.track('feedback_updated', {
    //   feedback_id: params.feedback.id,
    //   old_status: params.previousFeedback.status,
    //   new_status: params.feedback.status,
    //   updated_by: params.updatedBy,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 3. Send team notifications for important status changes
  if (params.feedback.status === 'completed') {
    try {
      // Example: await sendTeamNotification({
      //   type: 'feedback_completed',
      //   feedback: params.feedback,
      //   timestamp: params.timestamp,
      // });
    } catch (error) {
      console.warn('Team notification failed:', error);
    }
  }
}
