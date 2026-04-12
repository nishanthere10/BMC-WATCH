import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectUpdate {
  date: string;
  text: string;
}

export default function ProjectTimeline({ updates }: { updates: ProjectUpdate[] }) {
  if (!updates || updates.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20">
        <p className="text-[#64748B] dark:text-slate-500 text-sm font-medium">No official updates posted yet.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#2563EB] before:via-slate-200 before:to-transparent dark:before:via-slate-700">
      {updates.map((update, index) => (
        <div key={index} className="relative flex items-start gap-6 group">
          <div className={cn(
            "absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300",
            index === 0
              ? "bg-[#2563EB] border-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 group-hover:border-[#2563EB]/50"
          )}>
            {index === 0
              ? <CheckCircle2 className="text-white" size={18} />
              : <Circle className="text-slate-300 dark:text-slate-600" size={10} />
            }
          </div>

          <div className="ml-14 pt-1.5 pb-2 flex-1">
            <time className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] dark:text-[#38BDF8]">{update.date}</time>
            <p className="mt-1.5 text-[#334155] dark:text-slate-300 font-medium leading-relaxed text-sm">{update.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}