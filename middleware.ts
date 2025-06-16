import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  console.log("🔍 Middleware - Path:", req.nextUrl.pathname);
  
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  console.log("🔍 Middleware - Session exists:", !!session);
  console.log("🔍 Middleware - Session error:", sessionError);
  console.log("🔍 Middleware - User ID:", session?.user?.id);

  const pathname = req.nextUrl.pathname;

  // Always allow franchise/apply page
  if (pathname === "/franchise/apply") {
    console.log("✅ Allowing franchise/apply");
    return res;
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (pathname.startsWith("/auth/") && session) {
    console.log("🔄 Redirecting authenticated user from auth page to dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protected routes - require authentication
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/internal", 
    "/client",
    "/franchise/dashboard",
    "/profile",
    "/settings"
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );

  console.log("🔍 Is protected route:", isProtectedRoute);

  if (isProtectedRoute && !session) {
    console.log("❌ No session for protected route, redirecting to signin");
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-based route protection - ONLY for authenticated users
  if (session && isProtectedRoute) {
    console.log("🔍 Checking user role...");
    
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", session.user.id)
      .single();

    console.log("🔍 User data:", userData);
    console.log("🔍 User role error:", error);

    if (error) {
      console.error("❌ Error fetching user role:", error);
      // Don't redirect to signin if we can't fetch role - might be a temporary DB issue
      return res;
    }

    const role = userData?.role || "user";
    console.log("🔍 User role:", role);

    // Check role permissions
    if (pathname.startsWith("/admin/") && role !== "admin") {
      console.log("❌ Non-admin trying to access admin route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/internal/") && !["internal", "admin"].includes(role)) {
      console.log("❌ Non-internal user trying to access internal route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/franchise/dashboard") && !["franchise", "admin"].includes(role)) {
      console.log("❌ Non-franchise user trying to access franchise route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/client/") && !["client", "admin"].includes(role)) {
      console.log("❌ Non-client user trying to access client route");  
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    console.log("✅ Access allowed for role:", role);
  }

  console.log("✅ Middleware allowing request");
  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*", 
    "/internal/:path*",
    "/client/:path*",
    "/franchise/dashboard/:path*",
    "/profile",
    "/settings", 
    "/auth/:path*"
  ],
};