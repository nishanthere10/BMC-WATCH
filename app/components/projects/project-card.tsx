"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, HardHat, CircleDollarSign, ArrowRight } from "lucide-react";
import { Project } from "../../types/project";
import { cn } from "@/lib/utils";

// Helper for status colors
const statusStyles = {
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  "Delayed": "bg-amber-100 text-amber-700 border-amber-200",
  "Completed": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Planned": "bg-slate-100 text-slate-700 border-slate-200",
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm",
            statusStyles[project.status]
          )}>
            {project.status}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-xs font-medium flex items-center gap-1">
            <MapPin size={12} /> {project.ward} Ward
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
            {project.location}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span>Completion</span>
            <span>{project.completionPercent}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${project.completionPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                project.status === "Delayed" ? "bg-amber-500" : "bg-primary"
              )}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Budget</p>
            <p className="text-sm font-semibold flex items-center gap-1">
              <CircleDollarSign size={14} className="text-primary" />
              ₹{project.budgetSanctioned} Cr
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Contractor</p>
            <p className="text-sm font-semibold flex items-center gap-1 truncate">
              <HardHat size={14} className="text-primary" />
              {project.contractorName.split(' ')[0]}...
            </p>
          </div>
        </div>

        <Link 
          href={`/projects/${project.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all group/btn"
        >
          View Full Transparency
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}