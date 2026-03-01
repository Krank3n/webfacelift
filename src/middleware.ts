import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
  matcher: ["/dashboard/:path*", "/project/:path*", "/buy", "/buy/:path*", "/invite/:path*"],
};
