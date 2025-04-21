"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardNav } from "@/components/dashboard-nav";
import { db } from "@/lib/services/database";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      
      if (sessionError || !session?.user) {
        router.push("/auth/signin");
        return;
      }

      const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);

      if (userError) {
        console.error("Error fetching user role:", userError);
        return;
      }

      setRole(userData?.role);
    }

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-background">
            <DashboardNav role={role} />
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