"use client";

import { BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAnalysisLoading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.4)]"
        >
          <BrainCircuit size={16} className="text-white" />
        </motion.div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:text-[#38BDF8] flex items-center gap-1.5">
            <Sparkles size={11} /> AI Auditor Analyzing
          </span>
          <p className="text-[10px] text-[#64748B] dark:text-slate-500 font-medium mt-0.5">Processing image for civic insights…</p>
        </div>
      </div>

      {/* Animated skeleton lines */}
      <div className="space-y-2.5">
        {[100, 80, 65].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.2, ease: "easeInOut" }}
            className="h-3 rounded-full bg-gradient-to-r from-slate-200 dark:from-slate-700 to-slate-100 dark:to-slate-800"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}