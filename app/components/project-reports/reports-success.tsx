"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, LayoutList, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportSuccessProps {
  issueType: string;
  onBack: () => void;
  onViewFeed: () => void;
}

export default function ReportSuccess({ issueType, onBack, onViewFeed }: ReportSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
      {/* Glowing Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl scale-150 animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={40} className="text-white" />
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200/40 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
          <Sparkles size={11} /> Logged to BMC Watch
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">Voice Recorded!</h2>
        <p className="text-sm text-[#64748B] dark:text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
          Your report on{" "}
          <span className="font-bold text-[#0F172A] dark:text-white px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
            {issueType}
          </span>{" "}
          has been submitted to the public transparency dashboard.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid w-full gap-3"
      >
        <Button
          onClick={onViewFeed}
          className="h-12 font-bold gap-2 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:bg-[#2563EB] dark:hover:bg-[#38BDF8] dark:hover:text-white rounded-xl shadow-sm transition-all"
        >
          <LayoutList size={16} /> View Recent Reports
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-12 font-bold gap-2 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={15} /> Back
          </Button>
          <Button
            variant="outline"
            className="h-12 font-bold gap-2 rounded-xl border-[#2563EB]/30 text-[#2563EB] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Share2 size={15} /> Share
          </Button>
        </div>
      </motion.div>

      <p className="text-[10px] text-[#94A3B8] dark:text-slate-600 uppercase font-bold tracking-widest">
        Transparency Logged on Supabase
      </p>
    </div>
  );
}