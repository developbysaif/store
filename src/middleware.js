import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "atelier_admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow login page and API authentication endpoints without redirect loop
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // 2. Protect Admin Portal Pages (/admin and /admin/*)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    // If cookie is absent or clearly malformed, redirect to /admin/login
    if (!sessionCookie || !sessionCookie.value || !sessionCookie.value.includes(".")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Basic payload and expiration check in middleware
      const [encodedData] = sessionCookie.value.split(".");
      const decodedJson = atob(encodedData.replace(/-/g, "+").replace(/_/g, "/"));
      const data = JSON.parse(decodedJson);

      if (!data || data.role !== "ADMIN" || !data.expiresAt || Date.now() > data.expiresAt) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(SESSION_COOKIE_NAME);
        return response;
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
