import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import MyReportsClient from "./reports-client";

export const metadata = {
  title: "My Civic Reports | BMC Watch",
  description: "View and track the status of your submitted civic audits.",
};

export default async function MyReportsPage() {
  const supabase = await createClient();

  // 1. Authenticate user securely on the server
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch aggregate stats
  let profileStats = { points: 0, count: 0 };
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("total_points, total_ratings")
    .eq("id", user.id)
    .single();

  if (profile) {
    profileStats = { points: profile.total_points, count: profile.total_ratings };
  }

  // 3. Fetch detailed reports mapped with project data
  const { data: reports, error: reportsError } = await supabase
    .from("project_ratings")
    .select(`
      *,
      bmc_projects ( id, title, location )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (reportsError) {
    console.error("Server fetch error for project ratings:", reportsError);
  }

  // Pass JSON data down to the fully interactive Client Component
  return <MyReportsClient reports={reports || []} profileStats={profileStats} />;
}
