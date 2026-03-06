import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Known app hostnames — requests to these go through normal routing
const APP_HOSTS = new Set(
  (process.env.APP_HOSTNAMES || "localhost,webfacelift.com,www.webfacelift.com")
    .split(",")
    .map((h) => h.trim().toLowerCase())
);

function isAppHost(host: string): boolean {
  // Strip port for local dev
  const hostname = host.split(":")[0].toLowerCase();
  return APP_HOSTS.has(hostname);
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // ── Custom Domain Routing ──────────────────────────────────
  // If the request is NOT to our app hostname, it's a custom domain.
  // Look up the project and rewrite to the share page.
  if (!isAppHost(host)) {
    const hostname = host.split(":")[0].toLowerCase();

    try {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: domainRecord } = await admin
        .from("project_custom_domains")
        .select("project_id")
        .eq("domain", hostname)
        .eq("verified", true)
        .single();

      if (domainRecord) {
        const { data: link } = await admin
          .from("project_share_links")
          .select("token")
          .eq("project_id", domainRecord.project_id)
          .eq("is_active", true)
          .single();

        if (link) {
          const url = request.nextUrl.clone();
          url.pathname = `/share/${link.token}`;
          return NextResponse.rewrite(url);
        }
      }
    } catch {
      // Fall through to 404
    }

    // Unknown custom domain — 404
    return NextResponse.next();
  }

  // ── Normal App Routing ─────────────────────────────────────
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session (keeps tokens fresh)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes: /dashboard, /buy, and /project/[uuid] (but NOT /project/demo or /project/new)
  // /invite pages handle their own auth (redirect to login if needed)
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/buy") ||
    (pathname.startsWith("/project/") &&
      !pathname.startsWith("/project/demo") &&
      !pathname.startsWith("/project/new"));

  // /invite pages: refresh session but don't force redirect — the page handles auth
  if (pathname.startsWith("/invite/") && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // App routes
    "/dashboard/:path*",
    "/project/:path*",
    "/buy",
    "/buy/:path*",
    "/invite/:path*",
    // Catch custom domains — match everything so custom domains get routed
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
