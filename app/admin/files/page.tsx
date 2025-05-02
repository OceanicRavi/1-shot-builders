"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check, X, Pencil, Globe } from "lucide-react";
import { db } from "@/lib/services/database";
import { UploadFileDialog } from "@/components/dialogs/upload-file-dialog";
import { Switch } from "@/components/ui/switch";

interface FileUpload {
  id: string;
  project_id: string;
  file_url: string;
  file_type: "image" | "video" | "document";
  uploaded_by: string;
  created_at: string;
  is_public: boolean;
  approved_by: string | null;
  projects?: { name: string };
  users?: { email: string };
}

export default function AdminFilesPage() {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function loadUploads() {
    try {
      const { data, error } = await db.uploads.list();
      if (error) throw error;
      setUploads(data || []);
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

  async function updateFile(id: string, update: Partial<FileUpload>) {
    try {
      if (
        update.file_type &&
        !["image", "video", "document"].includes(update.file_type)
      ) {
        throw new Error("Invalid file_type");
      }

      const { error } = await db.uploads.update(id, update);
      if (error) throw error;

      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...update } : u))
      );
    } catch (error: any) {
      toast({
        title: "Error updating file",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    loadUploads();
  }, []);

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
          <h1 className="text-2xl font-bold">File Approvals</h1>
          <p className="text-muted-foreground text-sm">
            Review, approve, and manage uploaded files
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      <div className="grid gap-4">
        {uploads.map((upload) => (
          <Card key={upload.id} className="p-2">
            <div className="flex justify-between items-start px-4 pt-3">
              <div className="space-y-1">
                <h3 className="font-semibold">{upload.projects?.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {upload.users?.email} •{" "}
                  {new Date(upload.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm mt-1 font-medium break-all">
                  {upload.file_url.split("/").pop()}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(upload.file_url, "_blank")}
                >
                  Preview
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    promptEdit(upload.id, upload.file_url, upload.file_type)
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 pb-3 text-sm">
              <div className="flex items-center">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Check className="w-4 h-4" />
                  Approved : 
                </span>
                <Switch
                  checked={!!upload.approved_by}
                  onCheckedChange={(checked) =>
                    updateFile(upload.id, {
                      approved_by: checked ? "approved" : null,
                    })
                  }
                />
              </div>

              <div className="flex items-center">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  Public : 
                </span>
                <Switch
                  checked={upload.is_public}
                  onCheckedChange={(checked) =>
                    updateFile(upload.id, { is_public: checked })
                  }
                />
              </div>

              <div className="flex items-center">
                <span className="text-muted-foreground">Type : </span>
                <span>{upload.file_type}</span>
              </div>

              <div className="flex items-center">
                <span className="text-muted-foreground">Status : </span>
                <span>
                  {upload.approved_by ? "Approved" : "Rejected"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <UploadFileDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onSuccess={loadUploads}
      />
    </>
  );

  function promptEdit(id: string, url: string, type: string) {
    const newUrl = prompt("Enter new file URL:", url);
    if (!newUrl) return;

    const newType = prompt("Enter new file type (image/video/document):", type);
    if (!newType) return;

    updateFile(id, {
      file_url: newUrl,
      file_type: newType as FileUpload["file_type"],
    });
  }
}
