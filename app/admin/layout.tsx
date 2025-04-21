"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardNav } from "@/components/dashboard-nav";
import { db } from "@/lib/services/database";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      
      if (sessionError || !session?.user) {
        router.push("/auth/signin");
        return;
      }

      const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);

      if (userError || userData?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    }

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-background">
            <DashboardNav role="admin" />
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