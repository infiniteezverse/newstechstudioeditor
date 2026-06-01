"use client";

import { useState } from "react";
import { Rss, PenLine, Archive, Send, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const NAV = [
  { icon: Rss,      label: "Wire Feed",        id: "feed",       badge: "6" },
  { icon: PenLine,  label: "Editorial Studio",  id: "studio" },
  { icon: Archive,  label: "Knowledge Vault",   id: "vault" },
  { icon: Send,     label: "Distribution",      id: "distribute" },
  { icon: Settings, label: "Settings",          id: "settings" },
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
        width: collapsed ? "48px" : "210px",
        background: "white",
        borderRight: "2px solid var(--rule-heavy)",
        transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
    >
      {/* ── Masthead ── */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "14px 16px",
          borderBottom: "2px solid var(--accent)",
          background: "var(--accent)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "64px",
        }}
      >
        {!collapsed && (
          <h1
            className="serif"
            style={{ fontSize: "15px", fontWeight: 700, color: "white", letterSpacing: "-0.01em", lineHeight: 1.25 }}
          >
            Tech News<br />Studio
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "rgba(255,255,255,0.5)", padding: "4px", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          {collapsed
            ? <ChevronRight size={13} />
            : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* ── Live indicator ── */}
      {!collapsed && (
        <div
          className="flex items-center gap-2"
          style={{ padding: "9px 16px", borderBottom: "1px solid var(--rule-heavy)", background: "#F5F5F2", flexShrink: 0 }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0F5C2E", flexShrink: 0, display: "inline-block" }} />
          <span className="mono" style={{ fontSize: "11px", color: "var(--ink-2)", letterSpacing: "0.07em", fontWeight: 500 }}>
            LIVE ·{" "}
            <a
              href="https://cryptonewsorg.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: 700 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink)")}
            >
              cryptonewsorg.com
            </a>
          </span>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto" style={{ paddingTop: "6px" }}>
        {NAV.map(({ icon: Icon, label, id, badge }) => {
          const active = activeView === id || (id === "feed" && activeView === "feed");
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className="w-full flex items-center text-left"
              style={{
                gap: "10px",
                padding: collapsed ? "12px 0" : "10px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "#ECEEF5" : "transparent",
                borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                color: active ? "var(--ink)" : "var(--ink-2)",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "#F5F5F2";
                  (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--ink-2)";
                }
              }}
            >
              <Icon
                size={14}
                strokeWidth={active ? 2 : 1.5}
                style={{ color: active ? "var(--accent)" : "var(--ink-3)", flexShrink: 0, transition: "color 0.12s" }}
              />
              {!collapsed && (
                <>
                  <span style={{ fontSize: "13px", fontWeight: active ? 600 : 400, flex: 1, letterSpacing: "0.005em" }}>{label}</span>
                  {badge && (
                    <span
                      className="mono"
                      style={{ fontSize: "9px", background: "var(--accent)", color: "white", padding: "1px 6px", letterSpacing: "0.05em" }}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* ── Sections ── */}
        {!collapsed && (
          <div style={{ marginTop: "12px", borderTop: "2px solid var(--rule-heavy)" }}>
            <div style={{ padding: "12px 16px 6px" }}>
              <p className="kicker" style={{ color: "var(--ink-3)", letterSpacing: "0.12em" }}>Sections</p>
            </div>
            {SECTIONS.map(s => (
              <button
                key={s}
                onClick={() => onSectionClick?.(s)}
                className="w-full text-left flex items-center gap-2"
                style={{
                  padding: "7px 16px",
                  fontSize: "12.5px",
                  color: "var(--ink-2)",
                  borderBottom: "1px solid var(--rule)",
                  background: "transparent",
                  transition: "all 0.12s",
                  letterSpacing: "0.005em",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#ECEEF5";
                  (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                  (e.currentTarget as HTMLElement).style.paddingLeft = "20px";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--ink-2)";
                  (e.currentTarget as HTMLElement).style.paddingLeft = "16px";
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
