"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Info, Menu, X, Landmark, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Nearby Works", href: "/nearby", icon: Map },
    { name: "Project Dashboard", href: "/projects", icon: FileText },
    { name: "About", href: "#", icon: Info },
  ];

  return (
    <div className="fixed top-0 w-full z-50 px-4 pt-4 pb-2 pb-0 md:px-6 pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-7xl rounded-2xl border border-white/40 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl md:text-2xl tracking-tight text-[#0F172A] dark:text-white group">
            <div className="bg-[#2563EB] dark:bg-[#38BDF8] p-1.5 rounded-lg text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Landmark size={20} strokeWidth={2.5} />
            </div>
            <span className="tracking-tight font-extrabold flex items-center">
              BMC<span className="text-[#2563EB] dark:text-[#38BDF8] ml-0.5">Watch</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1 items-center bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-all hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm px-4 py-2 rounded-lg",
                  pathname === item.href ? "bg-white dark:bg-slate-700 text-[#2563EB] dark:text-[#38BDF8] shadow-sm" : "text-slate-600 dark:text-slate-300"
                )}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <ThemeToggle />
            <Link 
              href="/scan" 
              className="bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] hover:bg-[#2563EB] dark:hover:bg-[#38BDF8] dark:hover:text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
            >
              Scan Area
            </Link>
          </div>

          {/* Mobile Menu Toggle & Theme */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button 
              className="p-2 -mr-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 text-sm font-semibold p-3 pos-relative rounded-xl transition-colors",
                      pathname === item.href 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] dark:text-[#38BDF8]" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon size={18} className={pathname === item.href ? "text-[#2563EB] dark:text-[#38BDF8]" : "text-slate-400 dark:text-slate-500"} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}