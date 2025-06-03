import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname === "/franchise/apply") {
    return res;
  }
  // Auth routes - redirect to dashboard if already authenticated
  if (req.nextUrl.pathname.startsWith("/auth/") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protected routes - require authentication
  if (
    
    (req.nextUrl.pathname.startsWith("/dashboard") ||
     req.nextUrl.pathname.startsWith("/admin/") ||
     req.nextUrl.pathname.startsWith("/internal/") ||
     req.nextUrl.pathname.startsWith("/client/") ||
     req.nextUrl.pathname === "/profile" ||
     req.nextUrl.pathname === "/settings") && 
    !session
  ) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-based route protection
  if (session) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return res;
    }

    const role = userData?.role || "user";

    // Admin routes
    if (req.nextUrl.pathname.startsWith("/admin/") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Internal routes
    if (req.nextUrl.pathname.startsWith("/internal/") && role !== "internal" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Franchise routes
    if (req.nextUrl.pathname.startsWith("/franchise/dashboard") && role !== "franchise" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Client routes
    if (req.nextUrl.pathname.startsWith("/client/") && role !== "client" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Match all protected routes individually (explicit)
    "/dashboard/:path*",
    "/admin/:path*",
    "/internal/:path*",
    "/client/:path*",
    "/profile",
    "/settings",
    "/auth/:path*",
    "/franchise/dashboard",
    "/franchise/projects",
    "/franchise/documents/upload",
    "/franchise/clients",
    "/franchise/settings",
  ],
};


