"use client";

import { useState } from "react";
import { useWaitlist } from "@/hooks/use-waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Mail, Users, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function WaitlistDemoPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [checkEmail, setCheckEmail] = useState("");
  const [activeTab, setActiveTab] = useState("signup");

  const { 
    subscribe, 
    checkStatus, 
    checkIfExists, 
    isLoading, 
    error, 
    success, 
    data,
    reset 
  } = useWaitlist({
    onSuccess: (data) => {
      console.log("Waitlist signup successful:", data);
    },
    onError: (error) => {
      console.error("Waitlist signup failed:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe({ email, name, referralCode });
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkStatus(checkEmail);
    } catch {
      // Error is already handled in the hook
    }
  };

  const handleCheckExists = async () => {
    if (!checkEmail) return;
    const exists = await checkIfExists(checkEmail);
    alert(exists ? "Email is already on the waitlist" : "Email is not on the waitlist");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📧 Waitlist Module Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Complete waitlist system with email confirmations and server actions
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Server Actions
              </span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Email Confirmations
              </span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                Resend/Nodemailer
              </span>
              <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                Business Logic
              </span>
            </div>
            <div className="mt-4">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Waitlist Forms */}
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signup">Join Waitlist</TabsTrigger>
                  <TabsTrigger value="check">Check Status</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signup">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Join Our Waitlist
                      </CardTitle>
                      <CardDescription>
                        Be the first to know when we launch!
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {success ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                            Welcome to the waitlist!
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            You are #{data?.position} in line
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Check your email for a confirmation message
                          </p>
                          <Button onClick={() => { reset(); setEmail(""); setName(""); setReferralCode(""); }}>
                            Add Another Email
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="name">Name (Optional)</Label>
                            <Input
                              id="name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                            <Input
                              id="referralCode"
                              type="text"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value)}
                              placeholder="FRIEND123"
                            />
                          </div>
                          
                          {error && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {error}
                            </div>
                          )}
                          
                          <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Joining..." : "Join Waitlist"}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="check">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Check Your Status
                      </CardTitle>
                      <CardDescription>
                        Enter your email to see your waitlist position
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data && activeTab === "check" ? (
                        <div className="text-center py-8">
                          <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            Your Status: {data.status}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Position: #{data.position}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Joined: {new Date(data.createdAt).toLocaleDateString()}
                          </p>
                          <Button onClick={() => { reset(); setCheckEmail(""); }}>
                            Check Another Email
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <form onSubmit={handleCheckStatus} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="checkEmail">Email Address</Label>
                              <Input
                                id="checkEmail"
                                type="email"
                                value={checkEmail}
                                onChange={(e) => setCheckEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                              />
                            </div>
                            
                            {error && (
                              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? "Checking..." : "Check Status"}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCheckExists}
                                disabled={!checkEmail}
                              >
                                Quick Check
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Information Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Installation</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-gray-900 dark:bg-gray-800 text-green-400 p-4 rounded block">
                    npx shadcn@latest add "https://supremetoolkit.in/r/waitlist"
                  </code>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>✨ New Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Server actions with business logic
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Email confirmations (Resend/Nodemailer)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Duplicate email checking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Status checking functionality
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Approval/rejection workflows
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Analytics and CRM integration hooks
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📧 Email Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Resend (Recommended):</strong>
                      <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                        RESEND_API_KEY=your-key
                      </code>
                    </div>
                    <div>
                      <strong>Nodemailer SMTP:</strong>
                      <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                        SMTP_HOST=smtp.gmail.com
                      </code>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      The system automatically detects and uses the available mailer configuration.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔧 Server Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                        checkIfAlreadyInWaitlist()
                      </code>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Prevents duplicate signups
                      </p>
                    </div>
                    <div>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                        onAddWaitlist()
                      </code>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Handles signup with email confirmation
                      </p>
                    </div>
                    <div>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                        onWaitlistSignup()
                      </code>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Custom business logic hooks
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
