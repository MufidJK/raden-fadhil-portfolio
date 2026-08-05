import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Next.js Proxy — runs on every matched request.
 *
 * Responsibilities:
 * 1. Refresh Supabase Auth session cookies (prevents premature expiration).
 * 2. Protect /admin/* routes — redirect unauthenticated users to /admin/login.
 * 3. Redirect authenticated users away from /admin/login to /admin/projects.
 * 4. Pass through all public routes with zero interference.
 */
export default async function proxy(request: NextRequest) {
  // 1. Always refresh the session first — this updates cookies and gives
  //    us the current user. The supabaseResponse carries the Set-Cookie
  //    headers and MUST be returned (or its cookies copied) to keep the
  //    browser ↔ server session in sync.
  const { user, supabaseResponse } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // 2. If the user is on /admin/login and already authenticated,
  //    redirect them to the admin dashboard.
  if (pathname === "/admin/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/projects";
    return NextResponse.redirect(url);
  }

  // 3. If the user is on any /admin/* route (except /admin/login)
  //    and NOT authenticated, redirect to the login page.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // 4. For all other routes (public pages, API routes, etc.),
  //    return the response with refreshed cookies intact.
  return supabaseResponse;
}

/**
 * Matcher configuration — determines which routes the middleware runs on.
 *
 * Excludes:
 * - _next/static (static file serving)
 * - _next/image (image optimization)
 * - favicon.ico
 * - Common image file extensions
 *
 * This keeps public pages zero-overhead for static assets while still
 * running the session refresh + route protection on all page navigations.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
