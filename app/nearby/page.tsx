import { getProjects, getMapProjects, getFilterOptions } from "@/lib/projects";
import NearbyClient from "./nearby-client";

export default async function NearbyPage() {
  const [initialData, mapProjects, filterOptions] = await Promise.all([
    getProjects({ page: 1, pageSize: 50 }),
    getMapProjects(),
    getFilterOptions(),
  ]);

  return (
    <NearbyClient
      initialData={initialData}
      mapProjects={mapProjects}
      filterOptions={filterOptions}
    />
  );
}