"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, LayoutGrid, Search, Activity, AlertOctagon, Layers3 } from "lucide-react";

import ProjectMap from "@/components/map/project-map";
import ProjectFilters from "@/app/projects/project-filters";
import ProjectCard from "@/app/projects/project-card";
import { MOCK_PROJECTS } from "../../lib/mock-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || project.type === typeFilter;
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const stats = {
    total: filteredProjects.length,
    delayed: filteredProjects.filter((p) => p.status === "Delayed").length,
    inProgress: filteredProjects.filter((p) => p.status === "In Progress").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-blue-50 to-[#F4F7FB] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <main className="pb-20 pt-24">

        {/* Page Header */}
        <div className="container px-4 md:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 text-[#2563EB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <Activity size={12} /> Live Civic Data
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
                Nearby Civic Works
              </h1>
              <p className="text-[#64748B] dark:text-slate-400 max-w-2xl font-medium">
                Real-time transparency into BMC projects across Mumbai. Tracking your taxes, one road at a time.
              </p>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-3 shrink-0"
            >
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg rounded-2xl px-5 py-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[#2563EB] dark:text-[#38BDF8] tracking-widest mb-1">Active</p>
                <p className="text-2xl font-black text-[#0F172A] dark:text-white">{stats.inProgress}</p>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg rounded-2xl px-5 py-3 text-center">
                <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest mb-1">Delayed</p>
                <p className="text-2xl font-black text-[#0F172A] dark:text-white">{stats.delayed}</p>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg rounded-2xl px-5 py-3 text-center">
                <p className="text-[10px] uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-widest mb-1">Total</p>
                <p className="text-2xl font-black text-[#0F172A] dark:text-white">{stats.total}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="container px-4 md:px-8">
          {/* Filters */}
          <ProjectFilters
            onSearchChange={setSearchQuery}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
          />

          {/* View Toggle */}
          <Tabs defaultValue="map" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Layers3 size={14} /> Showing {stats.total} Projects
              </p>
              <TabsList className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-sm rounded-xl p-1 h-auto">
                <TabsTrigger value="map" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-sm text-xs font-semibold px-4 py-2 transition-all">
                  <MapIcon size={14} /> Map
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-sm text-xs font-semibold px-4 py-2 transition-all">
                  <LayoutGrid size={14} /> Grid
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="map" className="mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden border border-white/60 dark:border-slate-700/50 shadow-xl"
              >
                <ProjectMap projects={filteredProjects} />
              </motion.div>
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#64748B] dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_6px_#2563EB]" /> In Progress
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" /> Delayed
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" /> Completed
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg flex items-center justify-center">
                    <Search size={36} className="text-[#64748B] dark:text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">No projects found</h3>
                    <p className="text-[#64748B] dark:text-slate-400 mt-1 font-medium">Try adjusting your filters or search terms.</p>
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}