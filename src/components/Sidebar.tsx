"use client";

import { useState } from "react";
import { Rss, PenLine, Archive, Send, Settings, ChevronLeft } from "lucide-react";

const NAV = [
  { icon: Rss,     label: "Wire Feed",       id: "feed",      badge: "6" },
  { icon: PenLine, label: "Editorial Studio", id: "studio" },
  { icon: Archive, label: "Knowledge Vault",  id: "vault" },
  { icon: Send,    label: "Distribution",     id: "distribute" },
  { icon: Settings, label: "Settings",        id: "settings" },
];

const SECTIONS = ["Layer 2", "AI & LLMs", "DeFi", "Regulation", "Markets", "Infrastructure"];

interface SidebarProps {
  activeView: string;
  onViewChange: (v: string) => void;
  onSectionClick?: (section: string) => void;
}

export default function Sidebar({ activeView, onViewChange, onSectionClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{
        width: collapsed ? "48px" : "200px",
        background: "white",
        borderRight: "1px solid var(--rule-heavy)",
        transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
    >
      {/* ── Masthead ─────────────────────────────── */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "16px 18px",
          borderBottom: "2px solid #000",
          background: "#000",
          flexShrink: 0,
          display: "flex",
          alignItems: collapsed ? "center" : "flex-start",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "72px",
        }}
      >
        {!collapsed && (
          <div>
            <h1
              className="serif"
              style={{ fontSize: "16px", fontWeight: 700, color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}
            >
              Tech News Studio
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "rgba(255,255,255,0.6)", padding: "4px", flexShrink: 0, marginLeft: collapsed ? 0 : "8px" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <ChevronLeft
            size={14}
            style={{ transform: collapsed ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }}
          />
        </button>
      </div>

      {/* ── Live indicator ────────────────────────── */}
      {!collapsed && (
        <div
          className="flex items-center gap-2"
          style={{ padding: "8px 18px", borderBottom: "1px solid var(--rule)", background: "#F8F8F5", flexShrink: 0 }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0F5C2E", flexShrink: 0, display: "inline-block" }} />
          <span className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", letterSpacing: "0.08em" }}>
            LIVE ·{" "}
            <a
              href="https://cryptonewsorg.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--ink-2)", textDecoration: "underline", textUnderlineOffset: "2px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
            >
              cryptonewsorg.com
            </a>
          </span>
        </div>
      )}

      {/* ── Nav items ────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto" style={{ paddingTop: "8px" }}>
        {NAV.map(({ icon: Icon, label, id, badge }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className="w-full flex items-center text-left"
              style={{
                gap: "10px",
                padding: collapsed ? "12px 0" : "11px 18px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "#F0F4FB" : "transparent",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                color: active ? "var(--ink)" : "var(--ink-2)",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#F8F8F6"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} style={{ color: active ? "var(--accent)" : "var(--ink-3)", flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: "12.5px", fontWeight: active ? 500 : 400, flex: 1 }}>{label}</span>
                  {badge && (
                    <span
                      className="mono"
                      style={{ fontSize: "9px", background: "#EDF0F7", color: "var(--accent)", border: "1px solid rgba(10,25,49,0.12)", padding: "1px 6px" }}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {!collapsed && (
          <div style={{ marginTop: "16px", borderTop: "1px solid var(--rule)" }}>
            <div style={{ padding: "14px 18px 8px" }}>
              <p className="kicker">Sections</p>
            </div>
            {SECTIONS.map(s => (
              <button
                key={s}
                onClick={() => onSectionClick?.(s)}
                className="w-full text-left"
                style={{
                  display: "block",
                  padding: "8px 18px",
                  fontSize: "12px",
                  color: "var(--ink-2)",
                  borderBottom: "1px solid var(--canvas)",
                  background: "transparent",
                  transition: "all 0.1s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#F0F4FB";
                  (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--ink-2)";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </nav>

    </aside>
  );
}
