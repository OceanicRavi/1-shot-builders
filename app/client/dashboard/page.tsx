"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, FolderOpen, ClipboardList } from "lucide-react";
import { db } from "@/lib/services/database";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface DashboardStats {
  totalProjects?: number;
  activeProjects?: number;
  recentFiles?: any[];
}

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({});
  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          { count: projectCount },
          { data: activeProjectsData },
          { data: filesData }
        ] = await Promise.all([
          db.projects.list(),
          db.projects.list({ status: "in_progress" }),
          db.uploads.list()
        ]);

        setStats({
          totalProjects: projectCount || 0,
          activeProjects: activeProjectsData?.length || 0,
          recentFiles: filesData?.slice(0, 5) || []
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
        <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
        <p className="text-muted-foreground">View and manage your construction projects</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Recent Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Projects Overview
                </CardTitle>
                <CardDescription>Your construction projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Projects</span>
                    <span className="font-medium">{stats.totalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Projects</span>
                    <span className="font-medium">{stats.activeProjects}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/client/projects">View Projects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents
                </CardTitle>
                <CardDescription>Access project documents</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/client/documents">View Documents</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Files
                </CardTitle>
                <CardDescription>Manage project files</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/client/files">Manage Files</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>Latest uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentFiles && stats.recentFiles.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{file.file_type}</p>
                        <p className="text-sm text-muted-foreground">
                          Project: {file.project?.name}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={file.file_url} target="_blank">View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No recent files
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}