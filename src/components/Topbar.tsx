"use client";

import { useState } from "react";
import { Search, Bell, Wallet } from "lucide-react";

export default function Topbar() {
  const [focused, setFocused] = useState(false);

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <header
      className="flex items-center shrink-0"
      style={{
        height: "48px",
        background: "white",
        borderBottom: "2px solid var(--rule-heavy)",
      }}
    >
      {/* Date */}
      <div
        className="flex items-center shrink-0 h-full"
        style={{ padding: "0 20px", borderRight: "1px solid var(--rule-heavy)", minWidth: "220px" }}
      >
        <span className="mono" style={{ fontSize: "10px", color: "var(--ink-2)", letterSpacing: "0.08em", whiteSpace: "nowrap", fontWeight: 500 }}>
          {dateStr.toUpperCase()}
        </span>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-3 flex-1 h-full"
        style={{
          padding: "0 20px",
          borderRight: "1px solid var(--rule-heavy)",
          borderBottom: focused ? "2px solid var(--accent)" : "2px solid transparent",
          marginBottom: "-2px",
          transition: "border-color 0.15s",
          background: focused ? "#FAFAF8" : "transparent",
        }}
      >
        <Search size={13} style={{ color: focused ? "var(--accent)" : "var(--ink-3)", flexShrink: 0, transition: "color 0.15s" }} />
        <input
          type="text"
          placeholder="Search articles, topics, signals..."
          style={{ flex: 1, fontSize: "13px", color: "var(--ink)", background: "transparent", letterSpacing: "0.01em" }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <kbd
          className="mono shrink-0"
          style={{
            fontSize: "9.5px", color: "var(--ink-3)",
            border: "1px solid var(--rule-heavy)", padding: "2px 7px",
            background: "var(--canvas)", lineHeight: 1.6, letterSpacing: "0.05em",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center h-full">

        {/* Bell */}
        <button
          className="relative flex items-center justify-center h-full"
          style={{ color: "var(--ink-2)", borderRight: "1px solid var(--rule-heavy)", padding: "0 18px", transition: "background 0.12s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F4F4F0"; (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
        >
          <Bell size={14} strokeWidth={1.5} />
          <span style={{ position: "absolute", top: "11px", right: "13px", width: "6px", height: "6px", borderRadius: "50%", background: "#C0392B", border: "1.5px solid white" }} />
        </button>

        {/* Connect Wallet */}
        <button
          className="flex items-center gap-2 h-full"
          style={{ color: "var(--ink)", fontSize: "12px", fontWeight: 500, borderRight: "1px solid var(--rule-heavy)", padding: "0 18px", letterSpacing: "0.01em", transition: "background 0.12s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F4F4F0"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <Wallet size={13} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
          Connect Wallet
        </button>

        {/* Avatar */}
        <button
          className="flex items-center justify-center h-full"
          style={{ padding: "0 18px", transition: "background 0.12s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F4F4F0"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
        >
          <span
            className="serif flex items-center justify-center"
            style={{ width: "28px", height: "28px", background: "#000", color: "white", fontSize: "12px", fontWeight: 700, letterSpacing: "0.02em" }}
          >
            E
          </span>
        </button>
      </div>
    </header>
  );
}
