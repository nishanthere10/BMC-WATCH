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
            <h2
              className="font-extrabold text-slate-900 dark:text-white"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
            >
              Built for Active Citizens
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Four deliberate steps to drive accountability.
          </p>
        </div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mt-8">
          {/* Connecting line for larger screens */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-slate-200 via-[#0055A4]/30 to-[#F47920]/30 dark:from-slate-800 dark:via-[#38BDF8]/30 dark:to-[#F47920]/30 z-0" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 bg-white/60 dark:bg-[#0D1424]/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-8
                         hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,85,164,0.12)] dark:hover:shadow-[0_8px_30px_rgba(56,189,248,0.08)]
                         transition-all duration-300 group flex flex-col items-center text-center"
            >
              {/* Step number — big, offset background */}
              <div className="absolute top-4 right-4 font-heading font-extrabold text-7xl leading-none select-none pointer-events-none transition-all duration-300 group-hover:scale-110"
                style={{ color: step.color, opacity: 0.04, letterSpacing: "-0.05em" }}>
                {step.num}
              </div>

              {/* Icon block */}
              <div className="relative w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-sm" style={{ color: step.color, backgroundColor: `${step.color}15` }}>
                <step.icon size={28} className="relative z-10" />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md" style={{ backgroundColor: step.color }} />
              </div>

              {/* Monospace step num */}
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: step.color }}>
                Step {step.num}
              </span>

              <div
                className="font-extrabold text-slate-900 dark:text-white mb-3"
                style={{ fontSize: 19, letterSpacing: "-0.02em" }}
              >
                {step.title}
              </div>
              <p className="text-[15px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
