"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, Copy, RotateCcw, ChevronLeft } from "lucide-react";
import type { Article } from "@/lib/mock-data";

const FORMATS = [
  { id: "thread",   label: "X Thread",         platform: "X / Twitter" },
  { id: "cast",     label: "Farcaster Cast",    platform: "Farcaster" },
  { id: "linkedin", label: "LinkedIn Post",     platform: "LinkedIn" },
  { id: "longform", label: "Long-form Article", platform: "Medium / Mirror" },
  { id: "briefing", label: "Briefing Paper",    platform: "Notion / Vault" },
];

const PERSONAS = ["Analyst", "Trader", "Founder", "Researcher", "Commentator"];

const MOCK_TAKES: Record<string, string> = {
  thread: `🔥 Base just crossed 10M daily txs.

Here's why this is a bigger deal than the headline:

1/ This isn't just throughput. It's a distribution moat.

Coinbase has 110M+ verified users. Every on-ramp, every Wallet interaction, every dApp in their ecosystem defaults to Base. You don't build that with marketing. You inherit it.

2/ The $500M infra bet changes the sequencer narrative.

The #1 bearish argument on Base: "centralized sequencer = centralized risk."

That argument just got defunded. Literally.

3/ Sequencer decentralization + 10M TPS creates a new coordination problem for Ethereum mainnet.

At what point does L1 settlement become the minority use case? We might already be there.

TLDR: Base isn't competing with Arbitrum. It's competing with CEXs.

/thread`,

  cast: `Base hit 10M daily txs this week and Coinbase dropped $500M on infrastructure.

The sequencer decentralization piece is the real signal — that's been the bear case for a year.

What changes when you remove that objection? A lot of institutional DeFi deployments that were waiting on it.

Base may end up being the onramp that finally moves the needle on CEX → DEX migration.`,

  linkedin: `The Base network's 10M daily transaction milestone deserves more attention than mainstream coverage is giving it.

This isn't simply a throughput story. It's a distribution story.

Three strategic implications:

▸ Sequencer decentralization investment removes the primary institutional objection to Base deployment
▸ 340% YoY throughput growth outpaces every competing L2
▸ Compliance infrastructure + high-throughput settlement = compelling enterprise deployment target for 2026`,

  longform: `# Base at 10M: Why Coinbase's L2 Bet Is Bigger Than a Throughput Record

When Coinbase's Base network crossed 10 million daily transactions this week, coverage predictably focused on the number itself—a 340% year-over-year increase that puts Base ahead of Arbitrum and Optimism by raw throughput.

But the headline obscures the more interesting story.

## The Distribution Moat Nobody's Talking About

Base doesn't need to out-market Arbitrum. It has something neither network will ever have: 110 million verified Coinbase users sitting one click away from on-chain activity.

[Article continues — push to editor to complete and refine]`,

  briefing: `BRIEFING: Base Network · 10M Daily Transaction Milestone
June 1, 2026 · Layer 2 Infrastructure · Bullish

KEY FACTS
— 10M daily transactions — #1 among Ethereum L2s
— YoY growth: +340%
— Coinbase: $500M infrastructure investment announced
— Primary use: sequencer decentralization
— Timeline: Q3–Q4 2026 deployment

CONTEXT
— Ahead of Arbitrum and Optimism in raw throughput
— Coinbase 110M+ user base = structural distribution moat

OPEN QUESTIONS
— Current reporting does not confirm sequencer decentralization timeline specifics
— Net revenue impact not disclosed

VERDICT
Removes #1 institutional objection. Watch enterprise DeFi deployments H2 2026.`,
};

interface AITakePanelProps {
  sourceArticle: Article | null;
  onPushToEditor: (content: string) => void;
  onCollapse: () => void;
}

