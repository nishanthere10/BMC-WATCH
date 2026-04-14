"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  RefreshCw,
  TrendingUp,
  IndianRupee,
  Cpu,
  TriangleAlert,
  CircleCheck,
  CircleMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectInsightsData {
  summary: string;
  risk_flags: string[];
  timeline_assessment: "On Track" | "Delayed" | "Critical";
  transparency_score: number;
  citizen_action: string;
  budget_analysis: string;
}

// ── Mini Groq Logo SVG ──
function GroqLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.12" />
      <path d="M16 7C11.029 7 7 11.029 7 16C7 20.971 11.029 25 16 25H19V22H16C12.686 22 10 19.314 10 16C10 12.686 12.686 10 16 10C19.314 10 22 12.686 22 16V17.5C22 18.329 21.329 19 20.5 19C19.671 19 19 18.329 19 17.5V16C19 13.791 17.209 12 15 12C12.791 12 11 13.791 11 16C11 18.209 12.791 20 15 20C16.216 20 17.312 19.476 18.073 18.635C18.56 19.468 19.462 20 20.5 20C22.985 20 25 17.985 25 15.5V16C25 11.029 20.971 7 16 7ZM15 17C14.448 17 14 16.552 14 16C14 15.448 14.448 15 15 15C15.552 15 16 15.448 16 16C16 16.552 15.552 17 15 17Z" fill="currentColor"/>
    </svg>
  );
}

const TIMELINE_CONFIG = {
  "On Track": {
    icon: CircleCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-300 dark:border-emerald-700",
    label: "ON TRACK",
  },
  "Delayed": {
    icon: CircleMinus,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-700",
    label: "DELAYED",
  },
  "Critical": {
    icon: TriangleAlert,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-300 dark:border-red-700",
    label: "CRITICAL",
  },
};

function ScoreDial({ score }: { score: number }) {
  const color =
    score >= 7 ? "#10B981" : score >= 4 ? "#F59E0B" : "#EF4444";
  const pct = (score / 10) * 100;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r="22" fill="none" stroke="#e2e8f0" strokeWidth="5" className="dark:stroke-slate-700" />
          <motion.circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - pct / 100) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-black text-base leading-none" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="cr-section-title">/ 10</span>
    </div>
  );
}

export default function ProjectInsights({ project }: { project: Project }) {
  const [insights, setInsights] = useState<ProjectInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/project-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData: project }),
      });
      if (!res.ok) throw new Error("Failed to generate insights");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsights(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="cr-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu size={18} className="text-violet-500 animate-pulse" />
            <span className="font-heading font-bold text-slate-900 dark:text-white text-sm" style={{ letterSpacing: "-0.02em" }}>
              AI Contractor Review
            </span>
          </div>
          <span className="cr-section-title text-violet-400 animate-pulse">Analyzing…</span>
        </div>
        <div className="p-5 space-y-3">
          {[100, 83, 66, 50].map((w, i) => (
            <div key={i} className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="cr-card overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <Cpu size={18} className="text-violet-500" />
          <span className="font-heading font-bold text-slate-900 dark:text-white text-sm">AI Contractor Review</span>
        </div>
        <div className="p-5">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-3">{error}</p>
          <button onClick={fetchInsights} className="cr-btn-secondary text-xs py-1.5 px-3">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const tCfg = TIMELINE_CONFIG[insights.timeline_assessment] ?? TIMELINE_CONFIG["Delayed"];
  const TimelineIcon = tCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="cr-card overflow-hidden"
    >
      {/* ── Card Header ── */}
      <div className="relative px-5 py-4 border-b-2 border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-50/60 to-transparent dark:from-violet-950/20 dark:to-transparent flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Icon block */}
          <div className="w-9 h-9 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
            <Cpu size={17} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="font-heading font-bold text-slate-900 dark:text-white leading-tight" style={{ letterSpacing: "-0.025em" }}>
              AI Contractor Review
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <GroqLogo className="w-3 h-3 text-violet-500" />
              <span className="cr-section-title text-violet-500 dark:text-violet-400">Powered by Groq</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          className="p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-150 shrink-0"
          title="Regenerate"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Summary ── */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {insights.summary}
        </p>

        {/* ── Timeline + Transparency row ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Timeline Status */}
          <div className={cn(
            "flex flex-col gap-2 p-3 rounded-xl border-2",
            tCfg.bg, tCfg.border
          )}>
            <span className={cn("cr-section-title", tCfg.color)}>Timeline</span>
            <div className={cn("flex items-center gap-2 font-mono font-black text-sm", tCfg.color)}>
              <TimelineIcon size={15} />
              {tCfg.label}
            </div>
          </div>

          {/* Transparency Score */}
          <div className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex flex-col gap-1">
              <span className="cr-section-title flex items-center gap-1">
                <Shield size={10} /> Score
              </span>
              <span className="text-[10px] font-mono text-slate-400">Transparency</span>
            </div>
            <ScoreDial score={insights.transparency_score} />
          </div>
        </div>

        {/* ── Budget Analysis ── */}
        {insights.budget_analysis && (
          <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/20">
            <div className="w-7 h-7 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <IndianRupee size={13} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="cr-section-title text-emerald-600 dark:text-emerald-500 mb-1">Budget Analysis</p>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
                {insights.budget_analysis}
              </p>
            </div>
          </div>
        )}

        {/* ── Risk Flags ── */}
        {insights.risk_flags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-slate-100 dark:border-slate-800">
              <AlertTriangle size={12} className="text-red-500" />
              <h4 className="cr-section-title">Risk Flags Detected</h4>
              <span className="ml-auto font-mono text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800 rounded-md px-1.5 py-0.5">
                {insights.risk_flags.length}
              </span>
            </div>
            <div className="space-y-2">
              {insights.risk_flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl border-2 border-red-200 dark:border-red-800/50 bg-red-50/60 dark:bg-red-950/20">
                  <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-red-700 dark:text-red-300 leading-snug uppercase tracking-wide">
                    {flag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Citizen Action ── */}
        <div className="rounded-xl border-2 border-[#0055A4]/20 dark:border-[#38BDF8]/20 bg-[#0055A4]/5 dark:bg-[#38BDF8]/5 overflow-hidden">
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b-2 border-[#0055A4]/15 dark:border-[#38BDF8]/15 bg-[#0055A4]/8 dark:bg-[#38BDF8]/8">
            <TrendingUp size={12} className="text-[#0055A4] dark:text-[#38BDF8]" />
            <p className="cr-section-title text-[#0055A4] dark:text-[#38BDF8]">What You Can Do</p>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed px-3.5 py-3">
            {insights.citizen_action}
          </p>
        </div>

      </div>

      {/* ── Footer stamp ── */}
      <div className="px-5 py-3 border-t-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
        <span className="cr-section-title">AI-Generated Report · Not legal advice</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-violet-500">
          <Clock size={9} /> Live
        </span>
      </div>
    </motion.div>
  );
}
