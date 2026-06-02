"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { CheckCircle } from "lucide-react";

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const service = searchParams.get("service");
  const username = searchParams.get("username");

  useEffect(() => {
    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

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
        <CheckCircle size={48} style={{ color: "var(--bull)", margin: "0 auto 16px" }} />
        <h1 className="serif" style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
          Connected!
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-2)", marginBottom: "4px" }}>
          {service && `${service.charAt(0).toUpperCase() + service.slice(1)}`} account connected
        </p>
        {username && (
          <p className="mono" style={{ fontSize: "12px", color: "var(--ink-3)" }}>
            @{username}
          </p>
        )}
        <p style={{ fontSize: "12px", color: "var(--ink-4)", marginTop: "16px" }}>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
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
      <AuthSuccessContent />
    </Suspense>
  );
}
