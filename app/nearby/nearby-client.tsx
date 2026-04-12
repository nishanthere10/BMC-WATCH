"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Search, Activity, Layers3, ChevronLeft, ChevronRight, Map as MapIcon } from "lucide-react";

const ProjectMap = dynamic(() => import("@/components/map/project-map"), { ssr: false, loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" /> });
import ProjectFilters from "@/app/projects/project-filters";
import ProjectCard from "@/app/projects/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects, type PaginatedProjects } from "@/lib/projects";
import type { MapProject } from "@/types/project";
import { Button } from "@/components/ui/button";

interface NearbyClientProps {
  initialData: PaginatedProjects;
  mapProjects: MapProject[];
  filterOptions: { types: string[]; statuses: string[]; wards: string[] };
}

export default function NearbyClient({ initialData, mapProjects, filterOptions }: NearbyClientProps) {
  const [data, setData] = useState<PaginatedProjects>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Map markers state (filtered client-side for speed)
  const [filteredMapProjects, setFilteredMapProjects] = useState<MapProject[]>(mapProjects);

  // Fetch updated data when filters or page change
  useEffect(() => {
    // Skip first render since we have initial data
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const newData = await getProjects({
        search: searchQuery,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        ward: wardFilter !== "all" ? wardFilter : undefined,
        page,
        pageSize: 50,
      });
      if (isMounted) {
        setData(newData);
        setIsLoading(false);
      }
    };

    // Only fetch if filters have changed from default or we're on a new page
    if (searchQuery || typeFilter !== "all" || statusFilter !== "all" || wardFilter !== "all" || page > 1) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 300); // 300ms debounce for search
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    } else {
      setData(initialData);
    }
    
    return () => { isMounted = false; };
  }, [searchQuery, typeFilter, statusFilter, wardFilter, page, initialData]);

  // Filter map projects purely on client-side (they are lightweight)
  useEffect(() => {
    const filtered = mapProjects.filter(p => {
      const matchSearch = !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchWard = wardFilter === "all" || p.ward === wardFilter;
      // Note: MapProjects doesn't have `type`, so type filter only applies if you want to extend MapProject
      return matchSearch && matchStatus && matchWard;
    });
    setFilteredMapProjects(filtered);
  }, [searchQuery, statusFilter, wardFilter, mapProjects]);

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

            {/* Quick Stats (Reflects total DB count now) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-3 shrink-0"
            >
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg rounded-2xl px-6 py-4 text-center">
                <p className="text-[10px] uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-widest mb-1">Total Found</p>
                <p className="text-3xl font-black text-[#0F172A] dark:text-white">{data.total}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="container px-4 md:px-8">
          {/* Filters */}
          <ProjectFilters
            types={filterOptions.types}
            statuses={filterOptions.statuses}
            wards={filterOptions.wards}
            searchQuery={searchQuery}
            onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
            onTypeChange={(v) => { setTypeFilter(v); setPage(1); }}
            onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
            onWardChange={(v) => { setWardFilter(v); setPage(1); }}
            selectedWard={wardFilter}
          />

          {/* View Toggle */}
          <Tabs defaultValue="map" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Layers3 size={14} /> Page {data.page} of {data.totalPages || 1}
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
                <ProjectMap projects={filteredMapProjects as any} />
              </motion.div>
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <div className={isLoading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                {data.projects.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {data.projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Pagination Controls */}
                    {data.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-12 mb-8">
                        <Button 
                          variant="outline" 
                          disabled={page === 1}
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                          {page} / {data.totalPages}
                        </span>
                        <Button 
                          variant="outline" 
                          disabled={page >= data.totalPages}
                          onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl"
                        >
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
