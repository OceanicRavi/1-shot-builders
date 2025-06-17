"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import { db } from "@/lib/services/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  created_at: string;
  updated_at: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await db.emailTemplates.list();
      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading templates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSubject("");
    setBodyHtml("");
    setEditingTemplate(null);
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const editTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setSubject(template.subject);
    setBodyHtml(template.body_html);
    setShowForm(true);
  };

  const previewTemplateHandler = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !subject || !bodyHtml) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const templateData = {
        name,
        subject,
        body_html: bodyHtml,
        created_by: session.user.id,
        updated_at: new Date().toISOString(),
      };

      if (editingTemplate) {
        const { error } = await db.emailTemplates.update(editingTemplate.id, templateData);
        if (error) throw error;

        toast({
          title: "Template updated",
          description: "Email template has been updated successfully",
        });
      } else {
        const { error } = await db.emailTemplates.create(templateData);
        if (error) throw error;

        toast({
          title: "Template created",
          description: "Email template has been created successfully",
        });
      }

      closeForm();
      loadTemplates();
    } catch (error: any) {
      toast({
        title: editingTemplate ? "Update failed" : "Creation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    setDeleting(templateId);

    try {
      const { error } = await db.emailTemplates.delete(templateId);
      if (error) throw error;

      toast({
        title: "Template deleted",
        description: "Email template has been deleted",
      });

      loadTemplates();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const defaultTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 20px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: bold; }
    .content { padding: 40px 20px; }
    .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
    .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1ShotBuilders</div>
    </div>
    <div class="content">
      <h1>Your Email Title Here</h1>
      <p>Your email content goes here...</p>
      <a href="#" class="button">Call to Action</a>
    </div>
    <div class="footer">
      <p>1ShotBuilders | 20 Keats Place, Blockhouse Bay, Auckland, New Zealand</p>
      <p>Email: we@1shotbuilders.co.nz | Phone: (+64) 022-042-9642</p>
    </div>
  </div>
</body>
</html>`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Button onClick={openForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{template.subject}</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewTemplateHandler(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editTemplate(template)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  disabled={deleting === template.id}
                >
                  {deleting === template.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No email templates found</p>
            <Button onClick={openForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Welcome Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Welcome to 1ShotBuilders"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyHtml">HTML Content *</Label>
              <Textarea
                id="bodyHtml"
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder={defaultTemplate}
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Use HTML to create your email template. Include variables like {`{{name}}`} for personalization.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingTemplate ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingTemplate ? "Update Template" : "Create Template"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={previewTemplate?.body_html}
              className="w-full h-[500px]"
              title="Email Preview"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}