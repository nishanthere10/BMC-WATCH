"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Map, Menu, X, BarChart2, ScanLine, Trophy, UserCircle, LogOut, Award, ChevronDown, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { useAuth } from "@/app/hooks/use-auth";
import { useTranslations } from "@/app/components/I18nProvider";
import { motion, AnimatePresence } from "framer-motion";

// ── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { name: "Nearby Works", key: "nearby", href: "/nearby", icon: Map },
  { name: "Leaderboard", key: "leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Civic Audit", key: "dashboard", href: "/view-dashboard", icon: BarChart2, live: true },
];

const USER_MENU_ITEMS = [
  { href: "/profile", key: "profile", label: "My Profile", icon: UserCircle, iconClass: "text-slate-400" },
  { href: "/my-reports", key: "reports", label: "My Reports", icon: FolderOpen, iconClass: "text-[#38BDF8]" },
  { href: "/leaderboard", key: "leaderboard", label: "Leaderboard", icon: Award, iconClass: "text-[#F47920]" },
];

// ── Animation Variants ───────────────────────────────────────────────────────

const dropdown = {
  hidden: { opacity: 0, scale: 0.95, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.1, ease: "easeIn" } },
};

const drawer = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.15, ease: "easeOut" } },
});

// ── Shared class strings ─────────────────────────────────────────────────────

const TEXT = "text-[#475569] dark:text-slate-300";
const TEXT_ACTIVE = "text-[#0055A4] dark:text-[#38BDF8]";
const MENU_ITEM = `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold ${TEXT} hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:${TEXT_ACTIVE} transition-colors`;

// ── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const { t } = useTranslations();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-profile-menu]")) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  return (
    <div className="fixed top-0 w-full z-50 pointer-events-none">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#003366] via-[#0055A4] to-[#003366]" />

      <nav className={cn("cr-glass-subtle pointer-events-auto w-full transition-all duration-300", scrolled && "shadow-md")}>
        <div className={cn("container mx-auto max-w-7xl flex items-center justify-between px-4 md:px-6 transition-all duration-300", scrolled ? "h-[52px]" : "h-[60px]")}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-14 w-14 shrink-0 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-[#0D1424] group-hover:border-[#0055A4] dark:group-hover:border-[#38BDF8] transition-colors duration-200">
              <Image src="/logo-1.jpg" alt="BMC Watch Logo" fill className="object-contain" sizes="56px" priority />
            </div>
            <span className="text-lg font-black uppercase text-[#003366] dark:text-white" style={{ letterSpacing: "-0.02em" }}>
              BMC<span className="text-[#0055A4] dark:text-[#38BDF8]">Watch</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn("relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-150 text-[13px] font-bold", active ? TEXT_ACTIVE : `${TEXT} hover:text-[#003366] dark:hover:text-white`)}
                >
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-[#0055A4]/8 dark:bg-[#38BDF8]/10 border-2 border-[#0055A4]/20 dark:border-[#38BDF8]/20"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon size={15} />
                    {t(`nav.${item.key}`)}
                  </span>
                  {item.live && (
                    <span className="relative z-10 flex h-1.5 w-1.5 ml-0.5">
                      <span className="animate-ping absolute inset-0 rounded-full bg-[#1A7A3E] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1A7A3E]" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex gap-2 items-center shrink-0">
            <Link href="/scan" className="cr-btn cr-btn-secondary text-[13px]">
              <ScanLine size={14} />{t('nav.scan')}
            </Link>
            <LanguageToggle />
            <ThemeToggle />

            {loading ? (
              <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className={cn("flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 text-[13px] font-bold transition-all duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]", TEXT, `hover:border-[#0055A4] dark:hover:border-[#38BDF8] hover:${TEXT_ACTIVE}`)}
                >
                  <UserCircle size={15} className={TEXT_ACTIVE} />
                  Account
                  <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex">
                    <ChevronDown size={13} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      variants={dropdown} initial="hidden" animate="visible" exit="exit"
                      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 shadow-[6px_6px_0px_0px_rgba(0,85,164,0.08)] dark:shadow-[6px_6px_0px_0px_rgba(56,189,248,0.06)] rounded-2xl overflow-hidden py-2 origin-top-right"
                    >
                      {USER_MENU_ITEMS.map((item, i) => (
                        <motion.div key={item.href} variants={stagger(i)} initial="hidden" animate="visible">
                          <Link href={item.href} onClick={() => setProfileOpen(false)} className={MENU_ITEM}>
                            <item.icon size={16} className={item.iconClass} />
                            {t(`nav.${item.key}`)}
                          </Link>
                        </motion.div>
                      ))}
                      <div className="h-px mx-4 bg-slate-100 dark:bg-slate-800 my-1" />
                      <motion.div variants={stagger(USER_MENU_ITEMS.length)} initial="hidden" animate="visible">
                        <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          <LogOut size={16} />{t('nav.logout')}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="cr-btn cr-btn-primary text-[13px]">
                <UserCircle size={14} />{t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="p-2 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)]"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={cn("flex", TEXT)}
                >
                  {isOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div variants={drawer} initial="hidden" animate="visible" exit="exit" className="md:hidden overflow-hidden border-t-2 border-slate-100 dark:border-slate-800">
              <div className="px-4 py-4 flex flex-col gap-1.5 bg-white dark:bg-[#070D1A]">

                {NAV_ITEMS.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div key={item.name} variants={stagger(i)} initial="hidden" animate="visible">
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-[14px] font-bold transition-colors duration-150",
                          active ? `bg-[#0055A4]/6 dark:bg-[#38BDF8]/8 border-[#0055A4]/20 dark:border-[#38BDF8]/20 ${TEXT_ACTIVE}` : `border-slate-100 dark:border-slate-800 ${TEXT} hover:bg-slate-50 dark:hover:bg-slate-800/50`
                        )}
                      >
                        <item.icon size={17} />
                        <span className="flex-1">{t(`nav.${item.key}`)}</span>
                        {item.live && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inset-0 rounded-full bg-[#1A7A3E] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A7A3E]" />
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                
                <div className="flex items-center justify-center gap-3 py-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {user ? (
                  <>
                    {USER_MENU_ITEMS.map((item, i) => (
                      <motion.div key={item.href} variants={stagger(NAV_ITEMS.length + i + 1)} initial="hidden" animate="visible">
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-[14px] font-bold transition-colors duration-150", TEXT, "hover:bg-slate-50 dark:hover:bg-slate-800/50")}
                        >
                          <item.icon size={17} className={item.iconClass} />
                          {t(`nav.${item.key}`)}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div variants={stagger(NAV_ITEMS.length + USER_MENU_ITEMS.length + 1)} initial="hidden" animate="visible">
                      <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-[14px] font-bold text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut size={17} />{t('nav.logout')}
                      </button>
                    </motion.div>
                    <motion.div variants={stagger(NAV_ITEMS.length + USER_MENU_ITEMS.length + 2)} initial="hidden" animate="visible">
                      <Link href="/scan" onClick={() => setIsOpen(false)} className="cr-btn cr-btn-accent w-full mt-1">
                        <ScanLine size={16} />{t('nav.scan')}
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={stagger(NAV_ITEMS.length + 1)} initial="hidden" animate="visible">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="cr-btn cr-btn-primary w-full">
                      <UserCircle size={16} />{t('nav.login')}
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}