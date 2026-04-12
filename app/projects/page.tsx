import { redirect } from "next/navigation";

/**
 * /projects redirects to /nearby which is the main project listing page.
 * This prevents the 404 that was occurring when users navigated to /projects.
 */
export default function ProjectsPage() {
  redirect("/nearby");
}
