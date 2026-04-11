"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Star, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function RecentReports({ projectId }: { projectId: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error) setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, [projectId]);

  if (loading) return <div className="h-40 w-full animate-pulse bg-slate-100 rounded-xl" />;
  if (reports.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <MessageSquare size={18} className="text-primary" /> Community Feedback
      </h3>
      
      <div className="grid gap-4">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl border bg-white shadow-sm flex gap-4"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border">
              <img src={report.photo_url} alt="Evidence" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] h-5">{report.issue_type}</Badge>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={10} 
                      className={cn(idx < report.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 italic">"{report.comment || "No comment left."}"</p>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1">
                <Clock size={10} /> 
                {new Date(report.created_at).toLocaleDateString('en-IN')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}