"use client";

import { useState, useEffect, useCallback } from 'react';
import { getComments, addComment, updateComment, deleteComment } from '../lib/tickets';
import type { 
  TicketComment, 
  UseTicketCommentsOptions, 
  UseTicketCommentsReturn,
  CreateCommentRequest 
} from '../types';

export function useTicketComments({
  ticketId,
  userId,
  userRole = 'customer',
  onError,
}: UseTicketCommentsOptions): UseTicketCommentsReturn {
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load comments
  const loadComments = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const fetchedComments = await getComments(ticketId, userRole);
      setComments(fetchedComments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load comments';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, userRole, onError]);

  // Add new comment
  const addNewComment = useCallback(async (
    content: string,
    isInternal: boolean = false
  ) => {
    if (!userId) {
      const errorMessage = 'User ID is required to add a comment';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    if (!content.trim()) {
      const errorMessage = 'Comment content is required';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    try {
      setError(null);
      
      const commentData: CreateCommentRequest = {
        content: content.trim(),
        is_internal: isInternal,
      };
      
      const newComment = await addComment(ticketId, commentData, userId, userRole);
      
      // Add to local state
      setComments(prev => [...prev, newComment]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [ticketId, userId, userRole, onError]);

  // Update existing comment
  const updateExistingComment = useCallback(async (
    commentId: string,
    content: string
  ) => {
    if (!content.trim()) {
      const errorMessage = 'Comment content is required';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    try {
      setError(null);
      
      const updatedComment = await updateComment(ticketId, commentId, content.trim());
      
      if (updatedComment) {
        // Update local state
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId ? updatedComment : comment
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update comment';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [ticketId, onError]);

  // Delete comment
  const deleteExistingComment = useCallback(async (commentId: string) => {
    try {
      setError(null);
      
      const success = await deleteComment(ticketId, commentId);
      
      if (success) {
        // Remove from local state
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [ticketId, onError]);

  // Refresh comments
  const refreshComments = useCallback(async () => {
    await loadComments();
  }, [loadComments]);

  // Load comments on mount and when ticketId changes
  useEffect(() => {
    if (ticketId) {
      loadComments();
    }
  }, [ticketId, loadComments]);

  return {
    comments,
    isLoading,
    error,
    addComment: addNewComment,
    updateComment: updateExistingComment,
    deleteComment: deleteExistingComment,
    refreshComments,
  };
}
