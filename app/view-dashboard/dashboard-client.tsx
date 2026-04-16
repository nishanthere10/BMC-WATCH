"use client";

import StatCard from "@/components/dashboard/stat-card";
import WardRankingTable from "@/components/dashboard/ward-ranking-table";
import RecentReportsFeed from "@/components/dashboard/recent-reports-feed";
import DashboardMapWrapper from "@/components/dashboard/dashboard-map-wrapper";
import DashboardFilters from "@/components/dashboard/dashboard-filters";
import type { WardPerformance } from "@/types/dashboard";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "@/app/components/I18nProvider";

interface DashboardClientProps {
  data: {
    wardStats: any[];
    typeStats: any[];
    issueStats: any[];
    recentReports: any[];
    mapData: any[];
    totalBudget: number;
    criticalCount: number;
  };
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const { t } = useTranslations();
  const glassPanel = "cr-card";
  const sectionTitle = "font-heading text-lg font-bold";
  const sectionSub = "text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500";

  return (
    <div className="min-h-screen bg-white dark:bg-[#070D1A] transition-colors duration-300">
      <main className="pb-20 pt-24">
        <div className="container px-4 md:px-8 space-y-8">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <span className="cr-section-title">{t('dashboard.live_intelligence')}</span>
              <h1
                className="font-heading font-extrabold text-slate-900 dark:text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
              >
                {t('dashboard.title')}
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t('dashboard.subtitle_prefix')}
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {data.totalBudget > 0 ? `₹${(data.totalBudget / 10000000).toFixed(2)} ${t('project_card.cr')}` : "---"}
                </span>{" "}
                {t('dashboard.subtitle_suffix')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="cr-card-flat px-4 py-2.5 flex items-center gap-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('dashboard.live_feed')}</span>
              </div>
            </div>
          </div>

          <DashboardFilters />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title={t('dashboard.total_works')} value={data.wardStats.reduce((a: number, b: WardPerformance) => a + b.total_projects, 0)} icon={"HardHat"} />
            <StatCard title={t('dashboard.active_reports')} value={data.wardStats.reduce((a: number, b: WardPerformance) => a + b.citizen_reports, 0)} icon={"Users"} />
            <StatCard title={t('dashboard.delay_rate')} value="24%" trend={t('dashboard.trend_attention')} variant="destructive" icon={"Clock"} />
            <StatCard title={t('dashboard.most_active_ward')} value={data.wardStats[0]?.ward || t('dashboard.data_unavail')} description={`${data.wardStats[0]?.citizen_reports || 0} active reports`} icon={"MapPin"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`${glassPanel} p-4 lg:col-span-8 h-[450px]`}>
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h3 className={sectionTitle}>{t('dashboard.heatmap_title')}</h3>
                  <p className={sectionSub}>{t('dashboard.heatmap_sub')}</p>
                </div>
                <div className="hidden sm:block">
                   <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> {t('dashboard.healthy')}</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> {t('dashboard.critical')}</span>
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
                {t('dashboard.recent_audits')}
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
                <h3 className={sectionTitle}>{t('dashboard.leaderboard')}</h3>
                <p className={`${sectionSub} mt-0.5`}>{t('dashboard.leaderboard_sub')}</p>
              </div>
              <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                {t('dashboard.sorted_by')}
              </span>
            </div>
            <WardRankingTable data={data.wardStats} />
          </div>

        </div>
      </main>
    </div>
  );
}
