"use client";

import { Project } from "@/types/project";
import { Calendar, MapPin, HardHat, Tag, IndianRupee, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { pill: string; dot: string; label: string }> = {
  "In Progress": {
    pill: "cr-badge-progress",
    dot: "bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.7)]",
    label: "In Progress",
  },
  "Delayed": {
    pill: "cr-badge-rejected",
    dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
    label: "Delayed",
  },
  "Completed": {
    pill: "cr-badge-resolved",
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
    label: "Completed",
  },
  "Planned": {
    pill: "cr-badge-pending",
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
        <span className="cr-badge cr-badge-pending">
          <Tag size={11} /> {project.type || "Infrastructure"}
        </span>
        {project.subtype && (
          <span className="cr-badge cr-badge-pending">
            {project.subtype}
          </span>
        )}
        <span className={cn("cr-badge", config.pill)}>
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h1 className="cr-page-title md:text-4xl text-left font-black leading-tight">
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
            {project.zone && <span className="text-slate-400"> · {project.zone}</span>}
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
        {project.expected_end && status !== "Completed" && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100/80 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock size={14} className="text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
              Due {new Date(project.expected_end).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center">
            <HardHat size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
          </div>
          <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
            {project.contractor || "Contractor Unassigned"}
          </span>
        </div>
        {(project.sanctioned_budget_display || project.sanctioned_budget) && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30 flex items-center justify-center">
              <IndianRupee size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-[#334155] dark:text-slate-300">
              {project.sanctioned_budget_display || `₹${(project.sanctioned_budget! / 10000000).toFixed(2)} Cr`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}