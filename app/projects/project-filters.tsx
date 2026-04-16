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
import { useTranslations } from "@/app/components/I18nProvider";

interface ProjectFiltersProps {
  types?: string[];
  statuses?: string[];
  wards?: string[];
  searchQuery: string;
  selectedWard?: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onWardChange?: (value: string) => void;
}

export default function ProjectFilters({
  types = [],
  statuses = [],
  wards = [],
  searchQuery,
  selectedWard = "all",
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onWardChange,
}: ProjectFiltersProps) {
  const { t } = useTranslations();
  
  return (
    <div className="flex flex-col xl:flex-row gap-3 mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg rounded-2xl p-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-500" size={16} />
        <Input
          placeholder={t('filters.search')}
          value={searchQuery}
          className="pl-10 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-medium placeholder:text-[#94A3B8] dark:placeholder:text-slate-600 focus-visible:ring-[#2563EB]/30 focus-visible:border-[#2563EB]/50"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-[#64748B] dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
          <SlidersHorizontal size={14} /> {t('filters.filter_label')}
        </div>
        
        {/* Type Filter */}
        <Select onValueChange={onTypeChange} defaultValue="all">
          <SelectTrigger className="w-[140px] md:w-[150px] h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-semibold">
            <SelectValue placeholder={t('filters.project_type')} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/60 dark:border-slate-700/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl max-h-60">
            <SelectItem value="all">{t('filters.all_types')}</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select onValueChange={onStatusChange} defaultValue="all">
          <SelectTrigger className="w-[140px] md:w-[150px] h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-semibold">
            <SelectValue placeholder={t('filters.status')} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/60 dark:border-slate-700/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl max-h-60">
            <SelectItem value="all">{t('filters.all_statuses')}</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Ward Filter */}
        {onWardChange && (
          <Select onValueChange={onWardChange} value={selectedWard || "all"}>
            <SelectTrigger className="w-[140px] md:w-[150px] h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm font-semibold">
              <SelectValue placeholder={t('filters.ward')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/60 dark:border-slate-700/50 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl max-h-60">
              <SelectItem value="all">{t('filters.all_wards')}</SelectItem>
              {wards.map((w) => (
                <SelectItem key={w} value={w}>{t('filters.ward_prefix')} {w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}