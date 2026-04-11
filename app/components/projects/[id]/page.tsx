"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Info, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

import { MOCK_PROJECTS } from "@/lib/mock-projects";
import ProjectDetailsHeader from "@/components/projects/project-details-header";
import ProjectTimeline from "@/components/projects/project-timeline";
import ProjectMap from "@/components/map/project-map";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = MOCK_PROJECTS.find((p) => p.id === params.id);

  if (!project) return notFound();

  const remainingBudget = (project.budgetSanctioned - project.budgetSpent).toFixed(1);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container px-4 md:px-8 py-8">
        {/* Back Link */}
        <Link href="/nearby" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Nearby Works
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info & Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
              <ProjectDetailsHeader project={project} />
              
              <div className="mt-10 space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <TrendingUp size={16} /> Physical Progress
                  </h3>
                  <span className="text-2xl font-black text-primary">{project.completionPercent}%</span>
                </div>
                <Progress value={project.completionPercent} className="h-4" />
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Project Scope</h3>
                <p className="text-slate-700 leading-relaxed text-lg italic">"{project.description}"</p>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                Official Updates
              </h3>
              <ProjectTimeline updates={project.updates} />
            </section>
          </div>

          {/* Right Column: Cards & Map */}
          <div className="space-y-6">
            {/* Budget Card */}
            <Card className="border-2 border-primary/10 shadow-md overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet size={20} /> Budget Breakdown
                </CardTitle>
              </div>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sanctioned</span>
                  <span className="font-bold text-lg">₹{project.budgetSanctioned} Cr</span>
                </div>
                <div className="flex justify-between items-center text-blue-600 font-medium">
                  <span className="text-sm">Spent to Date</span>
                  <span>₹{project.budgetSpent} Cr</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-bold">Remaining</span>
                  <span className="font-black text-xl text-emerald-600">₹{remainingBudget} Cr</span>
                </div>
              </CardContent>
            </Card>

            {/* Contractor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HardHat size={18} className="text-primary" /> Contractor Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Agency Name</p>
                  <p className="font-bold text-slate-800">{project.contractorName}</p>
                </div>
                <a 
                  href={`tel:${project.contractorPhone}`} 
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  <Phone size={16} /> Contact Contractor
                </a>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Project Site
                </CardTitle>
              </CardHeader>
              <div className="h-[250px] w-full">
                <ProjectMap projects={[project]} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}