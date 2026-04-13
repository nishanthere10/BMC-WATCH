"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck, ShieldX, CheckCircle2, XCircle, AlertCircle,
  MessageSquareQuote, BotMessageSquare, Star, Sparkles
} from "lucide-react";

export interface AIVerdict {
  is_genuine: boolean;
  rejection_reason: string | null;
  diagnosis_summary: string;
  what_is_good: string[];
  what_is_faulty: string[];
  what_is_missing: string[];
  severity_level: "Low" | "Medium" | "High";
  suggested_rating: number;
  opinion_starter: string;
  points_to_award: number;
}

const severityConfig = {
  Low: {
    pill: "cr-badge-resolved",
    dot: "bg-emerald-500",
    glow: "",
  },
  Medium: {
    pill: "cr-badge-pending",
    dot: "bg-amber-500",
    glow: "",
  },
  High: {
    pill: "cr-badge-rejected animate-pulse",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]",
    glow: "ring-1 ring-red-400/30",
  },
};

export default function AIAnalysisCard({ analysis }: { analysis: AIVerdict }) {
  // Rejected / Spam
  if (!analysis.is_genuine) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="cr-error-box overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <ShieldX size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Photo Not Verified</p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
              {analysis.rejection_reason || "This photo doesn't appear to show a construction site."}
            </p>
          </div>
        </div>
        <div className="px-5 pb-4">
          <p className="text-xs text-red-500/70 dark:text-red-400/50">
            Please take a clear photo of the actual project site to earn civic points.
          </p>
        </div>
      </motion.div>
    );
  }

  const sev = severityConfig[analysis.severity_level] ?? severityConfig.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`cr-card ${sev.glow}`}
    >
      {/* Top Bar — Verified */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-emerald-50/80 to-transparent dark:from-emerald-950/20 dark:to-transparent">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <ShieldCheck size={13} className="text-white" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-widest">Verified Site Photo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`cr-badge ${sev.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
            <span className="font-mono">{analysis.severity_level} Severity</span>
          </span>
          <span className="cr-badge cr-badge-pending">
            <Sparkles size={10} /> <span className="font-mono">+{analysis.points_to_award}</span> pts
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary */}
        <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-snug italic">
            &ldquo;{analysis.diagnosis_summary}&rdquo;
          </p>
        </div>

        {/* AI Suggested Rating */}
        <div className="flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <BotMessageSquare size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">AI Suggested Rating</span>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= analysis.suggested_rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-slate-600"}
              />
            ))}
          </div>
        </div>

        {/* Three Checkpoints */}
        <div className="space-y-3">
          <CheckpointSection
            icon={<CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />}
            label="What is Good"
            labelColor="text-emerald-600 dark:text-emerald-400"
            items={analysis.what_is_good}
            dotColor="bg-emerald-500"
          />
          <CheckpointSection
            icon={<AlertCircle size={13} className="text-amber-600 dark:text-amber-400" />}
            label="What is Faulty"
            labelColor="text-amber-600 dark:text-amber-400"
            items={analysis.what_is_faulty}
            dotColor="bg-amber-500"
          />
          <CheckpointSection
            icon={<XCircle size={13} className="text-red-600 dark:text-red-400" />}
            label="What is Missing"
            labelColor="text-red-600 dark:text-red-400"
            items={analysis.what_is_missing}
            dotColor="bg-red-500"
          />
        </div>

        {/* Opinion Starter */}
        {analysis.opinion_starter && (
          <div className="flex gap-3 items-start bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20 p-3 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm shrink-0">
              <MessageSquareQuote size={13} className="text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest mb-1">Use this in your comment</p>
              <p className="text-xs italic text-[#334155] dark:text-slate-300 leading-relaxed">
                {analysis.opinion_starter}
              </p>
            </div>
          </div>
        )}

        {/* AI badge */}
        <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-[#94A3B8] dark:text-slate-600">
          <BotMessageSquare size={12} /> AI Verified · Groq LLaMA
        </div>
      </div>
    </motion.div>
  );
}

function CheckpointSection({
  icon, label, labelColor, items, dotColor
}: {
  icon: React.ReactNode;
  label: string;
  labelColor: string;
  items: string[];
  dotColor: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <h4 className={`flex items-center gap-1.5 text-[10px] font-black font-heading uppercase tracking-widest ${labelColor}`}>
        {icon} {label}
      </h4>
      <ul className="pl-4 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#64748B] dark:text-slate-400 font-medium leading-relaxed">
            <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}