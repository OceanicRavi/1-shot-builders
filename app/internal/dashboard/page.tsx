"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, Upload, ClipboardList, BarChart } from "lucide-react";
import { db } from "@/lib/services/database";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface DashboardStats {
  activeProjects?: number;
  pendingUploads?: number;
  recentActivity?: any[];
}

export default function InternalDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({});
  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          { count: projectCount },
          { data: uploadsData },
          { data: activityData }
        ] = await Promise.all([
          db.projects.list(),
          db.uploads.list(),
          db.audit.list({ limit: 5 })
        ]);

        setStats({
          activeProjects: projectCount || 0,
          pendingUploads: uploadsData?.filter(upload => !upload.approved_by).length || 0,
          recentActivity: activityData || []
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
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Internal Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage construction projects</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Project Management
                </CardTitle>
                <CardDescription>Monitor active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Projects</span>
                    <span className="font-medium">{stats.activeProjects}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/internal/projects">View Projects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Content Management
                </CardTitle>
                <CardDescription>Review and approve content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pending Approvals</span>
                    <span className="font-medium">{stats.pendingUploads}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/internal/content">Manage Content</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Reports
                </CardTitle>
                <CardDescription>View project analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/internal/reports">View Reports</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.target_type} - {activity.target_id}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
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
      </Tabs>
    </>
  );
}