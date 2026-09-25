import type { Metadata } from "next";
import { CertificationManager } from "@/components/admin/CertificationManager";

export const metadata: Metadata = { title: "Certifications" };

export default function AdminCertificationsPage() {
  return <CertificationManager />;
}
