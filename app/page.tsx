"use client";

import Link from "next/link";
import { ArrowRight, MapPin, BarChart3, ShieldCheck, Activity, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F4F7FB] via-blue-50 to-[#F4F7FB] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      
      {/* Soft Animated Background Blobs */}
      <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
      <div className="absolute top-40 -right-64 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-7xl relative z-10 flex min-h-[90vh] items-center">
        
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full">
          
          {/* Content Column */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-col items-start text-left max-w-2xl relative z-20"
          >
            <motion.div variants={fadeUpVariant} className="mb-6 inline-flex items-center rounded-full border border-blue-200/50 dark:border-blue-900/40 bg-white/50 dark:bg-blue-950/40 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-[#2563EB] dark:text-[#38BDF8] shadow-sm tracking-wide">
              <ShieldCheck className="w-4 h-4 mr-2" /> 
              Next-Gen Public Transparency
            </motion.div>
            
            <motion.h1 
              variants={fadeUpVariant} 
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] dark:text-white mb-6 leading-[1.1]"
            >
              The Next Era of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#38BDF8]">Civic Tracking</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUpVariant} 
              className="text-lg md:text-xl text-[#64748B] dark:text-slate-400 mb-10 max-w-xl font-medium leading-relaxed"
            >
              Monitor infrastructure, actively report issues, and follow the progress of modern city development with transparent, verifiable government data.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/projects" 
                className="inline-flex h-14 items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl px-8 font-semibold shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 group"
              >
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/nearby" 
                className="inline-flex h-14 items-center justify-center border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg text-[#0F172A] dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-2xl px-8 font-semibold shadow-sm transition-all hover:-translate-y-1 hover:shadow-md group"
              >
                <MapPin className="mr-2 h-5 w-5 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
                Scan Vicinity
              </Link>
            </motion.div>
          </motion.div>

          {/* Graphical Mockup Column */}
          <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000 hidden md:flex">
            
            {/* Background Glow under cards */}
            <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]"></div>

            {/* Main Center Card (Map Preview) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              className="absolute z-20 w-80 h-72 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-[0_20px_60px_rgba(15,23,42,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <MapPin size={18} className="text-[#38BDF8]" /> Active Array
                </span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-md font-bold">LIVE</span>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative">
                {/* Abstract Data Map UI */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="absolute left-1/3 top-1/3 w-3 h-3 bg-[#2563EB] rounded-full animate-ping"></div>
                <div className="absolute left-1/3 top-1/3 w-3 h-3 bg-[#2563EB] rounded-full shadow-[0_0_15px_#2563EB]"></div>
                
                <div className="absolute right-1/4 bottom-1/4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10B981]"></div>
                <div className="absolute left-1/4 bottom-1/3 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_#F59E0B]"></div>
              </div>
            </motion.div>

            {/* Top Right Floating Card (Stats) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.3 },
                x: { duration: 0.8, delay: 0.3 },
                y: { repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }
              }}
              className="absolute z-30 -right-4 top-12 w-48 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-[0_15px_35px_rgba(15,23,42,0.08)] p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[#2563EB] dark:text-[#38BDF8]">
                  <TrendingUp size={16} />
                </div>
                <div className="text-xs font-medium text-[#64748B] dark:text-slate-400">Total Outlay</div>
              </div>
              <div className="text-xl font-bold text-[#0F172A] dark:text-white">₹14.2B</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">↑ 2.4% vs Last Year</div>
            </motion.div>

            {/* Bottom Left Floating Card (Status List) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: [0, 6, 0] }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.5 },
                y: { repeat: Infinity, duration: 7, ease: "easeInOut" }
              }}
              className="absolute z-10 -left-8 bottom-16 w-56 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-[0_15px_40px_rgba(15,23,42,0.06)] p-4"
            >
              <div className="text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest mb-3">Recent Validations</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                     <div className="w-full h-full bg-emerald-500"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-amber-500" />
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                     <div className="w-[60%] h-full bg-amber-500"></div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
