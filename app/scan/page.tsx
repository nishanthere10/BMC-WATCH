"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Keyboard, QrCode } from "lucide-react";
import ProjectCard from "@/app/projects/project-card";
import QRScanner from "@/components/QR/qr-scanner";
import ManualProjectEntry from "@/components/QR/manual-project-entry";
import ScannerStatus from "@/components/QR/scanner-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjectById } from "@/lib/projects";
import type { Project } from "@/types/project";
import { useTranslations } from "@/app/components/I18nProvider";

export default function ScanPage() {
  const { t } = useTranslations();
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [previewId, setPreviewId] = useState<string>("");
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchPreview() {
      if (!previewId) {
        setPreviewProject(null);
        return;
      }
      const project = await getProjectById(previewId);
      setPreviewProject(project);
    }
    fetchPreview();
  }, [previewId]);

  const handleScanSuccess = (decodedText: string) => {
    setStatus("success");
    
    // Extract ID if the QR contains a full URL (e.g. from the dynamic QR feature)
    let extractedId = decodedText;
    if (decodedText.includes("/projects/")) {
      const parts = decodedText.split("/projects/");
      if (parts.length > 1) {
        // Grab the ID and remove any trailing slashes or queries
        extractedId = parts[1].split('?')[0].replace(/[^a-zA-Z0-9-_]/g, "");
      }
    }
    
    setPreviewId(extractedId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070D1A] transition-colors duration-300">
      <main className="pb-20 pt-24">

        {/* Page Header */}
        <div className="container max-w-5xl px-4 mx-auto mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="cr-badge cr-badge-progress">
              <QrCode size={13} /> {t('scan.mode')}
            </div>
            <h1 className="cr-page-title">
              {t('scan.title')}
            </h1>
            <p className="cr-page-subtitle">
              {t('scan.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="container max-w-5xl px-4 mx-auto">
          <div className="flex w-full gap-8 relative items-start flex-col lg:flex-row">

            {/* Scanner Panel */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`cr-card w-full transition-all duration-300 space-y-5 ${previewProject ? "lg:w-7/12" : "max-w-xl mx-auto"}`}
            >

                <Tabs defaultValue="camera" className="w-full">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl h-11 p-1">
                      <TabsTrigger
                        value="camera"
                        className="flex items-center gap-2 font-bold text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#2563EB] dark:data-[state=active]:text-[#38BDF8] data-[state=active]:shadow-sm"
                      >
                        <Scan size={16} /> {t('scan.camera')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="manual"
                        className="flex items-center gap-2 font-bold text-sm rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-[#2563EB] dark:data-[state=active]:text-[#38BDF8] data-[state=active]:shadow-sm"
                      >
                        <Keyboard size={16} /> {t('scan.manual')}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-5">
                    <TabsContent value="camera" className="mt-0 space-y-5">
                      <div className="flex justify-center">
                        <ScannerStatus status={status} />
                      </div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-slate-100 dark:bg-slate-900 rounded-2xl p-2 md:p-3 overflow-hidden">
                        
                        {/* HUD Corner Brackets */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#2563EB]/50 dark:border-[#38BDF8]/50 rounded-tl-xl z-20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#2563EB]/50 dark:border-[#38BDF8]/50 rounded-tr-xl z-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#2563EB]/50 dark:border-[#38BDF8]/50 rounded-bl-xl z-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#2563EB]/50 dark:border-[#38BDF8]/50 rounded-br-xl z-20 pointer-events-none"></div>
                        
                        {/* Sweeping Laser Line */}
                        <motion.div 
                          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] dark:via-[#38BDF8] to-transparent z-30 pointer-events-none"
                          style={{ boxShadow: "0 0 15px 2px rgba(37,99,235,0.6)" }}
                          animate={{ top: ["5%", "95%", "5%"] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        />

                        {/* Scanner Content */}
                        <div className="relative z-10 w-full h-full rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-inner bg-black/50">
                          <QRScanner
                            onScanSuccess={handleScanSuccess}
                            onScanError={() => setStatus("error")}
                          />
                        </div>

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
                  className="hidden lg:block lg:w-5/12 space-y-4"
                >
                  <div className="cr-card-flat flex justify-between items-center px-4 py-3">
                    <span className="cr-section-title flex items-center gap-2">
                      <QrCode size={13} /> {t('scan.result')}
                    </span>
                    <button
                      onClick={() => setPreviewId("")}
                      className="cr-btn-danger text-xs py-1 px-3"
                    >
                      {t('scan.close')}
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