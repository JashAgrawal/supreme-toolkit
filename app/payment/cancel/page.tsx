"use client";

/**
 * Supreme Toolkit - Payment Cancel Page
 *
 * Displays when a user cancels their payment or checkout session.
 */

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  XCircle,
  RefreshCw,
  Home,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

// ============================================================================
// COMPONENT
// ============================================================================

function PaymentCancelContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get session ID from URL parameters if available (for potential future use)
    searchParams.get('session_id');
    // Currently not used but available for future enhancements
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Cancel Card */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-orange-800 dark:text-orange-200">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-lg">
              Your payment was cancelled and no charges were made to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* What Happened */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-3">What Happened?</h3>
              <p className="text-sm text-muted-foreground">
                You cancelled the payment process before it was completed. This is completely normal 
                and happens when you:
              </p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Clicked the back button during checkout</li>
                <li>• Closed the payment window</li>
                <li>• Decided not to complete the purchase</li>
                <li>• Encountered an issue with payment details</li>
              </ul>
            </div>

            {/* No Charges */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                No Charges Made
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your payment method was not charged. You can safely try again or choose 
                a different payment option.
              </p>
            </div>

            {/* What's Next */}
            <div>
              <h3 className="font-semibold mb-3">What Would You Like to Do?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Try Payment Again</p>
                    <p className="text-sm text-muted-foreground">
                      Go back to the pricing page and complete your purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Need Help?</p>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team if you encountered any issues.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Have Questions?</p>
                    <p className="text-sm text-muted-foreground">
                      Learn more about our plans and features before purchasing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/stripe-demo">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Support Options */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link href="/support">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Get Support
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link href="/faq">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View FAQ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Your payment information is always secure and protected. 
            We never store your payment details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-orange-800 dark:text-orange-200">
                Loading...
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
