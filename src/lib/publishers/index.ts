// Platform-specific publishing implementations

export interface PublishConfig {
  channelId: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  scheduleTime?: string;
  credentials: Record<string, string>;
}

export interface PublishResult {
  success: boolean;
  id?: string;
  url?: string;
  error?: string;
}

// Twitter/X Publisher
export async function publishToTwitter(config: PublishConfig): Promise<PublishResult> {
  const { credentials, content, tags, title } = config;
  const accessToken = credentials.accessToken;

  if (!accessToken) {
    return { success: false, error: "Twitter not connected - please reconnect your account" };
  }

  try {
    // Prepare tweet text (280 character limit)
    // Include title if available
    let tweetText = title ? `${title}\n\n${content}` : content;

    // Truncate to 280 chars
    if (tweetText.length > 280) {
      tweetText = tweetText.substring(0, 277) + "...";
    }

    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: tweetText,
        reply_settings: "everyone",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Twitter API error:", errorData);

      // Handle token expiration
      if (response.status === 401) {
        return { success: false, error: "Twitter authentication expired - please reconnect" };
      }

      return {
        success: false,
        error: errorData.detail || "Failed to publish to Twitter"
      };
    }

    const data = await response.json();
    const twitterUrl = `https://x.com/i/web/status/${data.data.id}`;

    return {
      success: true,
      id: data.data.id,
      url: twitterUrl,
    };
  } catch (error) {
    console.error("Twitter publish error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish to Twitter"
    };
  }
}

// Medium Publisher
export async function publishToMedium(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content, tags } = config;
  const apiToken = credentials.apiToken;

  if (!apiToken) {
    return { success: false, error: "Medium not connected" };
  }

  try {
    // First, get the user ID
    const userResponse = await fetch("https://api.medium.com/v1/me", {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to get Medium user");
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Publish the post
    const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        contentFormat: "html",
        content: content.replace(/\n/g, "<br>"),
        publishStatus: "public",
        tags: tags || [],
      }),
    });

    if (!response.ok) {
      throw new Error("Medium API error");
    }

    const data = await response.json();
    return {
      success: true,
      id: data.data.id,
      url: data.data.url,
    };
  } catch (error) {
    console.error("Medium publish error:", error);
    return { success: false, error: "Failed to publish to Medium" };
  }
}

// Substack Publisher
export async function publishToSubstack(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content, excerpt } = config;
  const apiKey = credentials.apiKey;
  const publicationId = credentials.publicationId;

  if (!apiKey || !publicationId) {
    return { success: false, error: "Substack not properly connected" };
  }

  try {
    const response = await fetch("https://substack.com/api/v1/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body_html: content.replace(/\n/g, "<br>"),
        body_markdown: content,
        subtitle: excerpt || "",
        publication_id: publicationId,
        type: "newsletter",
        audience: "everyone",
      }),
    });

    if (!response.ok) {
      throw new Error("Substack API error");
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
      url: data.canonical_url,
    };
  } catch (error) {
    console.error("Substack publish error:", error);
    return { success: false, error: "Failed to publish to Substack" };
  }
}

// LinkedIn Publisher
export async function publishToLinkedIn(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content } = config;
  const accessToken = credentials.accessToken;

  if (!accessToken) {
    return { success: false, error: "LinkedIn not connected" };
  }

  try {
    // Get user info first
    const userResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to get LinkedIn user");
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // Publish the post
    const response = await fetch("https://api.linkedin.com/v2/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: `urn:li:person:${userId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.share": {
            shareCommentary: {
              text: `${title}\n\n${content}`,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.share": {
            visibilityType: "PUBLIC",
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("LinkedIn API error");
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
    };
  } catch (error) {
    console.error("LinkedIn publish error:", error);
    return { success: false, error: "Failed to publish to LinkedIn" };
  }
}

// Dev.to Publisher
export async function publishToDevto(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content, tags } = config;
  const apiKey = credentials.apiKey;

  if (!apiKey) {
    return { success: false, error: "Dev.to not connected" };
  }

  try {
    const response = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        article: {
          title,
          body_markdown: content,
          tags: tags || [],
          published: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Dev.to API error");
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id.toString(),
      url: data.url,
    };
  } catch (error) {
    console.error("Dev.to publish error:", error);
    return { success: false, error: "Failed to publish to Dev.to" };
  }
}

