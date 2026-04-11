import { ProjectUpdate } from "@/types/project";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProjectTimeline({ updates }: { updates: ProjectUpdate[] }) {
  if (updates.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-xl">
        <p className="text-muted-foreground text-sm">No official updates posted yet.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-slate-300 before:to-transparent">
      {updates.map((update, index) => (
        <div key={index} className="relative flex items-start gap-6">
          <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-primary shadow-sm">
            {index === 0 ? <CheckCircle2 className="text-primary" size={20} /> : <Circle className="text-slate-400" size={12} />}
          </div>
          <div className="ml-12 pt-1">
            <time className="text-xs font-bold uppercase tracking-widest text-primary">{update.date}</time>
            <p className="mt-1 text-slate-700 font-medium leading-relaxed">{update.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}