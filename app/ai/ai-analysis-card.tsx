"use client";

import { motion } from "framer-motion";
import { 
  Stethoscope, CheckCircle2, XCircle, HelpCircle, 
  AlertCircle, MessageSquareQuote, Zap 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIDiagnosis {
  diagnosis_summary: string;
  what_is_good: string[];
  what_is_faulty: string[];
  what_is_missing: string[];
  severity_level: "Low" | "Medium" | "High";
  opinion_starter: string;
}

export default function AIAnalysisCard({ analysis }: { analysis: AIDiagnosis }) {
  const severityStyles = {
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    High: "bg-red-100 text-red-700 border-red-200 animate-pulse",
  };

  return (
    <Card className="border-2 border-primary/10 overflow-hidden shadow-xl bg-white">
      {/* Header with Speed Branding */}
      <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-primary-foreground" />
          <span className="text-[10px] font-black uppercase tracking-widest">Site Diagnosis</span>
        </div>
        <Badge variant="outline" className={severityStyles[analysis.severity_level]}>
          {analysis.severity_level} Severity
        </Badge>
      </div>

      <CardContent className="p-5 space-y-6">
        {/* Summary Statement */}
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <p className="text-sm font-bold text-slate-800 leading-tight">
            "{analysis.diagnosis_summary}"
          </p>
        </div>

        {/* The Three Checkpoints */}
        <div className="space-y-4">
          {/* GOOD */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
              <CheckCircle2 size={14} /> What is Good
            </h4>
            <ul className="pl-6 space-y-1">
              {analysis.what_is_good.map((item, i) => (
                <li key={i} className="text-xs text-slate-600 list-disc">{item}</li>
              ))}
            </ul>
          </div>

          {/* FAULTY */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
              <AlertCircle size={14} /> What is Faulty
            </h4>
            <ul className="pl-6 space-y-1">
              {analysis.what_is_faulty.map((item, i) => (
                <li key={i} className="text-xs text-slate-600 list-disc">{item}</li>
              ))}
            </ul>
          </div>

          {/* MISSING */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-red-600 uppercase tracking-wider">
              <XCircle size={14} /> What is Missing
            </h4>
            <ul className="pl-6 space-y-1">
              {analysis.what_is_missing.map((item, i) => (
                <li key={i} className="text-xs text-slate-600 list-disc">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Opinion Starter / Pro-tip */}
        <div className="pt-4 border-t border-dashed">
          <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
            <MessageSquareQuote className="text-primary shrink-0" size={20} />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expert Opinion Starter</p>
              <p className="text-xs italic text-slate-700 leading-relaxed">
                {analysis.opinion_starter}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}