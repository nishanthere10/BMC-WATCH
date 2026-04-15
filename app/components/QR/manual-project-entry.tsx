"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, ArrowRight, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectById } from "@/lib/projects";

interface ManualProjectEntryProps {
  previewId?: string;
  onPreviewIdChange?: (id: string) => void;
}

export default function ManualProjectEntry({ previewId: externalPreviewId, onPreviewIdChange }: ManualProjectEntryProps = {}) {
  const [projectId, setProjectId] = useState(externalPreviewId || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanId = projectId.trim();

    if (!cleanId) {
      setError("Please enter a Project ID.");
      setIsLoading(false);
      return;
    }

    const project = await getProjectById(cleanId);
    if (project) {
      router.push(`/projects/${project.id}`);
    } else {
      setError("Project not found. Try a work code like E-289 or W-414.");
      setIsLoading(false);
    }
  };

  return (
    <div className="cr-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <Hash size={18} />
        </div>
        <div>
          <h3 className="font-heading font-bold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.02em" }}>
            Manual Lookup
          </h3>
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Type the ID printed below the QR
          </p>
        </div>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div className="relative">
          <input
            placeholder="e.g. E-289, W-414"
            value={projectId}
            onChange={(e) => {
              const rawValue = e.target.value;
              setProjectId(rawValue);
              onPreviewIdChange?.(rawValue.trim());
              setError(null);
            }}
            className="cr-input h-12 pl-4 pr-12 text-lg font-mono tracking-wider"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
            <Search size={18} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cr-btn-primary w-full h-12 text-base"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <span className="flex items-center gap-2">
              Find Project <ArrowRight size={18} />
            </span>
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="cr-error-box flex items-center gap-2 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-5 pt-5 border-t-2 border-dashed border-slate-100 dark:border-slate-800">
        <p className="cr-section-title mb-2">Try these IDs:</p>
        <div className="flex flex-wrap gap-2">
          {["E-289", "W-414"].map((id) => (
            <button
              key={id}
              onClick={() => {
                setProjectId(id);
                onPreviewIdChange?.(id);
                setError(null);
              }}
              className="px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-mono font-bold hover:border-[#0055A4] hover:text-[#0055A4] dark:hover:border-[#38BDF8] dark:hover:text-[#38BDF8] transition-all duration-150"
            >
              ID: {id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
