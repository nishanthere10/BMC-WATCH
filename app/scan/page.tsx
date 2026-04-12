"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Keyboard, QrCode } from "lucide-react";
import ProjectCard from "@/app/projects/project-card";
import QRScanner from "@/components/QR/qr-scanner";
import ManualProjectEntry from "@/components/QR/manual-project-entry";
import ScannerStatus from "@/components/QR/scanner-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_PROJECTS } from "@/lib/mock-project";

export default function ScanPage() {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [previewId, setPreviewId] = useState<string>("");

  const previewProject = MOCK_PROJECTS.find((p) => p.id === previewId) || null;

  const handleScanSuccess = (decodedText: string) => {
    setStatus("success");
    setPreviewId(decodedText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-blue-50 to-[#F4F7FB] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <main className="pb-20 pt-24">

        {/* Page Header */}
        <div className="container max-w-5xl px-4 mx-auto mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 text-[#2563EB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <QrCode size={13} /> Scanner Mode
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Identify a Project
            </h1>
            <p className="text-[#64748B] dark:text-slate-400 text-base font-medium max-w-md mx-auto">
              Scan the QR code on any BMC work site board to see budget, timeline, and contractor details.
            </p>
          </motion.div>
        </div>

        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex w-full gap-8 relative items-start flex-col lg:flex-row">

            {/* Scanner Panel */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-full transition-all duration-300 space-y-5 ${previewProject ? "lg:w-1/2" : "max-w-xl mx-auto"}`}
            >
              <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl overflow-hidden">
                <Tabs defaultValue="camera" className="w-full">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl h-11 p-1">
                      <TabsTrigger
                        value="camera"
                        className="flex items-center gap-2 font-bold text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#2563EB] dark:data-[state=active]:text-[#38BDF8] data-[state=active]:shadow-sm"
                      >
                        <Scan size={16} /> Camera
                      </TabsTrigger>
                      <TabsTrigger
                        value="manual"
                        className="flex items-center gap-2 font-bold text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#2563EB] dark:data-[state=active]:text-[#38BDF8] data-[state=active]:shadow-sm"
                      >
                        <Keyboard size={16} /> Manual ID
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-5">
                    <TabsContent value="camera" className="mt-0 space-y-5">
                      <div className="flex justify-center">
                        <ScannerStatus status={status} />
                      </div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <QRScanner
                          onScanSuccess={handleScanSuccess}
                          onScanError={() => setStatus("error")}
                        />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="manual" className="mt-0">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <ManualProjectEntry
                          previewId={previewId}
                          onPreviewIdChange={setPreviewId}
                        />
                      </motion.div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </motion.div>

            {/* Project Preview Panel (slides in) */}
            <AnimatePresence>
              {previewProject && (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="hidden lg:block lg:w-1/2 space-y-4"
                >
                  <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg px-4 py-3 rounded-2xl">
                    <span className="text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <QrCode size={13} /> Scanned Result
                    </span>
                    <button
                      onClick={() => setPreviewId("")}
                      className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  <ProjectCard project={previewProject} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>
    </div>
  );
}