import { NextRequest, NextResponse } from "next/server";

// In production, this would use a database like Prisma + encryption
// For now, we'll use in-memory storage (resets on server restart)
const connectedChannels: Record<string, Record<string, string>> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId, credentials } = body;

    if (!channelId || !credentials) {
      return NextResponse.json(
        { error: "Missing channelId or credentials" },
        { status: 400 }
      );
    }

    // Store credentials (in production, encrypt these!)
    connectedChannels[channelId] = credentials;

    return NextResponse.json({
      success: true,
      message: `${channelId} connected successfully`,
      channelId,
    });
  } catch (error) {
    console.error("Connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect channel" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const channelId = request.nextUrl.searchParams.get("channelId");

    if (channelId) {
      const isConnected = !!connectedChannels[channelId];
      return NextResponse.json({
        channelId,
        isConnected,
        hasCredentials: isConnected,
      });
    }

    // Return all connected channels
    const allConnected = Object.keys(connectedChannels);
    return NextResponse.json({
      connectedChannels: allConnected,
      total: allConnected.length,
    });
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json(
      { error: "Failed to query channels" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId } = body;

    if (!channelId) {
      return NextResponse.json(
        { error: "Missing channelId" },
        { status: 400 }
      );
    }

    delete connectedChannels[channelId];

    return NextResponse.json({
      success: true,
      message: `${channelId} disconnected`,
    });
  } catch (error) {
    console.error("Disconnection error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect channel" },
      { status: 500 }
    );
  }
}
