"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Users, FileText, Upload, ClipboardList, Building2, FolderOpen, Settings, Bell } from "lucide-react";
import { db } from "@/lib/services/database";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalProjects?: number;
  activeProjects?: number;
  totalClients?: number;
  pendingUploads?: number;
  recentAudits?: any[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({});
  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { session }, error: sessionError } = await db.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);
          
          if (userError) throw userError;
          
          const user = userData || { email: session.user.email, role: 'user' };
          setUser(user);

          await loadRoleSpecificData(user.role);
        }
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

    loadDashboard();
  }, [toast]);

  async function loadRoleSpecificData(role: string) {
    try {
      const stats: DashboardStats = {};

      switch (role) {
        case 'admin':
          const [
            { count: projectCount },
            { data: uploadsData },
            { data: auditData }
          ] = await Promise.all([
            db.projects.list(),
            db.uploads.list(),
            db.audit.list({ limit: 5 })
          ]);

          stats.totalProjects = projectCount || 0;
          stats.pendingUploads = uploadsData?.filter(upload => !upload.approved_by).length || 0;
          stats.recentAudits = auditData || [];
          break;

        case 'internal':
          const [
            { count: internalProjectCount },
            { data: internalUploadsData }
          ] = await Promise.all([
            db.projects.list(),
            db.uploads.list()
          ]);

          stats.activeProjects = internalProjectCount || 0;
          stats.pendingUploads = internalUploadsData?.filter(upload => !upload.approved_by).length || 0;
          break;

        case 'franchise':
          if (user?.franchise_id) {
            const { count: franchiseProjectCount } = await db.projects.list();
            stats.totalProjects = franchiseProjectCount || 0;
          }
          break;

        case 'client':
          const { count: clientProjectCount } = await db.projects.list();
          stats.totalProjects = clientProjectCount || 0;
          break;
      }

      setStats(stats);
    } catch (error) {
      console.error("Error loading role-specific data:", error);
    }
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.full_name || "User"}</p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Role-specific dashboard cards */}
            {user?.role === 'admin' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage system users and roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
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
                        <span className="font-medium">{stats.totalProjects || 0}</span>
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
                        <span className="font-medium">{stats.pendingUploads || 0}</span>
                      </div>
                      <Button asChild className="w-full">
                        <Link href="/admin/files">Review Files</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Add other role-specific cards here */}
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your recent notifications and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>You have no notifications at this time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/settings">Manage Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}