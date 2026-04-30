import { Activity, ShieldCheck, Target, Users, Zap, Map } from "lucide-react";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard = ({ children, className = "", delay = 0 }: FeatureCardProps) => (
  <div
    className={`relative bg-white/70 dark:bg-[#0D1424]/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-3xl overflow-hidden
                hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,85,164,0.12)] dark:hover:shadow-[0_12px_40px_rgba(56,189,248,0.08)]
                transition-all duration-300 group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    {children}
  </div>
);

export default function AppFeatures() {
  return (
    <section className="bg-white dark:bg-[#070D1A] py-24 px-4 sm:px-6">
      <div className="container max-w-7xl mx-auto">

        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end mb-12 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
          <div>
            <span className="cr-section-title block mb-3">Core Capabilities</span>
            <h2
              className="font-extrabold text-slate-900 dark:text-white"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
            >
              Everything to hold the<br />system accountable.
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base max-w-md leading-relaxed lg:text-right">
            Real-time civic intelligence, AI-powered verification, and open data — all in one platform built for transparency.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[280px]">

          {/* Feature 1 — Wide */}
          <FeatureCard className="lg:col-span-2 p-8 flex flex-col justify-between relative z-10" delay={0}>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#0055A4]/5 dark:bg-[#38BDF8]/5 rounded-full blur-3xl group-hover:bg-[#0055A4]/10 dark:group-hover:bg-[#38BDF8]/10 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0055A4] dark:text-[#38BDF8] group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Activity size={28} />
                </div>
                <span className="cr-badge-progress shadow-sm">Real-Time</span>
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white mb-3" style={{ fontSize: 22, letterSpacing: "-0.03em" }}>
                Live Civic Dashboard
              </div>
              <p className="text-[15px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                Track thousands of active projects, filter by ward, and monitor budget allocations as they happen.
              </p>
            </div>
            <div className="flex items-center justify-between relative z-10 mt-4">
              <Map size={64} className="text-[#0055A4]/10 dark:text-[#38BDF8]/10 -ml-2 group-hover:text-[#0055A4]/20 dark:group-hover:text-[#38BDF8]/20 transition-colors duration-300" />
              <div className="cr-badge-resolved text-[11px] flex items-center gap-2 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                244 Active Works
              </div>
            </div>
          </FeatureCard>

          {/* Feature 2 */}
          <FeatureCard className="p-8 flex flex-col justify-between relative z-10" delay={0.08}>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <ShieldCheck size={28} />
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white mb-3" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
                AI Diagnostics
              </div>
              <p className="text-[15px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Every photo is run through AI to prevent spam and ensure reports match real road conditions.
              </p>
            </div>
            <ShieldCheck size={56} className="text-emerald-500/15 self-end mt-4 group-hover:text-emerald-500/25 group-hover:rotate-12 transition-all duration-300 relative z-10" />
          </FeatureCard>

          {/* Feature 3 */}
          <FeatureCard className="p-8 flex flex-col justify-between relative z-10" delay={0.12}>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#F47920]/5 rounded-full blur-3xl group-hover:bg-[#F47920]/10 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#F47920] dark:text-orange-400 mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <Users size={28} />
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white mb-3" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
                Civic Leaderboard
              </div>
              <p className="text-[15px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Earn points for accurate reporting. Top civic reporters get featured on the monthly honor roll.
              </p>
            </div>
            <Users size={56} className="text-[#F47920]/15 self-start mt-4 group-hover:text-[#F47920]/25 group-hover:-translate-y-2 transition-all duration-300 relative z-10" />
          </FeatureCard>

          {/* Feature 4 — Wide, dark inverted */}
          <FeatureCard className="lg:col-span-2 p-8 flex flex-col justify-between !bg-slate-900/90 dark:!bg-[#040810]/90 !border-slate-800 backdrop-blur-xl" delay={0.16}>
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(56,189,248,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.2) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-[#38BDF8]">
                  <Target size={24} />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest border-2 bg-white/10 text-slate-200 border-white/20">
                  API Access
                </span>
              </div>
              <div className="font-extrabold text-white mb-2" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
                Open Civic Data
              </div>
              <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-sm">
                Public projects should be public knowledge. Export datasets, analyze trends, and build your own tools on our open API.
              </p>
            </div>
            <div className="relative z-10 flex justify-end">
              <Zap size={56} className="text-white/10" />
            </div>
          </FeatureCard>

        </div>
      </div>
    </section>
  );
}
