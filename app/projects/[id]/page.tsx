"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { MOCK_PROJECTS } from "@/lib/mock-project";
import ProjectDetailsHeader from "@/app/projects/project-details-header";
import ProjectTimeline from "@/app/projects/project-timeline";
import ProjectMap from "@/components/map/project-map";
import RecentReports from "@/components/project-reports/recent-reports";
import ReportForm from "@/components/project-reports/report-form";
import ReportSuccess from "@/components/project-reports/reports-success";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [feedKey, setFeedKey] = useState(0); // Used to refresh the feed after submission

  const project = MOCK_PROJECTS.find((p: any) => p.id === unwrappedParams.id);
  if (!project) return notFound();

  const handleSuccess = (reportData: any) => {
    setSubmittedReport(reportData);
    setFeedKey((prev) => prev + 1); // Triggers RecentReports to re-fetch
  };

  const closeDialog = () => {
    setIsReportOpen(false);
    // Reset state after the dialog animation closes
    setTimeout(() => setSubmittedReport(null), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container px-4 md:px-8 py-8">
        <Link href="/nearby" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Nearby Works
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Project Info Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm relative overflow-hidden">
               {/* "Report Issue" Floating Button for Mobile */}
               <div className="absolute top-6 right-6 lg:hidden">
                  <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="rounded-full h-12 w-12 shadow-lg">
                        <AlertTriangle size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                       <DialogHeader>
                        <DialogTitle>{submittedReport ? "Submission Successful" : "Report a Civic Issue"}</DialogTitle>
                      </DialogHeader>
                      {submittedReport ? (
                        <ReportSuccess 
                          issueType={submittedReport.issue_type} 
                          onBack={closeDialog} 
                          onViewFeed={closeDialog} 
                        />
                      ) : (
                        <ReportForm projectId={project.id} onSuccess={handleSuccess} />
                      )}
                    </DialogContent>
                  </Dialog>
               </div>

              <ProjectDetailsHeader project={project} />
              <div className="mt-10 space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">Physical Progress</h3>
                  <span className="text-2xl font-black text-primary">{project.completionPercent}%</span>
                </div>
                <Progress value={project.completionPercent} className="h-4" />
              </div>
            </section>

            {/* Recent Reports Feed - Key forces re-render on new report */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
              <RecentReports key={feedKey} projectId={project.id} />
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
              <h3 className="text-xl font-bold mb-8">Official Updates</h3>
              <ProjectTimeline updates={project.updates} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Call to Action: Desktop Report Button */}
            <Card className="border-2 border-red-100 bg-red-50/30 hidden lg:block">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle size={20} /> Spot an Issue?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Is work delayed? Poor quality concrete? Blocked drains? Report it directly to improve Mumbai's infrastructure.
                </p>
                <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full font-bold h-12">
                      Submit Citizen Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black">
                        {submittedReport ? "Feedback Received" : "Citizen Oversight"}
                      </DialogTitle>
                    </DialogHeader>
                    {submittedReport ? (
                      <ReportSuccess 
                        issueType={submittedReport.issue_type} 
                        onBack={closeDialog} 
                        onViewFeed={closeDialog} 
                      />
                    ) : (
                      <ReportForm projectId={project.id} onSuccess={handleSuccess} />
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
