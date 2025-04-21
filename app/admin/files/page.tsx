"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check, X } from "lucide-react";
import { db } from "@/lib/services/database";
import { UploadFileDialog } from "@/components/dialogs/upload-file-dialog";

interface FileUpload {
  id: string;
  project_id: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  is_public: boolean;
  approved_by: string | null;
  projects?: {
    name: string;
  };
  users?: {
    email: string;
  };
}

export default function AdminFilesPage() {
  const [pendingUploads, setPendingUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function loadPendingUploads() {
    try {
      const { data: uploads, error } = await db.uploads.list();

      if (error) throw error;
      setPendingUploads(uploads?.filter(upload => !upload.approved_by) || []);
    } catch (error: any) {
      console.error('Error loading uploads:', error);
      toast({
        title: "Error loading uploads",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingUploads();
  }, []);

  async function handleApproval(uploadId: string, approve: boolean) {
    try {
      const { data: { session } } = await db.auth.getSession();
      
      const { error } = await db.uploads.update(uploadId, {
        approved_by: approve ? session?.user?.id : null,
        is_public: approve
      });

      if (error) throw error;

      toast({
        title: approve ? "File approved" : "File rejected",
        description: approve ? "The file is now publicly visible" : "The file has been rejected",
      });

      loadPendingUploads();
    } catch (error: any) {
      console.error('Error updating upload:', error);
      toast({
        title: "Error updating file",
        description: error.message,
        variant: "destructive"
      });
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Approvals</h1>
          <p className="text-muted-foreground">Review and approve project files</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {pendingUploads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No pending uploads</p>
            <p className="text-muted-foreground">All files have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingUploads.map((upload) => (
            <Card key={upload.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>File Upload for {upload.projects?.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleApproval(upload.id, false)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleApproval(upload.id, true)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded by</span>
                    <span>{upload.users?.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Upload date</span>
                    <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File type</span>
                    <span>{upload.file_type}</span>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(upload.file_url, '_blank')}
                    >
                      Preview File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UploadFileDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onSuccess={loadPendingUploads}
      />
    </>
  );
}