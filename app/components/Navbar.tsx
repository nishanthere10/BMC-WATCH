"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Menu, X, Landmark, BarChart2, QrCode, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Nearby Works", href: "/nearby", icon: Map },
    { name: "Civic Audit", href: "/view-dashboard", icon: BarChart2 },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="fixed top-0 w-full z-50 px-4 pt-4 pb-0 md:px-6 pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-7xl rounded-2xl border border-white/40 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl md:text-2xl tracking-tight text-[#0F172A] dark:text-white group shrink-0">
            <div className="bg-gradient-to-br from-[#2563EB] to-[#38BDF8] p-1.5 rounded-xl text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)] transition-transform duration-300 group-hover:scale-105">
              <Landmark size={20} strokeWidth={2.5} />
            </div>
            <span className="tracking-tight font-extrabold">
              BMC<span className="text-[#2563EB] dark:text-[#38BDF8]">Watch</span>
            </span>
          </Link>

          {/* Desktop Nav Pills */}
          <div className="hidden md:flex gap-1 items-center bg-slate-100/60 dark:bg-slate-800/60 p-1 rounded-xl">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200",
                    active
                      ? "text-[#2563EB] dark:text-[#38BDF8]"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-slate-700 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon size={15} />
                    {item.name}
                  </span>
                  {/* Live dot for Civic Audit */}
                  {item.href === "/view-dashboard" && (
                    <span className="relative z-10 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex gap-3 items-center shrink-0">
            <ThemeToggle />
            <Link
              href="/scan"
              className="relative inline-flex items-center gap-2 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:bg-[#2563EB] dark:hover:bg-[#38BDF8] dark:hover:text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group"
            >
              {/* animated shimmer accent */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <ScanLine size={15} />
              Scan Area
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 -mr-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 text-sm font-semibold p-3 rounded-xl transition-colors",
                        active
                          ? "bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] dark:text-[#38BDF8]"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <item.icon size={17} className={active ? "text-[#2563EB] dark:text-[#38BDF8]" : "text-slate-400 dark:text-slate-500"} />
                      <span className="flex-1">{item.name}</span>
                      {item.href === "/view-dashboard" && (
                        <span className="flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                      )}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 mt-1">
                  <Link
                    href="/scan"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 justify-center w-full bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] px-4 py-3 rounded-xl text-sm font-bold"
                  >
                    <QrCode size={16} /> Scan QR Code
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}