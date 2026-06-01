"use client";

import { Archive, ArrowUpRight, BookOpen, Trash2 } from "lucide-react";
import type { Article } from "@/lib/mock-data";

interface KnowledgeVaultProps {
  pinnedArticles: Article[];
  savedDrafts: { title: string; words: number; lastEdited: string }[];
  onOpenArticle: (a: Article) => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  DeFi: "#0F5C2E",
  Layer2: "#1A3A8F",
  AI: "#6B21A8",
  Regulation: "#7A1A1A",
  Markets: "#92400E",
  Infrastructure: "#1E3A5F",
};

export default function KnowledgeVault({ pinnedArticles, savedDrafts, onOpenArticle }: KnowledgeVaultProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--canvas)" }}>

      {/* ── Header ── */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "2px solid var(--rule-heavy)", background: "white" }}>
        <div className="flex items-center gap-3">
          <Archive size={16} style={{ color: "var(--accent)" }} />
          <div>
            <h2 className="serif" style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              Knowledge Vault
            </h2>
            <p className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", letterSpacing: "0.1em", marginTop: "2px" }}>
              PINNED RESEARCH · SAVED DRAFTS
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "900px" }}>

        {/* ── Pinned Articles ── */}
        <div style={{ marginBottom: "36px" }}>
          <p className="kicker" style={{ marginBottom: "12px" }}>Pinned Articles — {pinnedArticles.length}</p>

          {pinnedArticles.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3"
              style={{ padding: "40px 24px", border: "1px dashed var(--rule-heavy)", background: "white" }}
            >
              <BookOpen size={20} style={{ color: "var(--ink-4)" }} />
              <p style={{ fontSize: "12px", color: "var(--ink-3)", textAlign: "center" }}>
                Pin articles in the Wire Feed to save them here for reference.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)" }}>
              {pinnedArticles.map(a => (
                <div
                  key={a.id}
                  style={{
                    background: "white",
                    padding: "14px 18px",
                    borderLeft: `3px solid ${CATEGORY_COLOR[a.category] ?? "var(--accent)"}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                      <span className="mono" style={{ fontSize: "8.5px", color: CATEGORY_COLOR[a.category] ?? "var(--accent)", letterSpacing: "0.08em" }}>
                        {a.category.toUpperCase()}
                      </span>
                      <span className="mono" style={{ fontSize: "8.5px", color: "var(--ink-4)" }}>·</span>
                      <span className="mono" style={{ fontSize: "8.5px", color: "var(--ink-3)" }}>
                        {new Date(a.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)", lineHeight: 1.4, marginBottom: "4px" }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: "11.5px", color: "var(--ink-3)", lineHeight: 1.5 }}>
                      {a.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenArticle(a)}
                      className="mono flex items-center gap-1"
                      style={{ fontSize: "8.5px", padding: "5px 10px", background: "var(--accent)", color: "white", letterSpacing: "0.07em" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                    >
                      TAKE → <ArrowUpRight size={9} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Saved Drafts ── */}
        <div>
          <p className="kicker" style={{ marginBottom: "12px" }}>Saved Drafts — {savedDrafts.length}</p>

          {savedDrafts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3"
              style={{ padding: "40px 24px", border: "1px dashed var(--rule-heavy)", background: "white" }}
            >
              <Trash2 size={20} style={{ color: "var(--ink-4)" }} />
              <p style={{ fontSize: "12px", color: "var(--ink-3)", textAlign: "center" }}>
                Drafts you save from the Editorial Studio will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)" }}>
              {savedDrafts.map((d, i) => (
                <div
                  key={i}
                  style={{ background: "white", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>{d.title}</p>
                    <p className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", marginTop: "3px" }}>
                      {d.words} words · Last edited {d.lastEdited}
                    </p>
                  </div>
                  <button
                    className="mono"
                    style={{ fontSize: "8.5px", padding: "5px 10px", border: "1px solid var(--rule-heavy)", color: "var(--ink-2)", letterSpacing: "0.07em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--rule-heavy)"; }}
                  >
                    OPEN
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
