"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

interface ToggleProps { label: string; description: string; defaultOn?: boolean; }

function Toggle({ label, description, defaultOn = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "14px 0", borderBottom: "1px solid var(--rule)" }}
    >
      <div style={{ flex: 1, paddingRight: "24px" }}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>{description}</p>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        style={{
          width: "36px", height: "20px", borderRadius: "10px", flexShrink: 0,
          background: on ? "var(--accent)" : "var(--rule-heavy)",
          position: "relative", transition: "background 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute", top: "3px",
            left: on ? "19px" : "3px",
            width: "14px", height: "14px", borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

interface SelectProps { label: string; description: string; options: string[]; defaultVal?: string; }

function SelectRow({ label, description, options, defaultVal }: SelectProps) {
  const [val, setVal] = useState(defaultVal ?? options[0]);
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "14px 0", borderBottom: "1px solid var(--rule)" }}
    >
      <div style={{ flex: 1, paddingRight: "24px" }}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>{description}</p>
      </div>
      <select
        value={val}
        onChange={e => setVal(e.target.value)}
        className="mono"
        style={{
          fontSize: "10px", padding: "5px 10px", border: "1px solid var(--rule-heavy)",
          background: "white", color: "var(--ink)", letterSpacing: "0.05em",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function SettingsPanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--canvas)" }}>

      {/* ── Header ── */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "2px solid var(--rule-heavy)", background: "white" }}>
        <div className="flex items-center gap-3">
          <Settings size={16} style={{ color: "var(--accent)" }} />
          <div>
            <h2 className="serif" style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              Settings
            </h2>
            <p className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", letterSpacing: "0.1em", marginTop: "2px" }}>
              PREFERENCES · DEFAULTS · NOTIFICATIONS
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "680px" }}>

        {/* AI Defaults */}
        <p className="kicker" style={{ marginBottom: "4px" }}>AI Defaults</p>
        <div style={{ background: "white", padding: "0 18px", marginBottom: "28px" }}>
          <SelectRow label="Default Voice Persona" description="Pre-selected persona when opening AI Synthesis." options={["Analyst", "Trader", "Founder", "Researcher", "Commentator"]} defaultVal="Analyst" />
          <SelectRow label="Default Output Format" description="Pre-selected format when a new article is loaded." options={["X Thread", "Farcaster Cast", "LinkedIn Post", "Long-form Article", "Briefing Paper"]} defaultVal="X Thread" />
          <Toggle label="Auto-generate on article select" description="Automatically trigger AI generation when you click TAKE →." defaultOn={false} />
        </div>

        {/* Wire Feed */}
        <p className="kicker" style={{ marginBottom: "4px" }}>Wire Feed</p>
        <div style={{ background: "white", padding: "0 18px", marginBottom: "28px" }}>
          <Toggle label="Auto-refresh feed" description="Pull new articles every 5 minutes automatically." defaultOn={true} />
          <Toggle label="Show trending badge" description="Display ↑ TRENDING tag on articles with high signal." defaultOn={true} />
          <SelectRow label="Default section filter" description="Which category to open Wire Feed on." options={["All", "DeFi", "Layer2", "AI", "Regulation", "Markets"]} defaultVal="All" />
        </div>

        {/* Notifications */}
        <p className="kicker" style={{ marginBottom: "4px" }}>Notifications</p>
        <div style={{ background: "white", padding: "0 18px", marginBottom: "28px" }}>
          <Toggle label="Breaking news alerts" description="Notify when a trending article lands in your watched sections." defaultOn={true} />
          <Toggle label="Publish confirmations" description="Show confirmation when an article is successfully published." defaultOn={true} />
          <Toggle label="Scheduled post reminders" description="Remind 15 minutes before a scheduled post goes live." defaultOn={false} />
        </div>

        {/* Editor */}
        <p className="kicker" style={{ marginBottom: "4px" }}>Editor</p>
        <div style={{ background: "white", padding: "0 18px" }}>
          <Toggle label="Autosave drafts" description="Save editor content to Knowledge Vault every 2 minutes." defaultOn={true} />
          <Toggle label="Word count in toolbar" description="Show live word and character count in the editor toolbar." defaultOn={true} />
          <SelectRow label="Writing focus mode" description="Collapse panels automatically when you start typing." options={["Off", "Collapse Feed", "Collapse Both"]} defaultVal="Off" />
        </div>

      </div>
    </div>
  );
}
