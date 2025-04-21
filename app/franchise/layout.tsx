"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardNav } from "@/components/dashboard-nav";
import { db } from "@/lib/services/database";

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for the apply route
  const isApplyRoute = pathname === "/franchise/apply";

  useEffect(() => {
    async function checkFranchiseAccess() {
      // Skip auth check for apply route
      if (isApplyRoute) {
        setLoading(false);
        return;
      }

      const { data: { session }, error: sessionError } = await db.auth.getSession();
      
      if (sessionError || !session?.user) {
        router.push("/auth/signin");
        return;
      }

      const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);

      if (userError || !["admin", "franchise"].includes(userData?.role || "")) {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    }

    checkFranchiseAccess();
  }, [router, isApplyRoute]);

  if (loading) {
    return null;
  }

  // For apply route, render without dashboard nav
  if (isApplyRoute) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-background">
            <DashboardNav role="franchise" />
          </div>
        </aside>
        <main className="flex-1">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}