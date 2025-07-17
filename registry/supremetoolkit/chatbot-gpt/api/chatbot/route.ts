import { NextRequest, NextResponse } from 'next/server';
import { sendChatCompletion , processStreamingResponse, handleOpenAIError } from '../../lib/openai';
import { sendChatbotMessage ,
  createChatbotConversation,
  getChatbotConversation,
  getUserChatbotConversations,
  updateConversationTitle,
  deleteChatbotConversation
  } from '../../actions/chatbot-actions';

// ============================================================================
// CHATBOT API ROUTES
// ============================================================================

/**
 * POST /api/chatbot - Send message or manage conversations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'send_message': {
        const { messages, userId, systemPrompt, conversationId, stream } = data;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return NextResponse.json(
            { error: 'Messages array is required' },
            { status: 400 }
          );
        }

        if (stream) {
          // Handle streaming response
          try {
            const streamResponse = await sendChatCompletion(messages, {
              systemPrompt,
              stream: true,
              userId,
            });

            // Return streaming response
            const encoder = new TextEncoder();
            const readableStream = new ReadableStream({
              async start(controller) {
                try {
                  // Check if it's a streaming response
                  if (streamResponse && 'controller' in streamResponse) {
                    for await (const chunk of processStreamingResponse(streamResponse as any)) {
                      const data = encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`);
                      controller.enqueue(data);
                    }
                  }

                  const doneData = encoder.encode('data: [DONE]\n\n');
                  controller.enqueue(doneData);
                } catch (error) {
                  const errorMessage = await handleOpenAIError(error);
                  const errorData = encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
                  controller.enqueue(errorData);
                } finally {
                  controller.close();
                }
              },
            });

            return new Response(readableStream, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
              },
            });
          } catch (error) {
            const errorMessage = await handleOpenAIError(error);
            return NextResponse.json(
              { error: errorMessage },
              { status: 500 }
            );
          }
        } else {
          // Handle non-streaming response
          const result = await sendChatbotMessage(messages, {
            userId,
            systemPrompt,
            conversationId,
            stream: false,
          });

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
      }

      case 'create_conversation': {
        const { userId, title } = data;
        const result = await createChatbotConversation(userId, title);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: result.conversation,
        });
      }

      case 'update_conversation_title': {
        const { conversationId, title, userId } = data;
        
        if (!conversationId || !title) {
          return NextResponse.json(
            { error: 'Conversation ID and title are required' },
            { status: 400 }
          );
        }

        const result = await updateConversationTitle(conversationId, title, userId);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Title updated successfully',
        });
      }

      case 'delete_conversation': {
        const { conversationId, userId } = data;
        
        if (!conversationId) {
          return NextResponse.json(
            { error: 'Conversation ID is required' },
            { status: 400 }
          );
        }

        const result = await deleteChatbotConversation(conversationId, userId);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Conversation deleted successfully',
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chatbot - Get conversations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation
      const result = await getChatbotConversation(conversationId, userId || undefined);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: result.error === 'Conversation not found' ? 404 : 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.conversation,
      });
    } else if (userId) {
      // Get user's conversations
      const result = await getUserChatbotConversations(userId);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.conversations,
      });
    } else {
      return NextResponse.json(
        { error: 'User ID or Conversation ID is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
