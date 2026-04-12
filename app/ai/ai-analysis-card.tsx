"use client";

import { motion } from "framer-motion";
import {
  Stethoscope, CheckCircle2, XCircle, AlertCircle,
  MessageSquareQuote, BotMessageSquare
} from "lucide-react";

interface AIDiagnosis {
  diagnosis_summary: string;
  what_is_good: string[];
  what_is_faulty: string[];
  what_is_missing: string[];
  severity_level: "Low" | "Medium" | "High";
  opinion_starter: string;
}

const severityConfig = {
  Low: {
    pill: "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30",
    dot: "bg-emerald-500",
    glow: "",
  },
  Medium: {
    pill: "bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30",
    dot: "bg-amber-500",
    glow: "",
  },
  High: {
    pill: "bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/30 animate-pulse",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.08)]",
  },
};

export default function AIAnalysisCard({ analysis }: { analysis: AIDiagnosis }) {
  const sev = severityConfig[analysis.severity_level] ?? severityConfig.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl overflow-hidden ${sev.glow}`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-blue-50/80 to-transparent dark:from-blue-950/20 dark:to-transparent">
        <div className="flex items-center gap-2 text-[#2563EB] dark:text-[#38BDF8]">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm">
            <Stethoscope size={13} className="text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Site Diagnosis</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${sev.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
          {analysis.severity_level} Severity
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary */}
        <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-snug italic">
            "{analysis.diagnosis_summary}"
          </p>
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
        <div className="flex gap-3 items-start bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20 p-3 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm shrink-0">
            <MessageSquareQuote size={13} className="text-white" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest mb-1">Expert Opinion Starter</p>
            <p className="text-xs italic text-[#334155] dark:text-slate-300 leading-relaxed">
              {analysis.opinion_starter}
            </p>
          </div>
        </div>

        {/* AI badge */}
        <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-[#94A3B8] dark:text-slate-600">
          <BotMessageSquare size={12} /> AI Generated · Groq
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
      <h4 className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${labelColor}`}>
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