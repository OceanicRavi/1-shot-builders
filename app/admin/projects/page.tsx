"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search } from "lucide-react";
import { statusToLabel, statusToColor } from "@/lib/utils";
import { db } from "@/lib/services/database";
import { AddProjectDialog } from "@/components/dialogs/add-project-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { EditProjectDialog } from "@/components/dialogs/edit-project-dailog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  status: 'planning' | 'in_progress' | 'completed';
  category: string | null;
  tags: string[] | null;
  features: string[] | null;
  materials_used: string[] | null;
  budget: number | null;
  cost_breakdown: Record<string, number> | null;
  testimonial: string | null;
  rating: number | null;
  highlighted: boolean;
  show_on_website: boolean;
  start_date: string | null;
  end_date: string | null;
  franchise: { name: string } | null;
  franchise_id: string | null;
  client: { user: { full_name: string } } | null;
  client_id: string | null;
  project_manager: { full_name: string } | null;
  created_by: string | null;
  created_at: string;
  deleted_at?: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const { toast } = useToast();

  async function loadProjects() {
    try {
      const { data, error } = await db.projects.list({
        status: statusFilter,
        search: searchTerm
      });

      if (error) throw error;

      setProjects(data || []);
    } catch (error: any) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [searchTerm, statusFilter]);

  async function handleDeleteProject(projectId: string) {
    try {
      const { error } = await db.projects.update(projectId, {
        deleted_at: new Date().toISOString(),
      });
      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
      toast({ title: "Deleted", description: "Project soft-deleted." });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } finally {
      setConfirmDeleteId(null);
    }
  }

  async function handleSaveEdit(updates: Partial<Project>) {
    if (!editProject) return;
    const { error } = await db.projects.update(editProject.id, updates);
    if (!error) {
      toast({ title: "Updated", description: "Project updated successfully." });
      loadProjects();
    } else {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
    setEditProject(null);
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
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <p className="text-muted-foreground">Manage and monitor all construction projects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Franchise</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="w-[200px] whitespace-normal break-words">{project.name}</TableCell>
                    <TableCell className="w-[200px] whitespace-normal break-words">{project.address || "N/A"}</TableCell>
                    <TableCell>{project.category || "N/A"}</TableCell>
                    <TableCell>{project.franchise?.name || "N/A"}</TableCell>
                    <TableCell>{project.client?.user?.full_name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={statusToColor[project.status]}>
                        {statusToLabel[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.budget ? `NZD ${project.budget.toLocaleString()}` : "N/A"}</TableCell>
                    <TableCell>
                      {new Date(project.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditProject(project)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmDeleteId(project.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddProjectDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={loadProjects}
      />

      {confirmDeleteId && (
        <ConfirmDialog
          open={!!confirmDeleteId}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => handleDeleteProject(confirmDeleteId)}
          title="Delete Project?"
          description="This will archive the project. You can restore it from Supabase if needed."
        />
      )}

      {editProject && (
        <EditProjectDialog
          open={!!editProject}
          onOpenChange={() => setEditProject(null)}
          project={{
            ...editProject,
            franchise_id: editProject.franchise_id,
            client_id: editProject.client_id,
          }}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
