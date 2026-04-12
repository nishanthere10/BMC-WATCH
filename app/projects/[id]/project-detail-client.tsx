"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, TrendingUp, Maximize2, Users, Calendar, Fingerprint, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import ProjectDetailsHeader from "@/app/projects/project-details-header";
import ProjectTimeline from "@/app/projects/project-timeline";
import ProjectMap from "@/components/map/project-map";
import RecentReports from "@/components/project-reports/recent-reports";
import ReportForm from "@/components/project-reports/report-form";
import ReportSuccess from "@/components/project-reports/reports-success";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/types/project";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<{ issue_type: string } | null>(null);
  const [feedKey, setFeedKey] = useState(0);

  const handleSuccess = (reportData: { issue_type: string }) => {
    setSubmittedReport(reportData);
    setFeedKey((prev) => prev + 1);
  };

  const closeDialog = () => {
    setIsReportOpen(false);
    setTimeout(() => setSubmittedReport(null), 3000);
  };

  // Convert remarks to a timeline item if updates aren't available
  const updates = project.remarks ? [{ date: "Initial Note", text: project.remarks }] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-blue-50 to-[#F4F7FB] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <main className="pb-20 pt-24">
        <div className="container px-4 md:px-8">
          {/* Back nav */}
          <Link
            href="/nearby"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-[#38BDF8] transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Nearby Works
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Info */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 md:p-8 relative overflow-hidden"
              >
                {/* Mobile Report Button */}
                <div className="absolute top-6 right-6 lg:hidden z-10">
                  <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="rounded-2xl h-12 w-12 shadow-lg">
                        <AlertTriangle size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle>{submittedReport ? "Submission Successful" : "Report a Civic Issue"}</DialogTitle>
                      </DialogHeader>
                      {submittedReport ? (
                        <ReportSuccess issueType={submittedReport.issue_type} onBack={closeDialog} onViewFeed={closeDialog} />
                      ) : (
                        <ReportForm projectId={project.id} onSuccess={handleSuccess} />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                <ProjectDetailsHeader project={project} />

                {/* Progress */}
                <div className="mt-8 space-y-3 relative z-0">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#2563EB] dark:text-[#38BDF8]" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B] dark:text-slate-400">
                        Physical Progress
                      </h3>
                    </div>
                    <span className="text-3xl font-black text-[#2563EB] dark:text-[#38BDF8]">
                      {project.progress_percent || 0}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress_percent || 0}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8]"
                    />
                  </div>
                </div>

                {/* Additional Extended Information Grid */}
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
                  {/* Site Dimensions */}
                  {(project.length_meters || project.width_meters || project.area_sqm) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Maximize2 size={16} className="text-slate-400" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] dark:text-slate-400">Site Dimensions</h4>
                      </div>
                      <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-[#0F172A] dark:text-slate-200">
                        {project.length_meters && <><dt className="text-slate-500">Length</dt><dd className="font-semibold">{project.length_meters}m</dd></>}
                        {project.width_meters && <><dt className="text-slate-500">Width</dt><dd className="font-semibold">{project.width_meters}m</dd></>}
                        {project.area_sqm && <><dt className="text-slate-500">Total Area</dt><dd className="font-semibold">{project.area_sqm} sqm</dd></>}
                      </dl>
                    </div>
                  )}

                  {/* Personnel Contacts */}
                  {(project.contractor_rep || project.qma_rep) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-slate-400" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] dark:text-slate-400">Key Personnel</h4>
                      </div>
                      <div className="space-y-4">
                        {project.contractor_rep && (
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Contractor Representative</p>
                            <p className="text-sm font-semibold mt-0.5 text-[#0F172A] dark:text-slate-200">{project.contractor_rep}</p>
                            {project.contractor_rep_mobile && <a href={`tel:${project.contractor_rep_mobile}`} className="text-xs text-blue-600 hover:underline">{project.contractor_rep_mobile}</a>}
                          </div>
                        )}
                        {project.qma_rep && (
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">QMA Representative</p>
                            <p className="text-sm font-semibold mt-0.5 text-[#0F172A] dark:text-slate-200">{project.qma_rep}</p>
                            {project.qma_rep_mobile && <a href={`tel:${project.qma_rep_mobile}`} className="text-xs text-blue-600 hover:underline">{project.qma_rep_mobile}</a>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Execution Phasing & NOCs */}
              {(project.excavation_start || project.traffic_noc_applied || project.quarter_deadlines) && (
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 md:p-8"
                >
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600 dark:text-blue-400" />
                    Approvals & Phasing
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* NOC Timeline */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Traffic NOC Status</h4>
                      <div className="space-y-3 border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-4">
                        <div className="relative">
                          <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${project.traffic_noc_applied ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Applied</p>
                          <p className="text-xs text-slate-500">{project.traffic_noc_applied ? format(new Date(project.traffic_noc_applied), 'MMM d, yyyy') : "Pending"}</p>
                        </div>
                        <div className="relative">
                          <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${project.traffic_noc_received && project.traffic_noc_received !== "Invalid date" ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Approved</p>
                          <p className="text-xs text-slate-500">{(project.traffic_noc_received && project.traffic_noc_received !== "Invalid date") ? format(new Date(project.traffic_noc_received), 'MMM d, yyyy') : "Awaiting NOC"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quarter Deadlines */}
                    {project.quarter_deadlines && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Quarterly Projections</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(project.quarter_deadlines).map(([q, date]) => (
                            <div key={q} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <p className="text-xs font-bold uppercase text-slate-400">{q}</p>
                              <p className="text-sm font-medium mt-1 text-slate-700 dark:text-slate-300">
                                {date ? format(new Date(date), 'MMM yyyy') : "TBD"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Recent Reports */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 md:p-8"
              >
                <RecentReports key={feedKey} projectId={project.id} />
              </motion.section>

              {/* Official Updates */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 md:p-8"
              >
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">
                  Official Updates
                </h3>
                <ProjectTimeline updates={updates} />
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Report Issue Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="hidden lg:block bg-red-50/60 dark:bg-red-950/20 backdrop-blur-xl border border-red-100 dark:border-red-900/30 shadow-lg rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-bold text-base text-red-700 dark:text-red-400">Spot an Issue?</h3>
                </div>
                <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed mb-5">
                  Is work delayed? Poor quality concrete? Blocked drains? Report it directly to improve Mumbai's infrastructure.
                </p>
                <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full font-bold h-12 rounded-xl shadow-[0_4px_15px_rgba(239,68,68,0.25)]">
                      Submit Citizen Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">
                        {submittedReport ? "Feedback Received" : "Citizen Oversight"}
                      </DialogTitle>
                    </DialogHeader>
                    {submittedReport ? (
                      <ReportSuccess issueType={submittedReport.issue_type} onBack={closeDialog} onViewFeed={closeDialog} />
                    ) : (
                      <ReportForm projectId={project.id} onSuccess={handleSuccess} />
                    )}
                  </DialogContent>
                </Dialog>
              </motion.div>

              {/* Map Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] dark:text-slate-400">Site Location</h4>
                </div>
                <div className="h-52 z-0 relative">
                  <ProjectMap projects={[project]} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
