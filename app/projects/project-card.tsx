"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, HardHat, CircleDollarSign, ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";
import { getProjectImage } from "@/types/project";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  "In Progress": "cr-badge-progress",
  "Delayed": "cr-badge-rejected",
  "Completed": "cr-badge-resolved",
  "Planned": "cr-badge-pending",
};

const progressColors: Record<string, string> = {
  "In Progress": "bg-gradient-to-r from-[#2563EB] to-[#38BDF8]",
  "Delayed": "bg-gradient-to-r from-amber-500 to-orange-400",
  "Completed": "bg-gradient-to-r from-emerald-500 to-teal-400",
  "Planned": "bg-gradient-to-r from-slate-400 to-slate-500",
};

export default function ProjectCard({ project }: { project: Project }) {
  const progress = project.progress_percent ?? 0;
  const status = project.status || "Planned";
  const imageSrc = getProjectImage(project.type);
  // Convert budget from raw number to Crores (if > 10M) or Lakhs
  const budgetCr = project.sanctioned_budget
    ? (project.sanctioned_budget / 10000000).toFixed(1)
    : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="cr-card group"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={project.title || "Project"}
          width={400}
          height={200}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={statusStyles[status] || statusStyles["Planned"]}>
            {status}
          </span>
        </div>
        {/* Ward */}
        <p className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
          <MapPin size={12} /> {project.ward || "N/A"} Ward
        </p>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg leading-snug text-[#0F172A] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] transition-colors">
            {project.title || "Untitled Project"}
          </h3>
          <p className="text-[#64748B] dark:text-slate-400 text-sm line-clamp-1 mt-1">{project.location || "Location not specified"}</p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#64748B] dark:text-slate-400">
            <span>Completion</span>
            <span className="text-[#0F172A] dark:text-white font-bold font-mono">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" as const }}
              className={cn("h-full rounded-full", progressColors[status] || progressColors["Planned"])}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] dark:text-slate-500 font-bold">Budget</p>
            <p className="text-sm font-bold font-mono text-[#0F172A] dark:text-white flex items-center gap-1.5">
              <CircleDollarSign size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
              ₹{budgetCr} Cr
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] dark:text-slate-500 font-bold">Contractor</p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5 truncate">
              <HardHat size={14} className="text-[#2563EB] dark:text-[#38BDF8] shrink-0" />
              <span className="truncate">{project.contractor ? project.contractor.split(" ").slice(0, 2).join(" ") : "N/A"}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="cr-btn-primary w-full group/btn mt-3"
        >
          View Full Transparency
          <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}