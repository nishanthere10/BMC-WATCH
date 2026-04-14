"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ExternalLink, Percent } from "lucide-react";

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Minimal shape the map needs — compatible with both Project and MapProject
interface MapItem {
  id: string;
  title?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  ward?: string | null;
  status?: string | null;
  progress_percent?: number | null;
}

export interface ProjectMapProps {
  projects: MapItem[];
  userLocation?: { lat: number; lon: number };
}

export default function ProjectMap({ projects, userLocation }: ProjectMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />;

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lon]
    : [19.0760, 72.8777]; // Central Mumbai

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "Completed": return "#10B981"; // Green
      case "Delayed":
      case "Stopped":
      case "Deleted":
      case "Cancelled": return "#ef4444"; // Red
      case "In Progress":
      default: return "#facc15"; // Yellow
    }
  };

  return (
    <div className="relative h-[400px] w-full rounded-xl overflow-hidden border shadow-inner z-0">
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lon]}
            radius={10}
            pathOptions={{
              fillColor: "#3B82F6",
              color: "white",
              weight: 3,
              opacity: 1,
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="p-1 text-center">
                <p className="font-bold text-sm">Your Location</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {projects
          .filter((project) => project.latitude !== null && project.longitude !== null)
          .map((project) => (
          <CircleMarker 
            key={project.id} 
            center={[project.latitude!, project.longitude!]}
            radius={project.status === "Completed" ? 6 : 8}
            pathOptions={{
              fillColor: getStatusColor(project.status),
              color: "white",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }}
          >
            <Popup className="project-popup" minWidth={220} closeButton={false}>
              <div className="flex flex-col gap-2 p-1">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
                  <span className="cr-badge cr-badge-progress shrink-0 px-2 py-0.5 text-[9px] uppercase tracking-wider !font-mono">
                    Ward {project.ward || "N/A"}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#1A7A3E] bg-[#1A7A3E]/10 dark:bg-[#1A7A3E]/20 px-2 py-0.5 rounded-full shrink-0 !font-mono">
                    <Percent size={10} />
                    {project.progress_percent || 0}%
                  </div>
                </div>
                
                <div 
                  className="font-extrabold text-[#003366] dark:text-slate-100 text-[13px] leading-snug line-clamp-2 mb-1"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  {project.title || "Untitled Project"}
                </div>
                
                <Link 
                  href={`/projects/${project.id}`}
                  className="cr-btn cr-btn-primary w-full min-h-[32px] flex items-center justify-center gap-1.5 mt-2 rounded-lg text-[10px] uppercase font-bold tracking-wider !border-none !shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                  style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
                >
                  View Details
                  <ExternalLink size={12} />
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm space-y-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#10B981]" />
          <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#facc15]" />
          <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Deleted / Stopped</span>
        </div>
      </div>
    </div>
  );
}