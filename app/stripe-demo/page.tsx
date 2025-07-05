"use client";

/**
 * Supreme Toolkit - Stripe Demo Page
 * 
 * Demonstrates the Stripe payment functionality including:
 * - Pricing cards with payment buttons
 * - Subscription management
 * - Customer portal integration
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingGrid } from '@/components/ui/pricing-card';
import { PayButton, SubscribeButton } from '@/components/ui/pay-button';
import { SubscriptionManager } from '@/components/ui/subscription-manager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Zap,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  Star
} from 'lucide-react';
import { getPricingComparison } from '@/lib/pricing';

// ============================================================================
// DEMO DATA
// ============================================================================

const demoSubscription = {
  id: "sub_demo123",
  status: "active" as const,
  currentPeriodStart: new Date("2024-01-01"),
  currentPeriodEnd: new Date("2024-02-01"),
  cancelAtPeriodEnd: false,
  plan: {
    id: "price_1RhWNXSErasIwHrG0cjoxhBy",
    name: "Pro Plan",
    amount: 2999,
    currency: "usd",
    interval: "month"
  },
  customer: {
    id: "cus_demo123",
    email: "demo@example.com"
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function StripeDemoPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);

  // Get pricing plans for the selected interval
  const pricingPlans = getPricingComparison(billingInterval);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Supreme Toolkit Demo
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Stripe Payment Integration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Supreme Toolkit's Stripe integration with 
            beautiful pricing cards, seamless payments, and subscription management.
          </p>
        </div>

        {/* Demo Tabs */}
        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
            <TabsTrigger value="payments">One-time Payments</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          {/* Pricing Plans Tab */}
          <TabsContent value="pricing" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground mb-6">
                Select the perfect plan for your needs. All plans include our core features.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={billingInterval === 'month' ? 'font-semibold' : 'text-muted-foreground'}>
                  Monthly
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
                  className="relative"
                >
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    billingInterval === 'year' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      billingInterval === 'year' ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </div>
                </Button>
                <span className={billingInterval === 'year' ? 'font-semibold' : 'text-muted-foreground'}>
                  Yearly
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Save 20%
                  </Badge>
                </span>
              </div>
            </div>

            {/* Pricing Grid */}
            <PricingGrid
              plans={pricingPlans}
              columns={3}
              className="max-w-6xl mx-auto"
            />
          </TabsContent>

          {/* One-time Payments Tab */}
          <TabsContent value="payments" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">One-time Purchases</h2>
              <p className="text-muted-foreground">
                Make single payments for products, services, or digital goods.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Product 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Audit
                  </CardTitle>
                  <CardDescription>
                    Comprehensive security review of your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">$299</div>
                  <PayButton
                    priceId="price_1RhWNXSErasIwHrG0cjoxhBy"
                    mode="payment"
                    className="w-full"
                    metadata={{ product: 'security-audit' }}
                  >
                    Purchase Audit
                  </PayButton>
                </CardContent>
              </Card>

              {/* Product 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Training
                  </CardTitle>
                  <CardDescription>
                    4-hour training session for your development team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">$599</div>
                  <PayButton
                    priceId="price_team_training"
                    mode="payment"
                    className="w-full"
                    metadata={{ product: 'team-training' }}
                  >
                    Book Training
                  </PayButton>
                </CardContent>
              </Card>

              {/* Product 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Custom Report
                  </CardTitle>
                  <CardDescription>
                    Detailed analytics report tailored to your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">$149</div>
                  <PayButton
                    priceId="price_custom_report"
                    mode="payment"
                    className="w-full"
                    metadata={{ product: 'custom-report' }}
                  >
                    Order Report
                  </PayButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Subscription Examples</h2>
              <p className="text-muted-foreground">
                Different ways to implement subscription buttons and flows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Simple Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Simple Subscription</CardTitle>
                  <CardDescription>
                    Basic subscription button with default styling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">$29.99/month</div>
                  <SubscribeButton
                    priceId="price_1RhWNXSErasIwHrG0cjoxhBy"
                    className="w-full"
                  >
                    Subscribe to Pro
                  </SubscribeButton>
                </CardContent>
              </Card>

              {/* Custom Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Subscription</CardTitle>
                  <CardDescription>
                    Subscription with custom styling and callbacks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">$99.99/month</div>
                  <SubscribeButton
                    priceId="price_enterprise_monthly"
                    variant="default"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    metadata={{ source: 'demo-page', plan: 'enterprise' }}
                    onPaymentStart={() => {
                      console.log('Enterprise subscription started');
                    }}
                    onPaymentSuccess={(sessionId) => {
                      console.log('Enterprise subscription successful:', sessionId);
                    }}
                    onPaymentError={(error) => {
                      console.error('Enterprise subscription failed:', error);
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Subscribe to Enterprise
                  </SubscribeButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Subscription Management</h2>
              <p className="text-muted-foreground">
                Manage existing subscriptions with the customer portal integration.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Toggle Demo Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Demo Controls</CardTitle>
                  <CardDescription>
                    Toggle the subscription manager to see how it works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowSubscriptionManager(!showSubscriptionManager)}
                    variant="outline"
                    className="w-full"
                  >
                    {showSubscriptionManager ? 'Hide' : 'Show'} Subscription Manager
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription Manager Demo */}
              {showSubscriptionManager && (
                <SubscriptionManager
                  subscription={demoSubscription}
                  onCustomerPortal={() => {
                    console.log('Customer portal accessed');
                    alert('In a real app, this would redirect to Stripe Customer Portal');
                  }}
                  onCancelSubscription={() => {
                    console.log('Subscription cancelled');
                    alert('In a real app, this would cancel the subscription');
                  }}
                  onReactivateSubscription={() => {
                    console.log('Subscription reactivated');
                    alert('In a real app, this would reactivate the subscription');
                  }}
                />
              )}

              {/* Features List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Secure webhook handling
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Automatic subscription management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Customer portal integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Customizable payment flows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Event-driven server actions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Separator className="my-12" />
        <div className="text-center text-muted-foreground">
          <p className="mb-2">
            This is a demo of Supreme Toolkit's Stripe integration.
          </p>
          <p className="text-sm">
            In production, make sure to configure your Stripe keys and webhook endpoints properly.
          </p>
        </div>
      </div>
    </div>
  );
}
