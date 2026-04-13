import { createClient } from "@supabase/supabase-js";
import LeaderboardClient from "./leaderboard-client";

export const metadata = {
  title: 'Civic Leaderboard',
  description: 'Top contributors auditing the city'
};

// Next.js Server Component
export default async function LeaderboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: users } = await supabase
    .from("user_profiles")
    .select("id, display_name, total_points, badge_rank")
    .order("total_points", { ascending: false })
    .limit(50);

  return <LeaderboardClient users={users || []} />;
}
