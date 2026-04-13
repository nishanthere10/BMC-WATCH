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
        "cr-card p-5",
        variant === "destructive" && "cr-card-destructive"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className={cn(
          "cr-section-title",
          variant === "destructive" && "text-red-500 dark:text-red-400"
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

      <p className="font-mono text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
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
