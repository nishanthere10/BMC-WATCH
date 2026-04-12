"use client";

import { Project } from "@/types/project";
import { Calendar, MapPin, HardHat, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { pill: string; dot: string; label: string }> = {
  "In Progress": {
    pill: "bg-blue-100/80 text-[#2563EB] border-blue-200/50 dark:bg-blue-900/30 dark:text-[#38BDF8] dark:border-blue-800/30",
    dot: "bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.7)]",
    label: "In Progress",
  },
  "Delayed": {
    pill: "bg-amber-100/80 text-amber-700 border-amber-200/50 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30",
    dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
    label: "Delayed",
  },
  "Completed": {
    pill: "bg-emerald-100/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30",
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
    label: "Completed",
  },
  "Planned": {
    pill: "bg-slate-100/80 text-slate-600 border-slate-200/50 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/30",
    dot: "bg-slate-400",
    label: "Planned",
  },
};

export default function ProjectDetailsHeader({ project }: { project: Project }) {
  const status = project.status || "Planned";
  const config = statusConfig[status] ?? statusConfig["Planned"];

  return (
    <div className="space-y-5">
      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-slate-100/80 dark:bg-slate-800/50 text-[#64748B] dark:text-slate-300 border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm">
          <Tag size={11} /> {project.type || "Infrastructure"}
        </span>
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm",
          config.pill
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A] dark:text-white leading-tight">
        {project.title || "Untitled Project"}
      </h1>

      {/* Meta info row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center">
            <MapPin size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
          </div>
          <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
            {project.location || "Unknown Location"} · Ward {project.ward || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center">
            <Calendar size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
          </div>
          <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
            Started {project.start_date ? new Date(project.start_date).toLocaleDateString() : "TBD"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center">
            <HardHat size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
          </div>
          <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
            {project.contractor || "Contractor Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}