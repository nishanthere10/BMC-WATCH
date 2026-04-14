"use client";

import { cn } from "@/lib/utils";
import type { WardPerformance } from "@/types/dashboard";
import { MapPin, TrendingUp, AlertTriangle } from "lucide-react";

export default function WardRankingTable({ data }: { data: WardPerformance[] }) {
  if (!data.length) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
        <span className="cr-section-title text-slate-400">No ward data available</span>
      </div>
    );
  }

  // Ensure data is sorted by citizen_reports descending since we display that logic
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

      {/* ── Rows ── */}
      <div className="space-y-3 relative z-10 w-full mb-3 pb-3">
        {sortedData.map((row, index) => {
          const isCritical = row.delayed_projects > 3;
          const progressSafe = Number(row.avg_progress) || 0;

          return (
            <div
              key={row.ward}
              className="group relative bg-white dark:bg-[#0B1221] border-2 border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:px-5 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-[4px_4px_0px_0px_rgba(139,92,246,0.1)] transition-all duration-200"
            >
              {/* Rank */}
              <div className="sm:col-span-1 shrink-0 font-mono text-xl font-black text-slate-200 dark:text-slate-800 flex items-center">
                #{index + 1}
              </div>

              {/* Ward Name */}
              <div className="sm:col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-blue-500" />
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
                   <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isCritical
                        ? "bg-gradient-to-r from-red-500 to-amber-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, progressSafe))}%` }}
                  />
                </div>
              </div>

              {/* Citizen Reports */}
              <div className="sm:col-span-2 flex items-center sm:justify-center justify-between">
                 <span className="sm:hidden text-[10px] font-mono font-bold text-slate-400 uppercase">Reports</span>
                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-black">
                   <TrendingUp size={12} className={cn("text-blue-500")} />
                   {row.citizen_reports}
                 </div>
              </div>

              {/* Status Pill */}
              <div className="sm:col-span-2 flex items-center sm:justify-end justify-between">
                 <span className="sm:hidden text-[10px] font-mono font-bold text-slate-400 uppercase">Status</span>
                 {isCritical ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800 rounded-full font-mono text-[10px] uppercase font-black text-red-600 dark:text-red-400 tracking-widest">
                       <AlertTriangle size={10} />
                       Critical
                    </span>
                 ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 rounded-full font-mono text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       Stable
                    </span>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}