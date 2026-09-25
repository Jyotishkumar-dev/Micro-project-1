import type { Metadata } from "next";
import { MessageManager } from "@/components/admin/MessageManager";

export const metadata: Metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return <MessageManager />;
}
