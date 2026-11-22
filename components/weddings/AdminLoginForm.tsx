"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginForm({
  initialError = "",
  configured = true,
}: {
  initialError?: string;
  configured?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }
    router.push("/admin/wedding-invitations");
    router.refresh();
  }

  return (
    <div className="adm-login">
      <form onSubmit={submit} className="adm-card adm-login-card">
        <p className="adm-brand" style={{ fontSize: "1.7rem" }}>
          <span className="adm-brand-dot" aria-hidden="true" />
          Inviteo
          <span className="adm-brand-sub">Admin</span>
        </p>
        <h1 className="adm-h1 mt-4" style={{ fontSize: "1.9rem" }}>Sign in</h1>
        <p className="adm-lead mt-2">Manage wedding websites, templates and publishing.</p>
        {!configured && (
          <p className="adm-banner adm-banner--err mt-4" role="alert">
            Supabase URL and anon key are not set, so sign-in cannot start. Add them to the environment and reload.
          </p>
        )}

        <label htmlFor="email" className="adm-label mt-6">Email</label>
        <input
          id="email"
          className="adm-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password" className="adm-label mt-4">Password</label>
        <input
          id="password"
          className="adm-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="adm-field-error" role="alert">{error}</p>}

        <button className="adm-btn mt-6 w-full" disabled={busy || !configured}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
