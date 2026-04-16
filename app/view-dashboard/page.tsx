import { supabase } from "@/lib/supabase";
import DashboardClient from "./dashboard-client";

async function getDashboardData() {
  const [performance, types, summary, issues, reports, mapProjects] = await Promise.all([
    supabase.from("ward_performance_stats").select("*"),
    supabase.from("project_type_stats").select("*"),
    supabase.from("bmc_projects").select("sanctioned_budget, spent_budget, status"),
    supabase.from("report_issue_distribution").select("*"),
    supabase
      .from("reports")
      .select(`id, issue_type, created_at, ai_analysis, project_id, bmc_projects (title, ward)`)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("bmc_projects")
      .select("id, title, latitude, longitude, status, ward")
      .not("latitude", "is", null)
      .not("longitude", "is", null),
  ]);

  return {
    wardStats: performance.data || [],
    typeStats: types.data || [],
    issueStats: issues.data || [],
    recentReports: reports.data || [],
    mapData: mapProjects.data || [],
    // Wrap in Number() to handle BigInt-to-String conversion from Supabase
    totalBudget: summary.data?.reduce((acc, curr) => acc + (Number(curr.sanctioned_budget) || 0), 0) || 0,
    criticalCount: summary.data?.filter((p) => p.status === "Delayed").length || 0,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}