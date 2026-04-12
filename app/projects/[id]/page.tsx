import { getProjectById } from "@/lib/projects";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./project-detail-client";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
