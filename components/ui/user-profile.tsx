"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Mail, Calendar, Shield } from "lucide-react";

interface UserProfileProps {
  onSignOut?: () => void;
  className?: string;
}

export function UserProfile({ onSignOut, className }: UserProfileProps) {
  const { user, signOut, isLoading } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={(user as any).avatar || user.image || undefined} alt={user.name || "User"} />
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{user.name || "User"}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </CardDescription>
          </div>
          <Badge variant={(user as any).role === 'admin' ? 'default' : 'secondary'} className="capitalize">
            <Shield className="h-3 w-3 mr-1" />
            {(user as any).role || 'user'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>User ID</span>
            </div>
            <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {user.id}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member Since</span>
            </div>
            <p className="text-sm">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Email Verification Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">Email Status</span>
          </div>
          <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
            {user.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
