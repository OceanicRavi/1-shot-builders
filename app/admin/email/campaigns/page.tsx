"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Send, Eye, X } from "lucide-react";
import { db } from "@/lib/services/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Campaign {
  id: string;
  name: string;
  template_id: string | null;
  recipient_tags: string[];
  status: string;
  sent_at: string | null;
  created_at: string;
  template?: {
    name: string;
    subject: string;
  };
  campaign_recipients?: Array<{
    id: string;
    email_sent: boolean;
    sent_at: string | null;
    error_message: string | null;
  }>;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  tags: string[];
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignsResult, templatesResult, recipientsResult] = await Promise.all([
        db.campaigns.list(),
        db.emailTemplates.list(),
        db.recipients.list()
      ]);

      if (campaignsResult.error) throw campaignsResult.error;
      if (templatesResult.error) throw templatesResult.error;
      if (recipientsResult.error) throw recipientsResult.error;

      setCampaigns(campaignsResult.data || []);
      setTemplates(templatesResult.data || []);
      setRecipients(recipientsResult.data || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setTemplateId("");
    setSelectedTags([]);
    setNewTag("");
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const previewTemplateHandler = async (templateId: string) => {
    try {
      const { data, error } = await db.emailTemplates.getById(templateId);
      if (error) throw error;
      setPreviewTemplate(data);
      setShowPreview(true);
    } catch (error: any) {
      toast({
        title: "Error loading template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !templateId) {
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

      const campaignData = {
        name,
        template_id: templateId,
        recipient_tags: selectedTags,
        status: 'draft',
        created_by: session.user.id,
      };

      const { error } = await db.campaigns.create(campaignData);
      if (error) throw error;

      toast({
        title: "Campaign created",
        description: "Email campaign has been created successfully",
      });

      closeForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to send this campaign? This action cannot be undone.")) {
      return;
    }

    setSending(campaignId);

    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send campaign');
      }

      toast({
        title: "Campaign sent",
        description: "Email campaign has been sent successfully",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Send failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSending(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get all unique tags from recipients
  const allTags = Array.from(new Set(recipients.flatMap(r => r.tags || [])));

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
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <Button onClick={openForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns List</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No campaigns found</p>
              <Button onClick={openForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.template?.name || 'No template'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {campaign.recipient_tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.template_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewTemplateHandler(campaign.template_id!)}
                          className="mr-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => sendCampaign(campaign.id)}
                          disabled={sending === campaign.id}
                        >
                          {sending === campaign.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Monthly Newsletter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Email Template *</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {templateId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => previewTemplateHandler(templateId)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview Template
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Recipient Tags</Label>
              <div className="flex gap-2">
                <Select value={newTag} onValueChange={setNewTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Leave empty to send to all recipients
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
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
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