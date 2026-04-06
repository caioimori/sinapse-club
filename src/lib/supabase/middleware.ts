import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRoleRank } from "@/lib/access";
import {
  getSupabaseServerConfig,
  hasSupabaseServerConfig,
} from "@/lib/supabase/server-config";

function serviceUnavailable() {
  return new NextResponse(
    "Supabase configuration is missing for authenticated routes.",
    {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requiresSupabase = pathname.startsWith("/forum")
    || pathname.startsWith("/feed")
    || pathname.startsWith("/courses")
    || pathname.startsWith("/calendar")
    || pathname.startsWith("/profile")
    || pathname.startsWith("/settings")
    || pathname.startsWith("/spaces")
    || pathname.startsWith("/posts")
    || pathname.startsWith("/marketplace")
    || pathname.startsWith("/benefits")
    || pathname.startsWith("/tools")
    || pathname.startsWith("/admin")
    || pathname.startsWith("/login")
    || pathname.startsWith("/register")
    || pathname.startsWith("/onboarding")
    || pathname.startsWith("/auth/callback");

  if (!hasSupabaseServerConfig()) {
    if (requiresSupabase) {
      return serviceUnavailable();
    }

    return NextResponse.next({ request });
  }

  const isPublicRoute = pathname === "/"
    || pathname.startsWith("/demo")
    || pathname.startsWith("/pricing")
    || pathname.startsWith("/about")
    || pathname.startsWith("/api")
    || pathname.startsWith("/login")
    || pathname.startsWith("/register")
    || pathname.startsWith("/onboarding")
    || pathname.startsWith("/auth/callback");

  if (isPublicRoute) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseServerConfig();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboardRoute = pathname.startsWith("/forum")
    || pathname.startsWith("/feed")
    || pathname.startsWith("/courses")
    || pathname.startsWith("/calendar")
    || pathname.startsWith("/profile")
    || pathname.startsWith("/settings")
    || pathname.startsWith("/spaces")
    || pathname.startsWith("/posts")
    || pathname.startsWith("/marketplace")
    || pathname.startsWith("/benefits")
    || pathname.startsWith("/tools")
    || pathname.startsWith("/admin");

  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isDashboardRoute && !pathname.startsWith("/onboarding")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded, role")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarded) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/forum";
      return NextResponse.redirect(url);
    }

    const proGatedRoutes = ["/marketplace", "/benefits", "/tools"];
    const isProGated = proGatedRoutes.some((route) => pathname.startsWith(route));

    if (isProGated && profile) {
      const userRank = getRoleRank(profile.role);
      if (userRank < 20) {
        const url = request.nextUrl.clone();
        url.pathname = "/pricing";
        url.searchParams.set("upgrade", "pro");
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  const isAuthRoute = pathname.startsWith("/login")
    || pathname.startsWith("/register");

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/forum";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
