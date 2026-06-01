"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold, Italic, List, ListOrdered, Quote,
  Heading1, Heading2, Code, RotateCcw, RotateCw, Download, ChevronRight,
} from "lucide-react";

const CHANNELS = ["𝕏 Twitter", "Farcaster", "Lens", "Mirror", "LinkedIn", "Medium", "Substack"];

interface ProEditorProps {
  content: string;
  onContentChange?: (text: string) => void;
  feedOpen: boolean;
  aiOpen: boolean;
  onOpenFeed: () => void;
  onOpenAI: () => void;
}

export default function ProEditor({
  content, onContentChange, feedOpen, aiOpen, onOpenFeed, onOpenAI,
}: ProEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Begin writing — or push a take from AI Synthesis." }),
      CharacterCount,
    ],
    content: "",
    onUpdate({ editor }) { onContentChange?.(editor.getText()); },
    editorProps: { attributes: { class: "tiptap" } },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !content?.trim()) return;
    editor.commands.setContent(
      content.trim().split("\n").map(l => `<p>${l || "<br>"}</p>`).join("")
    );
    editor.commands.focus("end");
  }, [content, editor]);

  const words = editor?.storage.characterCount.words() ?? 0;
  const chars = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--panel-editor)" }}>

      {/* ── Toolbar bar ──────────────────────────── */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{
          padding: "0 20px",
          height: "44px",
          borderBottom: "2px solid var(--rule-heavy)",
          background: "white",
        }}
      >
        {/* Panel re-open hints */}
        <div className="flex items-center gap-1" style={{ marginRight: "12px" }}>
          {!feedOpen && (
            <button
              onClick={onOpenFeed}
              className="mono flex items-center gap-1"
              style={{ fontSize: "8.5px", color: "var(--ink-3)", letterSpacing: "0.08em", padding: "3px 7px", border: "1px solid var(--rule)", background: "transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--rule)"; }}
            >
              <ChevronRight size={9} /> FEED
            </button>
          )}
          {!aiOpen && (
            <button
              onClick={onOpenAI}
              className="mono flex items-center gap-1"
              style={{ fontSize: "8.5px", color: "var(--ink-3)", letterSpacing: "0.08em", padding: "3px 7px", border: "1px solid var(--rule)", background: "transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--rule)"; }}
            >
              <ChevronRight size={9} /> AI
            </button>
          )}
        </div>

        {/* Formatting toolbar */}
        <div className="flex items-center gap-0.5 flex-1">
          <TBtn active={editor?.isActive("heading", { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={13} /></TBtn>
          <TBtn active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={13} /></TBtn>
          <TDiv />
          <TBtn active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={13} /></TBtn>
          <TBtn active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={13} /></TBtn>
          <TBtn active={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()}><Code size={13} /></TBtn>
          <TDiv />
          <TBtn active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List size={13} /></TBtn>
          <TBtn active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered size={13} /></TBtn>
          <TBtn active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote size={13} /></TBtn>
          <TDiv />
          <TBtn disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}><RotateCcw size={13} /></TBtn>
          <TBtn disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}><RotateCw size={13} /></TBtn>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="mono" style={{ fontSize: "9px", color: "var(--ink-4)" }}>
            {words}w · {chars}c
          </span>
          <button
            style={{ color: "var(--ink-3)", padding: "4px" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            <Download size={13} />
          </button>
          <button
            className="mono"
            style={{
              fontSize: "10px", letterSpacing: "0.1em",
              padding: "6px 18px",
              background: "var(--accent)", color: "white",
              border: "none",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.85"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >
            PUBLISH
          </button>
        </div>
      </div>

      {/* ── Writing canvas ───────────────────────── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--panel-editor)" }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 48px 100px" }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ── Distribution footer ──────────────────── */}
      <div
        className="flex items-center shrink-0 overflow-x-auto"
        style={{
          borderTop: "1px solid var(--rule-heavy)",
          background: "white",
          height: "38px",
        }}
      >
        <span
          className="kicker shrink-0 px-5 h-full flex items-center"
          style={{ borderRight: "1px solid var(--rule)", color: "var(--ink-3)" }}
        >
          Publish to:
        </span>
        {CHANNELS.map(ch => (
          <button
            key={ch}
            className="mono shrink-0 h-full px-4 flex items-center"
            style={{
              fontSize: "9px",
              letterSpacing: "0.07em",
              color: "var(--ink-3)",
              borderRight: "1px solid var(--rule)",
              background: "transparent",
              transition: "all 0.1s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent)";
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--ink-3)";
            }}
          >
            {ch.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function TBtn({ children, active, onClick, disabled }: {
  children: React.ReactNode; active?: boolean; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "5px 7px",
        color: active ? "var(--accent)" : "var(--ink-3)",
        background: active ? "#EDF0F7" : "transparent",
        borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
        opacity: disabled ? 0.25 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function TDiv() {
  return <span style={{ width: "1px", height: "18px", background: "var(--rule)", margin: "0 4px", display: "inline-block" }} />;
}
