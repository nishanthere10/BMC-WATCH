"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  RefreshCw,
  Sparkles,
  TrendingUp,
  IndianRupee,
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

  const timelineConfig = {
    "On Track": { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: CheckCircle2 },
    "Delayed": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", icon: Clock },
    "Critical": { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertTriangle },
  };

  // Loading skeleton
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-br from-purple-50/60 to-blue-50/40 dark:from-purple-950/20 dark:to-blue-950/10 backdrop-blur-xl border-2 border-purple-100/60 dark:border-purple-900/30 shadow-lg rounded-3xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-sm">
            <Brain size={18} className="text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">AI Insights</h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest">Analyzing…</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-3/4" />
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse w-1/2 mt-4" />
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-red-50/60 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 rounded-3xl p-6"
      >
        <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-3">{error}</p>
        <button onClick={fetchInsights} className="cr-btn-primary text-xs py-1.5 px-3">
          <RefreshCw size={12} /> Retry
        </button>
      </motion.div>
    );
  }

  if (!insights) return null;

  const tConfig = timelineConfig[insights.timeline_assessment] || timelineConfig["Delayed"];
  const TimelineIcon = tConfig.icon;
  const transparencyPct = (insights.transparency_score / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-gradient-to-br from-purple-50/60 to-blue-50/40 dark:from-purple-950/20 dark:to-blue-950/10 backdrop-blur-xl border-2 border-purple-100/60 dark:border-purple-900/30 shadow-lg rounded-3xl p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-sm">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">AI Insights</h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={9} /> Powered by Groq
            </p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-slate-400 hover:text-purple-600"
          title="Regenerate insights"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {insights.summary}
      </p>

      {/* Timeline Assessment */}
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold", tConfig.bg, tConfig.color)}>
        <TimelineIcon size={15} />
        Timeline: {insights.timeline_assessment}
      </div>

      {/* Transparency Score */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Shield size={11} /> Transparency
          </span>
          <span className="text-sm font-black text-[#0F172A] dark:text-white">{insights.transparency_score}/10</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${transparencyPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              insights.transparency_score >= 7
                ? "bg-emerald-500"
                : insights.transparency_score >= 4
                ? "bg-amber-500"
                : "bg-red-500"
            )}
          />
        </div>
      </div>

      {/* Budget Analysis */}
      {insights.budget_analysis && (
        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/30">
          <IndianRupee size={13} className="text-emerald-500 mt-0.5 shrink-0" />
          <span>{insights.budget_analysis}</span>
        </div>
      )}

      {/* Risk Flags */}
      {insights.risk_flags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <AlertTriangle size={11} /> Risk Flags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {insights.risk_flags.map((flag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100/80 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30"
              >
                <AlertTriangle size={9} /> {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Citizen Action */}
      <div className="bg-[#0055A4]/8 dark:bg-[#38BDF8]/8 border-2 border-[#0055A4]/15 dark:border-[#38BDF8]/15 rounded-xl p-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0055A4] dark:text-[#38BDF8] mb-1 flex items-center gap-1">
          <TrendingUp size={11} /> What you can do
        </p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {insights.citizen_action}
        </p>
      </div>
    </motion.div>
  );
}
