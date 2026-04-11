"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Project } from "../../types/project";
import Link from "next/link";
import { ExternalLink, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ProjectMapProps {
  projects: Project[];
}

export default function ProjectMap({ projects }: ProjectMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />;

  const center: [number, number] = [19.0760, 72.8777]; // Central Mumbai

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border shadow-inner z-0">
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((project) => (
          <Marker 
            key={project.id} 
            position={[project.latitude, project.longitude]}
          >
            <Popup className="project-popup">
              <div className="p-1 min-w-[180px]">
                <h4 className="font-bold text-sm leading-tight mb-1">{project.title}</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground font-semibold">
                    Ward {project.ward}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                    <Percent size={10} />
                    {project.completionPercent}%
                  </div>
                </div>
                
                <Link 
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-center gap-2 w-full py-1.5 rounded bg-primary text-primary-foreground text-[10px] font-bold hover:opacity-90 transition-all"
                >
                  Project Details
                  <ExternalLink size={10} />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}