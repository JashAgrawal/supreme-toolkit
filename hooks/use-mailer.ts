"use client";

import { useState } from "react";
import { sendEmail, getMailerInfo, sendTestEmail } from "@/lib/mailer";
import { onEmailSent, onEmailDelivered, onEmailFailed } from "@/actions/mailer-actions";

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

interface UseMailerOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useMailer(options: UseMailerOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const send = async (emailOptions: EmailOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server action before sending
      await onEmailSent({
        to: emailOptions.to,
        subject: emailOptions.subject,
        timestamp: new Date(),
        metadata: {
          from: emailOptions.from,
          hasAttachments: !!emailOptions.attachments?.length,
          recipientCount: Array.isArray(emailOptions.to) ? emailOptions.to.length : 1,
        },
      });

      const result = await sendEmail(emailOptions);

      if (result.success) {
        // Call success server action
        await onEmailDelivered({
          to: emailOptions.to,
          subject: emailOptions.subject,
          messageId: result.id,
          timestamp: new Date(),
          metadata: {
            from: emailOptions.from,
            mailerType: getMailerInfo().type,
          },
        });

        setLastResult(result);
        options.onSuccess?.(result);
        return { success: true, data: result };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      
      // Call error server action
      await onEmailFailed({
        to: emailOptions.to,
        subject: emailOptions.subject,
        error: errorMessage,
        timestamp: new Date(),
        metadata: {
          from: emailOptions.from,
          mailerType: getMailerInfo().type,
        },
      });

      setError(errorMessage);
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const sendTest = async (to: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendTestEmail(to);

      if (result.success) {
        setLastResult(result);
        options.onSuccess?.(result);
        return { success: true, data: result };
      } else {
        throw new Error(result.error || 'Failed to send test email');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const getInfo = () => {
    return getMailerInfo();
  };

  return {
    // State
    isLoading,
    error,
    lastResult,
    
    // Methods
    send,
    sendTest,
    getInfo,
    
    // Mailer info
    mailerInfo: getMailerInfo(),
  };
}
