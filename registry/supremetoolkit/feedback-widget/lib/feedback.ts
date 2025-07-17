import { getModuleConfig } from '@/config';
import type { 
  FeedbackEntry, 
  FeedbackStats, 
  FeedbackConfig,
  FeedbackFilters,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackWebhookPayload,
  FeedbackAnalytics
} from '../types';

// ============================================================================
// FEEDBACK SYSTEM CONFIGURATION
// ============================================================================

const config = getModuleConfig('feedback') as FeedbackConfig;

export const feedbackConfig = {
  enableScreenshots: config?.enableScreenshots ?? true,
  enableRatings: config?.enableRatings ?? true,
  enableEmailCollection: config?.enableEmailCollection ?? true,
  requireEmail: config?.requireEmail ?? false,
  enableUserIdentification: config?.enableUserIdentification ?? true,
  allowAnonymous: config?.allowAnonymous ?? true,
  webhookUrl: config?.webhookUrl,
  emailNotifications: config?.emailNotifications ?? true,
  slackWebhookUrl: config?.slackWebhookUrl,
  autoClose: config?.autoClose ?? false,
  autoCloseAfterDays: config?.autoCloseAfterDays ?? 30,
};

// ============================================================================
// IN-MEMORY STORAGE (Replace with your database)
// ============================================================================

const feedbackStore: Map<string, FeedbackEntry> = new Map();

// ============================================================================
// FEEDBACK OPERATIONS
// ============================================================================

/**
 * Generate unique feedback ID
 */
export function generateFeedbackId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `FB-${timestamp}-${random}`.toUpperCase();
}

/**
 * Create new feedback entry
 */
