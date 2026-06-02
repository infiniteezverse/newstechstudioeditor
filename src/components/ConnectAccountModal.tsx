"use client";

import { useState } from "react";
import { X, Loader } from "lucide-react";

export type ChannelId = "twitter" | "farcaster" | "linkedin" | "medium" | "substack" | "beehiiv" | "ghost" | "devto" | "hashnode" | "lens" | "mirror" | "reddit" | "make" | "rss";

interface ConnectAccountModalProps {
  channelId: ChannelId;
  channelLabel: string;
  onClose: () => void;
  onConnect: (credentials: Record<string, string>) => Promise<void>;
}

const CHANNEL_CONFIG: Record<ChannelId, { requiresAuth: "oauth" | "api-key" | "url"; description: string; instructions: string; fields: string[] }> = {
  twitter: {
    requiresAuth: "oauth",
    description: "Connect your X/Twitter account for direct posting",
    instructions: "You'll be redirected to X to authorize this application",
    fields: [],
  },
  farcaster: {
    requiresAuth: "api-key",
    description: "Connect your Farcaster account",
    instructions: "Get your Farcaster Signer from warpcast.com/settings",
    fields: ["signerKey"],
  },
  linkedin: {
    requiresAuth: "oauth",
    description: "Connect your LinkedIn account",
    instructions: "You'll be redirected to LinkedIn to authorize this application",
    fields: [],
  },
  medium: {
    requiresAuth: "api-key",
    description: "Connect your Medium account",
    instructions: "Get your API token from medium.com/me/settings",
    fields: ["apiToken"],
  },
  substack: {
    requiresAuth: "api-key",
    description: "Connect your Substack publication",
    instructions: "Get your API key from substack.com/settings/api",
    fields: ["apiKey", "publicationId"],
  },
  beehiiv: {
    requiresAuth: "api-key",
    description: "Connect your beehiiv account",
    instructions: "Get your API key from app.beehiiv.com/settings/integrations",
    fields: ["apiKey"],
  },
  ghost: {
    requiresAuth: "api-key",
    description: "Connect your Ghost publication",
    instructions: "Get your content API key from your Ghost admin panel",
    fields: ["ghostUrl", "apiKey"],
  },
  devto: {
    requiresAuth: "api-key",
    description: "Connect your Dev.to account",
    instructions: "Get your API key from dev.to/settings/account",
    fields: ["apiKey"],
  },
  hashnode: {
    requiresAuth: "api-key",
    description: "Connect your Hashnode account",
    instructions: "Get your API key from hashnode.com/settings/developer",
    fields: ["apiKey"],
  },
  lens: {
    requiresAuth: "api-key",
    description: "Connect your Lens Protocol account",
    instructions: "Get your Lens handle and verify ownership",
    fields: ["lensHandle"],
  },
  mirror: {
    requiresAuth: "api-key",
    description: "Connect your Mirror account",
    instructions: "Connect your Web3 wallet to Mirror",
    fields: ["walletAddress"],
  },
  reddit: {
    requiresAuth: "oauth",
    description: "Connect your Reddit account",
    instructions: "You'll be redirected to Reddit to authorize this application",
    fields: [],
  },
  make: {
    requiresAuth: "api-key",
    description: "Connect your Make.com workspace",
    instructions: "Get your API token from make.com/user/api",
    fields: ["apiToken"],
  },
  rss: {
    requiresAuth: "url",
    description: "Set up RSS feed for your publications",
    instructions: "Configure RSS feed URL for content syndication",
    fields: ["feedUrl"],
  },
};

export default function ConnectAccountModal({ channelId, channelLabel, onClose, onConnect }: ConnectAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const config = CHANNEL_CONFIG[channelId];

  async function handleConnect() {
    setLoading(true);
    try {
      await onConnect(credentials);
    } finally {
      setLoading(false);
    }
  }

  function handleOAuthClick() {
    // In real implementation, this would redirect to OAuth endpoint
    // e.g., window.location.href = `/api/auth/${channelId}`;
    alert(`OAuth flow for ${channelLabel} - implement in backend`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col"
        style={{
          background: "white",
          borderRadius: "4px",
          width: "90%",
          maxWidth: "420px",
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div>
            <h3 className="serif" style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>
              Connect {channelLabel}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "4px" }}>
              {config.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: "var(--ink-3)", padding: "4px", flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", flex: 1 }}>
          <p style={{ fontSize: "12.5px", color: "var(--ink-2)", marginBottom: "16px", lineHeight: 1.6 }}>
            {config.instructions}
          </p>

          {config.requiresAuth === "oauth" ? (
            <button
              onClick={handleOAuthClick}
              disabled={loading}
              className="w-full mono"
              style={{
                padding: "12px",
                fontSize: "11px",
                letterSpacing: "0.1em",
                fontWeight: 600,
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: "2px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={12} className="animate-spin" />
                  CONNECTING...
                </span>
              ) : (
                `AUTHORIZE ${channelLabel.toUpperCase()}`
              )}
            </button>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                {config.fields.map(field => (
                  <div key={field}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: "var(--ink-3)",
                        marginBottom: "4px",
                        letterSpacing: "0.05em",
                        fontWeight: 600,
                      }}
                    >
                      {field === "apiToken" ? "API Token" :
                       field === "apiKey" ? "API Key" :
                       field === "ghostUrl" ? "Ghost URL" :
                       field === "publicationId" ? "Publication ID" :
                       field === "signerKey" ? "Signer Key" :
                       field === "feedUrl" ? "Feed URL" :
                       field === "walletAddress" ? "Wallet Address" :
                       field === "lensHandle" ? "Lens Handle" :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field.includes("Token") || field.includes("Key") || field === "signerKey" ? "password" : "text"}
                      value={credentials[field] || ""}
                      onChange={e =>
                        setCredentials(prev => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      placeholder={field === "ghostUrl" ? "https://your-ghost-site.com" : ""}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        fontSize: "12px",
                        border: "1px solid var(--rule)",
                        borderRadius: "2px",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleConnect}
                disabled={loading || config.fields.some(f => !credentials[f])}
                className="w-full mono"
                style={{
                  padding: "12px",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  cursor: loading || config.fields.some(f => !credentials[f]) ? "not-allowed" : "pointer",
                  opacity: loading || config.fields.some(f => !credentials[f]) ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size={12} className="animate-spin" />
                    CONNECTING...
                  </span>
                ) : (
                  "CONNECT"
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--rule)",
            background: "#F8F8F5",
          }}
        >
          <p style={{ fontSize: "10px", color: "var(--ink-4)", lineHeight: 1.5 }}>
            Your credentials are encrypted and stored securely. We never share your account access with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
