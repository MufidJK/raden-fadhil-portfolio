import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the Supabase Auth session by reading/writing cookies on the
 * request ↔ response pair. This MUST run in the Next.js middleware on every
 * matched request to prevent premature session expiration.
 *
 * Returns the authenticated `user` (or `null`) and the `supabaseResponse`
 * that carries the updated Set-Cookie headers. The caller MUST return
 * `supabaseResponse` (or copy its cookies onto any replacement response)
 * to keep the browser and server in sync.
 */

interface UpdateSessionResult {
  user: Awaited<
    ReturnType<
      ReturnType<typeof createServerClient>["auth"]["getUser"]
    >
  >["data"]["user"];
  supabaseResponse: NextResponse;
}

export async function updateSession(
  request: NextRequest
): Promise<UpdateSessionResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
    );
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // 1. Update the request cookies so downstream Server Components
        //    can read the refreshed tokens immediately.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );

        // 2. Recreate the response to pick up the mutated request cookies.
        supabaseResponse = NextResponse.next({ request });

        // 3. Set the actual Set-Cookie headers on the outgoing response
        //    so the browser receives the refreshed tokens.
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );

        // 4. Forward any additional headers the library needs to set.
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value)
        );
      },
    },
  });

  // IMPORTANT: Do NOT add any code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard
  // to debug issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabaseResponse };
}
