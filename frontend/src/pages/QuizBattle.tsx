

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app/auth";
import { motion } from "framer-motion";
import brain from "brain";
import type { GetRandomQuestionData, DecideAiAnswerData } from "types";

// Battle tuning
const MAX_HP = 100;
const DAMAGE_PER_HIT = 25; // 4 good answers to defeat opponent
const DIFFICULTIES = ["easy", "medium", "hard", "insane"] as const;

// Utility component: neon health bar with motion width animation
const HealthBar = ({ label, hp, color }: { label: string; hp: number; color: "emerald" | "cyan" | "red" }) => {
  const barColor = useMemo(() => {
    if (color === "emerald") return "bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.9)]";
    if (color === "cyan") return "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]";
    return "bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]";
  }, [color]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
        <span className="font-mono tracking-widest uppercase">{label}</span>
        <span className="font-mono">{Math.max(0, Math.round(hp))}/{MAX_HP}</span>
      </div>
      <div className="h-4 w-full rounded-md border border-cyan-500/30 bg-zinc-900 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${Math.max(0, Math.min(100, (hp / MAX_HP) * 100))}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`h-full ${barColor}`}
        />
      </div>
    </div>
  );
};

// Protected Battle Page
export default function QuizBattle() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext(); // user is guaranteed non-null on protected pages

  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("medium");
  const [userHp, setUserHp] = useState<number>(MAX_HP);
  const [aiHp, setAiHp] = useState<number>(MAX_HP);
  const [question, setQuestion] = useState<GetRandomQuestionData | null>(null);
  const [loadingQ, setLoadingQ] = useState<boolean>(false);
  const [roundLock, setRoundLock] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [lastOutcome, setLastOutcome] = useState<null | { userCorrect: boolean; aiCorrect: boolean }>(null);

  // Robust username detection across common profile fields
  const hasName = Boolean(
    user?.profile?.name?.trim() ||
      (user as any)?.profile?.username?.trim() ||
      (user as any)?.profile?.handle?.trim() ||
      (user as any)?.profile?.nickname?.trim() ||
      (user as any)?.username?.trim() ||
      (user as any)?.displayName?.trim()
  );
  const needsUsername = !hasName;
  const displayName =
    user?.profile?.name ||
    (user as any)?.profile?.username ||
    (user as any)?.profile?.handle ||
    (user as any)?.profile?.nickname ||
    (user as any)?.displayName ||
    (user as any)?.username ||
    user?.email ||
    "player";

  // Fetch a question
  const loadQuestion = async () => {
    try {
      setLoadingQ(true);
      const res = await brain.get_random_question();
      const data = (await res.json()) as GetRandomQuestionData;
      setQuestion(data);
    } catch (e) {
      console.error("Failed to load question", e);
    } finally {
      setLoadingQ(false);
    }
  };

  // Start a fresh match
  const resetMatch = () => {
    setUserHp(MAX_HP);
    setAiHp(MAX_HP);
    setLastOutcome(null);
    setRoundLock(false);
    loadQuestion();
  };

  useEffect(() => {
    // initial
    resetMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = async (option: string) => {
    if (!question || roundLock) return;
    setRoundLock(true);

    const userCorrect = option === question.answer;

    // Apply user's damage to AI immediately for snappy feedback
    if (userCorrect) setAiHp((hp) => hp - DAMAGE_PER_HIT);

    // Ask AI to decide based on difficulty
    setAiThinking(true);
    let aiCorrect = false;
    try {
      const res = await brain.decide_ai_answer({ difficulty });
      const data = (await res.json()) as DecideAiAnswerData;
      aiCorrect = !!data.ai_correct;
    } catch (e) {
      console.error("AI decide failed", e);
      // Fallback: assume incorrect to avoid unfair damage
      aiCorrect = false;
    } finally {
      setAiThinking(false);
    }

    if (aiCorrect) setUserHp((hp) => hp - DAMAGE_PER_HIT);

    setLastOutcome({ userCorrect, aiCorrect });

    // Short pause to show result, then load next question if both alive
    setTimeout(() => {
      if (userHp - (aiCorrect ? DAMAGE_PER_HIT : 0) <= 0 || aiHp - (userCorrect ? DAMAGE_PER_HIT : 0) <= 0) {
        // Match over, let the UI show the end state
        setRoundLock(true);
      } else {
        setRoundLock(false);
        loadQuestion();
      }
    }, 700);
  };

  const matchOver = userHp <= 0 || aiHp <= 0;
  const resultText = userHp <= 0 && aiHp <= 0 ? "Draw" : userHp <= 0 ? "You Lost" : aiHp <= 0 ? "You Won" : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-foreground relative">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-cyan-500/20">
        <h1 className="text-xl tracking-widest font-semibold text-cyan-300">Quiz Battle Arena</h1>
        <nav aria-label="Main navigation" className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
        </nav>
      </header>

      {needsUsername && (
        <div className="container mx-auto px-6 mt-4">
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200 flex items-center justify-between">
            <p className="text-sm">Set your username to show in battles and on the leaderboard.</p>
            <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => navigate("/auth/account-settings")}>
              Set username
            </Button>
          </div>
        </div>
      )}

      <main className="container mx-auto p-6">
        <section className="mx-auto max-w-5xl rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_40px_-15px_rgba(34,211,238,0.5)]">
          {/* Top control row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-cyan-500/20">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Welcome, {displayName}
              </h2>
              <p className="text-zinc-400 text-sm">Answer correctly to deal damage. The AI strikes back based on difficulty.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 uppercase tracking-widest">Difficulty</span>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as (typeof DIFFICULTIES)[number])}>
                <SelectTrigger className="w-[180px] border-cyan-500/40">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-cyan-500/30">
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d} className="capitalize">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* HUD Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="flex flex-col gap-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-emerald-500/20 border border-emerald-400/40" />
                <div className="leading-tight">
                  <div className="text-sm text-emerald-300 font-semibold">{displayName || "You"}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400">Operative</div>
                </div>
              </div>
              <HealthBar label="Player HP" hp={userHp} color={userHp > 25 ? "emerald" : "red"} />
            </div>

            <div className="md:col-span-1 order-last md:order-none flex flex-col items-center justify-center">
              {/* Center arena: question + options */}
              <div className="w-full">
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-300/80 text-center mb-2">
                  {loadingQ ? "Loading question..." : aiThinking ? "AI deciding..." : "Round"}
                </div>
                <div className="rounded-lg border border-cyan-500/30 bg-zinc-950/70 p-4">
                  <div className="min-h-[56px] text-center text-lg text-cyan-100">
                    {question?.question || "Preparing..."}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {question?.options.map((opt) => (
                      <Button
                        key={opt}
                        variant="outline"
                        disabled={roundLock || loadingQ || matchOver}
                        className="justify-start border-cyan-500/40 hover:bg-cyan-500/10"
                        onClick={() => handleAnswer(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                  {lastOutcome && (
                    <div className="mt-3 text-center text-xs text-zinc-400">
                      <span className={lastOutcome.userCorrect ? "text-emerald-300" : "text-red-400"}>
                        You {lastOutcome.userCorrect ? "hit" : "missed"}
                      </span>
                      <span> • </span>
                      <span className={lastOutcome.aiCorrect ? "text-red-400" : "text-emerald-300"}>
                        AI {lastOutcome.aiCorrect ? "hit" : "missed"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:col-span-1 items-end">
              <div className="flex items-center gap-3">
                <div className="leading-tight text-right">
                  <div className="text-sm text-cyan-300 font-semibold">A.R.C-Angel</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400">AI Opponent</div>
                </div>
                <div className="size-10 rounded-md bg-cyan-500/20 border border-cyan-400/40" />
              </div>
              <HealthBar label="AI HP" hp={aiHp} color={aiHp > 25 ? "cyan" : "red"} />
            </div>
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between gap-4 p-6 border-t border-cyan-500/20">
            <div className="text-xs text-zinc-500 font-mono">
              {matchOver ? "Match complete" : roundLock ? "Resolving..." : "Choose your answer"}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={loadQuestion} disabled={loadingQ || roundLock || matchOver}>
                New Question
              </Button>
              <Button variant="outline" onClick={resetMatch}>
                Reset Match
              </Button>
            </div>
          </div>
        </section>

        {matchOver && (
          <div className="mx-auto max-w-5xl mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-center">
            <div className="text-emerald-300 font-semibold">{resultText}</div>
            <p className="text-zinc-400 text-sm mt-1">No results are saved yet. We will wire persistence in the next task.</p>
          </div>
        )}
      </main>
    </div>
  );
}
