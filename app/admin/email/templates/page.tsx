"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Eye, Copy, X } from "lucide-react";
import { db } from "@/lib/services/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  custom_variables: string[];
  category: string;
  created_at: string;
  updated_at: string;
}

const TEMPLATE_CATEGORIES = [
  'Welcome',
  'Newsletter', 
  'Promotion',
  'Notification',
  'Follow-up',
  'Survey',
  'Other'
];

const COMMON_VARIABLES = [
  'name',
  'email', 
  'first_name',
  'last_name',
  'company',
  'phone',
  'date',
  'time',
  'unsubscribe_url'
];

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
  const [category, setCategory] = useState("all");
  const [customVariables, setCustomVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState("");
  
  // Preview data
  const [previewData, setPreviewData] = useState<Record<string, string>>({});

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
    setCategory("");
    setCustomVariables([]);
    setNewVariable("");
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
    setCategory(template.category || "all");
    setCustomVariables(template.custom_variables || []);
    setShowForm(true);
  };

  const addCustomVariable = () => {
    if (newVariable.trim() && !customVariables.includes(newVariable.trim())) {
      setCustomVariables([...customVariables, newVariable.trim()]);
      setNewVariable("");
    }
  };

  const removeCustomVariable = (variable: string) => {
    setCustomVariables(customVariables.filter(v => v !== variable));
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('bodyHtml') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + `{{${variable}}}` + after;
      setBodyHtml(newText);
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  const generatePreviewHtml = (html: string, variables: string[]) => {
    let previewHtml = html;
    
    // Replace variables with preview data or placeholder
    [...COMMON_VARIABLES, ...variables].forEach(variable => {
      const value = previewData[variable] || `[${variable}]`;
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      previewHtml = previewHtml.replace(regex, value);
    });

    return previewHtml;
  };

  const previewTemplateHandler = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    // Initialize preview data with sample values
    const sampleData: Record<string, string> = {
      name: 'John Doe',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      company: 'Example Corp',
      phone: '+1 234 567 8900',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      unsubscribe_url: '#unsubscribe'
    };
    
    // Add custom variables with sample data
    template.custom_variables?.forEach(variable => {
      sampleData[variable] = `Sample ${variable}`;
    });
    
    setPreviewData(sampleData);
    setShowPreview(true);
  };

  const duplicateTemplate = async (template: EmailTemplate) => {
    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const templateData = {
        name: `${template.name} (Copy)`,
        subject: template.subject,
        body_html: template.body_html,
        custom_variables: template.custom_variables,
        category: template.category,
        created_by: session.user.id,
      };

      const { error } = await db.emailTemplates.create(templateData);
      if (error) throw error;

      toast({
        title: "Template duplicated",
        description: "Template has been duplicated successfully",
      });

      loadTemplates();
    } catch (error: any) {
      toast({
        title: "Duplication failed",
        description: error.message,
        variant: "destructive",
      });
    }
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
        custom_variables: customVariables,
        category,
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
      <h1>Hello {{name}}!</h1>
      <p>Thank you for your interest in our services.</p>
      <a href="#" class="button">Get Started</a>
    </div>
    <div class="footer">
      <p>1ShotBuilders | 20 Keats Place, Blockhouse Bay, Auckland, New Zealand</p>
      <p>Email: we@1shotbuilders.co.nz | Phone: (+64) 022-042-9642</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

// Update your filtering logic to handle "all"
const filteredTemplates = category === "all" 
  ? templates 
  : templates.filter(template => template.category === category);

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

      {/* Category Filter */}
      <div className="flex gap-4 items-center">
        <Label>Filter by category:</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {TEMPLATE_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                </div>
                {template.category && (
                  <Badge variant="outline">{template.category}</Badge>
                )}
              </div>
              
              {/* Custom Variables */}
              {template.custom_variables && template.custom_variables.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.custom_variables.slice(0, 3).map((variable, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {template.custom_variables.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.custom_variables.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
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
                  onClick={() => duplicateTemplate(template)}
                  title="Duplicate template"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editTemplate(template)}
                >
                  <Edit className="h-4 w-4" />
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

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {category ? `No templates found in "${category}" category` : "No email templates found"}
            </p>
            <Button onClick={openForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="content" className="space-y-6">
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
                      placeholder="Welcome to 1ShotBuilders, {{name}}!"
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
                    Use HTML to create your email template. Use {`{{variable_name}}`} for dynamic content.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="variables" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Available Variables</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Common Variables</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {COMMON_VARIABLES.map((variable) => (
                          <Button
                            key={variable}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable(variable)}
                            className="text-xs"
                          >
                            {`{{${variable}}}`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Custom Variables</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newVariable}
                          onChange={(e) => setNewVariable(e.target.value)}
                          placeholder="variable_name"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomVariable())}
                        />
                        <Button type="button" onClick={addCustomVariable} size="sm">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customVariables.map((variable, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => insertVariable(variable)}
                              className="text-xs"
                            >
                              {`{{${variable}}}`}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomVariable(variable)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEMPLATE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Template Information</Label>
                    <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                      <p><strong>Variables:</strong> {[...COMMON_VARIABLES, ...customVariables].length} available</p>
                      <p><strong>Category:</strong> {category || "Uncategorized"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <DialogFooter className="mt-6">
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
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="data">Sample Data</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewTemplate ? generatePreviewHtml(previewTemplate.body_html, previewTemplate.custom_variables || []) : ''}
                  className="w-full h-[500px]"
                  title="Email Preview"
                />
              </div>
            </TabsContent>

            <TabsContent value="data">
              <div className="space-y-4">
                <Label>Edit preview data to see how variables will be replaced:</Label>
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {Object.entries(previewData).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-sm">{`{{${key}}}`}</Label>
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => setPreviewData({...previewData, [key]: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}