"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWaitlist } from "@/hooks/use-waitlist";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface WaitlistFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export function WaitlistForm({
  title = "Join the Waitlist",
  description = "Be the first to know when we launch!",
  placeholder = "Enter your email address",
  buttonText = "Join Waitlist",
  className,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, error, success } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    await subscribe({ email });
    if (success) {
      setEmail("");
    }
  };

  if (success) {
    return (
      <Card className={`${className} max-w-md mx-auto`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium text-center">Successfully joined the waitlist!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} max-w-md mx-auto w-full`}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl truncate">{title}</CardTitle>
        <CardDescription className="text-sm sm:text-base line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full transition-colors focus:ring-2 focus:ring-primary/20"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-start space-x-2 text-red-600 p-3 bg-red-50 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed break-words">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center space-x-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="truncate">{isLoading ? "Joining..." : buttonText}</span>
            </div>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}