export async function createFeedback(
  feedbackData: CreateFeedbackRequest,
  userId?: string,
  metadata?: Record<string, any>
): Promise<FeedbackEntry> {
  const feedbackId = generateFeedbackId();
  
  const feedback: FeedbackEntry = {
    id: feedbackId,
    type: feedbackData.type,
    rating: feedbackData.rating,
    title: feedbackData.title,
    message: feedbackData.message.trim(),
    email: feedbackData.email,
    name: feedbackData.name,
    user_id: userId,
    page_url: metadata?.page_url,
    user_agent: metadata?.user_agent,
    screenshot: feedbackData.screenshot,
    metadata: {
      ...metadata,
      customFields: feedbackData.customFields,
    },
    status: 'new',
    priority: determinePriority(feedbackData),
    tags: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  feedbackStore.set(feedbackId, feedback);

  // Send notifications
  await sendFeedbackNotifications(feedback, 'feedback_created');

  return feedback;
}

/**
 * Get feedback by ID
 */
export async function getFeedback(feedbackId: string): Promise<FeedbackEntry | null> {
  return feedbackStore.get(feedbackId) || null;
}

/**
 * Get feedback with filters
 */
export async function getFeedbackList(
  filters: FeedbackFilters = {},
  userId?: string,
  userRole: 'user' | 'admin' = 'user'
): Promise<FeedbackEntry[]> {
  let feedback = Array.from(feedbackStore.values());

  // Filter by user role
  if (userRole === 'user' && userId) {
    feedback = feedback.filter(item => item.user_id === userId);
  }

  // Apply filters
  if (filters.type?.length) {
    feedback = feedback.filter(item => filters.type!.includes(item.type));
  }

  if (filters.status?.length) {
    feedback = feedback.filter(item => filters.status!.includes(item.status));
  }

  if (filters.priority?.length) {
    feedback = feedback.filter(item => filters.priority!.includes(item.priority));
  }

  if (filters.rating?.length) {
    feedback = feedback.filter(item => 
      item.rating && filters.rating!.includes(item.rating)
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    feedback = feedback.filter(item =>
      item.message.toLowerCase().includes(searchTerm) ||
      item.title?.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.date_range) {
    feedback = feedback.filter(item =>
      item.created_at >= filters.date_range!.start &&
      item.created_at <= filters.date_range!.end
    );
  }

  if (filters.user_id) {
    feedback = feedback.filter(item => item.user_id === filters.user_id);
  }

  // Sort by created_at (newest first)
  return feedback.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

/**
 * Update feedback
 */
export async function updateFeedback(
  feedbackId: string,
  updates: UpdateFeedbackRequest,
  updatedBy?: string
): Promise<FeedbackEntry | null> {
  const feedback = feedbackStore.get(feedbackId);
  if (!feedback) return null;

  const previousStatus = feedback.status;
  
  const updatedFeedback: FeedbackEntry = {
    ...feedback,
    ...updates,
    updated_at: new Date(),
  };

  // Set resolved_at when status changes to completed
  if (updates.status === 'completed' && feedback.status !== 'completed') {
    updatedFeedback.resolved_at = new Date();
  }

  feedbackStore.set(feedbackId, updatedFeedback);

  // Send notifications if status changed
  if (updates.status && updates.status !== previousStatus) {
    await sendFeedbackNotifications(updatedFeedback, 'feedback_updated');
  }

  return updatedFeedback;
}

/**
 * Delete feedback
 */
export async function deleteFeedback(feedbackId: string): Promise<boolean> {
  const feedback = feedbackStore.get(feedbackId);
  if (!feedback) return false;

  const deleted = feedbackStore.delete(feedbackId);
  
  if (deleted) {
    await sendFeedbackNotifications(feedback, 'feedback_deleted');
  }

  return deleted;
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats(
  userId?: string,
  userRole: 'user' | 'admin' = 'user'
): Promise<FeedbackStats> {
  let feedback = Array.from(feedbackStore.values());

  // Filter by user role
  if (userRole === 'user' && userId) {
    feedback = feedback.filter(item => item.user_id === userId);
  }

  const stats: FeedbackStats = {
    total: feedback.length,
    by_type: {
      bug: feedback.filter(f => f.type === 'bug').length,
      feature: feedback.filter(f => f.type === 'feature').length,
      improvement: feedback.filter(f => f.type === 'improvement').length,
      general: feedback.filter(f => f.type === 'general').length,
    },
    by_status: {
      new: feedback.filter(f => f.status === 'new').length,
      in_review: feedback.filter(f => f.status === 'in_review').length,
      planned: feedback.filter(f => f.status === 'planned').length,
      in_progress: feedback.filter(f => f.status === 'in_progress').length,
      completed: feedback.filter(f => f.status === 'completed').length,
      rejected: feedback.filter(f => f.status === 'rejected').length,
    },
    by_rating: {
      1: feedback.filter(f => f.rating === 1).length,
      2: feedback.filter(f => f.rating === 2).length,
      3: feedback.filter(f => f.rating === 3).length,
      4: feedback.filter(f => f.rating === 4).length,
      5: feedback.filter(f => f.rating === 5).length,
    },
    avg_rating: 0,
    response_rate: 0,
  };

  // Calculate average rating
  const ratedFeedback = feedback.filter(f => f.rating);
  if (ratedFeedback.length > 0) {
    const totalRating = ratedFeedback.reduce((sum, f) => sum + (f.rating || 0), 0);
    stats.avg_rating = totalRating / ratedFeedback.length;
  }

  // Calculate response rate (completed / total)
  stats.response_rate = feedback.length > 0 
    ? (stats.by_status.completed / feedback.length) * 100 
    : 0;

  return stats;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine priority based on feedback data
 */
function determinePriority(feedbackData: CreateFeedbackRequest): FeedbackEntry['priority'] {
  // Auto-assign priority based on type and rating
  if (feedbackData.type === 'bug') {
    return feedbackData.rating && feedbackData.rating <= 2 ? 'high' : 'medium';
  }
  
  if (feedbackData.type === 'feature') {
    return feedbackData.rating && feedbackData.rating >= 4 ? 'medium' : 'low';
  }
  
  return 'medium';
}

/**
 * Send feedback notifications
 */
async function sendFeedbackNotifications(
  feedback: FeedbackEntry,
  event: 'feedback_created' | 'feedback_updated' | 'feedback_deleted'
) {
  try {
    // Send webhook notification
    if (feedbackConfig.webhookUrl) {
      const payload: FeedbackWebhookPayload = {
        event,
        feedback,
        timestamp: new Date().toISOString(),
      };

      await fetch(feedbackConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }

    // Send Slack notification
    if (feedbackConfig.slackWebhookUrl && event === 'feedback_created') {
      const slackMessage = {
        text: `New feedback received: ${feedback.type}`,
        attachments: [
          {
            color: feedback.type === 'bug' ? 'danger' : 'good',
            fields: [
              {
                title: 'Type',
                value: feedback.type,
                short: true,
              },
              {
                title: 'Rating',
                value: feedback.rating ? `${feedback.rating}/5` : 'N/A',
                short: true,
              },
              {
                title: 'Message',
                value: feedback.message.substring(0, 200) + (feedback.message.length > 200 ? '...' : ''),
                short: false,
              },
            ],
          },
        ],
      };

      await fetch(feedbackConfig.slackWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      });
    }

    // Send email notification
    if (feedbackConfig.emailNotifications && feedback.email) {
      // TODO: Implement email sending
      console.log('Email notification would be sent to:', feedback.email);
    }
  } catch (error) {
    console.error('Error sending feedback notifications:', error);
  }
}

/**
 * Capture screenshot (client-side helper)
 */
export async function captureScreenshot(): Promise<string | null> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      return null;
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        stream.getTracks().forEach(track => track.stop());
        
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}
