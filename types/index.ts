/**
 * Supreme Toolkit Global Types
 * 
 * This file contains shared TypeScript definitions used across
 * all Supreme Toolkit modules.
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: boolean;
  role?: 'user' | 'admin' | 'moderator';
}

export interface Session {
  id: string;
  userId: string;
  user: User;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'email' | 'magic-link';
  enabled: boolean;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval?: 'month' | 'year' | 'week' | 'day';
  features?: string[];
  popular?: boolean;
  stripePriceId?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  description?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  user: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  createdAt: Date;
  updatedAt?: Date;
  edited?: boolean;
  replyTo?: string;
  attachments?: ChatAttachment[];
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  createdBy: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface TypingIndicator {
  userId: string;
  channelId: string;
  user: User;
  timestamp: Date;
}

// ============================================================================
// SUPPORT TYPES
// ============================================================================

export interface SupportTicket {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  assignedTo?: string;
  assignee?: User;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  user: User;
  content: string;
  type: 'message' | 'status_change' | 'assignment' | 'system';
  createdAt: Date;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface RichTextContent {
  id: string;
  userId: string;
  title?: string;
  content: string; // JSON string from Tiptap
  htmlContent?: string; // Rendered HTML
  version: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  content: string;
  version: number;
  createdAt: Date;
  createdBy: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
  url?: string;
  userAgent?: string;
  ip?: string;
}

export interface PageView {
  id: string;
  userId?: string;
  sessionId: string;
  url: string;
  title?: string;
  referrer?: string;
  timestamp: Date;
  duration?: number;
}

// ============================================================================
// WAITLIST TYPES
// ============================================================================

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  referralCode?: string;
  referredBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  position?: number;
  createdAt: Date;
  approvedAt?: Date;
  notifiedAt?: Date;
}

// ============================================================================
// FEEDBACK TYPES
// ============================================================================

export interface FeedbackEntry {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'general' | 'other';
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
  status: 'new' | 'in_review' | 'planned' | 'in_progress' | 'completed' | 'rejected' | 'open';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  admin_notes?: string;
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

export interface WebhookEvent {
  id: string;
  source: string;
  event: string;
  payload: Record<string, any>;
  headers: Record<string, string>;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
  error?: string;
  retryCount: number;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

// ============================================================================
// NEWSLETTER TYPES
// ============================================================================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed' | 'pending';
  tags?: string[];
  subscribedAt: Date;
  unsubscribedAt?: Date;
  source?: string;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  recipients: number;
  opens?: number;
  clicks?: number;
  createdAt: Date;
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

export interface UploadedFile {
  id: string;
  userId?: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type WithId<T> = T & {
  id: string;
};

export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// ============================================================================
// EVENT TYPES (for Server Actions)
// ============================================================================

export interface BaseEventParams {
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface AuthEventParams extends BaseEventParams {
  user: User;
  provider?: string;
}

export interface PaymentEventParams extends BaseEventParams {
  amount: number;
  currency: string;
  customerId?: string;
}

export interface ChatEventParams extends BaseEventParams {
  channelId: string;
  messageId?: string;
}

export interface SupportEventParams extends BaseEventParams {
  ticketId: string;
  ticket: SupportTicket;
}

export interface ContentEventParams extends BaseEventParams {
  contentId: string;
  content: RichTextContent;
}

export interface AnalyticsEventParams extends BaseEventParams {
  event: string;
  properties?: Record<string, any>;
}

export interface WebhookEventParams extends BaseEventParams {
  source: string;
  event: string;
  payload: Record<string, any>;
}

export interface FeedbackEventParams extends BaseEventParams {
  feedbackId: string;
  feedback: FeedbackEntry;
}

export interface NewsletterEventParams extends BaseEventParams {
  subscriberId?: string;
  campaignId?: string;
}

export interface UploadEventParams extends BaseEventParams {
  fileId: string;
  file: UploadedFile;
}
