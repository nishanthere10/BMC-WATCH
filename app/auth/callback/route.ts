import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * OAuth Callback Handler
 *
 * Supabase redirects here after Google login with a `code` query param.
 * This route exchanges the code for a session and sets the auth cookie,
 * then redirects the user to /profile.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/profile";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth — redirect user to intended destination
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    console.error("OAuth callback error:", error.message);
  }

  // Something went wrong — redirect to login with an error hint
  return NextResponse.redirect(
    new URL("/login?error=oauth_failed", requestUrl.origin)
  );
}
