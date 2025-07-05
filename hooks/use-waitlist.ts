"use client";

import { useState } from "react";
import { getModuleConfig } from "@/config";
import { checkIfAlreadyInWaitlist, onAddWaitlist, getWaitlistEntry } from "@/actions/waitlist-actions";

interface UseWaitlistOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface WaitlistSubscribeParams {
  email: string;
  name?: string;
  referralCode?: string;
}

export function useWaitlist(options: UseWaitlistOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);

  const config = getModuleConfig('waitlist');

  const subscribe = async (params: WaitlistSubscribeParams) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use server action directly for better performance and consistency
      const result = await onAddWaitlist({
        email: params.email,
        name: params.name,
        referralCode: params.referralCode,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to join waitlist');
      }

      const responseData = {
        id: result.entry!.id,
        position: result.entry!.position,
        status: result.entry!.status,
      };

      setData(responseData);
      setSuccess(true);

      options.onSuccess?.(responseData);

      // Redirect if configured
      if (config?.successRedirect) {
        window.location.href = config.successRedirect;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
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
      const result = await getWaitlistEntry(email);

      if (!result.success) {
        throw new Error(result.error || 'Entry not found');
      }

      const responseData = {
        id: result.entry!.id,
        position: result.entry!.position,
        status: result.entry!.status,
        createdAt: result.entry!.createdAt,
      };

      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfExists = async (email: string) => {
    try {
      const result = await checkIfAlreadyInWaitlist(email);
      return result.exists;
    } catch (err) {
      console.error('Error checking waitlist:', err);
      return false;
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setData(null);
  };

  return {
    subscribe,
    checkStatus,
    checkIfExists,
    reset,
    isLoading,
    error,
    success,
    data,
  };
}