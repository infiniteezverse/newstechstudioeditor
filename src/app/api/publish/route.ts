import { NextRequest, NextResponse } from "next/server";
import {
  publishToTwitter,
  publishToLinkedIn,
  publishToMedium,
  publishToSubstack,
  publishToBeehiiv,
  publishToGhost,
  publishToDevto,
  publishToHashnode,
  publishToReddit,
  publishToLens,
  publishToMirror,
  publishToFarcaster,
  publishToMake,
  publishToRSS,
  type PublishConfig,
  type PublishResult,
} from "@/lib/publishers";

interface PublishPayload {
  channels: string[];
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  scheduleTime?: string;
  credentials?: Record<string, Record<string, string>>;
}

// Map channel IDs to publisher functions
const publishHandlers: Record<string, (config: PublishConfig) => Promise<PublishResult>> = {
  twitter: publishToTwitter,
  linkedin: publishToLinkedIn,
  medium: publishToMedium,
  substack: publishToSubstack,
  beehiiv: publishToBeehiiv,
  ghost: publishToGhost,
  devto: publishToDevto,
  hashnode: publishToHashnode,
  reddit: publishToReddit,
  lens: publishToLens,
  mirror: publishToMirror,
  farcaster: publishToFarcaster,
  make: publishToMake,
  rss: publishToRSS,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PublishPayload;
    const { channels, title, content, excerpt, tags, scheduleTime, credentials } = body;

    if (!channels || !Array.isArray(channels) || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: channels, title, content" },
        { status: 400 }
      );
    }

    const results: Record<string, PublishResult> = {};

    // Publish to each requested channel
    for (const channelId of channels) {
      const handler = publishHandlers[channelId];
      if (handler) {
        // In production: fetch credentials from secure storage
        const channelCredentials = credentials?.[channelId] || {};
        results[channelId] = await handler({
          channelId,
          title,
          content,
          excerpt,
          tags,
          scheduleTime,
          credentials: channelCredentials,
        });
      } else {
        results[channelId] = { success: false, error: "No handler for this channel" };
      }
    }

    const allSuccess = Object.values(results).every((r) => r.success);

    return NextResponse.json({
      success: allSuccess,
      results,
      publishedTo: Object.keys(results).filter(ch => results[ch].success),
      failedChannels: Object.keys(results).filter(ch => !results[ch].success),
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish" },
      { status: 500 }
    );
  }
}
