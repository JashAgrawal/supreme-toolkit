"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Reply, 
  Check, 
  X,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ChatMessage as ChatMessageType } from '../../types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  currentUserId: string;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessageType) => void;
  className?: string;
}

export function ChatMessage({
  message,
  currentUserId,
  showAvatar = true,
  showTimestamp = true,
  onEdit,
  onDelete,
  onReply,
  className,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isOwnMessage = message.user_id === currentUserId;
  const userName = message.user?.name || 'Unknown User';
  const userAvatar = message.user?.avatar;
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleEdit = () => {
    if (onEdit && editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className={cn("group flex gap-3", className)}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8" /> // Spacer for alignment
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        {showAvatar && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </span>
            {message.edited_at && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                <Clock className="h-3 w-3 mr-1" />
                edited
              </Badge>
            )}
          </div>
        )}

        {/* Message Body */}
        <div className="flex items-start gap-2">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Reply indicator */}
                {message.reply_to && (
                  <div className="text-xs text-muted-foreground border-l-2 border-muted pl-2 mb-1">
                    Replying to a message
                  </div>
                )}
                
                {/* Message content */}
                <div className={cn(
                  "text-sm break-words",
                  message.type === 'system' && "italic text-muted-foreground"
                )}>
                  {message.content}
                </div>

                {/* Timestamp for non-avatar messages */}
                {!showAvatar && showTimestamp && (
                  <div className="text-xs text-muted-foreground">
                    {formatTime(message.created_at)}
                    {message.edited_at && (
                      <span className="ml-1">(edited)</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions Menu */}
          {!isEditing && message.type !== 'system' && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onReply && (
                    <DropdownMenuItem onClick={() => onReply(message)}>
                      <Reply className="h-3 w-3 mr-2" />
                      Reply
                    </DropdownMenuItem>
                  )}
                  {isOwnMessage && onEdit && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {isOwnMessage && onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(message.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
