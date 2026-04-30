import { getProjectById, getProjectState } from "@/lib/projects";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./project-detail-client";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const projectState = await getProjectState(project.id);

  return <ProjectDetailClient project={project} projectState={projectState} />;
}