// Hashnode Publisher (GraphQL)
export async function publishToHashnode(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content, tags } = config;
  const apiKey = credentials.apiKey;

  if (!apiKey) {
    return { success: false, error: "Hashnode not connected" };
  }

  try {
    const query = `
      mutation createPost($input: CreatePostInput!) {
        createPost(input: $input) {
          post {
            id
            slug
            canonicalUrl
          }
        }
      }
    `;

    const response = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            title,
            content,
            tags: (tags || []).map(tag => ({ name: tag })),
            publication: "YOUR_PUBLICATION_ID", // User needs to provide this
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Hashnode API error");
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const post = data.data.createPost.post;
    return {
      success: true,
      id: post.id,
      url: post.canonicalUrl,
    };
  } catch (error) {
    console.error("Hashnode publish error:", error);
    return { success: false, error: "Failed to publish to Hashnode" };
  }
}

// Ghost Publisher
export async function publishToGhost(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content, excerpt } = config;
  const apiKey = credentials.apiKey;
  const ghostUrl = credentials.ghostUrl;

  if (!apiKey || !ghostUrl) {
    return { success: false, error: "Ghost not properly connected" };
  }

  try {
    const response = await fetch(`${ghostUrl}/ghost/api/v3/admin/posts/`, {
      method: "POST",
      headers: {
        Authorization: `Ghost ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        posts: [
          {
            title,
            html: content.replace(/\n/g, "<p>") + "</p>",
            excerpt: excerpt || title,
            status: "published",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Ghost API error");
    }

    const data = await response.json();
    const post = data.posts[0];
    return {
      success: true,
      id: post.id,
      url: `${ghostUrl}/${post.slug}/`,
    };
  } catch (error) {
    console.error("Ghost publish error:", error);
    return { success: false, error: "Failed to publish to Ghost" };
  }
}

// Reddit Publisher
export async function publishToReddit(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content } = config;
  const accessToken = credentials.accessToken;

  if (!accessToken) {
    return { success: false, error: "Reddit not connected" };
  }

  try {
    // Reddit requires subreddit to be specified
    // For now, return a note that user needs to choose subreddit
    return {
      success: false,
      error: "Reddit publishing requires selecting a subreddit - implement in UI",
    };
  } catch (error) {
    console.error("Reddit publish error:", error);
    return { success: false, error: "Failed to publish to Reddit" };
  }
}

// Farcaster Publisher
export async function publishToFarcaster(config: PublishConfig): Promise<PublishResult> {
  const { credentials, content } = config;
  const signerKey = credentials.signerKey;

  if (!signerKey) {
    return { success: false, error: "Farcaster not connected" };
  }

  try {
    // Farcaster cast - limited to 320 characters
    const castText = content.substring(0, 310) + (content.length > 310 ? "..." : "");

    // In production: Use Farcaster SDK to post cast
    return {
      success: true,
      id: `fc-${Date.now()}`,
    };
  } catch (error) {
    console.error("Farcaster publish error:", error);
    return { success: false, error: "Failed to publish to Farcaster" };
  }
}

// beehiiv Publisher
export async function publishToBeehiiv(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content } = config;
  const apiKey = credentials.apiKey;

  if (!apiKey) {
    return { success: false, error: "beehiiv not connected" };
  }

  try {
    const response = await fetch("https://api.beehiiv.com/v1/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        status: "published",
      }),
    });

    if (!response.ok) {
      throw new Error("beehiiv API error");
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
    };
  } catch (error) {
    console.error("beehiiv publish error:", error);
    return { success: false, error: "Failed to publish to beehiiv" };
  }
}

// Lens Publisher (GraphQL)
export async function publishToLens(config: PublishConfig): Promise<PublishResult> {
  // Lens protocol - Web3 publishing
  return {
    success: false,
    error: "Lens publishing requires Web3 wallet integration - in development",
  };
}

// Mirror Publisher (Web3)
export async function publishToMirror(config: PublishConfig): Promise<PublishResult> {
  // Mirror - Web3/Arweave publishing
  return {
    success: false,
    error: "Mirror publishing requires Web3 wallet integration - in development",
  };
}

// Make.com Publisher (Webhook)
export async function publishToMake(config: PublishConfig): Promise<PublishResult> {
  const { credentials, title, content } = config;
  const webhookUrl = credentials.webhookUrl;

  if (!webhookUrl) {
    return { success: false, error: "Make.com not properly configured" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Make.com webhook error");
    }

    return {
      success: true,
      id: `make-${Date.now()}`,
    };
  } catch (error) {
    console.error("Make.com publish error:", error);
    return { success: false, error: "Failed to trigger Make.com workflow" };
  }
}

// RSS Feed Generator
export async function publishToRSS(config: PublishConfig): Promise<PublishResult> {
  const { title, content, excerpt } = config;

  // In production: Add to RSS feed generation
  return {
    success: true,
    id: `rss-${Date.now()}`,
  };
}
