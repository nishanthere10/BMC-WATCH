"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, UserCircle, Star } from "lucide-react";
import { useTranslations } from "@/app/components/I18nProvider";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  display_name: string;
  total_points: number;
  badge_rank: string;
}

// Stagger variant for list rows
const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.05, duration: 0.25, ease: "easeOut" },
  }),
};

// Podium card variant
const podiumVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const rankMeta: Record<number, { label: string; borderColor: string; iconBg: string; iconColor: string; rankText: string }> = {
  1: {
    label: "#1",
    borderColor: "border-amber-400 dark:border-amber-500",
    iconBg: "bg-amber-400 dark:bg-amber-500",
    iconColor: "text-amber-900",
    rankText: "text-amber-400",
  },
  2: {
    label: "#2",
    borderColor: "border-slate-300 dark:border-slate-600",
    iconBg: "bg-slate-200 dark:bg-slate-700",
    iconColor: "text-slate-600 dark:text-slate-300",
    rankText: "text-slate-500",
  },
  3: {
    label: "#3",
    borderColor: "border-amber-700/50 dark:border-amber-800",
    iconBg: "bg-amber-700/20 dark:bg-amber-900/40",
    iconColor: "text-amber-700 dark:text-amber-500",
    rankText: "text-amber-600 dark:text-amber-500",
  },
};

function PodiumCard({
  user,
  rank,
  delay,
  elevated,
  mobileOrder,
}: {
  user: LeaderboardUser;
  rank: 1 | 2 | 3;
  delay: number;
  elevated?: boolean;
  mobileOrder?: number;
}) {
  const meta = rankMeta[rank];

  return (
    <motion.div
      custom={delay}
      variants={podiumVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      style={mobileOrder !== undefined ? { order: mobileOrder } : undefined}
      className={cn(
        "relative flex flex-col items-center text-center p-6 w-full sm:w-1/3",
        "bg-white dark:bg-[#0D1424]",
        "border-2 rounded-xl overflow-visible",
        // hover via CSS class transition (avoids FM backgroundColor snap)
        "transition-shadow duration-150 hover:shadow-[6px_6px_0px_0px_rgba(0,85,164,0.15)]",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]",
        meta.borderColor,
        elevated ? "sm:-translate-y-4" : ""
      )}
    >
      {/* Rank badge */}
      <div className={cn(
        "absolute -top-5 w-10 h-10 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]",
        meta.iconBg
      )}>
        {rank === 1
          ? <Medal size={20} className={meta.iconColor} />
          : <span className={cn("font-black font-mono text-sm", meta.iconColor)}>{meta.label}</span>
        }
      </div>

      <div className="mt-5">
        <UserCircle size={rank === 1 ? 48 : 40} className="text-slate-400 dark:text-slate-600 mx-auto" />
      </div>

      <h3 className="font-heading font-extrabold text-slate-900 dark:text-white mt-3 truncate w-full text-base">
        {user.display_name}
      </h3>
      <p className="cr-section-title flex items-center gap-1 mt-1 justify-center">
        <Award size={10} /> {user.badge_rank}
      </p>

      <div className="mt-auto pt-4 border-t-2 border-slate-100 dark:border-slate-800 w-full">
        <p className={cn(
          "font-black font-mono",
          rank === 1 ? "text-2xl text-[#0055A4] dark:text-[#38BDF8]" : "text-xl text-slate-700 dark:text-slate-300"
        )}>
          {user.total_points.toLocaleString()}
        </p>
        <p className="cr-section-title mt-0.5">pts</p>
      </div>
    </motion.div>
  );
}

export default function LeaderboardClient({ users }: { users: LeaderboardUser[] }) {
  const { t } = useTranslations();
  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="min-h-screen bg-white dark:bg-[#070D1A] px-4 py-24 pb-32 transition-colors duration-300">
      <div className="mx-auto max-w-3xl">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl
            bg-amber-50 dark:bg-amber-900/20
            border-2 border-amber-300 dark:border-amber-700
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-5">
            <Trophy size={32} className="text-amber-500" />
          </div>
          <h1 className="cr-page-title">{t('leaderboard.title')}</h1>
          <p className="cr-page-subtitle mt-3">{t('leaderboard.subtitle')}</p>
          {/* Structural rule line */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="cr-section-title px-3 flex items-center gap-1.5">
              <Star size={9} /> Ranked by Civic Points
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
        </motion.div>

        {/* ── Top 3 Podium ── */}
        {topThree.length > 0 && (
          <div className="flex flex-col sm:flex-row items-end justify-center gap-5 mb-14 overflow-visible">
          {/* Mobile order: 1→2→3. Desktop: reorder to 2→1→3 via CSS order. */}
          {topThree[1] && (
            <PodiumCard user={topThree[1]} rank={2} delay={0.2} mobileOrder={2} />
          )}
          {topThree[0] && (
            <PodiumCard user={topThree[0]} rank={1} delay={0.1} elevated mobileOrder={1} />
          )}
          {topThree[2] && (
            <PodiumCard user={topThree[2]} rank={3} delay={0.3} mobileOrder={3} />
          )}
          </div>
        )}

        {/* ── The Rest ── */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="cr-card-flat overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <div className="col-span-2 cr-section-title text-center">{t('leaderboard.rank')}</div>
              <div className="col-span-7 cr-section-title">{t('leaderboard.citizen')}</div>
              <div className="col-span-3 cr-section-title text-right">{t('leaderboard.points')}</div>
            </div>

            <div className="divide-y-2 divide-slate-100 dark:divide-slate-800">
              {rest.map((user, index) => (
                <motion.div
                  key={user.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-12 items-center px-5 py-4 cursor-default
                    transition-colors duration-100
                    hover:bg-[rgba(0,85,164,0.03)] dark:hover:bg-[rgba(56,189,248,0.03)]"
                  // Note: no y-translate on hover — avoids overlapping divide-y-2 borders
                >
                  <div className="col-span-2 font-black font-mono text-slate-300 dark:text-slate-700 text-lg text-center">
                    #{index + 4}
                  </div>
                  <div className="col-span-7 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <UserCircle size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold font-heading text-slate-900 dark:text-white leading-tight text-sm">
                        {user.display_name}
                      </p>
                      <p className="cr-section-title mt-0.5">{user.badge_rank}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="font-black font-mono text-[#0055A4] dark:text-[#38BDF8]">
                      {user.total_points.toLocaleString()}
                    </span>
                    <span className="cr-section-title ml-1">pts</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {users.length === 0 && (
          <div className="cr-card-flat p-16 flex flex-col items-center justify-center text-center">
            <Trophy size={40} className="text-slate-300 dark:text-slate-700 mb-4" />
            <p className="cr-section-title">No participants yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
