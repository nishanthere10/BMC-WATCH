"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Award, FileText, ChevronDown, CheckCircle2, ShieldCheck, MapPin, Loader2, Calendar, FileCheck, CircleDashed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function MyReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [reports, setReports] = useState<any[]>([]);
  const [profileStats, setProfileStats] = useState({ points: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      // Get points and count
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("total_points, total_ratings")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        setProfileStats({ points: profile.total_points, count: profile.total_ratings });
      }
      
      // Get all reports from the user
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("project_ratings")
        .select(`
          *,
          bmc_projects ( id, title, location )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError);
      }
        
      if (ratingsData) {
        setReports(ratingsData);
      } else {
        setReports([]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070D1A]">
        <Loader2 className="animate-spin text-[#0055A4] dark:text-[#38BDF8]" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1A] pb-20 pt-24">
      {/* Header / Hero */}
      <div className="bg-[#0055A4] dark:bg-[#0D1424] text-white pt-12 pb-24 px-4 md:px-8 border-b-4 border-[#F47920] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto relative z-10">
          <Link href="/profile" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 text-sm font-bold transition-colors">
            <ChevronDown className="rotate-90" size={16} /> Back to Profile
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/50 border border-blue-400/30 text-white text-sm font-bold tracking-wider uppercase mb-4 backdrop-blur-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <FileText size={14} /> Tracking Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight" style={{ letterSpacing: "-0.04em" }}>My Reports</h1>
              <p className="text-blue-100 mt-2 text-lg max-w-xl">
                A complete history of your civic audits, verify the transparency log, and track the evaluation status of your submissions.
              </p>
            </div>
            
            <div className="flex gap-4 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 p-4 rounded-xl text-center min-w-[120px] shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Submissions</p>
                <p className="text-3xl font-black font-mono">{reports.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 p-4 rounded-xl text-center min-w-[120px] shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Impact Points</p>
                <p className="text-3xl font-black font-mono text-emerald-400">{profileStats.points}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="container mx-auto px-4 md:px-8 -mt-12 relative z-20 max-w-5xl">
        {reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-[8px_8px_0_0_rgba(0,0,0,0.05)]">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No reports yet</h3>
            <p className="text-slate-500 mb-6">You haven't submitted any civic evaluations. Start contributing to earn points!</p>
            <Link href="/nearby" className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl border-2 border-[#0055A4] bg-[#0055A4] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] transition-all">
              Find Ongoing Works
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <ReportCard key={report.id} report={report} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ report, index }: { report: any, index: number }) {
  const [expanded, setExpanded] = useState(false);
  const dateStr = format(new Date(report.created_at), "MMM d, yyyy");
  
  // Destructure statuses
  const isAIVerified = report.is_genuine;
  const isBlockchainLogged = !!report.tx_hash;
  const authorityStatus = "Pending Review"; // Future mock status

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-[#0D1424] border-2 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer overflow-clip",
        expanded 
          ? "border-[#0055A4] dark:border-[#38BDF8] shadow-[8px_8px_0px_0px_rgba(0,85,164,0.15)] dark:shadow-[8px_8px_0px_0px_rgba(56,189,248,0.1)]"
          : "border-slate-200 dark:border-slate-800 shadow-[4px_4px_0_0_rgba(0,0,0,0.05)] hover:border-[#0055A4] dark:hover:border-slate-600"
      )}
    >
      {/* Collapsed Header Bar */}
      <div 
        className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Calendar size={14} /> {dateStr}
            <span className="hidden md:inline-block px-1.5">•</span>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Award size={14} className="mr-1" /> +{report.points_awarded || 0} PTS
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-extrabold font-heading text-slate-900 dark:text-white truncate">
            {report.bmc_projects?.title || "Unknown Project"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 truncate">
            <MapPin size={14} /> {report.bmc_projects?.location || "Mumbai"}
          </p>
        </div>

        {/* Status Indicators row */}
        <div className="flex flex-wrap items-center gap-2 xl:gap-3 shrink-0 mt-2 md:mt-0">
          {/* 1. AI Status */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-bold",
            isAIVerified 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
          )}>
            {isAIVerified ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
            <span className="hidden sm:inline">AI Certified</span>
          </div>

          {/* 2. Blockchain Status */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-bold",
            isBlockchainLogged
              ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400"
              : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
          )}>
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">On-chain</span>
          </div>

          {/* 3. Authority Review (MOCK) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400 text-xs font-bold">
            <FileCheck size={14} />
            <span className="hidden sm:inline">{authorityStatus}</span>
          </div>
          
          {/* Chevron */}
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 ml-1">
            <ChevronDown size={18} className={cn("text-slate-500 transition-transform duration-300", expanded ? "rotate-180" : "rotate-0")} />
          </div>
        </div>
      </div>

      {/* Expanded Area */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-2 border-slate-100 dark:border-slate-800"
          >
            <div className="p-5 md:p-6 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Image & Map info */}
                <div className="space-y-4 lg:col-span-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Evidence</h4>
                  {report.photo_url ? (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100">
                      <Image 
                        src={report.photo_url} 
                        alt="Audit Photo" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center">
                      <p className="text-sm font-medium text-slate-400">No Image Attached</p>
                    </div>
                  )}
                  {isBlockchainLogged && (
                    <a href={`https://amoy.polygonscan.com/tx/${report.tx_hash}`} target="_blank" rel="noopener noreferrer" className="inline-flex w-full mt-2 items-center justify-center gap-2 text-xs font-bold py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] hover:translate-y-px hover:shadow-none transition-all">
                      View Polygon Transaction
                    </a>
                  )}
                </div>

                {/* Details text & AI */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Overall Rating</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Award 
                            key={s} 
                            size={20} 
                            className={s <= report.rating ? "text-amber-500 fill-amber-500" : "text-slate-200 dark:text-slate-700"} 
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white ml-2">{report.rating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Audit Comments</h4>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{report.comment || "No specific comments were left by the citizen for this report."}"
                    </div>
                  </div>

                  {/* AI Reasoning Block */}
                  {report.ai_analysis && Object.keys(report.ai_analysis).length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A4] dark:text-[#38BDF8] mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} /> AI Transparency Breakdown
                      </h4>
                      <div className="bg-[#0055A4]/5 dark:bg-[#38BDF8]/10 rounded-xl p-4 border-2 border-[#0055A4]/20 dark:border-[#38BDF8]/20">
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                          {report.ai_reasoning || "The AI system validated the image but generated no specific diagnosis string."}
                        </p>
                        {report.ai_analysis.suggested_rating && (
                          <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400">
                            Model Suggested Rating: {report.ai_analysis.suggested_rating} Stars
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mock authority block */}
                  <div className="mt-6 pt-6 border-t font-medium border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <FileCheck size={16} className="text-amber-500" />
                      BMC engineering authorities have not officially verified this audit yet. 
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
