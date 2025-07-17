"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Star, 
  Camera, 
  Bug, 
  Lightbulb, 
  TrendingUp, 
  MessageCircle,
  Upload
} from 'lucide-react';
import { captureScreenshot } from '../../lib/feedback';
import type { FeedbackFormProps, CreateFeedbackRequest, FeedbackEntry } from '../../types';
import { cn } from '@/lib/utils';

export function FeedbackForm({
  onSubmit,
  isLoading = false,
  showRating = true,
  showScreenshot = true,
  showEmailField = true,
  requireEmail = false,
  customFields = [],
  initialData = {},
  className,
}: FeedbackFormProps) {
  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    type: 'general',
    message: '',
    email: initialData.email || '',
    name: initialData.name || '',
    rating: undefined,
    screenshot: undefined,
    customFields: {},
    ...initialData,
  });

  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) return;
    if (requireEmail && !formData.email?.trim()) return;
    
    onSubmit(formData);
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleScreenshotCapture = async () => {
    setIsCapturingScreenshot(true);
    try {
      const screenshot = await captureScreenshot();
      if (screenshot) {
        setFormData(prev => ({ ...prev, screenshot }));
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldId]: value,
      },
    }));
  };

  const feedbackTypes: Array<{
    value: FeedbackEntry['type'];
    label: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      value: 'bug',
      label: 'Bug Report',
      icon: <Bug className="h-4 w-4" />,
      color: 'text-red-600',
    },
    {
      value: 'feature',
      label: 'Feature Request',
      icon: <Lightbulb className="h-4 w-4" />,
      color: 'text-blue-600',
    },
    {
      value: 'improvement',
      label: 'Improvement',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-green-600',
    },
    {
      value: 'general',
      label: 'General Feedback',
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-gray-600',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {/* Feedback Type */}
      <div className="space-y-2">
        <Label>What type of feedback is this?</Label>
        <Select
          value={formData.type}
          onValueChange={(value: FeedbackEntry['type']) => 
            setFormData(prev => ({ ...prev, type: value }))
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {feedbackTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <span className={type.color}>{type.icon}</span>
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}
      {showRating && (
        <div className="space-y-2">
          <Label>How would you rate your experience?</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                disabled={isLoading}
                className={cn(
                  "p-1 rounded transition-colors",
                  formData.rating && star <= formData.rating
                    ? "text-yellow-500"
                    : "text-gray-300 hover:text-yellow-400"
                )}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Title (optional) */}
      <div className="space-y-2">
        <Label htmlFor="title">Title (Optional)</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief summary of your feedback"
          disabled={isLoading}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Please describe your feedback in detail..."
          className="min-h-[100px]"
          disabled={isLoading}
          required
        />
      </div>

      {/* Email and Name */}
      {showEmailField && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email {requireEmail && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              disabled={isLoading}
              required={requireEmail}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {customFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          
          {field.type === 'text' && (
            <Input
              id={field.id}
              value={formData.customFields?.[field.id] || ''}
              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              disabled={isLoading}
              required={field.required}
            />
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              id={field.id}
              value={formData.customFields?.[field.id] || ''}
              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              disabled={isLoading}
              required={field.required}
            />
          )}
          
          {field.type === 'select' && (
            <Select
              value={formData.customFields?.[field.id] || ''}
              onValueChange={(value) => handleCustomFieldChange(field.id, value)}
              disabled={isLoading}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}

      {/* Screenshot */}
      {showScreenshot && (
        <div className="space-y-2">
          <Label>Screenshot (Optional)</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleScreenshotCapture}
              disabled={isLoading || isCapturingScreenshot}
            >
              <Camera className="h-4 w-4 mr-2" />
              {isCapturingScreenshot ? 'Capturing...' : 'Capture Screenshot'}
            </Button>
            
            {formData.screenshot && (
              <Badge variant="secondary" className="text-xs">
                Screenshot attached
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          !formData.message.trim() || 
          (requireEmail && !formData.email?.trim()) ||
          isLoading
        }
        className="w-full"
      >
        {isLoading ? 'Sending...' : 'Send Feedback'}
      </Button>
    </form>
  );
}
