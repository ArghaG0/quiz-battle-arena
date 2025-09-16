

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app/auth";

// This page is kept for future admin/tools. Mid-fight custom MCQs are handled inside the battle UI.
export default function CreateQuestion() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();

  const needsUsername = !user.profile?.name;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-cyan-500/20">
        <h1 className="text-xl tracking-widest font-semibold text-cyan-300">Quiz Battle Arena</h1>
        <nav aria-label="Main navigation">
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </nav>
      </header>

      {needsUsername && (
        <div className="container mx-auto px-6 mt-4">
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200 flex items-center justify-between">
            <p className="text-sm">Add a username so others can recognize you.</p>
            <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => navigate("/auth/account-settings")}>Add username</Button>
          </div>
        </div>
      )}

      <main className="container mx-auto p-6">
        <section className="mx-auto max-w-3xl rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_40px_-15px_rgba(34,211,238,0.5)]">
          <div className="p-8">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Hi, {user?.profile?.name || user?.email || "player"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              Mid-fight custom questions with your own options are authored directly in the Battle Arena. This page can be used later for moderation/admin tools.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
