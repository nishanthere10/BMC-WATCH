"use client";

import { cn } from "@/lib/utils";
import type { WardPerformance } from "@/types/dashboard";

export default function WardRankingTable({ data }: { data: WardPerformance[] }) {
  if (!data.length) {
    return (
      <div className="py-12 text-center text-xs font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest">
        No ward data available
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-4 py-3 text-[10px] font-black text-[#64748B] dark:text-slate-500 uppercase tracking-widest">Ward</th>
            <th className="px-4 py-3 text-[10px] font-black text-[#64748B] dark:text-slate-500 uppercase tracking-widest">Progress</th>
            <th className="px-4 py-3 text-[10px] font-black text-[#64748B] dark:text-slate-500 uppercase tracking-widest">Reports</th>
            <th className="px-4 py-3 text-[10px] font-black text-[#64748B] dark:text-slate-500 uppercase tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {data.map((row, _i) => {
            const isCritical = row.delayed_projects > 3;
            return (
              <tr
                key={row.ward}
                className="group hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="font-bold text-[#0F172A] dark:text-white text-sm">{row.ward}</div>
                  <div className="text-[10px] text-[#94A3B8] dark:text-slate-500 font-medium">Zone {row.zone}</div>
                </td>
                <td className="px-4 py-3.5 w-48">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isCritical
                            ? "bg-gradient-to-r from-red-500 to-orange-400"
                            : "bg-gradient-to-r from-[#2563EB] to-[#38BDF8]"
                        )}
                        style={{ width: `${row.avg_progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#0F172A] dark:text-white tabular-nums">
                      {row.avg_progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100/80 dark:bg-slate-800/60 text-[#64748B] dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/30">
                    {row.citizen_reports}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border",
                    isCritical
                      ? "bg-red-100/80 text-red-700 border-red-200/50 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30"
                      : "bg-emerald-100/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                  )}>
                    <span className={cn("w-1 h-1 rounded-full", isCritical ? "bg-red-500" : "bg-emerald-500")} />
                    {isCritical ? "Critical" : "Stable"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}