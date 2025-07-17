"use server";

import { 
  createFeedback, 
  getFeedback, 
  getFeedbackList, 
  updateFeedback, 
  deleteFeedback,
  getFeedbackStats
} from '../lib/feedback';
import type { 
  FeedbackEntry, 
  FeedbackStats,
  CreateFeedbackRequest, 
  UpdateFeedbackRequest,
  FeedbackFilters 
} from '../types';

// ============================================================================
// FEEDBACK SERVER ACTIONS
// ============================================================================

/**
 * Submit new feedback
 */
export async function submitFeedback(
  feedbackData: CreateFeedbackRequest,
  userId?: string,
  metadata?: Record<string, any>
): Promise<{
  success: boolean;
  feedback?: FeedbackEntry;
  error?: string;
}> {
  try {
    if (!feedbackData.message?.trim()) {
      return {
        success: false,
        error: 'Feedback message is required',
      };
    }

    // Validate email if provided
    if (feedbackData.email && !isValidEmail(feedbackData.email)) {
      return {
        success: false,
        error: 'Please provide a valid email address',
      };
    }

    const feedback = await createFeedback(feedbackData, userId, metadata);

    // Call the feedback submission event handler
    await onFeedbackSubmitted({
      feedback,
      userId,
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
export async function getFeedbackById(
  feedbackId: string,
  userId?: string,
  userRole: 'user' | 'admin' = 'user'
): Promise<{
  success: boolean;
  feedback?: FeedbackEntry;
  error?: string;
}> {
  try {
    const feedback = await getFeedback(feedbackId);

    if (!feedback) {
      return {
        success: false,
        error: 'Feedback not found',
      };
    }

    // Check permissions
    if (userRole === 'user' && feedback.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    return {
      success: true,
      feedback,
    };
  } catch (error) {
    console.error('Error getting feedback:', error);
    return {
      success: false,
      error: 'Failed to get feedback',
    };
  }
}

/**
 * Get feedback list with filters
 */
export async function getFeedbackEntries(
  filters: FeedbackFilters,
  userId?: string,
  userRole: 'user' | 'admin' = 'user'
): Promise<{
  success: boolean;
  feedback?: FeedbackEntry[];
  error?: string;
}> {
  try {
    const feedback = await getFeedbackList(filters, userId, userRole);

    return {
      success: true,
      feedback,
    };
  } catch (error) {
    console.error('Error getting feedback list:', error);
    return {
      success: false,
      error: 'Failed to get feedback list',
    };
  }
}

/**
 * Update feedback (admin only)
 */
export async function updateFeedbackEntry(
  feedbackId: string,
  updates: UpdateFeedbackRequest,
  userId: string,
  userRole: 'user' | 'admin'
): Promise<{
  success: boolean;
  feedback?: FeedbackEntry;
  error?: string;
}> {
  try {
    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Only administrators can update feedback',
      };
    }

    const existingFeedback = await getFeedback(feedbackId);
    if (!existingFeedback) {
      return {
        success: false,
        error: 'Feedback not found',
      };
    }

    const updatedFeedback = await updateFeedback(feedbackId, updates, userId);

    if (!updatedFeedback) {
      return {
        success: false,
        error: 'Failed to update feedback',
      };
    }

    // Call the feedback update event handler
    await onFeedbackUpdated({
      feedback: updatedFeedback,
      previousFeedback: existingFeedback,
      updatedBy: userId,
      timestamp: new Date(),
    });

    return {
      success: true,
      feedback: updatedFeedback,
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
 * Delete feedback (admin only)
 */
export async function deleteFeedbackEntry(
  feedbackId: string,
  userId: string,
  userRole: 'user' | 'admin'
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (userRole !== 'admin') {
      return {
        success: false,
        error: 'Only administrators can delete feedback',
      };
    }

    const existingFeedback = await getFeedback(feedbackId);
    if (!existingFeedback) {
      return {
        success: false,
        error: 'Feedback not found',
      };
    }

    const deleted = await deleteFeedback(feedbackId);

    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete feedback',
      };
    }

    // Call the feedback deletion event handler
    await onFeedbackDeleted({
      feedback: existingFeedback,
      deletedBy: userId,
      timestamp: new Date(),
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
export async function getFeedbackStatistics(
  userId?: string,
  userRole: 'user' | 'admin' = 'user'
): Promise<{
  success: boolean;
  stats?: FeedbackStats;
  error?: string;
}> {
  try {
    const stats = await getFeedbackStats(userId, userRole);

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    return {
      success: false,
      error: 'Failed to get feedback statistics',
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// EVENT HANDLERS (Customize these for your business logic)
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

  // 1. Send notification emails to team
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

  // 4. Send confirmation email to user
  if (params.feedback.email) {
    try {
      // Example: await sendConfirmationEmail({
      //   email: params.feedback.email,
      //   name: params.feedback.name,
      //   feedback_id: params.feedback.id,
      // });
    } catch (error) {
      console.warn('Confirmation email failed:', error);
    }
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

/**
 * Called when feedback is deleted
 */
async function onFeedbackDeleted(params: {
  feedback: FeedbackEntry;
  deletedBy: string;
  timestamp: Date;
}) {
  console.log('Feedback deleted:', params.feedback.id);

  // Add your custom business logic here:

  // 1. Track analytics
  try {
    // Example: await analytics.track('feedback_deleted', {
    //   feedback_id: params.feedback.id,
    //   feedback_type: params.feedback.type,
    //   deleted_by: params.deletedBy,
    //   timestamp: params.timestamp,
    // });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }

  // 2. Archive related data
  try {
    // Example: await archiveFeedbackData(params.feedback.id);
  } catch (error) {
    console.warn('Data archiving failed:', error);
  }
}
