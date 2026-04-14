"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Map, Menu, X, BarChart2, ScanLine, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useAuth } from "@/app/hooks/use-auth";
import {
  UserCircle,
  LogOut,
  Award,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Nearby Works", href: "/nearby", icon: Map },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Civic Audit", href: "/view-dashboard", icon: BarChart2, live: true },
];

// ── Removed legacy design tokens for Inter alignment ──

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="fixed top-0 w-full z-50 pointer-events-none">
      {/* ── Tri-color accent bar ─────────────────────────── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#003366] via-[#0055A4] to-[#003366] pointer-events-none" />

      <nav className="cr-glass-subtle pointer-events-auto w-full">
        <div className="container mx-auto max-w-7xl flex h-[60px] items-center justify-between px-4 md:px-6">
          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-[#0D1424] group-hover:border-[#0055A4] dark:group-hover:border-[#38BDF8] transition-all duration-200">
              <Image
                src="/logo-1.jpg"
                alt="BMC Watch Logo"
                fill
                className="object-contain" // removed p-1
                sizes="(max-width: 768px) 56px, 64px"
                priority
              />
            </div>
            <span
              className="text-lg font-black uppercase tracking-tight text-[#003366] dark:text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              BMC
              <span
                style={{ color: "#0055A4" }}
                className="dark:text-[#38BDF8]"
              >
                Watch
              </span>
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150",
                    active
                      ? "text-[#0055A4] dark:text-[#38BDF8]"
                      : "text-[#475569] dark:text-slate-400 hover:text-[#003366] dark:hover:text-white",
                  )}
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  {active && (
                    <div className="absolute inset-0 rounded-xl bg-[#0055A4]/8 dark:bg-[#38BDF8]/10 border-2 border-[#0055A4]/20 dark:border-[#38BDF8]/20 animate-in fade-in zoom-in-95 duration-200" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon size={15} />
                    {item.name}
                  </span>
                  {item.live && (
                    <span className="relative z-10 flex h-1.5 w-1.5 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A7A3E] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1A7A3E]" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Right Actions ─────────────────────── */}
          <div className="hidden md:flex gap-2 items-center shrink-0">
            {/* Scan CTA */}
            <Link
              href="/scan"
              className="cr-btn cr-btn-secondary"
              style={{ fontSize: 13 }}
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
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 text-[#334155] dark:text-slate-300 hover:border-[#0055A4] dark:hover:border-[#38BDF8] hover:text-[#0055A4] dark:hover:text-[#38BDF8] transition-all duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]"
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  <UserCircle
                    size={15}
                    style={{ color: "#0055A4" }}
                    className="dark:text-[#38BDF8]"
                  />
                  <span>Account</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 shadow-[6px_6px_0px_0px_rgba(0,85,164,0.08)] dark:shadow-[6px_6px_0px_0px_rgba(56,189,248,0.06)] rounded-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 origin-top-right">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#334155] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#0055A4] dark:hover:text-[#38BDF8] transition-colors"

                    >
                      <UserCircle size={16} className="text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      href="/my-reports"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#334155] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#0055A4] dark:hover:text-[#38BDF8] transition-colors"

                    >
                      <FolderOpen size={16} className="text-[#38BDF8]" />
                      My Reports
                    </Link>
                    <Link
                      href="/leaderboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#334155] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#0055A4] dark:hover:text-[#38BDF8] transition-colors"

                    >
                      <Award size={16} className="text-[#F47920]" />
                      Leaderboard
                    </Link>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"

                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="cr-btn cr-btn-primary"
                style={{ fontSize: 13 }}
              >
                <UserCircle size={14} />
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile Toggle ─────────────────────────────── */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[#334155] dark:text-slate-300 transition-all duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <span className="animate-in fade-in duration-150 rotate-0">
                  <X size={18} />
                </span>
              ) : (
                <span className="animate-in fade-in duration-150 rotate-0">
                  <Menu size={18} />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ─────────────────────────────── */}
        {isOpen && (
          <div className="md:hidden overflow-hidden border-t-2 border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-200 origin-top">
            <div className="px-4 py-4 flex flex-col gap-1.5 bg-white dark:bg-[#070D1A]">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150",
                      active
                        ? "bg-[#0055A4]/6 dark:bg-[#38BDF8]/8 border-[#0055A4]/20 dark:border-[#38BDF8]/20 text-[#0055A4] dark:text-[#38BDF8]"
                        : "border-slate-100 dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    )}
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    <item.icon size={17} />
                    <span className="flex-1">{item.name}</span>
                    {item.live && (
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#1A7A3E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A7A3E]" />
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    <UserCircle size={17} className="text-slate-400" />
                    Profile
                  </Link>
                  <Link
                    href="/my-reports"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    <FolderOpen size={17} className="text-[#38BDF8]" />
                    My Reports
                  </Link>
                  <Link
                    href="/leaderboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    <Award size={17} className="text-[#F47920]" />
                    Leaderboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                  <Link
                    href="/scan"
                    onClick={() => setIsOpen(false)}
                    className="cr-btn cr-btn-accent w-full mt-1"
                  >
                    <ScanLine size={16} />
                    Scan QR Code
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="cr-btn cr-btn-primary w-full"
                >
                  <UserCircle size={16} />
                  Login to Participate
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
