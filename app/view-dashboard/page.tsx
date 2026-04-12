import { supabase } from "@/lib/supabase";
import StatCard from "@/components/dashboard/stat-card";
import WardRankingTable from "@/components/dashboard/ward-ranking-table";
import ProjectStatusChart from "@/components/dashboard/project-status-chart";
import { formatCurrency } from "@/lib/utils"; // Utility to format Cr. or Lakhs

async function getDashboardData() {
  const [performance, types, summary] = await Promise.all([
    supabase.from('ward_performance_stats').select('*'),
    supabase.from('project_type_stats').select('*'),
    supabase.from('bmc_projects').select('sanctioned_budget, spent_budget, status')
  ]);

  return {
    wardStats: performance.data || [],
    typeStats: types.data || [],
    totalBudget: summary.data?.reduce((acc, curr) => acc + (curr.sanctioned_budget || 0), 0) || 0,
    criticalCount: summary.data?.filter(p => p.status === 'Delayed').length || 0
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Mumbai Civic Audit</h1>
          <p className="text-slate-500 text-sm">Real-time oversight of {data.totalBudget > 0 ? `₹${(data.totalBudget / 10000000).toFixed(2)} Cr` : "---"} in public works.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Live Feed
          </span>
        </div>
      </div>

      {/* KPI Row - Using your real Sanctioned Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Projects" 
          value={data.totalBudget > 0 ? data.wardStats.reduce((a, b) => a + b.total_projects, 0) : 0} 
          icon="HardHat" 
        />
        <StatCard 
          title="Citizen Watchdogs" 
          value={data.wardStats.reduce((a, b) => a + b.citizen_reports, 0)} 
          trend="+18% this week" 
          icon="Users"
        />
        <StatCard 
          title="Delayed Sites" 
          value={data.criticalCount} 
          trend="Action Required" 
          variant="destructive"
          icon="Clock"
        />
        <StatCard 
          title="Top Problem Ward" 
          value={data.wardStats[0]?.ward || "---"} 
          description={`${data.wardStats[0]?.citizen_reports || 0} active reports`}
          icon="MapPin"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Type Breakdown */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-slate-800">Work by Category</h3>
          <ProjectStatusChart data={data.typeStats} />
        </div>

        {/* Real Ward Performance Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800">Ward Performance Leaderboard</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sorted by Citizen Reports</span>
          </div>
          <WardRankingTable data={data.wardStats} />
        </div>
      </div>
    </main>
  );
}