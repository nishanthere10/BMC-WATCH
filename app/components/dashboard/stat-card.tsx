"use client";

import { HardHat, Users, Clock, MapPin, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
  HardHat,
  Users,
  Clock,
  MapPin,
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
  icon?: string;
  variant?: "default" | "destructive";
}

export default function StatCard({
  title,
  value,
  trend,
  description,
  icon,
  variant = "default",
}: StatCardProps) {
  const Icon = icon ? iconMap[icon] : null;
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-2xl border p-5 backdrop-blur-xl transition-all duration-200 hover:shadow-xl",
        variant === "destructive"
          ? "bg-red-50/80 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 hover:shadow-red-100/50 dark:hover:shadow-red-900/20"
          : "bg-white/75 dark:bg-slate-900/75 border-white/60 dark:border-slate-700/50 hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_12px_40px_rgba(56,189,248,0.05)]"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          variant === "destructive"
            ? "text-red-500 dark:text-red-400"
            : "text-[#64748B] dark:text-slate-400"
        )}>
          {title}
        </p>
        {Icon && (
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            variant === "destructive"
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20"
          )}>
            <Icon size={17} className={cn(
              variant === "destructive"
                ? "text-red-500 dark:text-red-400"
                : "text-[#2563EB] dark:text-[#38BDF8]"
            )} />
          </div>
        )}
      </div>

      <p className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
        {value}
      </p>

      {trend && (
        <p className={cn(
          "text-xs font-semibold mt-1.5 flex items-center gap-1",
          variant === "destructive"
            ? "text-red-500 dark:text-red-400"
            : "text-emerald-600 dark:text-emerald-400"
        )}>
          {trend}
        </p>
      )}
      {description && (
        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 font-medium">{description}</p>
      )}
    </motion.div>
  );
}
