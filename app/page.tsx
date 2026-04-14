import AnimatedHero from "@/components/home/animated-hero";
import HowItWorks from "@/components/home/how-it-works";
import AppFeatures from "@/components/home/app-features";
export const metadata = {
  title: "BMC Road Construction Tracker",
  description: "Scan the QR code at any BMC road construction site, see real-time project data, and rate the work quality. Your AI-verified ratings earn civic points and drive transparency.",
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      <AnimatedHero />
      <HowItWorks />
      <AppFeatures />
      
      {/* ── Final CTA ── */}
      <section className="relative py-28 px-4 border-t-2 border-slate-200 dark:border-slate-800 bg-[#0055A4] dark:bg-[#040810] text-white overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest border-2 bg-white/10 text-white border-white/30 mb-8">
            Citizens of Mumbai
          </span>
          <h2
            className="font-extrabold text-white mb-6"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            Ready to Drive Change?
          </h2>
          <p
            className="text-white/70 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
          >
            Join thousands of active citizens holding contractors accountable. Every scan counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/scan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl border-2 border-white bg-white text-[#0055A4] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-y-[2px] transition-all duration-150"
              style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: 15 }}
            >
              Start Scanning
            </a>
            <a
              href="/nearby"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl border-2 border-[#F47920] bg-[#F47920] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] transition-all duration-150"
              style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: 15 }}
            >
              Explore Ward Map
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
