"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { onAddWaitlist, checkIfAlreadyInWaitlist } from "@/actions/waitlist-actions";
import { WaitlistEntry } from "@/types";
import { ConvexQueryState, ConvexMutationState, createQueryState, createMutationState } from "@/lib/convex";
import { Id } from "@/convex/_generated/dataModel";

// ============================================================================
// WAITLIST HOOKS WITH CONVEX
// ============================================================================

interface UseWaitlistOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface WaitlistSubscribeParams {
  email: string;
  name?: string;
  referralCode?: string;
}

/**
 * Hook for managing waitlist operations with Convex
 */
export function useWaitlistConvex(options: UseWaitlistOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);

  const subscribe = async (params: WaitlistSubscribeParams) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await onAddWaitlist(params);
      
      if (result.success) {
        setSuccess(true);
        setData(result.entry);
        options.onSuccess?.(result.entry);
      } else {
        setError(result.error || 'Failed to join waitlist');
        options.onError?.(result.error || 'Failed to join waitlist');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await checkIfAlreadyInWaitlist(email);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
    setData(null);
  };

  return {
    subscribe,
    checkStatus,
    reset,
    isLoading,
    error,
    success,
    data,
  };
}

/**
 * Hook to get waitlist entries with real-time updates
 */
export function useWaitlistEntries(options: {
  status?: "pending" | "approved" | "rejected";
  limit?: number;
  offset?: number;
} = {}) {
  const entries = useQuery(api.waitlist.getWaitlistEntries, options);
  const isLoading = entries === undefined;
  
  return createQueryState(entries, isLoading);
}

/**
 * Hook to get waitlist statistics
 */
export function useWaitlistStats() {
  const stats = useQuery(api.waitlist.getWaitlistStats);
  const isLoading = stats === undefined;
  
  return createQueryState(stats, isLoading);
}

/**
 * Hook to get user's position in waitlist
 */
export function useWaitlistPosition(email: string) {
  const position = useQuery(api.waitlist.getWaitlistPosition, { email });
  const isLoading = position === undefined;
  
  return createQueryState(position, isLoading);
}

/**
 * Hook to search waitlist entries
 */
export function useWaitlistSearch(searchTerm: string, options: {
  status?: "pending" | "approved" | "rejected";
  limit?: number;
} = {}) {
  const results = useQuery(
    api.waitlist.searchWaitlist, 
    searchTerm ? { searchTerm, ...options } : "skip"
  );
  const isLoading = results === undefined && searchTerm !== "";
  
  return createQueryState(results, isLoading);
}

/**
 * Hook for waitlist mutations (approve, reject, update)
 */
export function useWaitlistMutations() {
  const [mutationState, setMutationState] = useState<ConvexMutationState>(
    createMutationState()
  );

  const approveMutation = useMutation(api.waitlist.approveWaitlistEntry);
  const rejectMutation = useMutation(api.waitlist.rejectWaitlistEntry);
  const updateMutation = useMutation(api.waitlist.updateWaitlistEntry);
  const deleteMutation = useMutation(api.waitlist.deleteWaitlistEntry);

  const approve = async (id: string, approvedBy?: string) => {
    setMutationState(createMutationState(true));
    
    try {
      const result = await approveMutation({ 
        id: id as Id<"waitlist">, 
        approvedBy: approvedBy as Id<"users"> 
      });
      setMutationState(createMutationState(false, null, true));
      return result;
    } catch (error) {
      setMutationState(createMutationState(false, error));
      throw error;
    }
  };

  const reject = async (id: string, rejectedBy?: string) => {
    setMutationState(createMutationState(true));
    
    try {
      const result = await rejectMutation({ 
        id: id as Id<"waitlist">, 
        rejectedBy: rejectedBy as Id<"users"> 
      });
      setMutationState(createMutationState(false, null, true));
      return result;
    } catch (error) {
      setMutationState(createMutationState(false, error));
      throw error;
    }
  };

  const update = async (id: string, updates: {
    name?: string;
    referralCode?: string;
    metadata?: any;
  }) => {
    setMutationState(createMutationState(true));
    
    try {
      const result = await updateMutation({ id: id as Id<"waitlist">, ...updates });
      setMutationState(createMutationState(false, null, true));
      return result;
    } catch (error) {
      setMutationState(createMutationState(false, error));
      throw error;
    }
  };

  const remove = async (id: string) => {
    setMutationState(createMutationState(true));
    
    try {
      const result = await deleteMutation({ id: id as Id<"waitlist"> });
      setMutationState(createMutationState(false, null, true));
      return result;
    } catch (error) {
      setMutationState(createMutationState(false, error));
      throw error;
    }
  };

  const reset = () => {
    setMutationState(createMutationState());
  };

  return {
    approve,
    reject,
    update,
    remove,
    reset,
    ...mutationState,
  };
}

/**
 * Hook to get referral statistics
 */
export function useReferralStats(referralCode: string) {
  const stats = useQuery(
    api.waitlist.getReferralStats, 
    referralCode ? { referralCode } : "skip"
  );
  const isLoading = stats === undefined && referralCode !== "";
  
  return createQueryState(stats, isLoading);
}

/**
 * Combined hook for all waitlist functionality
 */
export function useWaitlistComplete(options: UseWaitlistOptions = {}) {
  const waitlist = useWaitlistConvex(options);
  const entries = useWaitlistEntries();
  const stats = useWaitlistStats();
  const mutations = useWaitlistMutations();

  return {
    // Basic operations
    ...waitlist,
    
    // Data queries
    entries: entries.data || [],
    entriesLoading: entries.isLoading,
    entriesError: entries.error,
    
    // Statistics
    stats: stats.data,
    statsLoading: stats.isLoading,
    statsError: stats.error,
    
    // Mutations
    mutations,
  };
}
