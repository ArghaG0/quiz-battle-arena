

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@stackframe/react";

export default function App() {
  const navigate = useNavigate();
  const user = useUser();

  const goStartBattle = () => {
    if (!user) return navigate("/auth/sign-in");
    navigate("/quiz-battle");
  };

  // Consider multiple possible fields for username/display name
  const hasName = Boolean(
    user?.profile?.name?.trim() ||
      (user as any)?.profile?.username?.trim() ||
      (user as any)?.profile?.handle?.trim() ||
      (user as any)?.profile?.nickname?.trim() ||
      (user as any)?.username?.trim() ||
      (user as any)?.displayName?.trim()
  );
  const needsUsername = !!user && !hasName;
  const displayName =
    user?.profile?.name ||
    (user as any)?.profile?.username ||
    (user as any)?.profile?.handle ||
    (user as any)?.profile?.nickname ||
    (user as any)?.displayName ||
    (user as any)?.username ||
    user?.email ||
    "player";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-foreground relative overflow-hidden">
      {/* Subtle hex/scanline overlay for atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(transparent_95%,rgba(0,255,255,0.6)_96%),radial-gradient(ellipse_at_center,rgba(34,211,238,0.35),transparent_60%)]" />

      {/* Header */}
      <header role="banner" className="relative z-10 w-full flex items-center justify-between px-8 py-5 border-b border-cyan-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 select-none">
          <div className="size-3 bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] rotate-45" aria-hidden />
          <span className="text-sm tracking-widest text-cyan-300 font-semibold">Quiz Battle Arena</span>
        </div>
        <nav aria-label="Main navigation" className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="outline" onClick={() => navigate("/auth/account-settings")}>Account</Button>
              <Button onClick={goStartBattle}>Start battle</Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/auth/sign-in")}>Sign in</Button>
              <Button onClick={() => navigate("/auth/sign-up")}>Create account</Button>
            </div>
          )}
        </nav>
      </header>

      {needsUsername && (
        <div className="relative z-10 mx-auto mt-4 w-full max-w-5xl px-8">
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200 flex items-center justify-between">
            <p className="text-sm">Complete your profile: add a username to show on the leaderboard and in battles.</p>
            <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => navigate("/auth/account-settings")}>Add username</Button>
          </div>
        </div>
      )}

      {/* Hero */}
      <main className="relative z-10 container mx-auto px-8 pt-16 pb-24">
        <section className="mx-auto max-w-5xl rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_60px_-20px_rgba(34,211,238,0.7)]">
          <div className="p-10 md:p-14">
            <p className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-emerald-300/80">
              <span className="size-2 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" aria-hidden />
              Enter the Arena
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Battle an AI in a neon cyber arena
            </h1>
            <p className="mt-4 text-zinc-400 max-w-2xl">
              {user ? `Welcome back, ${displayName}!` : "Sign in, pick your difficulty, and fight the machine. Answer fast and precise to drain the AI's HP."}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Button onClick={goStartBattle}>Start battle</Button>
              <Button variant="outline" onClick={() => navigate("/leaderboard")}>Leaderboard</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
