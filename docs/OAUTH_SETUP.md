# OAuth Setup Guide for Tech News Studio

## Twitter/X OAuth 2.0 Configuration

### 1. Create Twitter Developer Application

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or select existing one
3. Go to **Settings** → **Authentication Settings**
4. Enable **OAuth 2.0**
5. Set **App Type** to "Web App"
6. Under **App Permissions**, select:
   - `tweet.read`
   - `tweet.write`
   - `users.read`
   - `follows.read`
   - `follows.write`

7. Add **Callback URI** (or **Redirect URI**):
   ```
   http://localhost:3000/api/auth/twitter/callback     # Development
   https://yourdomain.com/api/auth/twitter/callback     # Production
   ```

8. Copy your credentials:
   - **Client ID**
   - **Client Secret**

### 2. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# Twitter OAuth
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your domain in production
```

### 3. How OAuth Flow Works

#### User Flow:
1. User clicks "CONNECT" button on Twitter channel in Distribution Hub
2. Modal opens with "AUTHORIZE TWITTER" button
3. User clicks button → redirected to `https://twitter.com/i/oauth2/authorize`
4. User logs in and authorizes app
5. Twitter redirects back to `/api/auth/twitter/callback` with authorization code
6. Backend exchanges code for access token using PKCE
7. User info is fetched and stored
8. Redirect to success page
9. Token is stored in cookie for subsequent API calls

#### Technical Details:

**Security Features:**
- PKCE (Proof Key for Code Exchange) - prevents code interception
- State parameter - prevents CSRF attacks
- HttpOnly cookies - protects tokens from JavaScript access
- Secure flag in production - enforces HTTPS
- Token expiration - access tokens refresh automatically

**Endpoints:**
- `/api/auth/twitter/authorize` - Generates OAuth authorization URL
- `/api/auth/twitter/callback` - Handles OAuth callback and exchanges code for token

**Token Storage:**
- Currently: In-memory storage (resets on server restart)
- Production: Should use encrypted database with secure key management
- Tokens never exposed to frontend
- Only secure HTTP-only cookies sent to browser

### 4. LinkedIn OAuth Setup (Similar Pattern)

```bash
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
```

Scopes needed:
- `r_basicprofile` - Read user profile
- `w_member_social` - Write posts to member social feed

### 5. Publishing Flow

Once authenticated:

1. User writes content in editor
2. Clicks "PUBLISH" button
3. PublishModal shows connected channels
4. User selects channels to publish to
5. Clicks "PUBLISH TO X CHANNELS"
6. Backend retrieves stored token from secure storage
7. Content is posted to each selected channel using that channel's API
8. Results shown with success/failure status and URLs

### 6. Token Refresh (Production)

Twitter access tokens expire. For production:

```typescript
// Implement token refresh in /api/auth/twitter/refresh
export async function refreshTwitterToken(userId: string) {
  const storedToken = getStoredToken(userId);
  
  const response = await fetch("https://twitter.com/i/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: storedToken.refreshToken,
      client_id: TWITTER_CLIENT_ID,
      client_secret: TWITTER_CLIENT_SECRET,
    }),
  });

  // Store new tokens
  // Return new access token
}
```

### 7. Error Handling

Common OAuth errors:
- `access_denied` - User rejected authorization
- `invalid_scope` - App requested unavailable permissions
- `invalid_state` - CSRF protection triggered (state mismatch)
- `token_exchange_failed` - Code couldn't be exchanged for token

All errors redirect to `/auth/error` with details.

### 8. Testing Locally

1. Set up `.env.local` with your Twitter credentials
2. Run `npm run dev`
3. Navigate to Distribution Hub
4. Click "CONNECT" on Twitter
5. Authorize the app
6. You should see success page with your Twitter username

### 9. Production Deployment

**On Vercel:**
1. Add environment variables in Project Settings → Environment Variables
2. Update callback URI to production domain
3. Deploy

**Important:**
- Use secure token storage (encrypted database)
- Implement token refresh logic
- Add rate limiting to `/api/publish` endpoint
- Log OAuth events for debugging
- Monitor token expiration and refresh failures

### 10. Other Platforms

Once Twitter OAuth works, implement for:

**OAuth 2.0 (Similar Pattern):**
- LinkedIn
- Reddit
- (Add others as needed)

**API Key Based:**
- Medium, Substack, beehiiv, Ghost, Dev.to, Hashnode
- Store API keys securely in database
- Never expose to frontend

**Web3 (Different Pattern):**
- Lens Protocol - Use Lens SDK
- Mirror - Use Arweave/Web3 wallet
- Require user's Web3 wallet connection first

### 11. Troubleshooting

**"Twitter OAuth not configured"**
- Check that `TWITTER_CLIENT_ID` is set in environment
- Verify in `.env.local` or Vercel environment variables

**"Invalid state parameter"**
- Clear cookies: `document.cookie = "oauth_state=; max-age=0"`
- Try again
- State token expires after 10 minutes

**"Callback URI mismatch"**
- Ensure callback URI in Twitter app settings matches `NEXT_PUBLIC_APP_URL/api/auth/twitter/callback`
- Check for trailing slashes
- Production vs development mismatch

**Publishing returns 401**
- Token expired - user needs to reconnect
- Implement token refresh endpoint
- Redirect user to reconnect

## Security Best Practices

1. **Never log tokens** - Log only token IDs
2. **Rotate secrets regularly** - Especially in development
3. **Use HTTPS in production** - Secure flag requires it
4. **Implement rate limiting** - Prevent abuse
5. **Audit token usage** - Log who published what and when
6. **Expire sessions** - Automatic logout after period of inactivity
7. **Revoke tokens** - Let users disconnect accounts
8. **Monitor scopes** - Only request necessary permissions
