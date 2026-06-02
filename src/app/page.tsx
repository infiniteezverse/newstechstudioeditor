"use client";

import { useState, useCallback, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import NewsFeed from "@/components/NewsFeed";
import AITakePanel from "@/components/AITakePanel";
import ProEditor from "@/components/ProEditor";
import KnowledgeVault from "@/components/KnowledgeVault";
import DistributionHub from "@/components/DistributionHub";
import SettingsPanel from "@/components/SettingsPanel";
import type { Article } from "@/lib/mock-data";

const SECTION_TO_FILTER: Record<string, string> = {
  "Layer 2":        "Layer2",
  "AI & LLMs":      "AI",
  "DeFi":           "DeFi",
  "Regulation":     "Regulation",
  "Markets":        "Markets",
  "Infrastructure": "Infrastructure",
};

// Default widths: feed +7.5%, ai +7.5% vs old 340/320
const DEFAULT_FEED_W = 365;
const DEFAULT_AI_W   = 344;
const MIN_PANEL_W    = 220;

export default function Home() {
  const [activeView, setActiveView]         = useState("studio");
  const [sectionFilter, setSectionFilter]   = useState<string | null>(null);
  const [sourceArticle, setSourceArticle]   = useState<Article | null>(null);
  const [selectedIds, setSelectedIds]       = useState<Set<string>>(new Set());
  const [editorContent, setEditorContent]   = useState("");
  const [pinnedArticles, setPinnedArticles] = useState<Article[]>([]);
  const [feedOpen, setFeedOpen]             = useState(true);
  const [aiOpen, setAiOpen]                 = useState(true);
  const [feedW, setFeedW]                   = useState(DEFAULT_FEED_W);
  const [aiW, setAiW]                       = useState(DEFAULT_AI_W);

  // Drag state refs — avoid re-renders during drag
  const dragging   = useRef<"feed" | "ai" | null>(null);
  const dragStartX = useRef(0);
  const dragStartW = useRef(0);

  const startDrag = useCallback((handle: "feed" | "ai", e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current   = handle;
    dragStartX.current = e.clientX;
    dragStartW.current = handle === "feed" ? feedW : aiW;
    document.body.style.cursor    = "col-resize";
    document.body.style.userSelect = "none";

    function onMove(ev: MouseEvent) {
      const delta = ev.clientX - dragStartX.current;
      const next  = Math.max(MIN_PANEL_W, dragStartW.current + delta);
      if (dragging.current === "feed") setFeedW(next);
      else setAiW(next);
    }

    function onUp() {
      dragging.current = null;
      document.body.style.cursor    = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, [feedW, aiW]);

  function handleToggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSectionClick(section: string) {
    const filter = SECTION_TO_FILTER[section];
    if (filter) { setSectionFilter(filter); setActiveView("feed"); }
  }

  function handleViewChange(v: string) {
    setActiveView(v);
    if (v !== "feed") setSectionFilter(null);
  }

  const isStudioView = activeView === "studio" || activeView === "feed";

  return (
    <div className="flex h-full" style={{ background: "var(--canvas)" }}>
      <Sidebar activeView={activeView} onViewChange={handleViewChange} onSectionClick={handleSectionClick} />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Topbar />

        <div className="flex flex-1 min-h-0 overflow-hidden">

          {isStudioView ? (
            <>
              {/* ── Wire Feed panel ── */}
              <div
                className="flex flex-col h-full shrink-0"
                style={{
                  width: feedOpen ? `${feedW}px` : "44px",
                  background: "var(--panel-feed)",
                  transition: feedOpen ? "none" : "width 0.22s cubic-bezier(0.4,0,0.2,1)",
                  overflow: "hidden",
                }}
              >
                {feedOpen ? (
                  <NewsFeed
                    onGenerateTake={a => { setSourceArticle(a); setAiOpen(true); }}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onCollapse={() => setFeedOpen(false)}
                    initialFilter={sectionFilter}
                    onPinnedChange={setPinnedArticles}
                  />
                ) : (
                  <CollapsedStrip label="Wire Feed" badge={6} color="var(--panel-feed)" onClick={() => setFeedOpen(true)} />
                )}
              </div>

              {/* ── Drag handle: feed ↔ ai ── */}
              <DragHandle onMouseDown={e => startDrag("feed", e)} />

              {/* ── AI Synthesis panel ── */}
              <div
                className="flex flex-col h-full shrink-0"
                style={{
                  width: aiOpen ? `${aiW}px` : "44px",
                  background: "var(--panel-ai)",
                  transition: aiOpen ? "none" : "width 0.22s cubic-bezier(0.4,0,0.2,1)",
                  overflow: "hidden",
                }}
              >
                {aiOpen ? (
                  <AITakePanel
                    sourceArticle={sourceArticle}
                    onPushToEditor={content => setEditorContent(content)}
                    onCollapse={() => setAiOpen(false)}
                  />
                ) : (
                  <CollapsedStrip label="AI Synthesis" color="var(--panel-ai)" onClick={() => setAiOpen(true)} />
                )}
              </div>

              {/* ── Drag handle: ai ↔ editor ── */}
              <DragHandle onMouseDown={e => startDrag("ai", e)} />

              {/* ── Pro Editor ── */}
              <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden" style={{ background: "var(--panel-editor)" }}>
                <ProEditor
                  content={editorContent}
                  onContentChange={() => {}}
                  feedOpen={feedOpen}
                  aiOpen={aiOpen}
                  onOpenFeed={() => setFeedOpen(true)}
                  onOpenAI={() => setAiOpen(true)}
                />
              </div>
            </>
          ) : activeView === "vault" ? (
            <div className="flex-1 min-w-0 h-full overflow-hidden">
              <KnowledgeVault
                pinnedArticles={pinnedArticles}
                savedDrafts={[]}
                onOpenArticle={a => { setSourceArticle(a); setAiOpen(true); setActiveView("studio"); }}
              />
            </div>
          ) : activeView === "distribute" ? (
            <div className="flex-1 min-w-0 h-full overflow-hidden"><DistributionHub /></div>
          ) : activeView === "settings" ? (
            <div className="flex-1 min-w-0 h-full overflow-hidden"><SettingsPanel /></div>
          ) : null}

        </div>
      </div>
    </div>
  );
}

function DragHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "5px",
        flexShrink: 0,
        cursor: "col-resize",
        background: hovered ? "var(--accent)" : "var(--rule-heavy)",
        transition: "background 0.15s",
        position: "relative",
        zIndex: 10,
      }}
    />
  );
}

function CollapsedStrip({ label, badge, color, onClick }: {
  label: string; badge?: number; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center w-full h-full py-5 gap-4"
      style={{ background: color }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-2)")}
      onMouseLeave={e => (e.currentTarget.style.background = color)}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "var(--ink-3)", flexShrink: 0 }}>
        <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {badge !== undefined && (
        <span className="mono" style={{ fontSize: "9px", background: "var(--accent)", color: "white", padding: "1px 5px", flexShrink: 0 }}>
          {badge}
        </span>
      )}
      <span className="panel-label-rotated flex-1">{label}</span>
    </button>
  );
}
