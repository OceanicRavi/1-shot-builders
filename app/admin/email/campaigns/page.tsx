"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Send, Eye, X, Trash2, Mail, Users } from "lucide-react";
import { db } from "@/lib/services/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Campaign {
  id: string;
  name: string;
  template_id: string | null;
  recipient_tags: string[];
  status: string;
  sent_at: string | null;
  created_at: string;
  from_email: string;
  from_name: string;
  template?: {
    name: string;
    subject: string;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  custom_variables: string[];
}

interface Contact {
  id: string;
  name: string;
  email: string;
  tags: string[];
  type: 'recipient' | 'sender';
  is_default?: boolean;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [fromContactId, setFromContactId] = useState("");
  const [testEmail, setTestEmail] = useState("");
  
  // Preview data
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewRecipients, setPreviewRecipients] = useState<Contact[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignsResult, templatesResult, contactsResult] = await Promise.all([
        db.campaigns.list(),
        db.emailTemplates.list(),
        db.contacts ? db.contacts.list() : { data: [], error: null } // Fallback if contacts doesn't exist yet
      ]);

      if (campaignsResult.error) throw campaignsResult.error;
      if (templatesResult.error) throw templatesResult.error;
      if (contactsResult.error) throw contactsResult.error;

      setCampaigns(campaignsResult.data || []);
      setTemplates(templatesResult.data || []);
      setContacts(contactsResult.data || []);

      // Set default from address
      const defaultSender = contactsResult.data?.find(contact => 
        contact.type === 'sender' && contact.is_default
      );
      if (defaultSender) {
        setFromContactId(defaultSender.id);
      }
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
    setTestEmail("");
    
    // Reset to default sender
    const defaultSender = contacts.find(contact => 
      contact.type === 'sender' && contact.is_default
    );
    if (defaultSender) {
      setFromContactId(defaultSender.id);
    }
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

  const getMatchingRecipients = () => {
    const recipients = contacts.filter(c => c.type === 'recipient');
    if (selectedTags.length === 0) {
      return recipients;
    }
    return recipients.filter(recipient => 
      selectedTags.some(tag => recipient.tags?.includes(tag))
    );
  };

  const previewTemplateHandler = async (templateId: string) => {
    try {
      const { data, error } = await db.emailTemplates.getById(templateId);
      if (error) throw error;
      setPreviewTemplate(data);
      setPreviewRecipients(getMatchingRecipients());
      setShowPreview(true);
    } catch (error: any) {
      toast({
        title: "Error loading template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail || !templateId || !fromContactId) {
      toast({
        title: "Missing information",
        description: "Please select a template, sender, and enter test email",
        variant: "destructive",
      });
      return;
    }

    const fromContact = contacts.find(c => c.id === fromContactId);
    if (!fromContact) {
      toast({
        title: "Invalid sender",
        description: "Selected sender not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/campaigns/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          recipientEmail: testEmail,
          fromEmail: fromContact.email,
          fromName: fromContact.name
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send test email');
      }

      toast({
        title: "Test email sent",
        description: `Test email has been sent to ${testEmail}`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Test email failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !templateId || !fromContactId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const fromContact = contacts.find(c => c.id === fromContactId);
    if (!fromContact) {
      toast({
        title: "Invalid sender",
        description: "Selected sender not found",
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
        from_email: fromContact.email,
        from_name: fromContact.name,
        created_by: session.user.id,
      };

      const { error } = await db.campaigns.create(campaignData);
      if (error) throw error;

      toast({
        title: "Campaign created",
        description: "Email campaign has been created as draft",
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

      const result = await response.json();
      
      toast({
        title: "Campaign sent",
        description: result.message || "Email campaign has been sent successfully",
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

  const handleDelete = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    setDeleting(campaignId);

    try {
      const { error } = await db.campaigns.delete(campaignId);
      if (error) throw error;

      toast({
        title: "Campaign deleted",
        description: "Campaign has been deleted",
      });

      loadData();
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

  // Get all unique tags from recipients
  const allTags = Array.from(new Set(
    contacts
      .filter(c => c.type === 'recipient')
      .flatMap(r => r.tags || [])
  ));

  const senderContacts = contacts.filter(c => c.type === 'sender');

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
                  <TableHead>From</TableHead>
                  <TableHead>Recipients</TableHead>
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
                      <div className="text-sm">
                        <p className="font-medium">{campaign.from_name}</p>
                        <p className="text-muted-foreground">{campaign.from_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{getMatchingRecipients().length}</span>
                        {campaign.recipient_tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {campaign.recipient_tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {campaign.recipient_tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{campaign.recipient_tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
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
                      <div className="flex gap-2 justify-end">
                        {campaign.template_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => previewTemplateHandler(campaign.template_id!)}
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

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(campaign.id)}
                          disabled={deleting === campaign.id}
                        >
                          {deleting === campaign.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="sender">Sender & Test</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="setup" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Monthly Newsletter - January 2025"
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
                            {template.name} - {template.subject}
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
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Target Recipients by Tags</Label>
                    <div className="flex gap-2 mt-2">
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
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedTags.length === 0 
                        ? `Will send to all ${contacts.filter(c => c.type === 'recipient').length} recipients` 
                        : `Will send to ${getMatchingRecipients().length} recipients matching selected tags`
                      }
                    </p>
                  </div>

                  {getMatchingRecipients().length > 0 && (
                    <div>
                      <Label>Preview Recipients</Label>
                      <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                        {getMatchingRecipients().slice(0, 10).map((recipient) => (
                          <div key={recipient.id} className="flex justify-between items-center py-1">
                            <span className="text-sm">{recipient.name}</span>
                            <span className="text-sm text-muted-foreground">{recipient.email}</span>
                          </div>
                        ))}
                        {getMatchingRecipients().length > 10 && (
                          <p className="text-sm text-muted-foreground text-center pt-2">
                            ... and {getMatchingRecipients().length - 10} more recipients
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sender" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromContact">From Address *</Label>
                    <Select value={fromContactId} onValueChange={setFromContactId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sender address" />
                      </SelectTrigger>
                      <SelectContent>
                        {senderContacts.map((sender) => (
                          <SelectItem key={sender.id} value={sender.id}>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <div>
                                <p className="font-medium">{sender.name}</p>
                                <p className="text-sm text-muted-foreground">{sender.email}</p>
                                {sender.is_default && (
                                  <p className="text-xs text-blue-600">✓ Default</p>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {senderContacts.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No sender addresses configured. Please add one in the contacts page.
                      </p>
                    )}
                  </div>

                  {templateId && fromContactId && (
                    <div className="space-y-2">
                      <Label>Send Test Email</Label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="test@example.com"
                        />
                        <Button type="button" onClick={sendTestEmail} variant="outline">
                          Send Test
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Send a test email to verify everything looks correct before creating the campaign.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Campaign Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Recipients:</strong> {getMatchingRecipients().length} contacts</p>
                      <p><strong>From:</strong> {fromContactId ? senderContacts.find(s => s.id === fromContactId)?.name : 'Not selected'} &lt;{fromContactId ? senderContacts.find(s => s.id === fromContactId)?.email : 'Not selected'}&gt;</p>
                      <p><strong>Template:</strong> {templateId ? templates.find(t => t.id === templateId)?.name : 'Not selected'}</p>
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
                      Creating...
                    </>
                  ) : (
                    "Create Campaign"
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
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList>
              <TabsTrigger value="email">Email Preview</TabsTrigger>
              <TabsTrigger value="recipients">Recipients ({previewRecipients.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewTemplate?.body_html}
                  className="w-full h-[500px]"
                  title="Email Preview"
                />
              </div>
            </TabsContent>

            <TabsContent value="recipients">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRecipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell>{recipient.name}</TableCell>
                        <TableCell>{recipient.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {recipient.tags?.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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