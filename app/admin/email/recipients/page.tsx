"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, X, Mail, Users, Star } from "lucide-react";
import { db } from "@/lib/services/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Contact {
  id: string;
  name: string;
  email: string;
  tags: string[];
  type: 'recipient' | 'sender';
  is_default?: boolean;
  verified?: boolean;
  created_at: string;
  updated_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recipients");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [contactType, setContactType] = useState<'recipient' | 'sender'>('recipient');
  const [isDefault, setIsDefault] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await db.contacts.list();
      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading contacts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setTags([]);
    setNewTag("");
    setContactType('recipient');
    setIsDefault(false);
    setEditingContact(null);
  };

  const openForm = (type: 'recipient' | 'sender' = 'recipient') => {
    resetForm();
    setContactType(type);
    setActiveTab(type === 'sender' ? 'senders' : 'recipients');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const editContact = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setEmail(contact.email);
    setTags(contact.tags || []);
    setContactType(contact.type);
    setIsDefault(contact.is_default || false);
    setShowForm(true);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const contactData = {
        name,
        email,
        tags,
        type: contactType,
        is_default: contactType === 'sender' ? isDefault : false,
        verified: contactType === 'sender' ? true : undefined, // Auto-verify senders for now
        created_by: session.user.id,
        updated_at: new Date().toISOString(),
      };

      if (editingContact) {
        const { error } = await db.contacts.update(editingContact.id, contactData);
        if (error) throw error;

        toast({
          title: "Contact updated",
          description: `${contactType === 'sender' ? 'Sender' : 'Recipient'} has been updated successfully`,
        });
      } else {
        const { error } = await db.contacts.create(contactData);
        if (error) throw error;

        toast({
          title: "Contact created",
          description: `${contactType === 'sender' ? 'Sender' : 'Recipient'} has been created successfully`,
        });
      }

      closeForm();
      loadContacts();
    } catch (error: any) {
      toast({
        title: editingContact ? "Update failed" : "Creation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!confirm(`Are you sure you want to delete this ${contact?.type}?`)) {
      return;
    }

    setDeleting(contactId);

    try {
      const { error } = await db.contacts.delete(contactId);
      if (error) throw error;

      toast({
        title: "Contact deleted",
        description: "Contact has been deleted",
      });

      loadContacts();
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

  const setAsDefault = async (contactId: string) => {
    try {
      const { error } = await db.contacts.update(contactId, { is_default: true });
      if (error) throw error;

      toast({
        title: "Default sender updated",
        description: "This address is now your default sender",
      });

      loadContacts();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const recipients = contacts.filter(c => c.type === 'recipient');
  const senders = contacts.filter(c => c.type === 'sender');

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
        <div>
          <h1 className="text-3xl font-bold">Email Contacts</h1>
          <p className="text-muted-foreground">Manage recipients and sender addresses</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recipients ({recipients.length})
          </TabsTrigger>
          <TabsTrigger value="senders" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Senders ({senders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Email Recipients</CardTitle>
                <Button onClick={() => openForm('recipient')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Recipient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recipients.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No recipients found</p>
                  <Button onClick={() => openForm('recipient')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Recipient
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell className="font-medium">{recipient.name}</TableCell>
                        <TableCell>{recipient.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {recipient.tags?.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(recipient.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editContact(recipient)}
                            className="mr-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(recipient.id)}
                            disabled={deleting === recipient.id}
                          >
                            {deleting === recipient.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="senders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sender Addresses</CardTitle>
                <Button onClick={() => openForm('sender')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Sender
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {senders.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No sender addresses found</p>
                  <Button onClick={() => openForm('sender')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Sender
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {senders.map((sender) => (
                      <TableRow key={sender.id}>
                        <TableCell className="font-medium">{sender.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {sender.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sender.is_default ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAsDefault(sender.id)}
                              className="text-xs"
                            >
                              Set as Default
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(sender.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editContact(sender)}
                            className="mr-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(sender.id)}
                            disabled={deleting === sender.id || sender.is_default}
                            title={sender.is_default ? "Cannot delete default sender" : "Delete sender"}
                          >
                            {deleting === sender.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingContact 
                ? `Edit ${editingContact.type === 'sender' ? 'Sender' : 'Recipient'}` 
                : `Add New ${contactType === 'sender' ? 'Sender' : 'Recipient'}`
              }
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={contactType === 'sender' ? "1ShotBuilders Team" : "John Smith"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={contactType === 'sender' ? "hello@yourcompany.com" : "john@example.com"}
              />
            </div>

            {contactType === 'recipient' && (
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {contactType === 'sender' && (
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isDefault">Set as Default Sender</Label>
                  <p className="text-sm text-muted-foreground">
                    Use this as the default sender for new campaigns
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingContact ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingContact ? `Update ${contactType === 'sender' ? 'Sender' : 'Recipient'}` : `Add ${contactType === 'sender' ? 'Sender' : 'Recipient'}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}