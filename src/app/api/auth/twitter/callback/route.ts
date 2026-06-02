import { NextRequest, NextResponse } from "next/server";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || "";
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`
  : "http://localhost:3000/api/auth/twitter/callback";

// In-memory token storage (production: use encrypted database)
const tokenStorage: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Check for errors from Twitter
    if (error) {
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=${error}&description=${errorDescription || ""}`,
          request.nextUrl.origin
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/error?error=no_code", request.nextUrl.origin)
      );
    }

    // Verify state
    const storedState = request.cookies.get("oauth_state")?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL("/auth/error?error=invalid_state", request.nextUrl.origin)
      );
    }

    // Get PKCE verifier
    const codeVerifier = request.cookies.get("pkce_verifier")?.value;
    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL("/auth/error?error=no_verifier", request.nextUrl.origin)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://twitter.com/i/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: TWITTER_CLIENT_ID,
        client_secret: TWITTER_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=token_exchange_failed&details=${encodeURIComponent(error)}`,
          request.nextUrl.origin
        )
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();

    // Store tokens securely (in production: encrypt and store in database)
    const tokenId = `twitter_${userData.data.id}`;
    tokenStorage[tokenId] = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      userId: userData.data.id,
      username: userData.data.username,
      name: userData.data.name,
      connectedAt: new Date().toISOString(),
    };

    // Clear OAuth cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Connected to Twitter successfully",
        user: {
          id: userData.data.id,
          username: userData.data.username,
          name: userData.data.name,
        },
        tokenId,
      },
      { status: 200 }
    );

    response.cookies.delete("oauth_state");
    response.cookies.delete("pkce_verifier");

    // Set secure cookie with token reference
    response.cookies.set("twitter_token_id", tokenId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Redirect to success page with message
    return NextResponse.redirect(
      new URL(
        `/auth/success?service=twitter&username=${userData.data.username}`,
        request.nextUrl.origin
      )
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=callback_error&details=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.nextUrl.origin
      )
    );
  }
}

// Export for use by other parts of the app
export function getStoredTokens() {
  return tokenStorage;
}

export function getTwitterToken(userId: string) {
  const tokenId = `twitter_${userId}`;
  return tokenStorage[tokenId];
}

export function refreshTwitterToken(userId: string) {
  // Implement token refresh logic
  return null;
}
