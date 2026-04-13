"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Target, Users, Zap, Map } from "lucide-react";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard = ({ children, className = "", delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`relative bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden
                hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,85,164,0.1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(56,189,248,0.08)]
                transition-all duration-200 group ${className}`}
  >
    {children}
  </motion.div>
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
              className="font-heading font-extrabold text-slate-900 dark:text-white"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
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
          <FeatureCard className="lg:col-span-2 p-8 flex flex-col justify-between" delay={0}>
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0055A4] dark:text-[#38BDF8]">
                  <Activity size={24} />
                </div>
                <span className="cr-badge-progress">Real-Time</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
                Live Civic Dashboard
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Track thousands of active projects, filter by ward, and monitor budget allocations as they happen.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Map size={56} className="text-[#0055A4]/10 dark:text-[#38BDF8]/10 -ml-2" />
              <div className="cr-badge-resolved text-[10px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                244 Active Works
              </div>
            </div>
          </FeatureCard>

          {/* Feature 2 */}
          <FeatureCard className="p-8 flex flex-col justify-between" delay={0.08}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
                AI Diagnostics
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Every photo is run through AI to prevent spam and ensure reports match real road conditions.
              </p>
            </div>
            <ShieldCheck size={48} className="text-emerald-500/15 self-end" />
          </FeatureCard>

          {/* Feature 3 */}
          <FeatureCard className="p-8 flex flex-col justify-between" delay={0.12}>
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
                Civic Leaderboard
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Earn points for accurate reporting. Top civic reporters get featured on the monthly honor roll.
              </p>
            </div>
            <Users size={48} className="text-amber-500/15 self-start" />
          </FeatureCard>

          {/* Feature 4 — Wide, dark inverted */}
          <FeatureCard className="lg:col-span-2 p-8 flex flex-col justify-between bg-[#070D1A] dark:bg-[#040810] border-slate-800" delay={0.16}>
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(56,189,248,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.15) 1px, transparent 1px)`,
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
              <h3 className="font-heading font-bold text-2xl text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
                Open Civic Data
              </h3>
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
