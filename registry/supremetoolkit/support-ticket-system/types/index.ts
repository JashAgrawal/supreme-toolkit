// ============================================================================
// SUPPORT TICKET TYPES
// ============================================================================

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_by: string;
  assigned_to?: string;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  tags?: string[];
  attachments?: TicketAttachment[];
  metadata?: Record<string, any>;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  is_internal: boolean;
  created_at: Date;
  updated_at: Date;
  attachments?: TicketAttachment[];
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'customer' | 'agent' | 'admin';
  };
}

export interface TicketAttachment {
  id: string;
  ticket_id?: string;
  comment_id?: string;
  filename: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface TicketUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'agent' | 'admin';
  created_at: Date;
  last_active?: Date;
}

export interface TicketCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  created_at: Date;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseTicketsOptions {
  userId?: string;
  userRole?: 'customer' | 'agent' | 'admin';
  status?: SupportTicket['status'];
  priority?: SupportTicket['priority'];
  category?: string;
  assignedTo?: string;
  onError?: (error: string) => void;
}

export interface UseTicketsReturn {
  tickets: SupportTicket[];
  isLoading: boolean;
  error: string | null;
  createTicket: (ticket: CreateTicketRequest) => Promise<SupportTicket | null>;
  updateTicket: (ticketId: string, updates: Partial<SupportTicket>) => Promise<void>;
  deleteTicket: (ticketId: string) => Promise<void>;
  assignTicket: (ticketId: string, agentId: string) => Promise<void>;
  refreshTickets: () => Promise<void>;
}

export interface UseTicketCommentsOptions {
  ticketId: string;
  userId?: string;
  userRole?: 'customer' | 'agent' | 'admin';
  onError?: (error: string) => void;
}

export interface UseTicketCommentsReturn {
  comments: TicketComment[];
  isLoading: boolean;
  error: string | null;
  addComment: (content: string, isInternal?: boolean) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicketId?: string;
  onTicketSelect: (ticketId: string) => void;
  onCreateTicket?: () => void;
  userRole?: 'customer' | 'agent' | 'admin';
  className?: string;
}

export interface TicketDetailProps {
  ticket: SupportTicket;
  comments: TicketComment[];
  currentUserId: string;
  userRole: 'customer' | 'agent' | 'admin';
  onUpdateTicket: (updates: Partial<SupportTicket>) => void;
  onAddComment: (content: string, isInternal?: boolean) => void;
  onAssignTicket?: (agentId: string) => void;
  className?: string;
}

export interface TicketFormProps {
  onSubmit: (ticket: CreateTicketRequest) => void;
  isLoading?: boolean;
  categories: TicketCategory[];
  className?: string;
}

export interface TicketCommentProps {
  comment: TicketComment;
  currentUserId: string;
  userRole: 'customer' | 'agent' | 'admin';
  onUpdate?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  className?: string;
}

export interface TicketStatsProps {
  stats: TicketStats;
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: SupportTicket['priority'];
  category: string;
  tags?: string[];
  attachments?: File[];
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: SupportTicket['status'];
  priority?: SupportTicket['priority'];
  category?: string;
  assigned_to?: string;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
  is_internal?: boolean;
  attachments?: File[];
}

export interface TicketFilters {
  status?: SupportTicket['status'][];
  priority?: SupportTicket['priority'][];
  category?: string[];
  assigned_to?: string[];
  created_by?: string[];
  date_range?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// ============================================================================
// STATS TYPES
// ============================================================================

export interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  by_category: Record<string, number>;
  avg_resolution_time: number; // in hours
  satisfaction_score?: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface TicketNotification {
  id: string;
  ticket_id: string;
  user_id: string;
  type: 'ticket_created' | 'ticket_updated' | 'comment_added' | 'ticket_assigned' | 'ticket_resolved';
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// CONFIG TYPES
// ============================================================================

export interface TicketSystemConfig {
  enableFileUploads?: boolean;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  enableInternalComments?: boolean;
  enableEmailNotifications?: boolean;
  enableSlackNotifications?: boolean;
  autoAssignTickets?: boolean;
  defaultPriority?: SupportTicket['priority'];
  enableSatisfactionSurvey?: boolean;
  customFields?: TicketCustomField[];
}

export interface TicketCustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'number';
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
