import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/project";

const PROJECT_FIELDS = `*`;

// ─── Paginated project list with optional filters ──────────────────────
export interface ProjectFilters {
  search?: string;
  type?: string;
  status?: string;
  ward?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProjects {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getProjects(filters: ProjectFilters = {}): Promise<PaginatedProjects> {
  const { search, type, status, ward, page = 1, pageSize = 50 } = filters;

  let query = supabase
    .from("bmc_projects")
    .select(PROJECT_FIELDS, { count: "exact" });

  // Apply filters
  if (search) {
    // Sanitize special chars to prevent breaking Supabase .or() parsing and filter injection
    const safeSearch = search.replace(/[,%\.()]/g, ' ').trim();
    if (safeSearch) {
      query = query.or(`title.ilike.%${safeSearch}%,location.ilike.%${safeSearch}%,ward.ilike.%${safeSearch}%`);
    }
  }
  if (type && type !== "all") {
    query = query.ilike("type", `%${type}%`);
  }
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (ward && ward !== "all") {
    query = query.eq("ward", ward);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order("updated_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching projects:", error.message);
    return { projects: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count || 0;

  return {
    projects: (data as Project[]) || [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Single project by ID ──────────────────────────────────────────────
export async function getProjectById(idOrCode: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("bmc_projects")
    .select(PROJECT_FIELDS)
    .or(`id.eq.${idOrCode},work_code.ilike.%${idOrCode}%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching project:", error.message);
    return null;
  }

  return data as Project;
}

// ─── Check if project exists (lightweight) ─────────────────────────────
export async function projectExists(idOrCode: string): Promise<boolean> {
  // Check if it matches id or work_code
  const { data, error } = await supabase
    .from("bmc_projects")
    .select("id")
    .or(`id.eq.${idOrCode},work_code.ilike.%${idOrCode}%`)
    .limit(1)
    .maybeSingle();

  return !error && data !== null;
}

// ─── Get all map projects (only coords + status) ───────────────────────
export async function getMapProjects() {
  const { data, error } = await supabase
    .from("bmc_projects")
    .select("id, title, latitude, longitude, status, ward")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error("Error fetching map projects:", error.message);
    return [];
  }

  return data || [];
}

// ─── Get distinct filter values (for filter dropdowns) ─────────────────
export async function getFilterOptions() {
  const [typesRes, statusRes, wardsRes] = await Promise.all([
    supabase.from("bmc_projects").select("type").not("type", "is", null),
    supabase.from("bmc_projects").select("status").not("status", "is", null),
    supabase.from("bmc_projects").select("ward").not("ward", "is", null),
  ]);

  const unique = (arr: { [key: string]: string | null }[] | null, key: string) =>
    [...new Set((arr || []).map((r) => r[key]).filter(Boolean))] as string[];

  return {
    types: unique(typesRes.data, "type").sort(),
    statuses: unique(statusRes.data, "status").sort(),
    wards: unique(wardsRes.data, "ward").sort(),
  };
}
