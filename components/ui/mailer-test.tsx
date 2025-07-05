"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMailer } from "@/hooks/use-mailer";
import { Loader2, Mail, CheckCircle, XCircle, Info } from "lucide-react";

interface MailerTestProps {
  className?: string;
}

export function MailerTest({ className }: MailerTestProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Test Email from Supreme Toolkit");
  const [message, setMessage] = useState("This is a test email to verify your mailer configuration.");
  const [testResult, setTestResult] = useState<any>(null);

  const { send, sendTest, isLoading, error, mailerInfo } = useMailer({
    onSuccess: (data) => {
      setTestResult({ success: true, data });
    },
    onError: (error) => {
      setTestResult({ success: false, error });
    },
  });

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setTestResult(null);
    await sendTest(email);
  };

  const handleSendCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subject || !message) return;
    
    setTestResult(null);
    await send({
      to: email,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    });
  };

  const getStatusIcon = () => {
    if (testResult?.success) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (testResult?.success === false) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  const getStatusColor = () => {
    if (testResult?.success) return "text-green-600";
    if (testResult?.success === false) return "text-red-600";
    return "text-blue-600";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Configuration Test
        </CardTitle>
        <CardDescription>
          Test your email configuration and send test emails
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mailer Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Current Configuration</h3>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Mailer Type:</span>
              <Badge variant={mailerInfo.configured ? "default" : "destructive"}>
                {mailerInfo.type.toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {mailerInfo.configured ? "✓ Configured" : "⚠ Not Configured"}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {mailerInfo.details}
          </p>
        </div>

        <Separator />

        {/* Quick Test */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Quick Test</h3>
          <form onSubmit={handleSendTest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" disabled={isLoading || !email} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Test Email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </form>
        </div>

        <Separator />

        {/* Custom Email */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Custom Email</h3>
          <form onSubmit={handleSendCustom} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-email">Recipient Email</Label>
              <Input
                id="custom-email"
                type="email"
                placeholder="Enter recipient email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-subject">Subject</Label>
              <Input
                id="custom-subject"
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-message">Message</Label>
              <Textarea
                id="custom-message"
                placeholder="Enter your message"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                required
                disabled={isLoading}
                rows={4}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !email || !subject || !message} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Custom Email
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        {(testResult || error) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Result</h3>
              <div className={`flex items-start gap-3 p-4 rounded-lg border ${
                testResult?.success 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                {getStatusIcon()}
                <div className="flex-1 space-y-1">
                  <p className={`text-sm font-medium ${getStatusColor()}`}>
                    {testResult?.success ? 'Email sent successfully!' : 'Email sending failed'}
                  </p>
                  {testResult?.success && testResult.data?.id && (
                    <p className="text-xs text-muted-foreground">
                      Message ID: {testResult.data.id}
                    </p>
                  )}
                  {(testResult?.error || error) && (
                    <p className="text-xs text-red-600">
                      {testResult?.error || error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Help */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Configuration Help:</strong></p>
          <p>• For Resend: Set RESEND_API_KEY in your environment variables</p>
          <p>• For SMTP: Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD</p>
          <p>• For Gmail: Set EMAIL_PROVIDER=gmail, GMAIL_USER, GMAIL_APP_PASSWORD</p>
        </div>
      </CardContent>
    </Card>
  );
}
