"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Circle } from 'lucide-react';
import type { ChatUserListProps } from '../../types';
import { cn } from '@/lib/utils';

export function ChatUserList({
  users,
  currentUserId,
  className,
}: ChatUserListProps) {
  const sortedUsers = [...users].sort((a, b) => {
    // Current user first
    if (a.user_id === currentUserId) return -1;
    if (b.user_id === currentUserId) return 1;
    
    // Then sort by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Users className="h-4 w-4" />
        <span>Online ({users.length})</span>
      </div>

      {/* User List */}
      <ScrollArea className="h-full">
        <div className="space-y-2">
          {sortedUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No users online</p>
            </div>
          ) : (
            sortedUsers.map((user) => {
              const isCurrentUser = user.user_id === currentUserId;
              const userInitials = user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();

              return (
                <div
                  key={user.user_id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md transition-colors",
                    isCurrentUser && "bg-muted"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          You
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}