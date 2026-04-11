"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, LayoutGrid, Info, Search } from "lucide-react";

import ProjectMap from "@/components/map/project-map";
import ProjectFilters from "@/app/projects/project-filters";
import ProjectCard from "@/app/projects/project-card";
import { MOCK_PROJECTS } from "../../lib/mock-project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtering Logic
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

  // Statistics for the header
  const stats = {
    total: filteredProjects.length,
    delayed: filteredProjects.filter(p => p.status === "Delayed").length,
    inProgress: filteredProjects.filter(p => p.status === "In Progress").length,
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b pt-8 pb-6">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">Nearby Civic Works</h1>
              <p className="text-muted-foreground max-w-2xl">
                Real-time transparency into BMC projects across Mumbai. Tracking your taxes, one road at a time.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-center">
                <p className="text-[10px] uppercase font-bold text-blue-600">Active</p>
                <p className="text-xl font-bold text-blue-700">{stats.inProgress}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 text-center">
                <p className="text-[10px] uppercase font-bold text-amber-600">Delayed</p>
                <p className="text-xl font-bold text-amber-700">{stats.delayed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-8 mt-8">
        {/* Filters */}
        <ProjectFilters 
          onSearchChange={setSearchQuery}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
        />

        {/* View Toggle (Map vs Grid) */}
        <Tabs defaultValue="map" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Showing {stats.total} Projects
            </h2>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapIcon size={16} /> Map
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGrid size={16} /> Grid
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ProjectMap projects={filteredProjects} />
              
              {/* Floating Quick Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" /> Current Work
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" /> Delayed
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
                </div>
              </div>
            </motion.div>
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
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <Search size={40} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">No projects found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}