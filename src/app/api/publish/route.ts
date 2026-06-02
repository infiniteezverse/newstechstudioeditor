import { NextRequest, NextResponse } from "next/server";

interface PublishPayload {
  channelId: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  scheduleTime?: string; // ISO 8601 format
}

// Platform-specific publish handlers
const publishHandlers: Record<string, (payload: PublishPayload) => Promise<{ success: boolean; id?: string; error?: string }>> = {
  twitter: async (payload) => {
    // Twitter API v2 endpoint: POST /2/tweets
    // Requires: tweet.write scope
    try {
      // In production: call Twitter API with OAuth credentials
      console.log(`Publishing to Twitter: ${payload.title.substring(0, 50)}...`);
      return { success: true, id: `tw-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Twitter" };
    }
  },

  linkedin: async (payload) => {
    // LinkedIn API endpoint: /rest/posts
    // Requires: r_basicprofile, w_member_social scopes
    try {
      console.log(`Publishing to LinkedIn: ${payload.title}`);
      return { success: true, id: `li-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to LinkedIn" };
    }
  },

  medium: async (payload) => {
    // Medium API: POST /v1/me/posts
    // Requires: basic profile, publish, stories, list read, comment write
    try {
      console.log(`Publishing to Medium: ${payload.title}`);
      return { success: true, id: `med-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Medium" };
    }
  },

  substack: async (payload) => {
    // Substack API: POST /api/v1/posts
    try {
      console.log(`Publishing to Substack: ${payload.title}`);
      return { success: true, id: `sub-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Substack" };
    }
  },

  beehiiv: async (payload) => {
    // beehiiv API: POST /v1/posts
    try {
      console.log(`Publishing to beehiiv: ${payload.title}`);
      return { success: true, id: `bee-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to beehiiv" };
    }
  },

  ghost: async (payload) => {
    // Ghost API: POST /ghost/api/v3/content/posts/
    try {
      console.log(`Publishing to Ghost: ${payload.title}`);
      return { success: true, id: `gh-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Ghost" };
    }
  },

  devto: async (payload) => {
    // Dev.to API: POST /api/articles
    try {
      console.log(`Publishing to Dev.to: ${payload.title}`);
      return { success: true, id: `dev-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Dev.to" };
    }
  },

  hashnode: async (payload) => {
    // Hashnode API: GraphQL mutation
    try {
      console.log(`Publishing to Hashnode: ${payload.title}`);
      return { success: true, id: `hash-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Hashnode" };
    }
  },

  reddit: async (payload) => {
    // Reddit API: POST /api/submit
    try {
      console.log(`Publishing to Reddit: ${payload.title}`);
      return { success: true, id: `red-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Reddit" };
    }
  },

  lens: async (payload) => {
    // Lens Protocol: GraphQL mutation createPost
    try {
      console.log(`Publishing to Lens: ${payload.title}`);
      return { success: true, id: `lens-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Lens" };
    }
  },

  mirror: async (payload) => {
    // Mirror: Arweave transaction
    try {
      console.log(`Publishing to Mirror: ${payload.title}`);
      return { success: true, id: `mirror-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Mirror" };
    }
  },

  farcaster: async (payload) => {
    // Farcaster: POST cast to hub
    try {
      console.log(`Publishing to Farcaster: ${payload.title}`);
      return { success: true, id: `fc-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to publish to Farcaster" };
    }
  },

  rss: async (payload) => {
    // RSS: Generate feed item (no actual publish needed)
    try {
      console.log(`Added to RSS feed: ${payload.title}`);
      return { success: true, id: `rss-${Date.now()}` };
    } catch (error) {
      return { success: false, error: "Failed to add to RSS feed" };
    }
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channels, title, content, excerpt, tags, scheduleTime } = body;

    if (!channels || !Array.isArray(channels) || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: channels, title, content" },
        { status: 400 }
      );
    }

    const results: Record<string, any> = {};

    // Publish to each requested channel
    for (const channelId of channels) {
      const handler = publishHandlers[channelId];
      if (handler) {
        results[channelId] = await handler({
          channelId,
          title,
          content,
          excerpt,
          tags,
          scheduleTime,
        });
      } else {
        results[channelId] = { success: false, error: "No handler for this channel" };
      }
    }

    const allSuccess = Object.values(results).every((r: any) => r.success);

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
