"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center p-6 pt-24">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard Unavailable</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Failed to load civic audit data. This may be a temporary issue with the data source.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl shadow transition-all"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    </main>
  );
}
