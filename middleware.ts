import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  
  
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  
  
  

  const pathname = req.nextUrl.pathname;

  // Always allow franchise/apply page
  if (pathname === "/franchise/apply") {
    
    return res;
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (pathname.startsWith("/auth/") && session) {
    
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

  

  if (isProtectedRoute && !session) {
    
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-based route protection - ONLY for authenticated users
  if (session && isProtectedRoute) {
    
    
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", session.user.id)
      .single();

    
    

    if (error) {
      console.error("❌ Error fetching user role:", error);
      // Don't redirect to signin if we can't fetch role - might be a temporary DB issue
      return res;
    }

    const role = userData?.role || "user";
    

    // Check role permissions
    if (pathname.startsWith("/admin/") && role !== "admin") {
      
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/internal/") && !["internal", "admin"].includes(role)) {
      
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/franchise/dashboard") && !["franchise", "admin"].includes(role)) {
      
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/client/") && !["client", "admin"].includes(role)) {
        
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    
  }

  
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