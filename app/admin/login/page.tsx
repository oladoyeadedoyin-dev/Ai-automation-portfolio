"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[75vh] max-w-md items-center">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl shadow-black/30">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6f9cff]">
            Adedoyin CMS
          </p>

          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight">
            Admin login
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Sign in to manage your portfolio projects.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-white/60">
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#6f9cff]"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#6f9cff]"
                placeholder=""
              />
            </label>

            {error ? (
              <p className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 block text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 transition-colors hover:text-white"
          >
            Back to site
          </a>
        </div>
      </div>
    </main>
  );
}
