import { NextRequest, NextResponse } from "next/server";

// Twitter OAuth 2.0 Configuration
// Get these from https://developer.twitter.com/en/portal/dashboard
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || "";
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback` : "http://localhost:3000/api/auth/twitter/callback";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // If this is a callback from Twitter OAuth
  if (code) {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch("https://twitter.com/i/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
          code_verifier: "challenge", // In production, use real PKCE
        }).toString(),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const tokenData = await tokenResponse.json();

      // In production: Store this token securely in database with encryption
      // For now, return it so client can store temporarily
      return NextResponse.json({
        success: true,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      });
    } catch (error) {
      console.error("OAuth error:", error);
      return NextResponse.json({ error: "OAuth authentication failed" }, { status: 400 });
    }
  }

  // Initial OAuth request - redirect to Twitter
  const scope = ["tweet.read", "tweet.write", "users.read", "offline.access"];
  const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
  authUrl.searchParams.set("client_id", TWITTER_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope.join(" "));
  authUrl.searchParams.set("state", "state-" + Math.random().toString(36).substr(2, 9));

  return NextResponse.redirect(authUrl.toString());
}
