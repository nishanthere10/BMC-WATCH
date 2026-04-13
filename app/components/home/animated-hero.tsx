"use client";

import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Activity, CheckCircle2, ScanLine, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

export default function AnimatedHero() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-white dark:bg-[#070D1A]">
      
      {/* ── Blueprint grid background ── */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,85,164,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,85,164,0.08) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* ── Corner accent lines ── */}
      <div className="absolute top-24 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[#0055A4]/30 to-transparent pointer-events-none" />
      <div className="absolute top-24 right-0 w-px h-64 bg-gradient-to-b from-transparent via-[#0055A4]/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">

          {/* ── Content Column ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start"
          >
            {/* Eyebrow badge */}
            <motion.div variants={fadeUp}>
              <span className="cr-badge-progress mb-8 inline-flex">
                <ShieldCheck size={12} />
                Mumbai Road Construction Tracker
              </span>
            </motion.div>

            {/* Hero heading — big, tight, Syne */}
            <motion.h1
              variants={fadeUp}
              className="font-heading font-extrabold text-slate-900 dark:text-white mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.0, letterSpacing: "-0.05em" }}
            >
              Rate Mumbai&apos;s<br />
              <span
                className="relative inline-block"
                style={{ color: "var(--cr-blue-mid)" }}
              >
                Road Works
                {/* Underline accent */}
                <span className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#0055A4] dark:bg-[#38BDF8] rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="cr-page-subtitle text-left max-w-xl mb-10 text-base"
            >
              Scan the QR code at any BMC road construction site, verify real project data, and file AI-graded ratings. Earn civic points. Drive accountability.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link href="/scan" className="cr-btn-primary h-14 px-8 text-base group">
                <ScanLine size={18} />
                Scan QR Code
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/nearby" className="cr-btn-secondary h-14 px-8 text-base group">
                <MapPin size={18} />
                View Nearby Roads
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 pt-8 border-t-2 border-slate-100 dark:border-slate-800 w-full max-w-xl">
              {[
                { value: "2,000+", label: "Live Projects" },
                { value: "4.2★", label: "Avg Rating" },
                { value: "100%", label: "AI-Verified" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono font-bold text-xl text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Graphical Column ── */}
          <div className="hidden lg:flex relative items-center justify-center h-[500px]">

            {/* Main card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
              className="absolute z-20 w-[340px] bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,85,164,0.12)] dark:shadow-[8px_8px_0px_0px_rgba(56,189,248,0.08)] p-5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <MapPin size={14} className="text-[#0055A4] dark:text-[#38BDF8]" /> Road Projects
                </span>
                <span className="cr-badge-resolved text-[10px]">
                  <Zap size={10} /> 2000+ LIVE
                </span>
              </div>

              {/* Simulated map */}
              <div className="flex-1 h-44 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden relative border-2 border-slate-200 dark:border-slate-700">
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,85,164,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,85,164,0.06) 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute left-1/3 top-1/3 w-3 h-3 bg-[#0055A4] rounded-full shadow-[0_0_12px_rgba(0,85,164,0.6)] animate-ping" />
                <div className="absolute left-1/3 top-1/3 w-3 h-3 bg-[#0055A4] rounded-full shadow-[0_0_12px_rgba(0,85,164,0.4)]" />
                <div className="absolute right-1/4 bottom-1/4 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                <div className="absolute left-1/4 bottom-1/3 w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              </div>
            </motion.div>

            {/* Floating rating card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
              transition={{ opacity: { duration: 0.8, delay: 0.3 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 } }}
              className="absolute z-30 -right-4 top-8 w-52 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,85,164,0.1)] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-900/40 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center">
                  <Star size={14} className="text-amber-500" />
                </div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400">Avg Rating</span>
              </div>
              <div className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">4.2</div>
              <div className="cr-badge-resolved text-[10px] mt-2 w-fit">AI Verified</div>
            </motion.div>

            {/* Floating progress card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ opacity: { duration: 0.8, delay: 0.5 }, y: { repeat: Infinity, duration: 7, ease: "easeInOut" } }}
              className="absolute z-10 -left-10 bottom-12 w-60 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,85,164,0.1)] p-4"
            >
              <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Concretisation</div>
              <div className="space-y-3">
                {[
                  { Icon: CheckCircle2, label: "Completed", pct: "72%", color: "bg-emerald-500" },
                  { Icon: Activity, label: "In Progress", pct: "28%", color: "bg-amber-500" },
                ].map(({ Icon, label, pct, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon size={14} className={pct === "72%" ? "text-emerald-500" : "text-amber-500"} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500">{label}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">{pct}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                        <div className={`h-full ${color} rounded-full`} style={{ width: pct }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
