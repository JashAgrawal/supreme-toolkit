"use client";

/**
 * Supreme Toolkit - PricingCard Component
 * 
 * A beautiful pricing card component that displays pricing plans
 * with integrated Stripe payment functionality.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { PayButton } from './pay-button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface PricingFeature {
  /** Feature name */
  name: string;
  /** Whether this feature is included */
  included: boolean;
  /** Optional description or tooltip */
  description?: string;
}

export interface PricingCardProps {
  /** Plan name */
  title: string;
  /** Plan description */
  description?: string;
  /** Price amount (in dollars) */
  price: number;
  /** Price currency */
  currency?: string;
  /** Billing interval */
  interval?: 'month' | 'year' | 'week' | 'day' | 'one-time';
  /** Original price for showing discounts */
  originalPrice?: number;
  /** Stripe price ID */
  priceId: string;
  /** List of features */
  features?: PricingFeature[];
  /** Whether this is the popular/recommended plan */
  popular?: boolean;
  /** Custom badge text */
  badge?: string;
  /** Custom CSS classes */
  className?: string;
  /** Button text override */
  buttonText?: string;
  /** Button variant */
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Whether the plan is disabled */
  disabled?: boolean;
  /** Custom metadata for payment */
  metadata?: Record<string, string>;
  /** Success URL after payment */
  successUrl?: string;
  /** Cancel URL if payment is cancelled */
  cancelUrl?: string;
  /** Callback when payment is initiated */
  onPaymentStart?: () => void;
  /** Callback when payment succeeds */
  onPaymentSuccess?: (sessionId: string) => void;
  /** Callback when payment fails */
  onPaymentError?: (error: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PricingCard({
  title,
  description,
  price,
  currency = 'USD',
  interval = 'month',
  originalPrice,
  priceId,
  features = [],
  popular = false,
  badge,
  className,
  buttonText,
  buttonVariant,
  disabled = false,
  metadata,
  successUrl,
  cancelUrl,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
}: PricingCardProps) {
  // Format price for display
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  };

  // Get interval display text
  const getIntervalText = () => {
    switch (interval) {
      case 'month':
        return '/month';
      case 'year':
        return '/year';
      case 'week':
        return '/week';
      case 'day':
        return '/day';
      case 'one-time':
        return '';
      default:
        return `/${interval}`;
    }
  };

  // Determine payment mode
  const paymentMode = interval === 'one-time' ? 'payment' : 'subscription';

  // Calculate discount percentage
  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <Card 
      className={cn(
        'relative flex flex-col',
        popular && 'border-primary shadow-lg scale-105',
        disabled && 'opacity-60',
        className
      )}
    >
      {/* Popular badge */}
      {(popular || badge) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant={popular ? 'default' : 'secondary'}>
            {badge || 'Most Popular'}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base">{description}</CardDescription>
        )}
        
        {/* Price display */}
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-2">
            {originalPrice && originalPrice > price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-4xl font-bold">
              {formatPrice(price)}
            </span>
            {interval !== 'one-time' && (
              <span className="text-muted-foreground">
                {getIntervalText()}
              </span>
            )}
          </div>
          
          {/* Discount badge */}
          {discountPercentage && (
            <div className="mt-2">
              <Badge variant="destructive" className="text-xs">
                Save {discountPercentage}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Features list */}
        {features.length > 0 && (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={cn(
                    'text-sm',
                    !feature.included && 'text-muted-foreground line-through'
                  )}>
                    {feature.name}
                  </span>
                  {feature.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <PayButton
          priceId={priceId}
          mode={paymentMode}
          variant={buttonVariant || (popular ? 'default' : 'outline')}
          size="lg"
          className="w-full"
          disabled={disabled}
          metadata={metadata}
          successUrl={successUrl}
          cancelUrl={cancelUrl}
          onPaymentStart={onPaymentStart}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        >
          {buttonText || (paymentMode === 'subscription' ? 'Subscribe' : 'Purchase')}
        </PayButton>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// PRICING GRID COMPONENT
// ============================================================================

export interface PricingGridProps {
  /** Array of pricing plans */
  plans: PricingCardProps[];
  /** Custom CSS classes */
  className?: string;
  /** Number of columns (responsive) */
  columns?: 1 | 2 | 3 | 4;
}

export function PricingGrid({ 
  plans, 
  className,
  columns = 3 
}: PricingGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(
      'grid gap-8',
      gridCols[columns],
      className
    )}>
      {plans.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </div>
  );
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Basic usage
<PricingCard
  title="Pro Plan"
  description="Perfect for growing businesses"
  price={29.99}
  interval="month"
  priceId="price_1234567890"
  features={[
    { name: "Unlimited projects", included: true },
    { name: "24/7 support", included: true },
    { name: "Advanced analytics", included: false },
  ]}
  popular={true}
/>

// Pricing grid
<PricingGrid
  columns={3}
  plans={[
    {
      title: "Starter",
      price: 9.99,
      priceId: "price_starter",
      features: [
        { name: "5 projects", included: true },
        { name: "Email support", included: true },
      ]
    },
    {
      title: "Pro",
      price: 29.99,
      originalPrice: 39.99,
      priceId: "price_pro",
      popular: true,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "24/7 support", included: true },
      ]
    },
    {
      title: "Enterprise",
      price: 99.99,
      priceId: "price_enterprise",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Custom integrations", included: true },
      ]
    }
  ]}
/>
*/
