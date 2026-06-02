"use client";

import { Send, CheckCircle, Clock, AlertCircle } from "lucide-react";

const CHANNELS = [
  // Social & Community
  { id: "twitter",    label: "𝕏 Twitter",       connected: true,  followers: "12.4K", lastPost: "2h ago", category: "Social" },
  { id: "farcaster",  label: "Farcaster",       connected: true,  followers: "3.1K",  lastPost: "5h ago", category: "Social" },
  { id: "linkedin",   label: "LinkedIn",        connected: false, followers: "—",     lastPost: "—",      category: "Social" },
  { id: "reddit",     label: "Reddit",          connected: false, followers: "—",     lastPost: "—",      category: "Community" },

  // Content Platforms
  { id: "medium",     label: "Medium",          connected: false, followers: "—",     lastPost: "—",      category: "Content" },
  { id: "substack",   label: "Substack",        connected: false, followers: "—",     lastPost: "—",      category: "Content" },
  { id: "beehiiv",    label: "beehiiv",         connected: false, followers: "—",     lastPost: "—",      category: "Content" },
  { id: "ghost",      label: "Ghost",           connected: false, followers: "—",     lastPost: "—",      category: "Content" },

  // Developer/Technical
  { id: "devto",      label: "Dev.to",          connected: false, followers: "—",     lastPost: "—",      category: "Developer" },
  { id: "hashnode",   label: "Hashnode",        connected: false, followers: "—",     lastPost: "—",      category: "Developer" },
  { id: "lens",       label: "Lens",            connected: false, followers: "—",     lastPost: "—",      category: "Web3" },
  { id: "mirror",     label: "Mirror",          connected: false, followers: "—",     lastPost: "—",      category: "Web3" },

  // Automation & Syndication
  { id: "make",       label: "Make.com",        connected: false, followers: "—",     lastPost: "—",      category: "Automation" },
  { id: "rss",        label: "RSS Feed",        connected: false, followers: "—",     lastPost: "—",      category: "Syndication" },
];

const QUEUE = [
  { title: "Base Network Hits 10M Daily Transactions", channel: "𝕏 Twitter",  status: "scheduled", time: "Today 2:00 PM" },
  { title: "SEC Drops Long-Running Uniswap Investigation", channel: "Farcaster", status: "scheduled", time: "Today 3:30 PM" },
  { title: "BlackRock's On-Chain Treasury Fund Crosses $8B", channel: "𝕏 Twitter", status: "published", time: "Yesterday" },
  { title: "Anthropic Releases Claude 4.8", channel: "LinkedIn",   status: "draft",  time: "—" },
];

const STATUS_STYLE: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  scheduled: { icon: <Clock size={10} />,         color: "#92400E", label: "SCHEDULED" },
  published:  { icon: <CheckCircle size={10} />,  color: "var(--bull)", label: "PUBLISHED" },
  draft:      { icon: <AlertCircle size={10} />,  color: "var(--ink-3)", label: "DRAFT" },
};

export default function DistributionHub() {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--canvas)" }}>

      {/* ── Header ── */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "2px solid var(--rule-heavy)", background: "white" }}>
        <div className="flex items-center gap-3">
          <Send size={16} style={{ color: "var(--accent)" }} />
          <div>
            <h2 className="serif" style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              Distribution
            </h2>
            <p className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", letterSpacing: "0.1em", marginTop: "2px" }}>
              CHANNELS · QUEUE · PUBLISH HISTORY
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "900px" }}>

        {/* ── Channels ── */}
        <div style={{ marginBottom: "36px" }}>
          <p className="kicker" style={{ marginBottom: "16px" }}>Distribution Channels</p>

          {/* Group channels by category */}
          {["Social", "Content", "Developer", "Web3", "Community", "Automation", "Syndication"].map(category => {
            const categoryChannels = CHANNELS.filter(ch => ch.category === category);
            if (categoryChannels.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: "24px" }}>
                <p className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  {category.toUpperCase()}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px" }}>
                  {categoryChannels.map(ch => (
                    <div
                      key={ch.id}
                      style={{
                        background: "white",
                        border: `1px solid ${ch.connected ? "var(--accent-2)" : "var(--rule)"}`,
                        borderLeft: ch.connected ? "3px solid var(--accent)" : "3px solid transparent",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        opacity: ch.connected ? 1 : 0.75,
                        transition: "all 0.12s",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        if (!ch.connected) el.style.background = "#FAFAF7";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "white";
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--ink)", marginBottom: "3px" }}>{ch.label}</p>
                        {ch.connected ? (
                          <p className="mono" style={{ fontSize: "9px", color: "var(--ink-3)" }}>
                            {ch.followers} · {ch.lastPost}
                          </p>
                        ) : (
                          <p className="mono" style={{ fontSize: "9px", color: "var(--ink-4)" }}>Not connected</p>
                        )}
                      </div>
                      <button
                        className="mono shrink-0"
                        style={{
                          fontSize: "8px",
                          padding: "5px 10px",
                          letterSpacing: "0.07em",
                          fontWeight: 600,
                          background: ch.connected ? "transparent" : "var(--accent)",
                          color: ch.connected ? "var(--accent)" : "white",
                          border: ch.connected ? "1px solid var(--accent)" : "none",
                          borderRadius: "2px",
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "var(--accent)";
                          el.style.color = "white";
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = ch.connected ? "transparent" : "var(--accent)";
                          el.style.color = ch.connected ? "var(--accent)" : "white";
                        }}
                      >
                        {ch.connected ? "MANAGE" : "CONNECT"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Publish Queue ── */}
        <div>
          <p className="kicker" style={{ marginBottom: "12px" }}>Publish Queue</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)" }}>
            {QUEUE.map((item, i) => {
              const s = STATUS_STYLE[item.status];
              return (
                <div
                  key={i}
                  style={{ background: "white", padding: "12px 18px", display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--ink)", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </p>
                    <p className="mono" style={{ fontSize: "9px", color: "var(--ink-3)" }}>
                      {item.channel} · {item.time}
                    </p>
                  </div>
                  <div
                    className="mono flex items-center gap-1 shrink-0"
                    style={{ fontSize: "8.5px", color: s.color, letterSpacing: "0.07em" }}
                  >
                    {s.icon} {s.label}
                  </div>
                  {item.status !== "published" && (
                    <button
                      className="mono shrink-0"
                      style={{ fontSize: "8px", padding: "4px 9px", border: "1px solid var(--rule-heavy)", color: "var(--ink-2)", letterSpacing: "0.07em" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
                    >
                      EDIT
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
