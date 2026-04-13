"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Search, Activity, Layers3, ChevronLeft, ChevronRight, Map as MapIcon } from "lucide-react";

const ProjectMap = dynamic(() => import("@/components/map/project-map"), { ssr: false, loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" /> });
import LocationPrompt from "@/components/map/location-prompt";
import ProjectFilters from "@/app/projects/project-filters";
import ProjectCard from "@/app/projects/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjects, type PaginatedProjects } from "@/lib/projects";
import { filterByRadius } from "@/lib/geo-utils";
import type { MapProject } from "@/types/project";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

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

  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [radius, setRadius] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Fetch updated data when filters or page change
  useEffect(() => {
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

    if (searchQuery || typeFilter !== "all" || statusFilter !== "all" || wardFilter !== "all" || page > 1) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 300);
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
    
    return () => { isMounted = false; };
  }, [searchQuery, typeFilter, statusFilter, wardFilter, page]);

  // Filter map projects (text/status/ward filters + radius)
  const filteredMapProjects = useMemo(() => {
    let filtered = mapProjects.filter(p => {
      const matchSearch = !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchWard = wardFilter === "all" || p.ward === wardFilter;
      return matchSearch && matchStatus && matchWard;
    });

    // Apply radius filter if location is set and not showing all
    if (userLocation && !showAll) {
      filtered = filterByRadius(filtered, userLocation.lat, userLocation.lon, radius);
    }

    return filtered;
  }, [searchQuery, statusFilter, wardFilter, mapProjects, userLocation, radius, showAll]);

  // Also filter grid projects by radius
  const filteredGridProjects = useMemo(() => {
    if (!userLocation || showAll) return data.projects;
    return filterByRadius(data.projects, userLocation.lat, userLocation.lon, radius);
  }, [data.projects, userLocation, radius, showAll]);

  const handleLocationFound = (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    setShowAll(false);
  };

  const handleRadiusChange = (km: number) => {
    setRadius(km);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
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
              <div className="cr-badge cr-badge-progress uppercase tracking-widest backdrop-blur-sm">
                <Activity size={12} /> Live Civic Data
              </div>
              <h1 className="cr-page-title text-left">
                Nearby Civic Works
              </h1>
              <p className="cr-page-subtitle !mx-0 text-left">
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
              <div className="cr-card px-6 py-4 text-center">
                <p className="cr-section-title mb-1">
                  {userLocation && !showAll ? "Nearby" : "Total Found"}
                </p>
                <p className="text-3xl font-black font-mono text-[#0F172A] dark:text-white">
                  {userLocation && !showAll ? filteredMapProjects.length : data.total}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="container px-4 md:px-8">
          {/* Location Prompt */}
          <LocationPrompt
            userLocation={userLocation}
            radius={radius}
            onLocationFound={handleLocationFound}
            onRadiusChange={handleRadiusChange}
            onShowAll={handleShowAll}
            showAll={showAll}
            nearbyCount={filteredMapProjects.length}
          />

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
              <p className="cr-section-title flex items-center gap-2">
                <Layers3 size={14} /> Page <span className="font-mono">{data.page}</span> of <span className="font-mono">{data.totalPages || 1}</span>
              </p>
              <TabsList className="cr-glass-subtle p-1 h-auto">
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
                className="cr-card bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:12px_12px]"
              >
                <ProjectMap
                  projects={filteredMapProjects as MapProject[]}
                  userLocation={userLocation ?? undefined}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <div className={isLoading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                {filteredGridProjects.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {filteredGridProjects.map((project) => (
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
                      <p className="text-[#64748B] dark:text-slate-400 mt-1 font-medium">Try adjusting your filters, search terms, or radius.</p>
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
