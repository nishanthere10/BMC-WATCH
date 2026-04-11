"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RatingSelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function RatingSelector({ value, onChange, error }: RatingSelectorProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const labels: Record<number, string> = {
    1: "Terrible",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Work Quality Rating
        </label>
        {value > 0 && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "text-xs font-black uppercase px-2 py-0.5 rounded",
              value <= 2 ? "bg-red-100 text-red-700" : 
              value === 3 ? "bg-amber-100 text-amber-700" : 
              "bg-emerald-100 text-emerald-700"
            )}
          >
            {labels[value]}
          </motion.span>
        )}
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="relative p-1 focus:outline-none transition-transform active:scale-90"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(star)}
          >
            <Star
              size={32}
              className={cn(
                "transition-all duration-200",
                (hovered !== null ? star <= hovered : star <= value)
                  ? "fill-amber-400 text-amber-400 scale-110"
                  : "text-slate-300 fill-transparent"
              )}
            />
            {/* Subtle glow for the selected star */}
            {star === value && (
              <motion.div
                layoutId="active-star-glow"
                className="absolute inset-0 bg-amber-400/20 blur-lg rounded-full -z-10"
              />
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}