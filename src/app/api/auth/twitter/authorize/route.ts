import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Twitter OAuth 2.0 Configuration
// Get these from https://developer.twitter.com/en/portal/dashboard
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`
  : "http://localhost:3000/api/auth/twitter/callback";

// Generate PKCE code verifier and challenge
function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

export async function GET(request: NextRequest) {
  try {
    if (!TWITTER_CLIENT_ID) {
      return NextResponse.json(
        { error: "Twitter OAuth not configured. Set TWITTER_CLIENT_ID environment variable." },
        { status: 500 }
      );
    }

    // Generate state and PKCE
    const state = crypto.randomBytes(16).toString("hex");
    const { codeVerifier, codeChallenge } = generatePKCE();

    // Create authorization URL
    const params = new URLSearchParams({
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: ["tweet.read", "tweet.write", "users.read", "follows.read", "follows.write"].join(" "),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

    // Store state and verifier in response cookie for verification in callback
    const response = NextResponse.json({ authUrl });
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });
    response.cookies.set("pkce_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("OAuth authorize error:", error);
    return NextResponse.json({ error: "Failed to generate authorization URL" }, { status: 500 });
  }
}
