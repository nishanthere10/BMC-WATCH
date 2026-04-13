"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Map, Menu, X, BarChart2, ScanLine, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useAuth } from "@/app/hooks/use-auth";
import { UserCircle, LogOut, Award, ChevronDown } from "lucide-react";

const NAV_ITEMS = [
  { name: "Nearby Works", href: "/nearby", icon: Map },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Civic Audit", href: "/view-dashboard", icon: BarChart2, live: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="fixed top-0 w-full z-50 pointer-events-none">

      {/* ── Top accent bar ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#0055A4] via-[#38BDF8] to-[#0055A4] pointer-events-none" />

      <nav className="cr-glass-subtle pointer-events-auto w-full">
        <div className="container mx-auto max-w-7xl flex h-[60px] items-center justify-between px-4 md:px-6">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative h-9 w-9 shrink-0 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-[#0D1424] group-hover:border-[#0055A4] dark:group-hover:border-[#38BDF8] transition-all duration-200">
              <Image
                src="/logo-1.png"
                alt="BMC Watch Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900 dark:text-white uppercase" style={{ letterSpacing: "-0.03em" }}>
              BMC<span style={{ color: "var(--cr-blue-mid)" }}>Watch</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-xl transition-all duration-150",
                    active
                      ? "text-[#0055A4] dark:text-[#38BDF8]"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-xl bg-[#0055A4]/8 dark:bg-[#38BDF8]/10 border-2 border-[#0055A4]/20 dark:border-[#38BDF8]/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon size={15} />
                    {item.name}
                  </span>
                  {item.live && (
                    <span className="relative z-10 flex h-1.5 w-1.5 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden md:flex gap-2 items-center shrink-0">
            {/* Scan CTA in Navbar */}
            <Link
              href="/scan"
              className="flex items-center gap-2 text-[13px] font-bold px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0055A4] dark:hover:border-[#38BDF8] hover:text-[#0055A4] dark:hover:text-[#38BDF8] bg-white dark:bg-[#0D1424] transition-all duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]"
            >
              <ScanLine size={14} />
              Scan
            </Link>

            <ThemeToggle />

            {loading ? (
              <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-[13px] font-bold px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0055A4] dark:hover:border-[#38BDF8] transition-all duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]"
                >
                  <UserCircle size={15} style={{ color: "var(--cr-blue-mid)" }} />
                  <span>Account</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 shadow-[6px_6px_0px_0px_rgba(0,85,164,0.08)] dark:shadow-[6px_6px_0px_0px_rgba(56,189,248,0.06)] rounded-2xl overflow-hidden py-2"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <UserCircle size={16} className="text-slate-400" /> My Profile
                      </Link>
                      <Link
                        href="/leaderboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-slate-700 dark:text-slate-200"
                      >
                        <Award size={16} className="text-amber-500" /> Leaderboard
                      </Link>
                      <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-1" />
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="cr-btn-primary text-[13px]">
                <UserCircle size={14} />
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-all duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
                    <X size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
                    <Menu size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t-2 border-slate-100 dark:border-slate-800"
            >
              <div className="px-4 py-4 flex flex-col gap-1.5 bg-white dark:bg-[#070D1A]">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 text-sm font-bold px-4 py-3 rounded-xl border-2 transition-all duration-150",
                        active
                          ? "bg-[#0055A4]/6 dark:bg-[#38BDF8]/8 border-[#0055A4]/20 dark:border-[#38BDF8]/20 text-[#0055A4] dark:text-[#38BDF8]"
                          : "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <item.icon size={17} />
                      <span className="flex-1">{item.name}</span>
                      {item.live && (
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-bold px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-150">
                      <UserCircle size={17} className="text-slate-400" /> Profile
                    </Link>
                    <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-bold px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-150">
                      <Award size={17} className="text-amber-500" /> Leaderboard
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-3 text-sm font-bold px-4 py-3 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-150">
                      <LogOut size={17} /> Sign Out
                    </button>
                    <Link href="/scan" onClick={() => setIsOpen(false)} className="cr-btn-accent w-full mt-1">
                      <ScanLine size={16} /> Scan QR Code
                    </Link>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)} className="cr-btn-primary w-full">
                    <UserCircle size={16} /> Login to Participate
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}