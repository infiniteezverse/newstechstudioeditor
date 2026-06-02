"use client";

import { useState, useCallback, useEffect } from "react";
import { RotateCw, ArrowUpRight, ChevronLeft, Pin, PinOff } from "lucide-react";
import { MOCK_ARTICLES, REFRESH_POOL, type Article } from "@/lib/mock-data";

const SENTIMENT = {
  bullish: { label: "Bullish", color: "var(--bull)" },
  bearish: { label: "Bearish", color: "var(--bear)" },
  neutral: { label: "Neutral", color: "var(--ink-3)" },
};

const FILTERS = ["All", "DeFi", "Layer2", "AI", "Regulation", "Markets"] as const;
type FilterVal = typeof FILTERS[number];

interface NewsFeedProps {
  onGenerateTake: (a: Article) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onCollapse: () => void;
  initialFilter?: string | null;
  onPinnedChange?: (articles: Article[]) => void;
}

export default function NewsFeed({
  onGenerateTake, selectedIds, onToggleSelect, onCollapse, initialFilter, onPinnedChange,
}: NewsFeedProps) {
  const [filter, setFilter]     = useState<FilterVal>("All");
  const [spinning, setSpinning] = useState(false);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [usedRefreshIds, setUsedRefreshIds] = useState<Set<string>>(new Set());

  // Apply section filter when sidebar section is clicked
  useEffect(() => {
    if (initialFilter && FILTERS.includes(initialFilter as FilterVal)) {
      setFilter(initialFilter as FilterVal);
    }
  }, [initialFilter]);

  const togglePin = useCallback((id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  function handleRefresh() {
    setSpinning(true);
    setTimeout(() => {
      setArticles(prev => {
        // Find pool articles not yet shown
        const newOnes = REFRESH_POOL.filter(a => !usedRefreshIds.has(a.id));
        if (newOnes.length === 0) {
          setSpinning(false);
          return prev;
        }
        // Take up to 2 new articles per refresh
        const batch = newOnes.slice(0, 2);
        setUsedRefreshIds(used => {
          const next = new Set(used);
          batch.forEach(a => next.add(a.id));
          return next;
        });
        // Pinned articles always stay — prepend new ones before un-pinned
        const pinned   = prev.filter(a => pinnedIds.has(a.id));
        const unpinned = prev.filter(a => !pinnedIds.has(a.id));
        return [...pinned, ...batch, ...unpinned];
      });
      setSpinning(false);
    }, 700);
  }

  // Notify parent when pinned set changes
  useEffect(() => {
    onPinnedChange?.(articles.filter(a => pinnedIds.has(a.id)));
  }, [pinnedIds, articles, onPinnedChange]);

  // Display order: pinned first, then rest; filter applies to both
  const displayed = [
    ...articles.filter(a => pinnedIds.has(a.id)),
    ...articles.filter(a => !pinnedIds.has(a.id)),
  ].filter(a => filter === "All" || a.category === filter);

  const pinnedCount   = [...pinnedIds].filter(id => articles.some(a => a.id === id)).length;
  const unpinnedCount = displayed.length - pinnedCount;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--panel-feed)" }}>

      {/* ── Header ───────────────────────────────── */}
      <div
        style={{
          borderBottom: "2px solid var(--accent)",
          padding: "14px 18px 12px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker" style={{ marginBottom: "5px", color: "var(--accent)", fontSize: "12.5px", letterSpacing: "0.1em", fontWeight: 700 }}>Wire Feed</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="mono flex items-center gap-1.5"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.07em",
                fontWeight: 600,
                padding: "5px 11px",
                border: "1px solid var(--rule-heavy)",
                color: "var(--ink-2)",
                background: "transparent",
                transition: "all 0.12s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--rule-heavy)"; }}
            >
              <RotateCw size={11} className={spinning ? "animate-spin" : ""} />
              REFRESH
            </button>
            <button
              onClick={onCollapse}
              title="Collapse panel"
              style={{ color: "var(--ink-4)", padding: "5px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-4)")}
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3" style={{ marginTop: "8px" }}>
          <span className="mono" style={{ fontSize: "12px", color: "var(--ink-2)", fontWeight: 600, letterSpacing: "0.05em" }}>
            {displayed.length} DISPATCHES
          </span>
          {pinnedCount > 0 && (
            <span
              className="mono flex items-center gap-1"
              style={{ fontSize: "10px", color: "var(--accent)", background: "rgba(10,25,49,0.07)", padding: "1px 7px", border: "1px solid rgba(10,25,49,0.15)" }}
            >
              <Pin size={8} />
              {pinnedCount} PINNED
            </span>
          )}
        </div>
      </div>

      {/* ── Multi-select bar ─────────────────────── */}
      {selectedIds.size > 0 && (
        <div
          className="flex items-center justify-between px-5 py-2"
          style={{ background: "var(--accent)", flexShrink: 0 }}
        >
          <span className="mono" style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>
            {selectedIds.size} SELECTED FOR SYNTHESIS
          </span>
          <button className="mono" style={{ fontSize: "9px", color: "white", textDecoration: "underline" }}>
            SYNTHESIZE ALL →
          </button>
        </div>
      )}

      {/* ── Section filters ──────────────────────── */}
      <div
        className="flex overflow-x-auto shrink-0"
        style={{ borderBottom: "1px solid var(--rule)", padding: "0 4px" }}
      >
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="mono shrink-0"
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.07em",
              padding: "10px 11px",
              color: filter === f ? "var(--accent)" : "var(--ink-2)",
              fontWeight: filter === f ? 700 : 500,
              borderBottom: filter === f ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-1px",
              background: "transparent",
              whiteSpace: "nowrap",
              transition: "color 0.12s",
            }}
            onMouseEnter={e => { if (filter !== f) (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
            onMouseLeave={e => { if (filter !== f) (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Article list ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Pinned section divider */}
        {pinnedCount > 0 && (
          <div
            className="flex items-center gap-2 px-5 py-2 sticky top-0 z-10"
            style={{ background: "#EDF2FF", borderBottom: "1px solid rgba(10,25,49,0.1)" }}
          >
            <Pin size={9} style={{ color: "var(--accent)" }} />
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent)", letterSpacing: "0.1em" }}>
              PINNED — {pinnedCount} ARTICLE{pinnedCount > 1 ? "S" : ""}
            </span>
          </div>
        )}

        {displayed.map((article, i) => {
          const isPinned   = pinnedIds.has(article.id);
          const isSelected = selectedIds.has(article.id);
          const sent       = SENTIMENT[article.sentiment];
          // Show "Latest" divider after last pinned article
          const showLatestDivider = pinnedCount > 0 && i === pinnedCount;

          return (
            <div key={article.id}>
              {showLatestDivider && (
                <div
                  className="flex items-center gap-2 px-5 py-2 sticky top-0 z-10"
                  style={{ background: "#F8F8F5", borderBottom: "1px solid var(--rule)", borderTop: "1px solid var(--rule)" }}
                >
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--ink-3)", letterSpacing: "0.1em" }}>
                    LATEST — {unpinnedCount} ARTICLE{unpinnedCount !== 1 ? "S" : ""}
                  </span>
                </div>
              )}

              <article
                style={{
                  borderBottom: "1px solid var(--rule)",
                  background: isPinned ? "#F5F8FF" : isSelected ? "#F0F4FB" : "transparent",
                  borderLeft: isPinned
                    ? "3px solid var(--accent)"
                    : isSelected
                    ? "3px solid rgba(10,25,49,0.3)"
                    : "3px solid transparent",
                  transition: "background 0.1s",
                }}
              >
                <div style={{ padding: "15px 18px" }}>

                  {/* Category + sentiment */}
                  <div className="flex items-center justify-between" style={{ marginBottom: "7px" }}>
                    <div className="flex items-center gap-2">
                      <span className="kicker" style={{ color: "var(--accent)", fontSize: "10px", fontWeight: 700 }}>
                        {article.category}
                      </span>
                      {article.trending && (
                        <span className="mono" style={{ fontSize: "9.5px", color: "var(--ink-3)", fontWeight: 600 }}>↑ TRENDING</span>
                      )}
                    </div>
                    <span className="mono" style={{ fontSize: "9.5px", color: sent.color, fontWeight: 500 }}>
                      {sent.label.toUpperCase()}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2
                    className="serif"
                    style={{
                      fontSize: "15.5px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: "var(--ink)",
                      letterSpacing: "-0.01em",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--ink)")}
                  >
                    {article.title}
                  </h2>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "var(--ink-2)",
                      lineHeight: 1.6,
                      marginBottom: "12px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.summary}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center" style={{ gap: "8px" }}>
                    {/* Select */}
                    <label className="flex items-center gap-1.5" style={{ cursor: "pointer", flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(article.id)}
                        style={{ accentColor: "var(--accent)", width: "12px", height: "12px" }}
                      />
                      <span className="mono" style={{ fontSize: "9.5px", color: "var(--ink)", letterSpacing: "0.07em", fontWeight: 600 }}>
                        SELECT
                      </span>
                    </label>

                    <span className="mono" style={{ fontSize: "11px", color: "var(--ink-2)", fontWeight: 500 }}>
                      {new Date(article.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    <div className="flex items-center gap-1" style={{ marginLeft: "auto" }}>
                      {/* Source link */}
                      <a
                        href="https://cryptonewsorg.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center"
                        style={{ color: "var(--ink-2)", padding: "3px 6px", gap: "2px", transition: "color 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
                      >
                        <ArrowUpRight size={12} />
                        <span className="mono" style={{ fontSize: "7.5px", letterSpacing: "0.06em", fontWeight: 600 }}>OPEN</span>
                      </a>

                      <div style={{ width: "1px", height: "24px", background: "var(--rule)", flexShrink: 0 }} />

                      {/* Pin button */}
                      <button
                        onClick={() => togglePin(article.id)}
                        title={isPinned ? "Unpin article" : "Pin article"}
                        className="flex flex-col items-center"
                        style={{
                          color: isPinned ? "var(--accent)" : "var(--ink-2)",
                          padding: "3px 6px",
                          gap: "2px",
                          background: isPinned ? "rgba(10,25,49,0.07)" : "transparent",
                          border: isPinned ? "1px solid rgba(10,25,49,0.15)" : "1px solid transparent",
                          transition: "all 0.1s",
                        }}
                        onMouseEnter={e => { if (!isPinned) (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                        onMouseLeave={e => { if (!isPinned) (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
                      >
                        {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
                        <span className="mono" style={{ fontSize: "7.5px", letterSpacing: "0.06em", fontWeight: 600 }}>{isPinned ? "UNPIN" : "PIN"}</span>
                      </button>

                      {/* Take button */}
                      <button
                        onClick={() => onGenerateTake(article)}
                        className="mono"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.07em",
                          fontWeight: 600,
                          color: "var(--accent)",
                          border: "1px solid var(--accent)",
                          padding: "4px 12px",
                          background: "transparent",
                          transition: "all 0.1s",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                          (e.currentTarget as HTMLElement).style.color = "white";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                        }}
                      >
                        TAKE →
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
