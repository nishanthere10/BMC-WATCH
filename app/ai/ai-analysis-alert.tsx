"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface AIAnalysisAlertProps {
  error: string;
  onRetry: () => void;
}

export default function AIAnalysisAlert({ error, onRetry }: AIAnalysisAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <AlertTitle className="font-bold text-red-950">
              AI Analysis Paused
            </AlertTitle>
            <AlertDescription className="text-xs text-red-800">
              {error || "We couldn't generate insights from this photo right now."}
            </AlertDescription>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="bg-white hover:bg-red-100 border-red-300 text-red-900 font-bold gap-2 text-xs h-9"
        >
          <RotateCcw size={14} /> Retry AI Audit
        </Button>
      </Alert>
    </motion.div>
  );
}