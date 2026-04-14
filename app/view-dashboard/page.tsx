import { supabase } from "@/lib/supabase";
import StatCard from "@/components/dashboard/stat-card";
import WardRankingTable from "@/components/dashboard/ward-ranking-table";

import RecentReportsFeed from "@/components/dashboard/recent-reports-feed";
import DashboardMapWrapper from "@/components/dashboard/dashboard-map-wrapper";
import DashboardFilters from "@/components/dashboard/dashboard-filters"; // ADD THIS
import type { WardPerformance } from "@/types/dashboard";
import { 
  MessageSquare, 
  Activity, 
  TrendingUp 
} from "lucide-react";

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

  const glassPanel = "cr-card";
  const sectionTitle = "font-heading text-lg font-bold" ;
  const sectionSub = "text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500";

  return (
    <div className="min-h-screen transition-colors duration-300">
      <main className="pb-20 pt-24">
        <div className="container px-4 md:px-8 space-y-8">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <span className="cr-section-title">Live Intelligence Feed</span>
              <h1
                className="font-heading font-extrabold text-slate-900 dark:text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                Mumbai Civic Audit
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Real-time oversight of{" "}
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {data.totalBudget > 0 ? `₹${(data.totalBudget / 10000000).toFixed(2)} Cr` : "---"}
                </span>{" "}
                in public infrastructure works.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="cr-card-flat px-4 py-2.5 flex items-center gap-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Feed</span>
              </div>
            </div>
          </div>

          {/* NEW: Dashboard Filters */}
          <DashboardFilters />

          {/* KPI Row - Passing Components instead of Strings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Works Tracked" value={data.wardStats.reduce((a: number, b: WardPerformance) => a + b.total_projects, 0)} icon={"HardHat"} />
          <StatCard title="Active Citizen Reports" value={data.wardStats.reduce((a: number, b: WardPerformance) => a + b.citizen_reports, 0)} trend="+18% this week" icon={"Users"} />
          <StatCard title="Overall Delay Rate" value="24%" trend="Needs Attention" variant="destructive" icon={"Clock"} />
          <StatCard title="Most Active Ward" value={data.wardStats[0]?.ward || "Data unavailable"} description={`${data.wardStats[0]?.citizen_reports || 0} active reports`} icon={"MapPin"} />
        </div>

          {/* Hero Section: Map + AI Audits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`${glassPanel} p-4 lg:col-span-8 h-[450px]`}>
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h3 className={sectionTitle}>Live Site Heatmap</h3>
                  <p className={sectionSub}>Spatial distribution of active & delayed works</p>
                </div>
                <div className="hidden sm:block">
                   <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Healthy</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Critical</span>
                   </div>
                </div>
              </div>
              <DashboardMapWrapper projects={data.mapData} /> 
            </div>

            <div className={`${glassPanel} p-6 lg:col-span-4 h-[450px] flex flex-col`}>
              <h3 className={`${sectionTitle} flex items-center gap-2 mb-5`}>
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-sm">
                  <MessageSquare size={14} className="text-white" />
                </div>
                Recent AI Audits
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <RecentReportsFeed reports={data.recentReports} />
              </div>
            </div>
          </div>



          {/* Ward Leaderboard */}
          <div className={`${glassPanel} p-6 overflow-hidden`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={sectionTitle}>Ward Performance Leaderboard</h3>
                <p className={`${sectionSub} mt-0.5`}>Ranked by citizen engagement and project health</p>
              </div>
              <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                Sorted by Citizen Reports
              </span>
            </div>
            <WardRankingTable data={data.wardStats} />
          </div>

        </div>
      </main>
    </div>
  );
}