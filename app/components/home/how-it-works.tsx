"use client";

import { motion } from "framer-motion";
import { ScanLine, ClipboardList, Camera, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ScanLine,
    title: "Scan QR Code",
    description: "Find the official BMC QR code at any road construction site and scan it instantly.",
    color: "#0055A4",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "View Project Data",
    description: "See contractor name, allocated budget, timeline, and live project status.",
    color: "#0891B2",
  },
  {
    num: "03",
    icon: Camera,
    title: "File Your Evaluation",
    description: "Photograph the site and submit your rating capturing the ground reality.",
    color: "#F47920",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "AI Verifies & Awards",
    description: "Your photo is verified by AI to prevent fraud, then you earn Civic Points.",
    color: "#1A7A3E",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-slate-50 dark:bg-[#060C18] border-y-2 border-slate-200 dark:border-slate-800 py-24 overflow-hidden">
      
      {/* Structural background divisions */}
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none opacity-30 dark:opacity-10"
        style={{ backgroundImage: `linear-gradient(rgba(0,85,164,0.05) 1px, transparent 1px)`, backgroundSize: "100% 80px" }} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section heading */}
        <div className="flex items-end justify-between mb-16 gap-4 flex-wrap border-b-2 border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <span className="cr-section-title block mb-3">User Flow — How It Works</span>
            <h2 className="font-heading font-extrabold text-slate-900 dark:text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              Built for Active Citizens
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Four deliberate steps to drive accountability.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 
                         hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,85,164,0.12)] dark:hover:shadow-[6px_6px_0px_0px_rgba(56,189,248,0.08)]
                         transition-all duration-200 group"
            >
              {/* Step number — big, offset */}
              <div className="absolute -top-4 -right-2 font-heading font-extrabold text-6xl leading-none select-none pointer-events-none"
                style={{ color: step.color, opacity: 0.08, letterSpacing: "-0.05em" }}>
                {step.num}
              </div>

              {/* Icon block */}
              <div className="w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-5 transition-all duration-200 group-hover:border-current" style={{ color: step.color, backgroundColor: `${step.color}12` }}>
                <step.icon size={24} />
              </div>

              {/* Monospace step num */}
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: step.color }}>
                Step {step.num}
              </span>

              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
