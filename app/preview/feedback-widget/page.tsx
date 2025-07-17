"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Star, 
  Camera, 
  Send,
  ArrowLeft,
  CheckCircle,
  Bug,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function FeedbackWidgetPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setRating(0);
      setFeedbackType('');
      setMessage('');
    }, 2000);
  };

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-600' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-blue-600' },
    { value: 'improvement', label: 'Improvement', icon: TrendingUp, color: 'text-green-600' },
    { value: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-gray-600' },
  ];

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs/modules/feedback-widget">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Feedback Widget Preview</h1>
            <p className="text-muted-foreground">Interactive demo of the feedback collection system</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live Demo</Badge>
          <Badge variant="outline">Interactive</Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demo Area */}
            <Card className="h-[500px] relative overflow-hidden">
              <CardHeader>
                <CardTitle>Demo Application</CardTitle>
                <CardDescription>
                  This simulates your application with the feedback widget
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Your Amazing App</h3>
                  <p className="text-muted-foreground mb-6">
                    This is where your application content would be. 
                    The feedback widget appears as a floating button.
                  </p>
                  <Button onClick={() => setIsOpen(true)}>
                    Try the App
                  </Button>
                </div>

                {/* Floating Feedback Button */}
                {!isOpen && (
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="absolute bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Feedback Widget */}
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Feedback Widget
                </CardTitle>
                <CardDescription>
                  {isOpen ? 'Widget is open' : 'Click the floating button to open'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isOpen ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click the floating button in the demo area to open the feedback widget
                      </p>
                    </div>
                  </div>
                ) : submitted ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
                      <p className="text-muted-foreground">
                        Your feedback has been submitted successfully.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Feedback Type */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        What type of feedback is this?
                      </label>
                      <Select value={feedbackType} onValueChange={setFeedbackType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className={`h-4 w-4 ${type.color}`} />
                                  {type.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        How would you rate your experience?
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-1 rounded transition-colors ${
                              rating >= star
                                ? 'text-yellow-500'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tell us more about your experience
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your feedback in detail..."
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email (Optional)
                      </label>
                      <Input placeholder="your@email.com" />
                    </div>

                    {/* Screenshot */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Screenshot (Optional)
                      </label>
                      <Button variant="outline" size="sm" className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Capture Screenshot
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!message.trim()}
                        className="flex-1"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Feedback
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Star Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Collect user satisfaction ratings with an intuitive 5-star rating system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Screenshot Capture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Allow users to capture and attach screenshots to provide visual context.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feedback Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organize feedback with predefined categories like bugs, features, and improvements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive dashboard for managing and analyzing all feedback submissions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track feedback trends, satisfaction scores, and response rates over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Webhook Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integrate with external services through webhooks for real-time notifications.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
