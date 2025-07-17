"use client";

import { useState, useCallback } from 'react';
import { createFeedback } from '../lib/feedback';
import type { 
  FeedbackEntry, 
  UseFeedbackOptions, 
  UseFeedbackReturn, 
  CreateFeedbackRequest 
} from '../types';

export function useFeedback({
  userId,
  onSuccess,
  onError,
}: UseFeedbackOptions): UseFeedbackReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitFeedback = useCallback(async (feedbackData: CreateFeedbackRequest) => {
    if (!feedbackData.message.trim()) {
      const errorMessage = 'Feedback message is required';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Collect page metadata
      const metadata = {
        page_url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
      };

      const feedback = await createFeedback(feedbackData, userId, metadata);
      
      setSuccess(true);
      onSuccess?.(feedback);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onSuccess, onError]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    success,
    submitFeedback,
    reset,
  };
}
