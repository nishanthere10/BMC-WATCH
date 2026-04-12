"use client";

import { motion } from "framer-motion";
import { MessageSquare, Calendar, MapPin, BrainCircuit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FeedReport {
  id: string;
  issue_type: string;
  created_at: string;
  ai_analysis?: { diagnosis_summary: string } | null;
  bmc_projects?: { title: string; ward: string }[] | null;
}

const issueColors: Record<string, string> = {
  "Safety Hazard": "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50 dark:border-red-800/30",
  "Construction Quality": "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30",
  "Debris / Waste": "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/30",
  "Work Stalled": "bg-slate-100/80 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/30",
};

export default function RecentReportsFeed({ reports }: { reports: FeedReport[] }) {
  if (!reports.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <MessageSquare size={24} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-xs font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest">No audits yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report, index) => {
        const ai = report.ai_analysis;
        const pillStyle = issueColors[report.issue_type] || issueColors["Work Stalled"];

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07, duration: 0.3 }}
            className="group flex gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:border-blue-200/50 dark:hover:border-blue-800/30 hover:shadow-sm transition-all duration-200"
          >
            {/* Left accent bar */}
            <div className="w-0.5 rounded-full bg-gradient-to-b from-[#2563EB] to-[#38BDF8] shrink-0 self-stretch opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${pillStyle}`}>
                  {report.issue_type}
                </span>
                <span className="text-[10px] font-semibold text-[#94A3B8] dark:text-slate-500 flex items-center gap-1 shrink-0">
                  <Calendar size={9} />
                  {formatDistanceToNow(new Date(report.created_at))} ago
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#0F172A] dark:text-white line-clamp-1">
                {report.bmc_projects?.[0]?.title || "Unknown Project"}
              </h4>

              <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
                <MapPin size={11} className="text-[#2563EB] dark:text-[#38BDF8]" />
                {report.bmc_projects?.[0]?.ward} Ward
              </div>

              {ai && (
                <div className="bg-white/70 dark:bg-slate-900/50 border border-blue-100/50 dark:border-blue-900/20 p-2 rounded-lg flex gap-2 items-start">
                  <BrainCircuit size={12} className="text-[#2563EB] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-snug text-[#64748B] dark:text-slate-400 italic">
                    "{ai.diagnosis_summary}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}