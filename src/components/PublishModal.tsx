"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { X } from "lucide-react";

interface PublishModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  connectedChannels: string[];
}

export default function PublishModal({ title, content, isOpen, onClose, connectedChannels }: PublishModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(connectedChannels));
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});

  const allChannels = [
    "twitter",
    "linkedin",
    "medium",
    "substack",
    "beehiiv",
    "ghost",
    "devto",
    "hashnode",
    "farcaster",
    "reddit",
    "lens",
    "mirror",
    "make",
    "rss",
  ];

  const channelLabels: Record<string, string> = {
    twitter: "𝕏 Twitter",
    linkedin: "LinkedIn",
    medium: "Medium",
    substack: "Substack",
    beehiiv: "beehiiv",
    ghost: "Ghost",
    devto: "Dev.to",
    hashnode: "Hashnode",
    farcaster: "Farcaster",
    reddit: "Reddit",
    lens: "Lens",
    mirror: "Mirror",
    make: "Make.com",
    rss: "RSS Feed",
  };

  async function handlePublish() {
    if (selectedChannels.size === 0) return;

    setPublishing(true);
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channels: Array.from(selectedChannels),
          title,
          content,
          tags: [],
        }),
      });

      const data = await response.json();
      setResults(data.results || {});
    } catch (error) {
      console.error("Publish error:", error);
      setResults({});
    } finally {
      setPublishing(false);
    }
  }

  if (!isOpen) return null;

  const publishedCount = Object.values(results).filter((r: any) => r.success).length;

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
          maxWidth: "520px",
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
              Publish to Distribution
            </h3>
            <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "4px" }}>
              Send your story to {connectedChannels.length} connected channels
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
        <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
          {Object.keys(results).length > 0 ? (
            // Results view
            <div>
              <p className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", letterSpacing: "0.1em", marginBottom: "12px" }}>
                PUBLISH RESULTS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.entries(results).map(([channel, result]: any) => (
                  <div
                    key={channel}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      border: "1px solid var(--rule)",
                      borderRadius: "2px",
                      background: result.success ? "#F0F8F5" : "#FDF5F5",
                    }}
                  >
                    {result.success ? (
                      <CheckCircle size={16} style={{ color: "var(--bull)", flexShrink: 0 }} />
                    ) : (
                      <AlertCircle size={16} style={{ color: "var(--bear)", flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--ink)" }}>
                        {channelLabels[channel] || channel}
                      </p>
                      {result.success ? (
                        <p style={{ fontSize: "11px", color: "var(--ink-3)" }}>Published successfully</p>
                      ) : (
                        <p style={{ fontSize: "11px", color: "var(--bear)" }}>{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full mono"
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                CLOSE
              </button>
            </div>
          ) : (
            // Channel selection view
            <>
              <p className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", letterSpacing: "0.1em", marginBottom: "12px" }}>
                SELECT CHANNELS TO PUBLISH
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
                {connectedChannels.map(channel => (
                  <label
                    key={channel}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      border: "1px solid var(--rule)",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.has(channel)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedChannels(prev => new Set([...prev, channel]));
                        } else {
                          setSelectedChannels(prev => {
                            const next = new Set(prev);
                            next.delete(channel);
                            return next;
                          });
                        }
                      }}
                      style={{ accentColor: "var(--accent)", width: "14px", height: "14px" }}
                    />
                    <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--ink)" }}>
                      {channelLabels[channel] || channel}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handlePublish}
                disabled={publishing || selectedChannels.size === 0}
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
                  cursor: publishing || selectedChannels.size === 0 ? "not-allowed" : "pointer",
                  opacity: publishing || selectedChannels.size === 0 ? 0.6 : 1,
                }}
              >
                {publishing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size={12} className="animate-spin" />
                    PUBLISHING...
                  </span>
                ) : (
                  `PUBLISH TO ${selectedChannels.size} CHANNEL${selectedChannels.size !== 1 ? "S" : ""}`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
