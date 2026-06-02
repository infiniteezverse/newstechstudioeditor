"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const details = searchParams.get("details");
  const description = searchParams.get("description");

  const errorMessages: Record<string, string> = {
    access_denied: "You denied access to this application",
    invalid_scope: "Invalid permissions requested",
    invalid_state: "Invalid state parameter (security check failed)",
    no_code: "No authorization code received",
    no_verifier: "PKCE verification failed",
    token_exchange_failed: "Failed to exchange code for token",
    callback_error: "Error during authentication callback",
  };

  const message = errorMessages[error || ""] || (description || "Authentication failed");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: "var(--canvas)" }}
    >
      <div
        className="text-center"
        style={{
          background: "white",
          padding: "48px 32px",
          borderRadius: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
        }}
      >
        <AlertCircle size={48} style={{ color: "var(--bear)", margin: "0 auto 16px" }} />
        <h1 className="serif" style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
          Authentication Failed
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-2)", marginBottom: "16px" }}>
          {message}
        </p>
        {details && (
          <p className="mono" style={{ fontSize: "11px", color: "var(--ink-4)", marginBottom: "16px", wordBreak: "break-all" }}>
            {details}
          </p>
        )}
        <button
          onClick={() => router.push("/")}
          className="mono"
          style={{
            padding: "10px 20px",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: 600,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col items-center justify-center min-h-screen"
          style={{ background: "var(--canvas)" }}
        >
          <div style={{ color: "var(--ink-3)" }}>Loading...</div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
