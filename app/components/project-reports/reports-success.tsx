"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, LayoutList, Share2, Sparkles, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingSuccessProps {
  rating: number;
  points: number;
  onBack: () => void;
  onViewFeed: () => void;
}

export default function RatingSuccess({ rating, points, onBack, onViewFeed }: RatingSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
      {/* Glowing Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
        transition={{ 
          default: { type: "spring", stiffness: 260, damping: 20 },
          rotate: { type: "tween", duration: 0.5, ease: "easeInOut" }
        }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl scale-150 animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={40} className="text-white" />
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="cr-badge cr-badge-resolved mb-2">
          <Sparkles size={11} /> AI Verified
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">Rating Submitted!</h2>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <motion.div
              key={s}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4 + s * 0.08, type: "spring", stiffness: 300 }}
            >
              <Star
                size={24}
                className={s <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200 dark:text-slate-700"
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Points Earned */}
        {points > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/80 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200/60 dark:border-amber-700/30"
          >
            <Trophy size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-black text-amber-700 dark:text-amber-300">
              +{points} Civic Points Earned!
            </span>
          </motion.div>
        )}

        <p className="text-sm text-[#64748B] dark:text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
          Your evaluation has been recorded on the public transparency dashboard. Thank you for being a responsible citizen!
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid w-full gap-3"
      >
        <Button
          onClick={onViewFeed}
          className="cr-btn-primary w-full h-12 gap-2"
        >
          <LayoutList size={16} /> View Community Ratings
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-12 font-bold gap-2 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={15} /> Back
          </Button>
          <Button
            variant="outline"
            className="h-12 font-bold gap-2 rounded-xl border-[#2563EB]/30 text-[#2563EB] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Share2 size={15} /> Share
          </Button>
        </div>
      </motion.div>

      <p className="text-[10px] text-[#94A3B8] dark:text-slate-600 uppercase font-bold tracking-widest">
        Transparency Logged on BMC Watch
      </p>
    </div>
  );
}