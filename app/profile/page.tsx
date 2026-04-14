"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Star as StarIcon, History, Edit2, CheckCircle2, ShieldCheck, UserCircle, Loader2, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  total_points: number;
  total_ratings: number;
  badge_rank: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  
  // State for user reports
  const [userRatings, setUserRatings] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (data) {
        setProfile(data);
        setNewName(data.display_name || "");
      }
      
      const { data: ratingsData } = await supabase
        .from("project_ratings")
        .select(`
          *,
          projects ( id, title, location )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
        
      if (ratingsData) {
        setUserRatings(ratingsData);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [user, authLoading, router]);

  const handleSaveName = async () => {
    if (!profile || !newName.trim()) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("user_profiles")
      .update({ display_name: newName.trim(), updated_at: new Date().toISOString() })
      .eq("id", profile.id);
      
    if (!error) {
      setProfile({ ...profile, display_name: newName.trim() });
      setIsEditing(false);
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" style={{color:'var(--cr-blue-mid)'}} size={32} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen px-4 py-24 pb-32">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Header Strip */}
        <div className="cr-card p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2563EB] to-[#38BDF8] p-1 shadow-lg shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800">
                <UserCircle size={48} className="text-[#2563EB] dark:text-[#38BDF8]" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full max-w-xs">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="cr-input font-heading text-xl font-bold"
                      autoFocus
                    />
                    <button 
                      onClick={handleSaveName}
                      disabled={saving}
                      className="cr-btn-primary p-2"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                      {profile.display_name}
                    </h1>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-slate-800/50 w-fit px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <ShieldCheck size={14} className="text-emerald-500" />
                Verified Citizen • {profile.email}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cr-card p-6 flex flex-col items-center justify-center text-center gap-2"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] dark:text-[#38BDF8] rounded-xl flex items-center justify-center mb-1">
              <Award size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Points</p>
            <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{profile.total_points.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cr-card p-6 flex flex-col items-center justify-center text-center gap-2"
          >
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl flex items-center justify-center mb-1">
              <StarIcon size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Rank</p>
            <p className="text-xl font-extrabold font-heading text-slate-900 dark:text-white mt-1 break-words leading-tight">{profile.badge_rank}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cr-card p-6 flex flex-col items-center justify-center text-center gap-2"
          >
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl flex items-center justify-center mb-1">
              <History size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Audits</p>
            <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{profile.total_ratings}</p>
          </motion.div>
        </div>

        {/* Recent Contributions Section */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <History size={20} className="text-[#2563EB] dark:text-[#38BDF8]" />
              My Recent Audits (Top 10)
            </h3>
          </div>

          {userRatings.length === 0 ? (
            <div className="cr-card p-10 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <StarIcon size={24} className="text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">No audits yet</h4>
              <p className="text-sm text-slate-500 mb-6">Start auditing nearby projects to earn points and climb the leaderboard.</p>
              <Link href="/nearby" className="cr-btn-primary">
                Find Projects Nearby
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {userRatings.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="cr-card overflow-hidden hover:border-[#2563EB]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Thumbnail */}
                    <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0 bg-slate-100 dark:bg-slate-800">
                      <Image 
                        src={r.photo_url || "/placeholder-project.jpg"} 
                        alt="Audit Photo" 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
                      {r.is_genuine && (
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-[#1A7A3E] text-white text-[10px] font-bold tracking-wider font-mono shadow-md border border-white/20">
                          <ShieldCheck size={11} /> Verified
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Title and date */}
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <Link 
                            href={`/projects/${r.projects?.id}`}
                            className="font-bold text-[#003366] dark:text-slate-200 text-lg hover:text-[#0055A4] hover:underline"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            {r.projects?.title || "Unknown Project"}
                          </Link>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {r.points_awarded > 0 && (
                              <span className="cr-badge cr-badge-progress text-[10px]">
                                +{r.points_awarded} pts
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                              <Clock size={11} />
                              {new Date(r.created_at).toLocaleDateString("en-IN", {
                                year: "numeric", month: "short", day: "numeric"
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        {r.projects?.location && (
                          <div className="flex items-start gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{r.projects.location}</span>
                          </div>
                        )}
                        
                        {/* Rating and Comment */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
                          <div className="flex gap-0.5 mb-1.5">
                            {[...Array(5)].map((_, idx) => (
                              <StarIcon
                                key={idx}
                                size={12}
                                className={cn(idx < r.rating ? "fill-[#F47920] text-[#F47920]" : "text-slate-200 dark:text-slate-700")}
                              />
                            ))}
                          </div>
                          <p className="text-[13px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
                            &ldquo;{r.comment || "No comment provided."}&rdquo;
                          </p>
                        </div>
                      </div>
                      
                      {/* Blockchain status */}
                      {r.blockchain_verified && (
                        <div className="flex items-center gap-1 mt-3 text-[10px] sm:text-[11px] text-[#2563EB] dark:text-[#38BDF8] font-mono">
                          <CheckCircle2 size={12} />
                          <span>Logged on Polygon Amoy network • </span>
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${r.blockchain_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold hover:underline truncate inline-block max-w-[150px]"
                          >
                            {r.blockchain_tx_hash}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
