import type { Metadata } from "next";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export const metadata: Metadata = { title: "Experience" };

export default function AdminExperiencePage() {
  return <ExperienceManager />;
}
