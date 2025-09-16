import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-cyan-500/20">
        <h1 className="text-xl tracking-widest font-semibold text-cyan-300">Quiz Battle Arena</h1>
        <nav aria-label="Main navigation">
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <section className="mx-auto max-w-3xl rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_40px_-15px_rgba(34,211,238,0.5)]">
          <div className="p-8">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Leaderboard
            </h2>
            <p className="mt-3 text-muted-foreground">
              Top players will show up here after we wire persistence. For now, this is a placeholder.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
