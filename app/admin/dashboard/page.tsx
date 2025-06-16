"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, FileText, Upload, ClipboardList, Settings } from "lucide-react";
import { db } from "@/lib/services/database";

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  pendingUploads: number;
  recentAudits: any[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    pendingUploads: 0,
    recentAudits: [],
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Check if user is admin
        console.log('######## dashboard Check if user is admin');
        const { data: { session }, error: sessionError } = await db.auth.getSession();
        console.log('######## dashboard session'+ JSON.stringify(session));
        if (sessionError) throw sessionError;

        if (!session?.user) {
          router.push("/auth/signin");
          return;
        }

        const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);

        if (userError) throw userError;

        if (!userData?.role || userData.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        // Load dashboard stats
        const [
          { count: userCount },
          { count: projectCount },
          { data: uploadsData },
          { data: auditData },
        ] = await Promise.all([
          db.users.list(),
          db.projects.list(),
          db.uploads.list(),
          db.audit.list({ limit: 5 })
        ]);

        // Filter pending uploads (where approved_by is null) client-side
        const pendingUploads = uploadsData?.filter(upload => !upload.approved_by)?.length || 0;

        setStats({
          totalUsers: userCount || 0,
          totalProjects: projectCount || 0,
          pendingUploads: pendingUploads,
          recentAudits: auditData || [],
        });
      } catch (error: any) {
        console.error("Error loading dashboard:", error);
        toast({
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">

        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>

      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="container my-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application settings and view analytics</p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage system users and roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-medium">{stats.totalUsers}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Projects Overview
                  </CardTitle>
                  <CardDescription>Monitor all projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Projects</span>
                      <span className="font-medium">{stats.totalProjects}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/admin/projects">View Projects</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Content Approvals
                  </CardTitle>
                  <CardDescription>Review pending uploads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pending Approvals</span>
                      <span className="font-medium">{stats.pendingUploads}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/admin/files">Review Files</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System audit logs</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentAudits.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentAudits.map((log) => (
                      <div key={log.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.target_type} - {log.target_id}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure global application settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/admin/settings">Manage Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
  );
}