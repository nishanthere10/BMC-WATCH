import {
  ShieldCheck,
  ShieldX,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquareDot,
  BotMessageSquare,
  Sparkles,
  Star,
} from "lucide-react";

export interface AIVerdict {
  is_genuine: boolean;
  rejection_reason: string | null;
  diagnosis_summary: string;
  what_is_good: string[];
  what_is_faulty: string[];
  what_is_missing: string[];
  severity_level: "Low" | "Medium" | "High";
  suggested_rating: number;
  opinion_starter: string;
  points_to_award: number;
}

// Maps directly to cr-badge variants from the design system
const SEVERITY_BADGE: Record<string, string> = {
  Low:    "cr-badge-resolved",
  Medium: "cr-badge-pending",
  High:   "cr-badge-rejected",
};

/* ──────────────────────────────────────────────────────────
   Rejected / Spam state
────────────────────────────────────────────────────────── */
export default function AIAnalysisCard({ analysis }: { analysis: AIVerdict }) {
  if (!analysis.is_genuine) {
    return (
      <div
        className="cr-error-box overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="flex items-start gap-3 p-5">
          <div className="w-10 h-10 rounded-xl bg-[#B91C1C]/15 border border-[#B91C1C]/25 flex items-center justify-center shrink-0">
            <ShieldX size={18} className="text-[#B91C1C]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-[#B91C1C] uppercase tracking-widest font-mono">
              Photo Not Verified
            </p>
            <p className="text-xs text-[#B91C1C]/70 mt-1 leading-relaxed font-medium" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
              {analysis.rejection_reason ??
                "This photo doesn\u2019t appear to show a valid construction site."}
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-slate-500 mt-3">
              Take a clear photo of the actual project site to earn civic points.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const badgeVariant = SEVERITY_BADGE[analysis.severity_level] ?? "cr-badge-pending";

  return (
    <div
      className="cr-card overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* ── Card Header: Verified stamp + severity ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-[#F0FDF4] dark:bg-emerald-950/20">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1A7A3E, #22c55e)" }}
          >
            <ShieldCheck size={15} className="text-white" />
          </div>
          <div>
            <p
              className="text-[11px] font-black text-[#1A7A3E] dark:text-emerald-400 uppercase tracking-[0.14em]"
              style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
            >
              Site Verified · AI Review
            </p>
            <p
              className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5"
              style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
            >
              Groq LLaMA · BMC Civic Watch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className={`cr-badge ${badgeVariant}`}>
            {analysis.severity_level} Severity
          </span>
          <span className="cr-badge cr-badge-progress">
            <Sparkles size={9} />
            +{analysis.points_to_award} pts
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-5 space-y-5">

        {/* Diagnosis summary */}
        <div
          className="cr-info-box"
          style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
        >
          <p className="text-sm font-medium text-[#0F172A] dark:text-slate-200 leading-relaxed italic">
            &ldquo;{analysis.diagnosis_summary}&rdquo;
          </p>
        </div>

        {/* AI suggested rating */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <BotMessageSquare size={14} className="text-[#0055A4] dark:text-[#38BDF8] shrink-0" />
            <span
              className="cr-section-title"
              style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
            >
              AI Suggested Rating
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={15}
                className={
                  s <= analysis.suggested_rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                }
              />
            ))}
            <span
              className="ml-2 text-[11px] font-black text-slate-500 dark:text-slate-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {analysis.suggested_rating}/5
            </span>
          </div>
        </div>

        {/* ── Three checkpoint sections ── */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <CheckpointSection
            icon={<CheckCircle2 size={13} className="text-[#1A7A3E] dark:text-emerald-400" />}
            label="What Is Good"
            labelClass="text-[#1A7A3E] dark:text-emerald-400"
            dotClass="bg-[#1A7A3E]"
            items={analysis.what_is_good}
          />
          <CheckpointSection
            icon={<AlertCircle size={13} className="text-amber-600 dark:text-amber-400" />}
            label="What Is Faulty"
            labelClass="text-amber-600 dark:text-amber-400"
            dotClass="bg-amber-500"
            items={analysis.what_is_faulty}
          />
          <CheckpointSection
            icon={<XCircle size={13} className="text-[#B91C1C] dark:text-red-400" />}
            label="What Is Missing"
            labelClass="text-[#B91C1C] dark:text-red-400"
            dotClass="bg-[#B91C1C]"
            items={analysis.what_is_missing}
          />
        </div>

        {/* Opinion starter */}
        {analysis.opinion_starter && (
          <div className="flex gap-3 items-start bg-[#EFF6FF] dark:bg-blue-950/20 border border-[#BFDBFE] dark:border-blue-900/30 rounded-xl p-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "linear-gradient(135deg, #0055A4, #38BDF8)" }}
            >
              <MessageSquareDot size={13} className="text-white" />
            </div>
            <div className="min-w-0">
              <p
                className="cr-section-title text-[#0055A4] dark:text-[#38BDF8] mb-1.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Use this in your comment
              </p>
              <p
                className="text-[12px] italic text-[#334155] dark:text-slate-300 leading-relaxed"
                style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
              >
                {analysis.opinion_starter}
              </p>
            </div>
          </div>
        )}

        {/* Footer attribution */}
        <div
          className="flex items-center justify-end gap-1.5 pt-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <BotMessageSquare size={11} className="text-slate-400" />
          <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            AI Verified · Groq LLaMA
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   CheckpointSection — uses design system font stack
────────────────────────────────────────────────────────── */
function CheckpointSection({
  icon,
  label,
  labelClass,
  dotClass,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  labelClass: string;
  dotClass: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <div
        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${labelClass}`}
        style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 10 }}
      >
        {icon}
        {label}
      </div>
      <ul className="space-y-1.5 pl-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-[12px] text-[#475569] dark:text-slate-400 font-medium leading-relaxed"
            style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
          >
            <span className={`w-1.5 h-1.5 rounded-full mt-[5px] shrink-0 opacity-80 ${dotClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}