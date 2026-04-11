"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, LayoutList, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportSuccessProps {
  issueType: string;
  onBack: () => void;
  onViewFeed: () => void;
}

export default function ReportSuccess({ issueType, onBack, onViewFeed }: ReportSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"
      >
        <CheckCircle2 size={48} />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Voice Recorded!</h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Your report on <Badge variant="secondary" className="mx-1">{issueType}</Badge> has been submitted to the public dashboard.
        </p>
      </div>

      <div className="grid w-full gap-3 pt-4">
        <Button onClick={onViewFeed} className="h-12 font-bold gap-2">
          <LayoutList size={18} /> View Recent Reports
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onBack} className="h-12 font-bold gap-2">
            <ArrowLeft size={16} /> Back
          </Button>
          <Button variant="outline" className="h-12 font-bold gap-2 border-primary text-primary">
            <Share2 size={16} /> Share
          </Button>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pt-4">
        Transparency Logged on Supabase
      </p>
    </div>
  );
}