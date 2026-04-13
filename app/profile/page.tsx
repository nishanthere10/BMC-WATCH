"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Star, History, Edit2, CheckCircle2, ShieldCheck, UserCircle, Loader2 } from "lucide-react";

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
              <Star size={24} />
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
      </div>
    </div>
  );
}
