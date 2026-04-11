"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScannerStatusProps {
  status: "idle" | "scanning" | "success" | "error";
}

export default function ScannerStatus({ status }: ScannerStatusProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-full bg-slate-100 border border-slate-200">
      <div className="relative">
        {status === "scanning" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Loader2 className="text-primary" size={20} />
          </motion.div>
        )}
        {status === "idle" && <ScanLine className="text-slate-400" size={20} />}
        {status === "success" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </motion.div>
        )}
      </div>

      <span className={cn(
        "text-sm font-bold uppercase tracking-wider",
        status === "scanning" ? "text-primary" : "text-slate-500",
        status === "success" && "text-emerald-600"
      )}>
        {status === "idle" && "Ready to Scan"}
        {status === "scanning" && "Scanning for QR Code..."}
        {status === "success" && "Project Identified!"}
        {status === "error" && "Invalid Code"}
      </span>
    </div>
  );
}