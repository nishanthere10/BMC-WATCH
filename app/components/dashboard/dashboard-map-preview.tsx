"use client";

import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Map as MapIcon, Maximize2 } from "lucide-react";
import Link from "next/link";

interface MapProject {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  ward: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "#10B981"; // emerald-500
    case "Delayed":
    case "Stopped":
    case "Deleted":
    case "Cancelled":
      return "#ef4444"; // red-500
    case "In Progress":
    default:
      return "#facc15"; // yellow-400
  }
};

export default function DashboardMapPreview({ projects }: { projects: MapProject[] }) {
  // Use a state driven by a ref update via a layout-safe pattern
  // useRef tracks mount; a single forced update renders post-mount
  const [isMounted, setIsMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setIsMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- Required: Leaflet needs window
    }
  }, []);

  if (!isMounted) return <div className="h-[300px] bg-slate-100 animate-pulse rounded-2xl" />;

  // Mumbai Center Coordinates
  const center: [number, number] = [19.076, 72.8777];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-[350px] w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-white/60 dark:border-slate-700/50 shadow-xl">
        {/* Map Overlay Header */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 dark:border-slate-700/50 shadow-sm">
          <MapIcon size={14} className="text-[#2563EB]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-white">
            Live Site Heatmap
          </span>
        </div>

        {/* View Full Map CTA */}
        <Link href="/nearby" className="absolute top-4 right-4 z-[1000]">
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-full border shadow-sm hover:bg-primary hover:text-white transition-all">
            <Maximize2 size={14} />
          </div>
        </Link>

        {/* The Leaflet Map */}
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {projects.map((project) => (
            <CircleMarker
              key={project.id}
              center={[project.latitude, project.longitude]}
              radius={project.status === "Completed" ? 6 : 8}
              pathOptions={{
                fillColor: getStatusColor(project.status),
                color: "white",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                <div className="p-1 space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">{project.ward}</p>
                  <p className="text-xs font-bold text-slate-800">{project.title}</p>
                  <Badge variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "warning" : "destructive"} className="text-[9px] px-1 py-0">
                    {project.status}
                  </Badge>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/60 dark:border-slate-700/50 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_4px_rgba(16,185,129,0.7)]" />
            <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#facc15] shadow-[0_0_4px_rgba(250,204,21,0.7)]" />
            <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.7)]" />
            <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Deleted / Stopped</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Badge component if you don't want to import the whole shadcn one here
function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
    const styles = variant === 'destructive' ? 'bg-red-100 text-red-700' : 
                   variant === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700';
    return <span className={`px-2 py-0.5 rounded-full font-bold ${styles} ${className}`}>{children}</span>;
}