import { NextRequest, NextResponse } from "next/server";
import { onAddWaitlist, getWaitlistEntry, getWaitlistStats } from "@/actions/waitlist-actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, referralCode } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Use the server action to add to waitlist
    const result = await onAddWaitlist({
      email,
      name,
      referralCode,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'This email is already on the waitlist' ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.entry!.id,
        position: result.entry!.position,
        status: result.entry!.status,
      },
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      // Get specific entry using server action
      const result = await getWaitlistEntry(email);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: result.entry!.id,
          position: result.entry!.position,
          status: result.entry!.status,
          createdAt: result.entry!.createdAt,
        },
      });
    }

    // Get waitlist statistics (admin only - you'd add auth here)
    const stats = await getWaitlistStats();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        message: 'Use ?email=user@example.com to get specific entry details',
      },
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}