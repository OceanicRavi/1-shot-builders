"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import { db } from "@/lib/services/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Recipient {
  id: string;
  name: string;
  email: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const { data, error } = await db.recipients.list();
      if (error) throw error;
      setRecipients(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading recipients",
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
    setEditingRecipient(null);
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const editRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setName(recipient.name);
    setEmail(recipient.email);
    setTags(recipient.tags || []);
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

    setSubmitting(true);

    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const recipientData = {
        name,
        email,
        tags,
        created_by: session.user.id,
        updated_at: new Date().toISOString(),
      };

      if (editingRecipient) {
        const { error } = await db.recipients.update(editingRecipient.id, recipientData);
        if (error) throw error;

        toast({
          title: "Recipient updated",
          description: "Recipient has been updated successfully",
        });
      } else {
        const { error } = await db.recipients.create(recipientData);
        if (error) throw error;

        toast({
          title: "Recipient created",
          description: "Recipient has been created successfully",
        });
      }

      
      loadRecipients();
    } catch (error: any) {
      toast({
        title: editingRecipient ? "Update failed" : "Creation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      closeForm();
    }
  };

  const handleDelete = async (recipientId: string) => {
    if (!confirm("Are you sure you want to delete this recipient?")) {
      return;
    }

    setDeleting(recipientId);

    try {
      const { error } = await db.recipients.delete(recipientId);
      if (error) throw error;

      toast({
        title: "Recipient deleted",
        description: "Recipient has been deleted",
      });

      loadRecipients();
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
        <h1 className="text-3xl font-bold">Email Recipients</h1>
        <Button onClick={openForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Recipient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recipients List</CardTitle>
        </CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No recipients found</p>
              <Button onClick={openForm}>
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
                        onClick={() => editRecipient(recipient)}
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

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRecipient ? "Edit Recipient" : "Add New Recipient"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingRecipient ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingRecipient ? "Update Recipient" : "Add Recipient"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}