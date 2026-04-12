"use client";

import dynamic from "next/dynamic";

const DashboardMapPreview = dynamic(
  () => import("@/components/dashboard/dashboard-map-preview"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
    ),
  }
);

interface MapProject {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  ward: string;
}

export default function DashboardMapWrapper({ projects }: { projects: MapProject[] }) {
  return <DashboardMapPreview projects={projects} />;
}
