"use client";

import { cn } from "@/lib/utils";
import type { WardPerformance } from "@/types/dashboard";
import { MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

export default function WardRankingTable({ data }: { data: WardPerformance[] }) {
  if (!data.length) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
        <span className="cr-section-title text-slate-400">No ward data available</span>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.citizen_reports - a.citizen_reports);

  return (
    <div className="w-full space-y-3">
      {/* ── Desktop Header ── */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b-2 border-slate-100 dark:border-slate-800 mb-2">
        <div className="col-span-1" />
        <div className="col-span-4 cr-section-title">Ward / Zone</div>
        <div className="col-span-3 cr-section-title">Completion Progress</div>
        <div className="col-span-2 cr-section-title text-center">Citizen Reports</div>
        <div className="col-span-2 cr-section-title text-right">Health Status</div>
      </div>

      {/* ── Animated Rows ── */}
      <div className="space-y-3 relative z-10 w-full mb-3 pb-3">
        {sortedData.map((row, index) => {
          const isCritical = row.delayed_projects > 3;
          const progressSafe = Number(row.avg_progress) || 0;

          return (
            <motion.div
              key={`${row.ward}-${row.zone}`}
              custom={index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                y: -2,
                boxShadow: isCritical
                  ? "4px 4px 0px 0px rgba(239,68,68,0.15)"
                  : "4px 4px 0px 0px rgba(0,85,164,0.12)",
                transition: { duration: 0.15 },
              }}
              className={cn(
                "group relative bg-white dark:bg-[#0B1221] border-2 rounded-xl p-4 sm:px-5 sm:py-4",
                "flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center",
                "transition-colors duration-200 cursor-default",
                isCritical
                  ? "border-red-200 dark:border-red-900 hover:border-red-400 dark:hover:border-red-700"
                  : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
              )}
            >
              {/* Rank */}
              <div className="sm:col-span-1 shrink-0 font-mono text-xl font-black text-slate-200 dark:text-slate-800 flex items-center">
                #{index + 1}
              </div>

              {/* Ward Name */}
              <div className="sm:col-span-4 flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg border-2 flex items-center justify-center shrink-0",
                  isCritical
                    ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
                    : "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900"
                )}>
                  <MapPin size={16} className={isCritical ? "text-red-500" : "text-blue-500"} />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base leading-none mb-1">
                    Ward {row.ward}
                  </h4>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold">
                    Zone {row.zone}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="sm:col-span-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="sm:hidden text-[10px] font-mono font-bold text-slate-400 uppercase">Progress</span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {progressSafe}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      isCritical
                        ? "bg-gradient-to-r from-red-500 to-amber-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progressSafe))}%` }}
                    transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Citizen Reports */}
              <div className="sm:col-span-2 flex items-center sm:justify-center justify-between">
                <span className="sm:hidden text-[10px] font-mono font-bold text-slate-400 uppercase">Reports</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-black">
                  <TrendingUp size={12} className="text-blue-500" />
                  {row.citizen_reports}
                </div>
              </div>

              {/* Status Pill */}
              <div className="sm:col-span-2 flex items-center sm:justify-end justify-between">
                <span className="sm:hidden text-[10px] font-mono font-bold text-slate-400 uppercase">Status</span>
                {isCritical ? (
                  <span className="cr-badge-rejected flex items-center gap-1.5">
                    <AlertTriangle size={10} />
                    Critical
                  </span>
                ) : (
                  <span className="cr-badge-resolved flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Stable
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}