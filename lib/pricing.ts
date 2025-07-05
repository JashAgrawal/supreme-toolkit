/**
 * Supreme Toolkit - Pricing Configuration System
 * 
 * Centralized pricing configuration for managing plans, features,
 * and pricing tiers in the Supreme Toolkit.
 */

import { PricingCardProps } from '@/components/ui/pricing-card';

// ============================================================================
// TYPES
// ============================================================================

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  interval: 'month' | 'year' | 'week' | 'day' | 'one-time';
  stripeProductId: string;
  stripePriceId: string;
  features: PricingFeature[];
  popular?: boolean;
  badge?: string;
  metadata?: Record<string, string>;
}

export interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
  limit?: number | string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  plans: PricingPlan[];
}

// ============================================================================
// DEFAULT PRICING PLANS
// ============================================================================

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_starter',
    stripePriceId: 'price_starter_monthly',
    features: [
      { name: '5 Projects', included: true },
      { name: '10GB Storage', included: true },
      { name: 'Email Support', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'API Access', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Custom Integrations', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for growing businesses and teams',
    price: 29.99,
    originalPrice: 39.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_pro',
    stripePriceId: 'price_1RhWNXSErasIwHrG0cjoxhBy',
    popular: true,
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: '100GB Storage', included: true },
      { name: 'Priority Email Support', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'Team Collaboration', included: true },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 99.99,
    currency: 'USD',
    interval: 'month',
    stripeProductId: 'prod_enterprise',
    stripePriceId: 'price_enterprise_monthly',
    badge: 'Most Advanced',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: '24/7 Phone Support', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'SLA Guarantee', included: true },
      { name: 'On-premise Deployment', included: true },
      { name: 'Custom Training', included: true },
    ],
  },
];

// ============================================================================
// YEARLY PRICING PLANS (with discount)
// ============================================================================

export const yearlyPricingPlans: PricingPlan[] = [
  {
    id: 'starter-yearly',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: 99.99,
    originalPrice: 119.88, // 9.99 * 12
    currency: 'USD',
    interval: 'year',
    stripeProductId: 'prod_starter',
    stripePriceId: 'price_1RhWNXSErasIwHrG0cjoxhBy',
    features: defaultPricingPlans[0].features,
  },
  {
    id: 'pro-yearly',
    name: 'Pro',
    description: 'Best for growing businesses and teams',
    price: 299.99,
    originalPrice: 359.88, // 29.99 * 12
    currency: 'USD',
    interval: 'year',
    stripeProductId: 'prod_pro',
    stripePriceId: 'price_1RhWNXSErasIwHrG0cjoxhBy',
    popular: true,
    features: defaultPricingPlans[1].features,
  },
  {
    id: 'enterprise-yearly',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 999.99,
    originalPrice: 1199.88, // 99.99 * 12
    currency: 'USD',
    interval: 'year',
    stripeProductId: 'prod_enterprise',
    stripePriceId: 'price_1RhWNXSErasIwHrG0cjoxhBy',
    badge: 'Most Advanced',
    features: defaultPricingPlans[2].features,
  },
];

// ============================================================================
// ONE-TIME PRICING PLANS
// ============================================================================

export const oneTimePricingPlans: PricingPlan[] = [
  {
    id: 'basic-license',
    name: 'Basic License',
    description: 'One-time purchase for basic features',
    price: 49.99,
    currency: 'USD',
    interval: 'one-time',
    stripeProductId: 'prod_basic_license',
    stripePriceId: 'price_1RhWNXSErasIwHrG0cjoxhBy',
    features: [
      { name: 'Lifetime Access', included: true },
      { name: 'Basic Features', included: true },
      { name: 'Email Support', included: true },
      { name: 'Updates for 1 Year', included: true },
      { name: 'Advanced Features', included: false },
      { name: 'Priority Support', included: false },
    ],
  },
  {
    id: 'premium-license',
    name: 'Premium License',
    description: 'One-time purchase with all features',
    price: 199.99,
    currency: 'USD',
    interval: 'one-time',
    stripeProductId: 'prod_premium_license',
    stripePriceId: 'price_1RhWNXSErasIwHrG0cjoxhBy',
    popular: true,
    features: [
      { name: 'Lifetime Access', included: true },
      { name: 'All Features', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Lifetime Updates', included: true },
      { name: 'Commercial License', included: true },
      { name: 'Source Code Access', included: true },
    ],
  },
];

// ============================================================================
// PRICING UTILITIES
// ============================================================================

/**
 * Get pricing plan by ID
 */
export function getPricingPlan(planId: string, interval: 'month' | 'year' | 'one-time' = 'month'): PricingPlan | null {
  let plans: PricingPlan[];
  
  switch (interval) {
    case 'year':
      plans = yearlyPricingPlans;
      break;
    case 'one-time':
      plans = oneTimePricingPlans;
      break;
    default:
      plans = defaultPricingPlans;
  }
  
  return plans.find(plan => plan.id === planId || plan.id === `${planId}-${interval}`) || null;
}

/**
 * Get all pricing plans for a specific interval
 */
export function getPricingPlans(interval: 'month' | 'year' | 'one-time' = 'month'): PricingPlan[] {
  switch (interval) {
    case 'year':
      return yearlyPricingPlans;
    case 'one-time':
      return oneTimePricingPlans;
    default:
      return defaultPricingPlans;
  }
}

/**
 * Convert pricing plan to PricingCard props
 */
export function planToPricingCardProps(plan: PricingPlan, options?: {
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}): PricingCardProps {
  return {
    title: plan.name,
    description: plan.description,
    price: plan.price,
    originalPrice: plan.originalPrice,
    currency: plan.currency,
    interval: plan.interval,
    priceId: plan.stripePriceId,
    features: plan.features,
    popular: plan.popular,
    badge: plan.badge,
    metadata: { ...plan.metadata, ...options?.metadata },
    successUrl: options?.successUrl,
    cancelUrl: options?.cancelUrl,
  };
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

/**
 * Get pricing comparison data
 */
export function getPricingComparison(interval: 'month' | 'year' = 'month') {
  const monthlyPlans = getPricingPlans('month');
  const yearlyPlans = getPricingPlans('year');
  
  if (interval === 'month') {
    return monthlyPlans.map(plan => planToPricingCardProps(plan));
  }
  
  return yearlyPlans.map(plan => planToPricingCardProps(plan));
}

// ============================================================================
// FEATURE COMPARISON
// ============================================================================

/**
 * Get all unique features across all plans
 */
export function getAllFeatures(): string[] {
  const allFeatures = new Set<string>();
  
  [...defaultPricingPlans, ...yearlyPricingPlans, ...oneTimePricingPlans].forEach(plan => {
    plan.features.forEach(feature => {
      allFeatures.add(feature.name);
    });
  });
  
  return Array.from(allFeatures);
}

/**
 * Create feature comparison matrix
 */
export function createFeatureMatrix(interval: 'month' | 'year' | 'one-time' = 'month') {
  const plans = getPricingPlans(interval);
  const allFeatures = getAllFeatures();
  
  return {
    features: allFeatures,
    plans: plans.map(plan => ({
      ...plan,
      featureMap: allFeatures.reduce((map, featureName) => {
        const feature = plan.features.find(f => f.name === featureName);
        map[featureName] = feature ? feature.included : false;
        return map;
      }, {} as Record<string, boolean>),
    })),
  };
}
