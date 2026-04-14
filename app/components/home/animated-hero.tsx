"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, ShieldCheck, ScanLine, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: any = { show: { transition: { staggerChildren: 0.12 } } };

const IMAGES = [
  { src: "/images/road-img1.webp", caption: "Active construction monitoring" },
  { src: "/images/road-img-2.webp", caption: "Real-time site inspections" },
  { src: "/images/road-img3.jpg", caption: "Citizen-verified project data" },
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current]
  );

  const prev = () => go((current - 1 + IMAGES.length) % IMAGES.length);
  const next = () => go((current + 1) % IMAGES.length);

  // Auto-advance every 4s
  useEffect(() => {
    const t = setTimeout(() => go((current + 1) % IMAGES.length), 4000);
    return () => clearTimeout(t);
  }, [current, go]);

  const variants: any = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.97, transition: { duration: 0.3 } }),
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-[8px_8px_0px_0px_rgba(0,85,164,0.10)] dark:shadow-[8px_8px_0px_0px_rgba(56,189,248,0.06)] bg-white dark:bg-[#0D1424]">
      {/* Image area */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={IMAGES[current].src}
              alt={IMAGES[current].caption}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 z-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-white text-sm font-bold font-mono"
            >
              {IMAGES[current].caption}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-xl bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-xl bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dot indicators + label */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t-2 border-slate-100 dark:border-slate-800">
        <span className="cr-section-title text-slate-400">
          {current + 1} / {IMAGES.length} · Site Photos
        </span>
        <div className="flex gap-1.5">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 bg-[#0055A4] dark:bg-[#38BDF8]"
                  : "w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnimatedHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-[#070D1A]">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,85,164,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,85,164,0.08) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Text content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            {/* Eyebrow badge */}
            <motion.div variants={fadeUp}>
              <span className="cr-badge-progress mb-6 inline-flex">
                <ShieldCheck size={12} />
                Mumbai Road Construction Tracker
              </span>
            </motion.div>

            {/* Hero heading */}
            <motion.h1
              variants={fadeUp}
              className="font-heading font-extrabold text-slate-900 dark:text-white mb-5"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", lineHeight: 1.05, letterSpacing: "-0.04em" }}
            >
              Rate Mumbai&apos;s{" "}
              <span className="text-[#0055A4] dark:text-[#38BDF8]">Road Works</span>.
              <br />
              Hold the system accountable.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-slate-500 dark:text-slate-400 font-medium text-lg mb-8 leading-relaxed max-w-lg"
            >
              Scan the QR code at any BMC road construction site, verify real project data, and file AI-graded ratings. Earn civic points. Drive accountability.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <Link href="/scan" className="cr-btn-primary h-14 px-8 text-base group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <ScanLine size={18} />
                Start Scanning
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/nearby" className="cr-btn-secondary h-14 px-8 text-base group bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
                <MapPin size={18} />
                Explore Ward Map
              </Link>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-8 mt-10 pt-8 border-t-2 border-slate-100 dark:border-slate-800"
            >
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

          {/* ── RIGHT: Image carousel card ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <ImageCarousel />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
