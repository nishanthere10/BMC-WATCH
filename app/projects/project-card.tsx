import Image from "next/image";
import Link from "next/link";
import { MapPin, HardHat, CircleDollarSign, ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";
import { getProjectImage } from "@/types/project";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/app/components/I18nProvider";

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
  const { t } = useTranslations();
  const progress = project.progress_percent ?? 0;
  const status = project.status || "Planned";
  const imageSrc = getProjectImage(project.type);
  // Convert budget from raw number to Crores (if > 10M) or Lakhs
  const budgetCr = project.sanctioned_budget
    ? (project.sanctioned_budget / 10000000).toFixed(1)
    : "0";

  return (
    <div
      className="cr-card group transition-transform duration-300 hover:-translate-y-1.5 animate-in fade-in fill-mode-both duration-500"
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
          <MapPin size={12} /> {project.ward || t('project_card.na')} {t('project_card.ward')}
        </p>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg leading-snug text-[#0F172A] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] transition-colors">
            {project.title || t('project_card.untitled')}
          </h3>
          <p className="text-[#64748B] dark:text-slate-400 text-sm line-clamp-1 mt-1">{project.location || t('project_card.no_loc')}</p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#64748B] dark:text-slate-400">
            <span>{t('project_card.completion')}</span>
            <span className="text-[#0F172A] dark:text-white font-bold font-mono">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className={cn("h-full rounded-full transition-all duration-1000 ease-out", progressColors[status] || progressColors["Planned"])}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] dark:text-slate-500 font-bold">{t('project_card.budget')}</p>
            <p className="text-sm font-bold font-mono text-[#0F172A] dark:text-white flex items-center gap-1.5">
              <CircleDollarSign size={14} className="text-[#2563EB] dark:text-[#38BDF8]" />
              ₹{budgetCr} {t('project_card.cr')}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#64748B] dark:text-slate-500 font-bold">{t('project_card.contractor')}</p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5 truncate">
              <HardHat size={14} className="text-[#2563EB] dark:text-[#38BDF8] shrink-0" />
              <span className="truncate">{project.contractor ? project.contractor.split(" ").slice(0, 2).join(" ") : t('project_card.na')}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="cr-btn-primary w-full group/btn mt-3"
        >
          {t('project_card.view')}
          <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}