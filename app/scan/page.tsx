"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Keyboard } from "lucide-react";
import ProjectCard from "@/app/projects/project-card"
import QRScanner from "@/components/QR/qr-scanner";
import ManualProjectEntry from "@/components/QR/manual-project-entry";
import ScannerStatus from "@/components/QR/scanner-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_PROJECTS } from "@/lib/mock-project";

export default function ScanPage() {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [previewId, setPreviewId] = useState<string>("");
  
  // This actively searches our database for a matching project 
  const previewProject = MOCK_PROJECTS.find(p => p.id === previewId) || null;

  const handleScanSuccess = (decodedText: string) => {
    setStatus("success");
    setPreviewId(decodedText)
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b pt-10 pb-8 px-4 text-center">
        <div className="container max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Scan size={14} /> Scanner Mode
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Identify a Project
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Scan the QR code on any BMC work site board to see budget, timeline, and contractor details.
          </p>
        </div>
      </div>

        <div className="container max-w-5xl px-4 mt-8 flex justify-center">
        <div className="flex w-full gap-8 relative items-start flex-col lg:flex-row">
          
          {/* The Scanner side. Notice the 'layout' tag making the slide smooth! */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-full transition-all duration-300 space-y-6 ${previewProject ? "lg:w-1/2" : "max-w-xl mx-auto"}`}
          >

            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                <TabsTrigger value="camera" className="flex items-center gap-2 font-bold">
                  <Scan size={18} /> Camera
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2 font-bold">
                  <Keyboard size={18} /> Manual ID
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="mt-0 space-y-6">
                <div className="flex justify-center">
                  <ScannerStatus status={status} />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <QRScanner 
                    onScanSuccess={handleScanSuccess} 
                    onScanError={() => setStatus("error")}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="manual" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
               <ManualProjectEntry 
    previewId={previewId} 
    onPreviewIdChange={setPreviewId} 
  />

                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* New Project Preview Area (Right) */}
          <AnimatePresence>
            {previewProject && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "50%" }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:block lg:w-1/2 space-y-4"
              >
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Scanned Result</span>
                  <button 
                    onClick={() => setPreviewId("")}
                    className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Close Preview
                  </button>
                </div>

                <ProjectCard project={previewProject} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}