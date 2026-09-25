import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/DashboardOverview";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return <DashboardOverview />;
}
