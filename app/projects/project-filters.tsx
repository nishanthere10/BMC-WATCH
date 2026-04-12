"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProjectFiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ProjectFilters({
  onSearchChange,
  onTypeChange,
  onStatusChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg rounded-2xl p-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-500" size={16} />
        <Input
          placeholder="Search by project name, ward, or location..."
          className="pl-10 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-medium placeholder:text-[#94A3B8] dark:placeholder:text-slate-600 focus-visible:ring-[#2563EB]/30 focus-visible:border-[#2563EB]/50"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-[#64748B] dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
          <SlidersHorizontal size={14} /> Filter
        </div>
        <Select onValueChange={onTypeChange} defaultValue="all">
          <SelectTrigger className="w-[150px] h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-semibold">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/60 dark:border-slate-700/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Road Work">Road Work</SelectItem>
            <SelectItem value="Drain Work">Drain Work</SelectItem>
            <SelectItem value="Water Line Repair">Water Line Repair</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onStatusChange} defaultValue="all">
          <SelectTrigger className="w-[150px] h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-semibold">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/60 dark:border-slate-700/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}