"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, LayoutList, Share2, Sparkles, Star, Trophy } from "lucide-react";

interface RatingSuccessProps {
  rating: number;
  points: number;
  onBack: () => void;
  onViewFeed: () => void;
}

export default function RatingSuccess({ rating, points, onBack, onViewFeed }: RatingSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
      {/* Neo-brutalist Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative"
      >
        <div className="relative w-20 h-20 rounded-xl bg-[#1A7A3E] dark:bg-emerald-500 flex items-center justify-center
          border-2 border-emerald-900 dark:border-emerald-300
          shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(74,222,128,0.2)]">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
              bg-amber-50 dark:bg-amber-900/20
              border-2 border-amber-300 dark:border-amber-700
              shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)]"
          >
            <Trophy size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-black font-mono text-amber-700 dark:text-amber-300">
              +{points} CIVIC POINTS EARNED
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
        <button onClick={onViewFeed} className="cr-btn-primary w-full h-12 gap-2 flex items-center justify-center">
          <LayoutList size={16} /> View Community Ratings
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBack}
            className="cr-btn-secondary h-12"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <button className="cr-btn-secondary h-12">
            <Share2 size={15} /> Share
          </button>
        </div>
      </motion.div>

      <p className="text-[10px] text-[#94A3B8] dark:text-slate-600 uppercase font-bold tracking-widest">
        Transparency Logged on BMC Watch
      </p>
    </div>
  );
}