"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check, X, FileText, Video, Image as ImageIcon, Globe, Download, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/lib/services/database";
import { UploadFileDialog } from "@/components/dialogs/upload-file-dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileUpload {
  id: string;
  project_id: string;
  file_url: string;
  file_type: "image" | "video" | "document";
  uploaded_by: string;
  created_at: string;
  is_public: boolean;
  approved_by: string | null;
  title: string;
  description: string | null;
  original_name: string;
  projects?: { name: string };
  users?: { email: string };
}

interface GroupedUploads {
  [projectId: string]: {
    projectName: string;
    files: FileUpload[];
  };
}

export default function AdminFilesPage() {
  const [uploads, setUploads] = useState<GroupedUploads>({});
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileUpload | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };
  
  async function loadUploads() {
    try {
      const { data, error } = await db.uploads.list();
      if (error) throw error;

      // Group uploads by project
      const grouped = (data || []).reduce<GroupedUploads>((acc, upload) => {
        const projectId = upload.project_id;
        if (!acc[projectId]) {
          acc[projectId] = {
            projectName: upload.projects?.name || "Unknown Project",
            files: [],
          };
        }
        acc[projectId].files.push(upload);
        return acc;
      }, {});

      setUploads(grouped);
    } catch (error: any) {
      toast({
        title: "Error loading uploads",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUploads();
  }, []);

  async function updateFile(id: string, update: Partial<FileUpload>) {
    try {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user?.id && update.approved_by !== null) {
        throw new Error("User must be logged in to approve files");
      }

      if ('approved_by' in update) {
        update.approved_by = update.approved_by ? session?.user?.id : null;
      }

      const { error } = await db.uploads.update(id, update);
      if (error) throw error;

      // Update the local state directly instead of reloading
      setUploads(prevUploads => {
        const newUploads = { ...prevUploads };
        Object.keys(newUploads).forEach(projectId => {
          newUploads[projectId].files = newUploads[projectId].files.map(file => 
            file.id === id ? { ...file, ...update } : file
          );
        });
        return newUploads;
      });
    } catch (error: any) {
      toast({
        title: "Error updating file",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function deleteFile(file: FileUpload) {
    try {
      // Delete from storage first
      const filePath = file.file_url.split('/').pop();
      if (filePath) {
        const { error: storageError } = await db.storage
          .from('project-files')
          .remove([`${file.project_id}/${filePath}`]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await db.uploads.delete(file.id);
      if (dbError) throw dbError;

      // Update local state
      setUploads(prevUploads => {
        const newUploads = { ...prevUploads };
        Object.keys(newUploads).forEach(projectId => {
          newUploads[projectId].files = newUploads[projectId].files.filter(f => f.id !== file.id);
          // Remove project if it has no files
          if (newUploads[projectId].files.length === 0) {
            delete newUploads[projectId];
          }
        });
        return newUploads;
      });

      toast({
        title: "File deleted",
        description: "The file has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFileToDelete(null);
    }
  }

  const FileTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">File Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage and organize project files
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="grid gap-6">
      {Object.entries(uploads).map(([projectId, { projectName, files }]) => {
        const isExpanded = expandedProjects[projectId];

        return (
          <Card key={projectId}>
            <CardHeader
              onClick={() => toggleProject(projectId)}
              className="cursor-pointer flex flex-row items-center justify-between"
            >
              <div>
                <CardTitle>{projectName}</CardTitle>
                <CardDescription>
                  {files.length} file{files.length !== 1 ? "s" : ""} uploaded
                </CardDescription>
              </div>
              <div>
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
                      >
                        <div className="shrink-0">
                          <FileTypeIcon type={file.file_type} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold truncate">
                              {file.title || file.original_name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {file.file_type}
                            </Badge>
                          </div>

                          {file.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {file.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Uploaded by: {file.users?.email}</span>
                            <span>
                              {new Date(file.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Public</span>
                            <Switch
                              checked={file.is_public}
                              onCheckedChange={(checked) =>
                                updateFile(file.id, { is_public: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Approved</span>
                            <Switch
                              checked={!!file.approved_by}
                              onCheckedChange={(checked) =>
                                updateFile(file.id, {
                                  approved_by: checked ? "pending" : null,
                                })
                              }
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-500"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(file.file_url, "_blank")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setFileToDelete(file)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>

      <UploadFileDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onSuccess={loadUploads}
      />
      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => fileToDelete && deleteFile(fileToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}