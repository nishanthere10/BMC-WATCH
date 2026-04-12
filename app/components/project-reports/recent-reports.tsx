"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Star, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunityRating {
  id: string;
  rating: number;
  comment: string | null;
  photo_url: string;
  is_genuine: boolean;
  points_awarded: number;
  created_at: string;
}

export default function RecentRatings({ projectId }: { projectId: string }) {
  const [ratings, setRatings] = useState<CommunityRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      const { data, error } = await supabase
        .from("project_ratings")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error && data) setRatings(data);
      setLoading(false);
    }
    fetchRatings();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-[#0F172A] dark:text-white flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm">
            <MessageSquare size={14} className="text-white" />
          </div>
          Community Ratings
        </h3>
        <div className="text-center py-8">
          <p className="text-sm text-slate-400 dark:text-slate-500">No ratings yet. Be the first to evaluate this project!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-lg text-[#0F172A] dark:text-white flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm">
          <Star size={14} className="text-white" />
        </div>
        Community Ratings
        <span className="text-xs font-medium text-slate-400 ml-auto">{ratings.length} reviews</span>
      </h3>

      <div className="grid gap-3">
        {ratings.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:border-blue-200/40 dark:hover:border-blue-800/20 hover:shadow-sm transition-all duration-200"
          >
            {/* Photo */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/60 dark:border-slate-700/50 shadow-sm">
              <img src={r.photo_url} alt="Site photo" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                {/* Verified badge */}
                {r.is_genuine && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
                    <ShieldCheck size={10} /> Verified
                  </span>
                )}
                {/* Stars */}
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={10}
                      className={cn(idx < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 italic leading-relaxed">
                &ldquo;{r.comment || "No comment left."}&rdquo;
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] dark:text-slate-500 font-medium">
                <Clock size={10} />
                {new Date(r.created_at).toLocaleDateString("en-IN")}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}