"use server";

// ============================================================================
// MAILER SERVER ACTIONS
// ============================================================================

/**
 * Called when an email is about to be sent
 * Customize this function with your own business logic
 */
export async function onEmailSent(params: {
  to: string | string[];
  subject: string;
  timestamp: Date;
  metadata?: {
    from?: string;
    hasAttachments?: boolean;
    recipientCount?: number;
    [key: string]: any;
  };
}) {
  // Add your custom logic here
  console.log('Email sending initiated:', params);
  
  // Examples of what you might want to do:
  // - Log email attempts
  // - Track analytics
  // - Rate limiting checks
  // - Spam prevention
  // - User quota checks
  // - Audit logging
  
  // Example: Log the email attempt
  const recipients = Array.isArray(params.to) ? params.to.join(', ') : params.to;
  console.log(`Sending email to: ${recipients} - Subject: ${params.subject}`);
  
  // Example: Track analytics
  // await trackEvent('email_sent_attempt', {
  //   recipients: params.metadata?.recipientCount || 1,
  //   subject: params.subject,
  //   hasAttachments: params.metadata?.hasAttachments || false,
  //   timestamp: params.timestamp,
  // });
  
  // Example: Check user quota
  // const userQuota = await checkUserEmailQuota(params.metadata?.from);
  // if (userQuota.exceeded) {
  //   throw new Error('Email quota exceeded');
  // }
  
  // Example: Spam prevention
  // await checkSpamScore(params.subject, params.to);
  
  return { success: true };
}

/**
 * Called when an email is successfully delivered
 */
export async function onEmailDelivered(params: {
  to: string | string[];
  subject: string;
  messageId?: string;
  timestamp: Date;
  metadata?: {
    from?: string;
    mailerType?: string;
    [key: string]: any;
  };
}) {
  console.log('Email delivered successfully:', params);
  
  // Add your custom logic here:
  // - Update delivery status in database
  // - Track successful deliveries
  // - Update user statistics
  // - Trigger follow-up actions
  // - Send delivery confirmations
  // - Update email campaigns
  
  // Example: Log successful delivery
  const recipients = Array.isArray(params.to) ? params.to.join(', ') : params.to;
  console.log(`Email delivered to: ${recipients} - Message ID: ${params.messageId}`);
  
  // Example: Track analytics
  // await trackEvent('email_delivered', {
  //   messageId: params.messageId,
  //   recipients: Array.isArray(params.to) ? params.to.length : 1,
  //   subject: params.subject,
  //   mailerType: params.metadata?.mailerType,
  //   deliveryTime: params.timestamp,
  // });
  
  // Example: Update database
  // await updateEmailStatus(params.messageId, 'delivered', params.timestamp);
  
  // Example: Trigger follow-up actions
  // if (params.subject.includes('Welcome')) {
  //   await scheduleFollowUpEmail(params.to, 'onboarding_day_2', 24 * 60 * 60 * 1000);
  // }
  
  // Example: Update user statistics
  // await incrementUserEmailsSent(params.metadata?.from);
  
  return { success: true };
}

/**
 * Called when an email fails to send
 */
export async function onEmailFailed(params: {
  to: string | string[];
  subject: string;
  error: string;
  timestamp: Date;
  metadata?: {
    from?: string;
    mailerType?: string;
    [key: string]: any;
  };
}) {
  console.log('Email sending failed:', params);
  
  // Add your custom logic here:
  // - Log errors for debugging
  // - Track failure rates
  // - Alert administrators
  // - Retry logic
  // - Update user notifications
  // - Fallback to alternative mailer
  
  // Example: Log the failure
  const recipients = Array.isArray(params.to) ? params.to.join(', ') : params.to;
  console.error(`Email failed to send to: ${recipients} - Error: ${params.error}`);
  
  // Example: Track analytics
  // await trackEvent('email_failed', {
  //   recipients: Array.isArray(params.to) ? params.to.length : 1,
  //   subject: params.subject,
  //   error: params.error,
  //   mailerType: params.metadata?.mailerType,
  //   timestamp: params.timestamp,
  // });
  
  // Example: Alert administrators for critical emails
  // if (params.subject.includes('Critical') || params.subject.includes('Alert')) {
  //   await sendSlackAlert(`Critical email failed: ${params.error}`);
  // }
  
  // Example: Retry logic
  // if (params.error.includes('rate limit') || params.error.includes('temporary')) {
  //   await scheduleEmailRetry(params.to, params.subject, 5 * 60 * 1000); // Retry in 5 minutes
  // }
  
  // Example: Update failure statistics
  // await incrementEmailFailures(params.metadata?.from, params.error);
  
  // Example: Notify user of failure (for important emails)
  // if (params.metadata?.notifyOnFailure) {
  //   await notifyUserOfEmailFailure(params.metadata.from, params.error);
  // }
  
  return { success: true };
}

/**
 * Called when an email bounces (if webhook is configured)
 */
export async function onEmailBounced(params: {
  to: string;
  messageId?: string;
  bounceType: 'hard' | 'soft';
  reason: string;
  timestamp: Date;
  metadata?: {
    [key: string]: any;
  };
}) {
  console.log('Email bounced:', params);
  
  // Add your custom logic here:
  // - Update email status
  // - Mark email as invalid (for hard bounces)
  // - Track bounce rates
  // - Clean up mailing lists
  // - Alert administrators
  
  // Example: Log the bounce
  console.log(`Email bounced: ${params.to} - Type: ${params.bounceType} - Reason: ${params.reason}`);
  
  // Example: Handle hard bounces
  // if (params.bounceType === 'hard') {
  //   await markEmailAsInvalid(params.to);
  //   await removeFromMailingLists(params.to);
  // }
  
  // Example: Track analytics
  // await trackEvent('email_bounced', {
  //   email: params.to,
  //   bounceType: params.bounceType,
  //   reason: params.reason,
  //   messageId: params.messageId,
  //   timestamp: params.timestamp,
  // });
  
  return { success: true };
}

/**
 * Called when a recipient complains about spam (if webhook is configured)
 */
export async function onEmailComplaint(params: {
  to: string;
  messageId?: string;
  timestamp: Date;
  metadata?: {
    [key: string]: any;
  };
}) {
  console.log('Email complaint received:', params);
  
  // Add your custom logic here:
  // - Remove from mailing lists
  // - Track complaint rates
  // - Alert administrators
  // - Review email content
  // - Update sender reputation
  
  // Example: Log the complaint
  console.log(`Spam complaint from: ${params.to} - Message ID: ${params.messageId}`);
  
  // Example: Immediate actions
  // await removeFromAllMailingLists(params.to);
  // await markAsComplainer(params.to);
  
  // Example: Track analytics
  // await trackEvent('email_complaint', {
  //   email: params.to,
  //   messageId: params.messageId,
  //   timestamp: params.timestamp,
  // });
  
  // Example: Alert administrators
  // await sendSlackAlert(`Spam complaint received from ${params.to}`);
  
  return { success: true };
}
