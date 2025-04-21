"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, FileText, Video, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/services/database";

interface Upload {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document';
  uploaded_by: string;
  user: {
    full_name: string;
    email: string;
  };
  created_at: string;
}

export default function ContentApprovePage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadPendingUploads();
  }, []);

  const loadPendingUploads = async () => {
    try {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        router.push("/auth/signin");
        return;
      }

      // Check if user is admin
      const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);

      if (userError) throw userError;
      if (userData?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      const { data, error } = await db.uploads.list();

      if (error) throw error;
      setUploads((data || []).filter(upload => !upload.approved_by));
    } catch (error: any) {
      console.error("Error loading uploads:", error);
      toast({
        title: "Error loading content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (uploadId: string, approve: boolean) => {
    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { error } = await db.uploads.update(uploadId, {
        approved_by: approve ? session.user.id : null,
        is_public: approve
      });

      if (error) throw error;

      toast({
        title: approve ? "Content approved" : "Content rejected",
        description: approve ? "The content is now publicly visible" : "The content has been rejected",
      });

      setUploads(uploads.filter(upload => upload.id !== uploadId));
    } catch (error: any) {
      console.error("Error updating upload:", error);
      toast({
        title: "Error updating content",
        description: error.message,
        variant: "destructive",
      });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Content Approval</h1>
        <p className="text-muted-foreground">Review and approve uploaded content</p>
      </div>

      {uploads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Check className="h-12 w-12 text-primary mb-4" />
            <p className="text-lg font-medium">No pending content</p>
            <p className="text-muted-foreground">All content has been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {uploads.map((upload) => (
            <Card key={upload.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{upload.title || "Untitled Upload"}</span>
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {upload.file_type === "image" ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={upload.file_url}
                          alt={upload.title || "Upload preview"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                        {upload.file_type === "video" ? (
                          <Video className="h-12 w-12 text-muted-foreground" />
                        ) : (
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-muted-foreground">
                        {upload.description || "No description provided"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">File Type</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {upload.file_type === "image" ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : upload.file_type === "video" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span>{upload.file_type}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Uploaded By</h3>
                      <p className="text-muted-foreground">
                        {upload.user?.full_name || "Unknown"}
                        <br />
                        <span className="text-sm">{upload.user?.email}</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Upload Date</h3>
                      <p className="text-muted-foreground">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
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
    </>
  );
}