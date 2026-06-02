"use client";

import { X, Plus } from "lucide-react";
import type { Article } from "@/lib/mock-data";

interface SearchResultsProps {
  query: string;
  results: Article[];
  onClose: () => void;
  onAddArticle: (article: Article) => void;
}

export default function SearchResults({ query, results, onClose, onAddArticle }: SearchResultsProps) {
  if (!query) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="fixed top-20 left-0 right-0 mx-auto flex flex-col"
        style={{
          width: "90%",
          maxWidth: "800px",
          maxHeight: "calc(100vh - 140px)",
          background: "white",
          borderRadius: "4px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div>
            <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", letterSpacing: "0.1em" }}>
              SEARCH RESULTS
            </span>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
              "{query}"
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: "var(--ink-3)", padding: "4px" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "var(--ink-3)",
              }}
            >
              <p style={{ fontSize: "14px" }}>No articles found for "{query}"</p>
            </div>
          ) : (
            results.map((article, i) => (
              <div
                key={article.id}
                style={{
                  padding: "16px 20px",
                  borderBottom: i < results.length - 1 ? "1px solid var(--rule)" : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Category + Sentiment */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="mono"
                        style={{
                          fontSize: "9px",
                          background: "var(--accent)",
                          color: "white",
                          padding: "2px 6px",
                          letterSpacing: "0.05em",
                          fontWeight: 600,
                        }}
                      >
                        {article.category}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: "8.5px",
                          color:
                            article.sentiment === "bullish"
                              ? "var(--bull)"
                              : article.sentiment === "bearish"
                                ? "var(--bear)"
                                : "var(--ink-3)",
                          fontWeight: 600,
                        }}
                      >
                        {article.sentiment.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="serif"
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "var(--ink-2)",
                        lineHeight: 1.5,
                        marginBottom: "8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.summary}
                    </p>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map(tag => (
                          <span
                            key={tag}
                            className="mono"
                            style={{
                              fontSize: "9px",
                              color: "var(--ink-3)",
                              border: "1px solid var(--rule)",
                              padding: "2px 6px",
                              borderRadius: "2px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => onAddArticle(article)}
                    className="flex items-center gap-1 shrink-0"
                    style={{
                      padding: "8px 12px",
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      fontWeight: 600,
                      border: "1px solid var(--accent)",
                      color: "var(--accent)",
                      background: "transparent",
                      transition: "all 0.1s",
                      marginTop: "4px",
                      whiteSpace: "nowrap",
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
                    <Plus size={12} />
                    ADD
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
