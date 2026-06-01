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
        height: "44px",
        background: "white",
        borderBottom: "1px solid var(--rule-heavy)",
      }}
    >
      {/* Date */}
      <div
        className="flex items-center shrink-0 h-full px-5"
        style={{ borderRight: "1px solid var(--rule)" }}
      >
        <span className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
          {dateStr.toUpperCase()}
        </span>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 flex-1 h-full px-4"
        style={{
          borderRight: "1px solid var(--rule)",
          borderBottom: focused ? "2px solid var(--accent)" : "2px solid transparent",
          marginBottom: "-1px",
          transition: "border-color 0.1s",
        }}
      >
        <Search size={11} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search articles, topics, signals..."
          style={{ flex: 1, fontSize: "12.5px", color: "var(--ink)", background: "transparent" }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <kbd
          className="mono shrink-0"
          style={{
            fontSize: "9px", color: "var(--ink-4)",
            border: "1px solid var(--rule)", padding: "1px 6px",
            background: "var(--canvas-2)", lineHeight: 1.6,
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center h-full">
        <button
          className="relative flex items-center justify-center h-full px-4"
          style={{ color: "var(--ink-3)", borderRight: "1px solid var(--rule)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F8F8F6")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Bell size={13} strokeWidth={1.5} />
          <span
            style={{ position: "absolute", top: "10px", right: "12px", width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }}
          />
        </button>

        <button
          className="flex items-center gap-2 h-full px-4"
          style={{ color: "var(--ink-2)", fontSize: "11.5px", fontWeight: 500, borderRight: "1px solid var(--rule)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F8F8F6")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Wallet size={12} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
          Connect Wallet
        </button>

        <button
          className="flex items-center gap-2 h-full px-4"
          style={{ color: "var(--ink-2)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F8F8F6")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span
            className="serif flex items-center justify-center"
            style={{
              width: "26px", height: "26px",
              background: "var(--accent)",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            E
          </span>
        </button>
      </div>
    </header>
  );
}
