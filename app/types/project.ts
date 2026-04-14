// Matches the Supabase `bmc_projects` table schema exactly
export interface Project {
  id: string;
  title: string | null;
  type: string | null;
  subtype: string | null;
  ward: string | null;
  zone: string | null;
  work_code: string | null;
  location: string | null;
  contractor: string | null;
  status: string | null;
  progress_percent: number | null;
  sanctioned_budget: number | null;
  spent_budget: number | null;
  start_date: string | null;
  expected_end: string | null;
  latitude: number | null;
  longitude: number | null;
  remarks: string | null;
  // Execution & Specs
  length_meters?: number | null;
  width_meters?: number | null;
  area_sqm?: number | null;
  budget_note?: string | null;
  sanctioned_budget_display?: string | null;
  
  // Personnel
  contractor_rep?: string | null;
  contractor_rep_mobile?: string | null;
  qma_rep?: string | null;
  qma_rep_mobile?: string | null;

  // Schedules & Approvals
  quarter_deadlines?: { q1?: string, q2?: string, q3?: string, q4?: string, q5?: string } | null;
  is_phase2?: boolean | null;
  excavation_start?: string | null;
  excavation_end?: string | null;
  swd_start?: string | null;
  swd_end?: string | null;
  pqc_start?: string | null;
  pqc_end?: string | null;
  duct_laying_start?: string | null;
  duct_laying_end?: string | null;
  completion_date_pqc?: string | null;
  pqc_status?: string | null;
  traffic_noc_applied?: string | null;
  traffic_noc_received?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
  data_source?: string | null;
}

// Convenience type for map-only data (lighter fetch)
export type MapProject = Pick<Project, "id" | "title" | "latitude" | "longitude" | "status" | "ward" | "progress_percent">;

// Default placeholder images based on project type
export const PROJECT_TYPE_IMAGES: Record<string, string> = {
  "Road": "/images/road-placeholder.svg",
  "Drain": "/images/drain-placeholder.svg",
  "Water": "/images/water-placeholder.svg",
  "default": "/images/project-placeholder.svg",
};

export function getProjectImage(type: string | null): string {
  if (!type) return PROJECT_TYPE_IMAGES["default"];
  const key = Object.keys(PROJECT_TYPE_IMAGES).find((k) => type.toLowerCase().includes(k.toLowerCase()));
  return key ? PROJECT_TYPE_IMAGES[key] : PROJECT_TYPE_IMAGES["default"];
}