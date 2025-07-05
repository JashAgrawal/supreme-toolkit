"use client";

/**
 * Supreme Toolkit - Payment Success Page
 * 
 * Displays a success message after a successful payment or subscription.
 */

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  Mail, 
  ArrowRight,
  Home,
  Receipt
} from 'lucide-react';
import Link from 'next/link';

// ============================================================================
// COMPONENT
// ============================================================================

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'payment' | 'subscription'>('payment');

  useEffect(() => {
    // Get session ID from URL parameters
    const session = searchParams.get('session_id');
    const type = searchParams.get('type') as 'payment' | 'subscription' || 'payment';
    
    setSessionId(session);
    setPaymentType(type);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200">
              {paymentType === 'subscription' ? 'Subscription Activated!' : 'Payment Successful!'}
            </CardTitle>
            <CardDescription className="text-lg">
              {paymentType === 'subscription' 
                ? 'Your subscription has been activated and you now have access to all features.'
                : 'Your payment has been processed successfully. Thank you for your purchase!'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                {sessionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-mono text-xs">{sessionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    <span>Card</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold mb-3">What's Next?</h3>
              <div className="space-y-3">
                {paymentType === 'subscription' ? (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Access Your Dashboard</p>
                        <p className="text-sm text-muted-foreground">
                          Start using all the premium features in your account dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Check Your Email</p>
                        <p className="text-sm text-muted-foreground">
                          We've sent you a confirmation email with your subscription details.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Receipt className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Download Your Receipt</p>
                        <p className="text-sm text-muted-foreground">
                          A receipt has been sent to your email address.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Access Your Purchase</p>
                        <p className="text-sm text-muted-foreground">
                          Your purchase is now available in your account.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Need help or have questions?
              </p>
              <Button variant="link" size="sm" asChild>
                <Link href="/support">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            This payment was processed securely by Stripe. 
            Your payment information is protected and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200">
                Loading...
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
