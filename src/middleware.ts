import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

const LOGIN_PATH = "/admin/login";

/**
 * Auth middleware for the admin area.
 *
 * Two jobs, both cheap:
 *  1. Keep the auth cookies fresh. `getUser()` triggers a refresh, and the
 *     `setAll` handler below writes the refreshed tokens onto the outgoing
 *     response — the only place in the app that can do so.
 *  2. Redirect anonymous visitors away from /admin before any dashboard code
 *     runs, so an unauthenticated visitor never sees a partially rendered page.
 *
 * Scoped to /admin on purpose. The public portfolio reads through a cookie-less
 * client, so forcing a Supabase round trip on every marketing-page request
 * would be pure added latency.
 *
 * IMPORTANT: this is UX, not security. It keeps unauthenticated users out of
 * the UI. It is trivially bypassed by anyone calling the API directly, which
 * is exactly why every write in the admin dashboard is also gated by RLS in
 * the database. Never treat a 200 from middleware as an authorization decision.
 */
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    // No backend to talk to. Let the request through so /admin/login can
    // explain what is missing instead of bouncing forever.
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not skip this: it is what performs the token refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === LOGIN_PATH;

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
