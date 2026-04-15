import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import ProfileClient from "./profile-client";

export const metadata = {
  title: "My Profile | BMC Watch",
  description: "View your verified civic profile and leaderboard status.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Authenticate user securely on the server
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch User Profile
  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3. Fetch User Ratings Timeline (Top 10)
  const { data: userRatings, error: ratingsError } = await supabase
    .from("project_ratings")
    .select(`
      *,
      bmc_projects ( id, title, location )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (ratingsError) {
    console.error("Server fetch error for profile ratings:", ratingsError);
  }

  return (
    <ProfileClient 
      initialProfile={profileData || null} 
      userRatings={userRatings || []} 
    />
  );
}
