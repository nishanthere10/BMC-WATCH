"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import ProjectDetailsHeader from "@/app/projects/project-details-header";
import ProjectTimeline from "@/app/projects/project-timeline";
import ProjectMap from "@/components/map/project-map";
import RecentRatings from "@/components/project-reports/recent-reports";
import ProjectRatingForm from "@/components/project-reports/report-form";
import RatingSuccess from "@/components/project-reports/reports-success";
import ProjectQR from "@/components/projects/project-qr";
import ProjectFullDetails from "@/components/project-full-details";
import ProjectInsights from "@/components/project-insights";

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
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [submittedRating, setSubmittedRating] = useState<{ rating: number; points: number } | null>(null);
  const [feedKey, setFeedKey] = useState(0);

  const handleSuccess = (data: { rating: number; points: number }) => {
    setSubmittedRating(data);
    setFeedKey((prev) => prev + 1);
  };

  const closeDialog = () => {
    setIsRatingOpen(false);
    setTimeout(() => setSubmittedRating(null), 3000);
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
            Back to Map
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
                {/* Mobile Rate Button */}
                <div className="absolute top-6 right-6 lg:hidden z-10">
                  <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="rounded-2xl h-12 w-12 shadow-lg bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white">
                        <Star size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle>{submittedRating ? "Rating Submitted!" : "Rate This Project"}</DialogTitle>
                      </DialogHeader>
                      {submittedRating ? (
                        <RatingSuccess rating={submittedRating.rating} points={submittedRating.points} onBack={closeDialog} onViewFeed={closeDialog} />
                      ) : (
                        <ProjectRatingForm projectId={project.id} onSuccess={handleSuccess} />
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

                {/* Full Project Details (Expandable) */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-0">
                  <ProjectFullDetails project={project} />
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

              {/* Community Ratings */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 md:p-8"
              >
                <RecentRatings key={feedKey} projectId={project.id} />
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
              {/* Rate This Project Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="hidden lg:block bg-gradient-to-br from-blue-50/60 to-amber-50/40 dark:from-blue-950/20 dark:to-amber-950/10 backdrop-blur-xl border border-blue-100/60 dark:border-blue-900/30 shadow-lg rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                    <Star size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Rate This Project</h3>
                </div>
                <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed mb-5">
                  Visited this site? Take a photo, rate the work quality, and earn civic points for your contribution.
                </p>
                <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full font-bold h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#38BDF8] hover:from-[#1d4ed8] hover:to-[#0ea5e9] text-white shadow-[0_4px_15px_rgba(37,99,235,0.25)]">
                      <Star size={16} className="mr-2" /> Submit Site Evaluation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">
                        {submittedRating ? "Evaluation Complete" : "Rate Project Quality"}
                      </DialogTitle>
                    </DialogHeader>
                    {submittedRating ? (
                      <RatingSuccess rating={submittedRating.rating} points={submittedRating.points} onBack={closeDialog} onViewFeed={closeDialog} />
                    ) : (
                      <ProjectRatingForm projectId={project.id} onSuccess={handleSuccess} />
                    )}
                  </DialogContent>
                </Dialog>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
              >
                <ProjectInsights project={project} />
              </motion.div>

              {/* Dynamic QR Code */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.20 }}
              >
                <ProjectQR projectId={project.id} />
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
