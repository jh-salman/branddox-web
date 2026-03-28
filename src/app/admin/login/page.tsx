"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        const data = await res.json();
        if (!cancelled && data.ok === true) {
          router.replace(from.startsWith("/admin") ? from : "/admin");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }
      setPassword("");
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setLoginError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-dark)] text-white">
        <p className="text-sm">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-dark)] p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-1 text-xl font-bold text-[var(--brand-dark)]">Admin login</h1>
        <p className="mb-4 text-sm text-[var(--brand-dark)]/60">
          Enter the admin password to manage portfolio, services, and clients.
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-[var(--brand-dark)]/20 px-3 py-2 text-[var(--brand-dark)]"
            autoComplete="current-password"
            autoFocus
            required
          />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[var(--brand-mint)] px-4 py-2 font-semibold text-[var(--brand-dark)] hover:bg-[var(--brand-green)] disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Log in"}
          </button>
        </form>
        <Link
          href="/"
          className="mt-4 block text-center text-sm text-[var(--brand-dark)]/70 hover:underline"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--brand-dark)] text-white">
          <p className="text-sm">Loading…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
