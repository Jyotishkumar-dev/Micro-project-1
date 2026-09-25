import type { Metadata } from "next";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const metadata: Metadata = { title: "Projects" };

export default function AdminProjectsPage() {
  return <ProjectManager />;
}
