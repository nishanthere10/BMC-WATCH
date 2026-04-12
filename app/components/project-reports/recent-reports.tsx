"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Star, MessageSquare, Clock, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitizenReport {
  id: string;
  issue_type: string;
  rating: number;
  comment: string | null;
  photo_url: string;
  created_at: string;
}

export default function RecentReports({ projectId }: { projectId: string }) {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(3);
      if (!error) setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) return null;

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-lg text-[#0F172A] dark:text-white flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm">
          <MessageSquare size={14} className="text-white" />
        </div>
        Community Feedback
      </h3>

      <div className="grid gap-3">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:border-blue-200/40 dark:hover:border-blue-800/20 hover:shadow-sm transition-all duration-200"
          >
            {/* Photo */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/60 dark:border-slate-700/50 shadow-sm">
              <img src={report.photo_url} alt="Evidence" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/80 dark:bg-blue-900/30 text-[#2563EB] dark:text-[#38BDF8] border border-blue-200/50 dark:border-blue-800/30">
                  {report.issue_type}
                </span>
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={10}
                      className={cn(idx < report.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 italic leading-relaxed">
                "{report.comment || "No comment left."}"
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] dark:text-slate-500 font-medium">
                <Clock size={10} />
                {new Date(report.created_at).toLocaleDateString("en-IN")}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}