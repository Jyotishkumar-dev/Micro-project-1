import type { Metadata } from "next";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { getAdminSession } from "@/lib/supabase/session";
import { isSupabaseConfigured, PROJECT_IMAGES_BUCKET } from "@/lib/supabase/env";
import { isSupabaseServerConfigured } from "@/lib/supabase/env.server";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  // Safe to call again here: getAdminSession is wrapped in React `cache`, so
  // the layout's check and this read share one auth round trip.
  const session = await getAdminSession();

  return (
    <SettingsManager
      profile={session.profile}
      email={session.user?.email ?? ""}
      configured={isSupabaseConfigured()}
      // A boolean, never the key itself — this value is rendered into HTML.
      serviceRoleConfigured={isSupabaseServerConfigured()}
      bucket={PROJECT_IMAGES_BUCKET}
    />
  );
}
