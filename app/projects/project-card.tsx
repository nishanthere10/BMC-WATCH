"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, HardHat, CircleDollarSign, ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  "In Progress": "bg-blue-100/80 text-[#2563EB] border-blue-200/60 dark:bg-blue-900/30 dark:text-[#38BDF8] dark:border-blue-800/30",
  "Delayed": "bg-amber-100/80 text-amber-700 border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30",
  "Completed": "bg-emerald-100/80 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30",
  "Planned": "bg-slate-100/80 text-slate-600 border-slate-200/60 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/30",
};

const progressColors: Record<string, string> = {
  "In Progress": "bg-gradient-to-r from-[#2563EB] to-[#38BDF8]",
  "Delayed": "bg-gradient-to-r from-amber-500 to-orange-400",
  "Completed": "bg-gradient-to-r from-emerald-500 to-teal-400",
  "Planned": "bg-gradient-to-r from-slate-400 to-slate-500",
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group overflow-hidden rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_12px_40px_rgba(56,189,248,0.08)] transition-all duration-300"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.images[0]}
          alt={project.title}
          width={400}
          height={200}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm",
            statusStyles[project.status]
          )}>
            {project.status}
          </span>
        </div>
        {/* Ward */}
        <p className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
          <MapPin size={12} /> {project.ward} Ward
        </p>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-base leading-snug text-[#0F172A] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] transition-colors">
            {project.title}
          </h3>
          <p className="text-[#64748B] dark:text-slate-400 text-sm line-clamp-1 mt-1">{project.location}</p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#64748B] dark:text-slate-400">
            <span>Completion</span>
            <span className="text-[#0F172A] dark:text-white font-bold">{project.completionPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.completionPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", progressColors[project.status] || progressColors["Planned"])}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] dark:text-slate-500 font-bold">Budget</p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
              <CircleDollarSign size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
              ₹{project.budgetSanctioned} Cr
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] dark:text-slate-500 font-bold">Contractor</p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5 truncate">
              <HardHat size={14} className="text-[#2563EB] dark:text-[#38BDF8] shrink-0" />
              <span className="truncate">{project.contractorName.split(" ")[0]}...</span>
            </p>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0F172A] dark:bg-white/10 text-white dark:text-white font-semibold text-sm hover:bg-[#2563EB] dark:hover:bg-[#2563EB] transition-all group/btn border border-transparent hover:border-[#2563EB]/30 shadow-sm"
        >
          View Full Transparency
          <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}