import { NextRequest, NextResponse } from 'next/server';
import {
  submitFeedback,
  getFeedbackById,
  getFeedbackEntries,
  updateFeedbackEntry,
  deleteFeedbackEntry,
  getFeedbackStatistics
} from '../../actions/feedback-actions';

// ============================================================================
// FEEDBACK API ROUTES
// ============================================================================

/**
 * POST /api/feedback - Submit feedback or update existing feedback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, userRole = 'user', ...data } = body;

    switch (action) {
      case 'submit': {
        // Collect request metadata
        const metadata = {
          ip_address: request.headers.get('x-forwarded-for'),
          user_agent: request.headers.get('user-agent'),
          referer: request.headers.get('referer'),
          timestamp: new Date().toISOString(),
        };

        const result = await submitFeedback(data, userId, metadata);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.feedback,
        });
      }

      case 'update': {
        const { feedbackId, updates } = data;
        
        if (!feedbackId) {
          return NextResponse.json(
            { error: 'Feedback ID is required' },
            { status: 400 }
          );
        }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }

        const result = await updateFeedbackEntry(feedbackId, updates, userId, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Feedback not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.feedback,
        });
      }

      case 'delete': {
        const { feedbackId } = data;
        
        if (!feedbackId) {
          return NextResponse.json(
            { error: 'Feedback ID is required' },
            { status: 400 }
          );
        }

        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }

        const result = await deleteFeedbackEntry(feedbackId, userId, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Feedback not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Feedback deleted successfully',
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback - Get feedback entries, single feedback, or statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = (searchParams.get('userRole') as 'user' | 'admin') || 'user';
    const feedbackId = searchParams.get('feedbackId');
    const type = searchParams.get('type'); // 'list', 'single', 'stats'

    switch (type) {
      case 'single': {
        if (!feedbackId) {
          return NextResponse.json(
            { error: 'Feedback ID is required' },
            { status: 400 }
          );
        }

        const result = await getFeedbackById(feedbackId, userId || undefined, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: result.error === 'Feedback not found' ? 404 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.feedback,
        });
      }

      case 'stats': {
        const result = await getFeedbackStatistics(userId || undefined, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.stats,
        });
      }

      default: {
        // Get feedback list with filters
        const filters: { [key: string]: any } = {
          type: searchParams.get('feedbackType')?.split(',') as any,
          status: searchParams.get('status')?.split(',') as any,
          priority: searchParams.get('priority')?.split(',') as any,
          rating: searchParams.get('rating')?.split(',').map(Number).filter(n => !isNaN(n)),
          search: searchParams.get('search') || undefined,
          user_id: searchParams.get('filterUserId') || undefined,
        };

        // Handle date range
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (startDate && endDate) {
          filters.date_range = {
            start: new Date(startDate),
            end: new Date(endDate),
          };
        }

        // Remove undefined values
        Object.keys(filters).forEach(key => {
          if (filters[key as keyof typeof filters] === undefined) {
            delete filters[key as keyof typeof filters];
          }
        });

        const result = await getFeedbackEntries(filters, userId || undefined, userRole);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.feedback,
        });
      }
    }
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
