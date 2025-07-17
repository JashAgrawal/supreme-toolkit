// ============================================================================
// FEEDBACK WIDGET TYPES
// ============================================================================

export interface FeedbackEntry {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'general';
  rating?: number; // 1-5 stars
  title?: string;
  message: string;
  email?: string;
  name?: string;
  user_id?: string;
  page_url?: string;
  user_agent?: string;
  screenshot?: string;
  metadata?: Record<string, any>;
  status: 'new' | 'in_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  admin_notes?: string;
}

export interface FeedbackStats {
  total: number;
  by_type: {
    bug: number;
    feature: number;
    improvement: number;
    general: number;
  };
  by_status: {
    new: number;
    in_review: number;
    planned: number;
    in_progress: number;
    completed: number;
    rejected: number;
  };
  by_rating: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  avg_rating: number;
  response_rate: number;
}

export interface FeedbackConfig {
  enableScreenshots?: boolean;
  enableRatings?: boolean;
  enableEmailCollection?: boolean;
  requireEmail?: boolean;
  enableUserIdentification?: boolean;
  allowAnonymous?: boolean;
  webhookUrl?: string;
  emailNotifications?: boolean;
  slackWebhookUrl?: string;
  customFields?: FeedbackCustomField[];
  autoClose?: boolean;
  autoCloseAfterDays?: number;
}

export interface FeedbackCustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'number' | 'url';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select/multiselect
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseFeedbackOptions {
  userId?: string;
  onSuccess?: (feedback: FeedbackEntry) => void;
  onError?: (error: string) => void;
}

export interface UseFeedbackReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  submitFeedback: (feedback: CreateFeedbackRequest) => Promise<void>;
  reset: () => void;
}

export interface UseFeedbackListOptions {
  userId?: string;
  userRole?: 'user' | 'admin';
  type?: FeedbackEntry['type'];
  status?: FeedbackEntry['status'];
  onError?: (error: string) => void;
}

export interface UseFeedbackListReturn {
  feedback: FeedbackEntry[];
  isLoading: boolean;
  error: string | null;
  updateFeedback: (id: string, updates: Partial<FeedbackEntry>) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  refreshFeedback: () => Promise<void>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface FeedbackWidgetProps {
  userId?: string;
  userEmail?: string;
  userName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  theme?: 'light' | 'dark' | 'auto';
  triggerButton?: React.ReactNode;
  showRating?: boolean;
  showScreenshot?: boolean;
  showEmailField?: boolean;
  requireEmail?: boolean;
  allowAnonymous?: boolean;
  customFields?: FeedbackCustomField[];
  onSuccess?: (feedback: FeedbackEntry) => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface FeedbackFormProps {
  onSubmit: (feedback: CreateFeedbackRequest) => void;
  isLoading?: boolean;
  showRating?: boolean;
  showScreenshot?: boolean;
  showEmailField?: boolean;
  requireEmail?: boolean;
  customFields?: FeedbackCustomField[];
  initialData?: Partial<CreateFeedbackRequest>;
  className?: string;
}

export interface FeedbackListProps {
  feedback: FeedbackEntry[];
  onUpdateFeedback?: (id: string, updates: Partial<FeedbackEntry>) => void;
  onDeleteFeedback?: (id: string) => void;
  userRole?: 'user' | 'admin';
  className?: string;
}

export interface FeedbackItemProps {
  feedback: FeedbackEntry;
  onUpdate?: (updates: Partial<FeedbackEntry>) => void;
  onDelete?: () => void;
  userRole?: 'user' | 'admin';
  className?: string;
}

export interface FeedbackStatsProps {
  stats: FeedbackStats;
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateFeedbackRequest {
  type: FeedbackEntry['type'];
  rating?: number;
  title?: string;
  message: string;
  email?: string;
  name?: string;
  screenshot?: string; // base64 encoded image
  customFields?: Record<string, any>;
}

export interface UpdateFeedbackRequest {
  status?: FeedbackEntry['status'];
  priority?: FeedbackEntry['priority'];
  tags?: string[];
  admin_notes?: string;
}

export interface FeedbackFilters {
  type?: FeedbackEntry['type'][];
  status?: FeedbackEntry['status'][];
  priority?: FeedbackEntry['priority'][];
  rating?: number[];
  date_range?: {
    start: Date;
    end: Date;
  };
  search?: string;
  user_id?: string;
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

export interface FeedbackWebhookPayload {
  event: 'feedback_created' | 'feedback_updated' | 'feedback_deleted';
  feedback: FeedbackEntry;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface FeedbackNotification {
  id: string;
  feedback_id: string;
  type: 'new_feedback' | 'status_update' | 'admin_response';
  title: string;
  message: string;
  recipient_email?: string;
  sent_at?: Date;
  delivery_status: 'pending' | 'sent' | 'failed';
  created_at: Date;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface FeedbackAnalytics {
  total_submissions: number;
  submissions_this_month: number;
  submissions_this_week: number;
  avg_rating: number;
  response_time_avg: number; // in hours
  completion_rate: number; // percentage of feedback marked as completed
  top_categories: Array<{
    type: FeedbackEntry['type'];
    count: number;
    percentage: number;
  }>;
  rating_distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  status_distribution: Array<{
    status: FeedbackEntry['status'];
    count: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    submissions: number;
    avg_rating: number;
  }>;
}
