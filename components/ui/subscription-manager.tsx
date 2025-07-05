"use client";

/**
 * Supreme Toolkit - Subscription Manager Component
 * 
 * A component for managing user subscriptions, including viewing current
 * subscription status, upgrading/downgrading plans, and accessing the
 * customer portal.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import {
  Calendar,
  ExternalLink,
  Loader2,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface SubscriptionData {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: string;
  };
  customer: {
    id: string;
    email: string;
  };
}

export interface SubscriptionManagerProps {
  /** Current subscription data */
  subscription?: SubscriptionData;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Callback when customer portal is accessed */
  onCustomerPortal?: () => void;
  /** Callback when subscription is cancelled */
  onCancelSubscription?: () => void;
  /** Callback when subscription is reactivated */
  onReactivateSubscription?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SubscriptionManager({
  subscription,
  loading = false,
  className,
  onCustomerPortal,
  onCancelSubscription,
  onReactivateSubscription,
}: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Format price for display
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get status badge variant and text
  const getStatusInfo = (status: SubscriptionData['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, text: 'Active', icon: CheckCircle };
      case 'trialing':
        return { variant: 'secondary' as const, text: 'Trial', icon: Calendar };
      case 'canceled':
        return { variant: 'destructive' as const, text: 'Canceled', icon: AlertTriangle };
      case 'past_due':
        return { variant: 'destructive' as const, text: 'Past Due', icon: AlertTriangle };
      case 'incomplete':
        return { variant: 'secondary' as const, text: 'Incomplete', icon: AlertTriangle };
      default:
        return { variant: 'secondary' as const, text: status, icon: AlertTriangle };
    }
  };

  // Handle customer portal access
  const handleCustomerPortal = async () => {
    if (!subscription) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: subscription.customer.id,
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer portal session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
        onCustomerPortal?.();
      }
    } catch (error) {
      console.error('Customer portal error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      onCancelSubscription?.();
    } catch (error) {
      console.error('Cancel subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    if (!subscription) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      onReactivateSubscription?.();
    } catch (error) {
      console.error('Reactivate subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading subscription...</span>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription. Choose a plan to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(subscription.status);
  const StatusIcon = statusInfo.icon;
  const isTrialing = subscription.status === 'trialing';
  const isCanceled = subscription.cancelAtPeriodEnd;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              {subscription.plan.name}
            </CardTitle>
            <CardDescription>
              {formatPrice(subscription.plan.amount, subscription.plan.currency)} per {subscription.plan.interval}
            </CardDescription>
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Subscription details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Customer Email</span>
            <span>{subscription.customer.email}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Period</span>
            <span>
              {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
            </span>
          </div>

          {isTrialing && subscription.trialEnd && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Trial Ends</span>
              <span>{formatDate(subscription.trialEnd)}</span>
            </div>
          )}

          {isCanceled && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cancels On</span>
              <span className="text-destructive">
                {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleCustomerPortal}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Settings className="mr-2 h-4 w-4" />
            )}
            Manage Subscription
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          {isCanceled ? (
            <Button
              onClick={handleReactivateSubscription}
              disabled={isLoading}
              variant="default"
              className="w-full"
            >
              Reactivate Subscription
            </Button>
          ) : (
            subscription.status === 'active' && (
              <Button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                variant="destructive"
                className="w-full"
              >
                Cancel Subscription
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Basic usage
<SubscriptionManager
  subscription={{
    id: "sub_1234567890",
    status: "active",
    currentPeriodStart: new Date("2024-01-01"),
    currentPeriodEnd: new Date("2024-02-01"),
    cancelAtPeriodEnd: false,
    plan: {
      id: "price_1234567890",
      name: "Pro Plan",
      amount: 2999,
      currency: "usd",
      interval: "month"
    },
    customer: {
      id: "cus_1234567890",
      email: "user@example.com"
    }
  }}
  onCustomerPortal={() => {
    console.log('Customer portal accessed');
  }}
  onCancelSubscription={() => {
    console.log('Subscription cancelled');
    // Refresh subscription data
  }}
/>
*/
