"use client";

import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectDetailsHeader({ project }: { project: Project }) {
  const statusColors = {
    "In Progress": "bg-blue-500",
    "Delayed": "bg-amber-500",
    "Completed": "bg-emerald-500",
    "Planned": "bg-slate-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="text-primary border-primary">
          {project.type}
        </Badge>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", statusColors[project.status])} />
          <span className="text-sm font-bold uppercase tracking-wider">{project.status}</span>
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">{project.title}</h1>
      
      <div className="flex flex-wrap gap-6 text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          <span className="text-sm font-medium">{project.location} (Ward {project.ward})</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-primary" />
          <span className="text-sm font-medium">Started: {project.startDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <HardHat size={18} className="text-primary" />
          <span className="text-sm font-medium">{project.contractorName}</span>
        </div>
      </div>
    </div>
  );
}