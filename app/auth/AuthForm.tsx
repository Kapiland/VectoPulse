"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const signUpMode = searchParams.get("mode") === "signup";
  const next = searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const supabase = createClient();

    if (signUpMode) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      });
      if (signUpError) setError(signUpError.message);
      else if (data.session) window.location.assign(safeNext);
      else setMessage("Account created. Check your email to confirm your address, then sign in.");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
      else window.location.assign(safeNext);
    }
    setBusy(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,.18),transparent_45%)]">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl shadow-blue-950/40">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600"><Sparkles className="h-5 w-5" /></span>
          CampusSignal
        </Link>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-400">Student workspace</p>
        <h1 className="text-3xl font-bold text-white">{signUpMode ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-slate-400">{signUpMode ? "Sign up with your email to find opportunities and teammates." : "Sign in to continue to your campus workspace."}</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {signUpMode && <label className="block text-sm text-slate-300">Full name<input required minLength={2} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="Your name" /></label>}
          <label className="block text-sm text-slate-300">Email<div className="mt-1.5 flex items-center rounded-xl border border-slate-700 bg-slate-900 px-3 focus-within:border-cyan-400"><Mail className="h-4 w-4 text-slate-500" /><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-3 text-white outline-none" placeholder="you@college.edu" /></div></label>
          <label className="block text-sm text-slate-300">Password<div className="mt-1.5 flex items-center rounded-xl border border-slate-700 bg-slate-900 px-3 focus-within:border-cyan-400"><LockKeyhole className="h-4 w-4 text-slate-500" /><input required type="password" minLength={8} autoComplete={signUpMode ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent px-3 py-3 text-white outline-none" placeholder="At least 8 characters" /></div></label>
          {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-300">{message}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">{busy ? "Please wait…" : signUpMode ? "Create account" : "Sign in"}<ArrowRight className="h-4 w-4" /></button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">{signUpMode ? "Already registered?" : "New to CampusSignal?"} <Link href={signUpMode ? "/auth" : "/auth?mode=signup"} className="font-semibold text-cyan-300 hover:text-cyan-200">{signUpMode ? "Sign in" : "Create an account"}</Link></p>
      </section>
    </main>
  );
}
