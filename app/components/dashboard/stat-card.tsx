"use client";

import { HardHat, Users, Clock, MapPin, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
        variant === "destructive"
          ? "bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30"
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-widest",
            variant === "destructive"
              ? "text-red-600 dark:text-red-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {title}
        </p>
        {Icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              variant === "destructive"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-blue-50 dark:bg-blue-900/30"
            )}
          >
            <Icon
              size={18}
              className={cn(
                variant === "destructive"
                  ? "text-red-600 dark:text-red-400"
                  : "text-blue-600 dark:text-blue-400"
              )}
            />
          </div>
        )}
      </div>

      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        {value}
      </p>

      {trend && (
        <p
          className={cn(
            "text-xs font-semibold mt-1",
            variant === "destructive"
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {trend}
        </p>
      )}

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
}
