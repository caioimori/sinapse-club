import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  // Stripe requer js.stripe.com (script), hooks.stripe.com + js.stripe.com (frames),
  // api.stripe.com (XHR). Vercel Analytics: va.vercel-scripts.com.
  if (isDev) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' blob: data: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://maps.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'none'",
    ].join("; ");
  }
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://js.stripe.com https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' blob: data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://maps.stripe.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(globalThis.crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Inject nonce into request headers so Server Components (layout.tsx) can read it.
  // NextRequest.headers is read-only, so we forward via NextResponse.next() and
  // rely on the fact that updateSession reads from the incoming request object.
  // We pass the modified headers to updateSession by augmenting the request.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js renderer reads this from the request to auto-apply the nonce to
  // its framework scripts and bundles during SSR. Without it, strict-dynamic
  // blocks every chunk because no script carries the matching nonce.
  requestHeaders.set("Content-Security-Policy", csp);

  // Use NextResponse.next to forward the mutated headers into the Next.js pipeline
  // before auth processing, so layout.tsx can pick up x-nonce via `headers()`.
  const preAuthResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Run auth middleware — it creates its own response with cookies, redirects, etc.
  const authResponse = await updateSession(request);

  // Merge cookies from auth response onto preAuth response where needed,
  // but we primarily care about setting CSP on the final response.
  // We set CSP on whatever response auth returned (redirect or next).
  authResponse.headers.set("Content-Security-Policy", csp);

  // Propagate x-nonce as a response header so middleware can expose it to the
  // Next.js headers() API. Next.js exposes request headers set via NextResponse.next()
  // to Server Components — we need to set this on the response that Next.js processes.
  // Since authResponse may be a redirect, we always set both:
  authResponse.headers.set("x-nonce", nonce);

  // For non-redirect responses, also make sure the request headers contain x-nonce
  // so that layout.tsx `headers()` call returns it. We do this by re-wrapping if
  // authResponse is a NextResponse.next() type (not a redirect).
  const isRedirect = authResponse.status >= 300 && authResponse.status < 400;
  if (!isRedirect) {
    // Re-issue a NextResponse.next() that carries the mutated request headers
    // (x-nonce) so Server Components can read it via `headers()`.
    const finalResponse = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Copy all headers from authResponse (cookies, etc.) to finalResponse
    authResponse.headers.forEach((value, key) => {
      finalResponse.headers.set(key, value);
    });

    // Copy cookies from authResponse to finalResponse
    authResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
      finalResponse.cookies.set({ name, value, ...options });
    });

    finalResponse.headers.set("Content-Security-Policy", csp);
    finalResponse.headers.set("x-nonce", nonce);
    return finalResponse;
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
