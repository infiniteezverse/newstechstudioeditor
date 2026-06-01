"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import NewsFeed from "@/components/NewsFeed";
import AITakePanel from "@/components/AITakePanel";
import ProEditor from "@/components/ProEditor";
import type { Article } from "@/lib/mock-data";

export default function Home() {
  const [activeView, setActiveView] = useState("studio");
  const [sourceArticle, setSourceArticle] = useState<Article | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editorContent, setEditorContent] = useState("");

  // Panel open/closed state
  const [feedOpen, setFeedOpen] = useState(true);
  const [aiOpen, setAiOpen]     = useState(true);

  function handleToggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex h-full" style={{ background: "var(--canvas)" }}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Topbar />

        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Wire Feed panel ── */}
          <div
            className="panel-transition flex flex-col h-full shrink-0"
            style={{
              width: feedOpen ? "340px" : "44px",
              borderRight: "1px solid var(--rule-heavy)",
              background: "var(--panel-feed)",
            }}
          >
            {feedOpen ? (
              <NewsFeed
                onGenerateTake={a => { setSourceArticle(a); setAiOpen(true); }}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onCollapse={() => setFeedOpen(false)}
              />
            ) : (
              <CollapsedStrip
                label="Wire Feed"
                badge={6}
                color="var(--panel-feed)"
                onClick={() => setFeedOpen(true)}
              />
            )}
          </div>

          {/* ── AI Synthesis panel ── */}
          <div
            className="panel-transition flex flex-col h-full shrink-0"
            style={{
              width: aiOpen ? "320px" : "44px",
              borderRight: "1px solid var(--rule-heavy)",
              background: "var(--panel-ai)",
            }}
          >
            {aiOpen ? (
              <AITakePanel
                sourceArticle={sourceArticle}
                onPushToEditor={content => setEditorContent(content)}
                onCollapse={() => setAiOpen(false)}
              />
            ) : (
              <CollapsedStrip
                label="AI Synthesis"
                color="var(--panel-ai)"
                onClick={() => setAiOpen(true)}
              />
            )}
          </div>

          {/* ── Pro Editor (always open, fills remaining space) ── */}
          <div
            className="flex flex-col flex-1 min-w-0 h-full overflow-hidden"
            style={{ background: "var(--panel-editor)" }}
          >
            <ProEditor
              content={editorContent}
              onContentChange={() => {}}
              feedOpen={feedOpen}
              aiOpen={aiOpen}
              onOpenFeed={() => setFeedOpen(true)}
              onOpenAI={() => setAiOpen(true)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

function CollapsedStrip({
  label, badge, color, onClick,
}: {
  label: string;
  badge?: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center w-full h-full py-5 gap-4"
      style={{ background: color }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-2)")}
      onMouseLeave={e => (e.currentTarget.style.background = color)}
    >
      {/* Arrow */}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "var(--ink-3)", flexShrink: 0 }}>
        <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {badge !== undefined && (
        <span
          className="mono"
          style={{
            fontSize: "9px",
            background: "var(--accent)",
            color: "white",
            padding: "1px 5px",
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}

      <span className="panel-label-rotated flex-1">{label}</span>
    </button>
  );
}