export default function AITakePanel({ sourceArticle, onPushToEditor, onCollapse }: AITakePanelProps) {
  const [format, setFormat]       = useState(FORMATS[0]);
  const [persona, setPersona]     = useState("Analyst");
  const [generating, setGenerating] = useState(false);
  const [take, setTake]           = useState<string | null>(null);
  const [showFormats, setShowFormats] = useState(false);

  function generate() {
    if (!sourceArticle) return;
    setGenerating(true);
    setTake(null);
    setTimeout(() => {
      setGenerating(false);
      setTake(MOCK_TAKES[format.id] ?? MOCK_TAKES.thread);
    }, 1200);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--panel-ai)" }}>

      {/* ── Panel header ─────────────────────────── */}
      <div
        style={{
          borderBottom: "2px solid var(--rule-heavy)",
          background: "var(--panel-ai)",
          padding: "14px 18px 12px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker" style={{ marginBottom: "4px", color: "var(--accent)", fontSize: "12px", letterSpacing: "0.1em" }}>AI Synthesis</p>
            <span className="mono" style={{ fontSize: "11px", color: "var(--ink-3)", fontWeight: 500 }}>
              MASTER SCHEMA v1.0
            </span>
          </div>
          <button
            onClick={onCollapse}
            style={{ color: "var(--ink-4)", padding: "4px", marginTop: "2px" }}
            title="Collapse panel"
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-4)")}
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Source */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)" }}>
          <p className="kicker" style={{ marginBottom: "8px" }}>Source Article</p>
          {sourceArticle ? (
            <div
              style={{
                background: "white",
                border: "1px solid var(--rule)",
                borderLeft: "3px solid var(--accent)",
                padding: "10px 12px",
              }}
            >
              <p
                className="serif"
                style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.3, color: "var(--ink)", marginBottom: "4px" }}
              >
                {sourceArticle.title}
              </p>
              <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
                {sourceArticle.source} · {sourceArticle.category}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: "13px", color: "var(--ink-3)", fontStyle: "italic", lineHeight: 1.5 }}>
              Select an article from the Wire Feed to begin synthesis.
            </p>
          )}
        </div>

        {/* Output format */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)" }}>
          <p className="kicker" style={{ marginBottom: "10px" }}>Output Format</p>
          <button
            onClick={() => setShowFormats(!showFormats)}
            className="flex items-center justify-between w-full"
            style={{
              padding: "9px 12px",
              border: "1px solid var(--rule-heavy)",
              background: "white",
              color: "var(--ink)",
            }}
          >
            <div className="text-left">
              <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{format.label}</span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginLeft: "8px" }}>
                {format.platform}
              </span>
            </div>
            <ChevronDown size={12} style={{ color: "var(--ink-3)", transform: showFormats ? "rotate(180deg)" : undefined, transition: "transform 0.1s" }} />
          </button>

          {showFormats && (
            <div style={{ border: "1px solid var(--rule-heavy)", borderTop: "none" }}>
              {FORMATS.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFormat(f); setShowFormats(false); }}
                  className="flex items-center justify-between w-full text-left"
                  style={{
                    padding: "9px 12px",
                    borderBottom: "1px solid var(--rule)",
                    borderLeft: format.id === f.id ? "2px solid var(--accent)" : "2px solid transparent",
                    background: format.id === f.id ? "#EDF0F7" : "white",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (format.id !== f.id) (e.currentTarget as HTMLElement).style.background = "#F5F5F3"; }}
                  onMouseLeave={e => { if (format.id !== f.id) (e.currentTarget as HTMLElement).style.background = "white"; }}
                >
                  <span style={{ fontSize: "13px", fontWeight: format.id === f.id ? 500 : 400, color: "var(--ink)" }}>
                    {f.label}
                  </span>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>{f.platform}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Persona */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)" }}>
          <p className="kicker" style={{ marginBottom: "10px", fontSize: "11px", letterSpacing: "0.1em", color: "var(--ink-2)" }}>Voice Persona</p>
          <div className="flex flex-wrap" style={{ gap: "7px" }}>
            {PERSONAS.map(p => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className="mono"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.07em",
                  fontWeight: persona === p ? 600 : 400,
                  padding: "6px 14px",
                  border: "1px solid",
                  borderColor: persona === p ? "var(--accent)" : "var(--rule-heavy)",
                  color: persona === p ? "white" : "var(--ink)",
                  background: persona === p ? "var(--accent)" : "transparent",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { if (persona !== p) { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; } }}
                onMouseLeave={e => { if (persona !== p) { (e.currentTarget as HTMLElement).style.borderColor = "var(--rule-heavy)"; (e.currentTarget as HTMLElement).style.color = "var(--ink)"; } }}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)" }}>
          <button
            onClick={generate}
            disabled={!sourceArticle || generating}
            className="w-full mono"
            style={{
              padding: "11px",
              fontSize: "10px",
              letterSpacing: "0.12em",
              background: sourceArticle && !generating ? "var(--accent)" : "var(--rule)",
              color: sourceArticle && !generating ? "white" : "var(--ink-4)",
              cursor: sourceArticle && !generating ? "pointer" : "not-allowed",
              transition: "all 0.1s",
            }}
          >
            {generating ? "SYNTHESIZING..." : "GENERATE TAKE →"}
          </button>
        </div>

        {/* Skeleton */}
        {generating && (
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[82, 95, 64, 90, 72, 48, 78].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: "9px", width: `${w}%`, borderRadius: "2px" }} />
            ))}
          </div>
        )}

        {/* Generated output */}
        {take && !generating && (
          <>
            {/* Label bar */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "8px 18px",
                background: "#EDF0F7",
                borderBottom: "1px solid var(--rule)",
                borderTop: "1px solid var(--rule)",
              }}
            >
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent)", letterSpacing: "0.08em" }}>
                GENERATED · {format.label.toUpperCase()} · {persona.toUpperCase()}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigator.clipboard?.writeText(take)}
                  style={{ color: "var(--ink-3)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
                >
                  <Copy size={11} />
                </button>
                <button
                  onClick={generate}
                  style={{ color: "var(--ink-3)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
                >
                  <RotateCcw size={11} />
                </button>
              </div>
            </div>

            {/* Take text */}
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--rule)", maxHeight: "240px", overflowY: "auto", background: "white" }}>
              <pre style={{ fontSize: "13.5px", lineHeight: 1.72, color: "var(--ink-2)", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {take}
              </pre>
            </div>

            {/* Push to editor */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--rule)" }}>
              <button
                onClick={() => onPushToEditor(take)}
                className="w-full flex items-center justify-center gap-2 mono"
                style={{
                  padding: "10px",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
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
                PUSH TO EDITOR <ArrowRight size={11} style={{ marginLeft: "6px" }} />
              </button>
            </div>

            {/* Refine tools */}
            <div style={{ padding: "14px 18px" }}>
              <p className="kicker" style={{ marginBottom: "10px" }}>Refine Output</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {["Sharpen Tone", "More Contrarian", "Strip Jargon", "Add Data Points"].map(a => (
                  <button
                    key={a}
                    className="mono"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.05em",
                      padding: "7px 4px",
                      border: "1px solid var(--rule-heavy)",
                      color: "var(--ink-2)",
                      background: "white",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F0F0EC"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
                  >
                    {a.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
