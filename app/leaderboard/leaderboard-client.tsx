"use client";

import { LazyMotion, m } from "framer-motion";
import { Trophy, Medal, Award, UserCircle } from "lucide-react";
import { useTranslations } from "@/app/components/I18nProvider";

interface LeaderboardUser {
  id: string;
  display_name: string;
  total_points: number;
  badge_rank: string;
}

// Function returning dynamic import of features to heavily prevent bundling main thread load
const loadFeatures = () => import('@/components/home/features').then(res => res.default);

export default function LeaderboardClient({ users }: { users: LeaderboardUser[] }) {
  const { t } = useTranslations();
  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="min-h-screen bg-white dark:bg-[#070D1A] px-4 py-24 pb-32 transition-colors duration-300">
        <div className="mx-auto max-w-3xl">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 shadow-lg border border-amber-100 dark:border-amber-900/50 mb-4">
              <Trophy size={32} className="text-amber-500" />
            </div>
            <h1 className="cr-page-title">{t('leaderboard.title')}</h1>
            <p className="cr-page-subtitle mt-3">
              {t('leaderboard.subtitle')}
            </p>
          </div>

          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 mb-12 h-auto sm:h-56">
              {/* Rank 2 */}
              {topThree[1] && (
                <m.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="cr-card w-full sm:w-1/3 p-6 flex flex-col items-center text-center relative max-sm:order-2 h-48 sm:h-48"
                >
                  <div className="absolute -top-6 w-12 h-12 bg-slate-200 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
                    <span className="font-bold font-mono text-slate-500">#2</span>
                  </div>
                  <div className="mt-4"><UserCircle size={40} className="text-slate-400" /></div>
                  <h3 className="font-bold font-heading text-slate-900 dark:text-white mt-3 truncate w-full">{topThree[1].display_name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 justify-center"><Award size={12}/> {topThree[1].badge_rank}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
                    <p className="font-extrabold font-mono text-[#2563EB] dark:text-[#38BDF8] text-xl">{topThree[1].total_points.toLocaleString()}</p>
                  </div>
                </m.div>
              )}

              {/* Rank 1 */}
              <m.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="w-full sm:w-1/3 bg-gradient-to-b from-[#2563EB] to-[#1E3A8A] text-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative z-10 max-sm:order-1 h-56 sm:h-56 transform sm:-translate-y-4 border border-blue-400/30"
              >
                <div className="absolute -top-7 w-14 h-14 bg-amber-400 rounded-full border-4 border-[#2563EB] flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Medal size={24} className="text-amber-900" />
                </div>
                <div className="mt-4"><UserCircle size={48} className="text-blue-200" /></div>
                <h3 className="font-bold font-heading text-white mt-3 truncate w-full text-lg">{topThree[0].display_name}</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1 mt-1 justify-center"><Award size={12}/> {topThree[0].badge_rank}</p>
                <div className="mt-auto pt-4 border-t border-blue-400/30 w-full">
                  <p className="font-extrabold font-mono text-amber-300 text-2xl">{topThree[0].total_points.toLocaleString()}</p>
                </div>
              </m.div>

              {/* Rank 3 */}
              {topThree[2] && (
                <m.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="cr-card w-full sm:w-1/3 p-6 flex flex-col items-center text-center relative max-sm:order-3 h-44 sm:h-44"
                >
                  <div className="absolute -top-6 w-12 h-12 bg-amber-700/20 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
                    <span className="font-bold font-mono text-amber-700 dark:text-amber-500">#3</span>
                  </div>
                  <div className="mt-2"><UserCircle size={36} className="text-slate-400" /></div>
                  <h3 className="font-bold font-heading text-slate-900 dark:text-white mt-2 truncate w-full">{topThree[2].display_name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 justify-center"><Award size={12}/> {topThree[2].badge_rank}</p>
                  <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 w-full">
                    <p className="font-extrabold font-mono text-[#2563EB] dark:text-[#38BDF8] text-lg">{topThree[2].total_points.toLocaleString()}</p>
                  </div>
                </m.div>
              )}
            </div>
          )}

          {/* The Rest of the List */}
          {rest.length > 0 && (
            <div className="cr-card pt-2">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 flex cr-section-title">
                <span className="w-12 text-center">{t('leaderboard.rank')}</span>
                <span className="flex-1">{t('leaderboard.citizen')}</span>
                <span className="text-right">{t('leaderboard.points')}</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {rest.map((user, index) => (
                  <m.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className="flex items-center px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="w-12 text-center font-bold font-mono text-slate-400">#{index + 4}</span>
                    <div className="flex-1 flex items-center gap-3">
                      <UserCircle size={20} className="text-slate-400 hidden sm:block" />
                      <div>
                        <p className="font-bold font-heading text-slate-900 dark:text-white leading-tight">{user.display_name}</p>
                        <p className="text-xs text-slate-500 font-medium">{user.badge_rank}</p>
                      </div>
                    </div>
                    <span className="font-extrabold font-mono text-[#2563EB] dark:text-[#38BDF8]">{user.total_points.toLocaleString()}</span>
                  </m.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </LazyMotion>
  );
}
