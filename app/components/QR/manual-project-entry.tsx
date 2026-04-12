"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, ArrowRight, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { projectExists } from "@/lib/projects";

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

    // Clean input to strip letters/symbols in case user types "ID: 5"
    // Wait, the new Supabase IDs are UUIDs (strings) like "proj_...". We shouldn't strip letters!
    const cleanId = projectId.trim();

    if (!cleanId) {
      setError("Please enter a Project ID.");
      setIsLoading(false);
      return;
    }

    // Check if project exists in database
    const exists = await projectExists(cleanId);

    if (exists) {
      router.push(`/projects/${cleanId}`);
    } else {
      setError(
        "Project ID not found. Please check the code on the site board.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <Hash size={20} />
        </div>
        <div>
          <h3 className="font-bold">Manual Lookup</h3>
          <p className="text-xs text-muted-foreground">
            Type the ID printed below the QR code
          </p>
        </div>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div className="relative">
          <Input
            placeholder="e.g. 1, 2, 5"
            value={projectId}
            onChange={(e) => {
              const rawValue = e.target.value;
              setProjectId(rawValue);
              const cleanId = rawValue.trim();
              onPreviewIdChange?.(cleanId);
              setError(null);
            }}
            className="h-12 pl-4 pr-12 text-lg font-mono tracking-wider"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
            <Search size={20} />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-md font-bold transition-all"
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
        </Button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-100 py-3"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-6 pt-6 border-t border-dashed">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2">
          Try these IDs:
        </p>
        <div className="flex flex-wrap gap-2">
          {/* Fallback tip, the actual IDs are long UUIDs now so clicking generic numbers won't work in prod, but left for structure */}
          {["1", "2"].map((id) => (
            <button
              key={id}
              onClick={() => {
                setProjectId(id);
                onPreviewIdChange?.(id);
                setError(null);
              }}
              className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-mono hover:bg-primary/10 hover:text-primary transition-colors"
            >
              ID: {id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
