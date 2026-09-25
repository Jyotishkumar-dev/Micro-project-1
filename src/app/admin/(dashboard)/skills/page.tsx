import type { Metadata } from "next";
import { SkillManager } from "@/components/admin/SkillManager";

export const metadata: Metadata = { title: "Skills" };

export default function AdminSkillsPage() {
  return <SkillManager />;
}
