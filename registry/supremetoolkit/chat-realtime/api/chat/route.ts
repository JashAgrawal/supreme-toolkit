import { NextRequest, NextResponse } from 'next/server';
import { 
  createChatRoom, 
  sendChatMessage, 
  getUserChatRooms, 
  getChatMessages,
  joinChatRoom,
  leaveChatRoom
} from '../../actions/chat-actions';

// ============================================================================
// CHAT API ROUTES
// ============================================================================

/**
 * POST /api/chat - Create room or send message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create_room': {
        const result = await createChatRoom(userId, data);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.room,
        });
      }

      case 'send_message': {
        const result = await sendChatMessage(userId, data);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.message,
        });
      }

      case 'join_room': {
        const { roomId } = data;
        const result = await joinChatRoom(userId, roomId);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Successfully joined room',
        });
      }

      case 'leave_room': {
        const { roomId } = data;
        const result = await leaveChatRoom(userId, roomId);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Successfully left room',
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat - Get rooms or messages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const roomId = searchParams.get('roomId');
    const limit = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (roomId) {
      // Get messages for a specific room
      const result = await getChatMessages(
        roomId, 
        limit ? parseInt(limit) : undefined
      );
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.messages,
      });
    } else {
      // Get user's rooms
      const result = await getUserChatRooms(userId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rooms,
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
