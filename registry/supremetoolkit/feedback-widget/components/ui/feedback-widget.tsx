"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  X, 
  CheckCircle, 
  AlertCircle,
  Camera,
  Star
} from 'lucide-react';
import { useFeedback } from '../../hooks/use-feedback';
import { FeedbackForm } from './feedback-form';
import type { FeedbackWidgetProps } from '../../types';
import { cn } from '@/lib/utils';

export function FeedbackWidget({
  userId,
  userEmail,
  userName,
  position = 'bottom-right',
  theme = 'auto',
  triggerButton,
  showRating = true,
  showScreenshot = true,
  showEmailField = true,
  requireEmail = false,
  allowAnonymous = true,
  customFields = [],
  onSuccess,
  onError,
  className,
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading,
    error,
    success,
    submitFeedback,
    reset,
  } = useFeedback({
    userId,
    onSuccess: (feedback) => {
      onSuccess?.(feedback);
      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        reset();
      }, 2000);
    },
    onError,
  });

  // Position classes
  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50',
  };

  // Default trigger button
  const defaultTriggerButton = (
    <Button
      onClick={() => setIsOpen(true)}
      size="lg"
      className="rounded-full h-14 w-14 shadow-lg"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  if (!isOpen) {
    return (
      <div className={cn(positionClasses[position], className)}>
        {triggerButton || defaultTriggerButton}
      </div>
    );
  }

  return (
    <div className={cn(positionClasses[position], className)}>
      <Card className="w-96 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Feedback
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback has been submitted successfully. We'll review it and get back to you if needed.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <FeedbackForm
                onSubmit={submitFeedback}
                isLoading={isLoading}
                showRating={showRating}
                showScreenshot={showScreenshot}
                showEmailField={showEmailField}
                requireEmail={requireEmail}
                customFields={customFields}
                initialData={{
                  email: userEmail,
                  name: userName,
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
