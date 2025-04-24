"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type EditProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    status: "planning" | "in_progress" | "completed";
    franchise_id: string | null;
    client_id: string | null;
  };
  onSave: (updates: any) => void;
};

export function EditProjectDialog({ open, onOpenChange, project, onSave }: EditProjectDialogProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [location, setLocation] = useState(project.location || "");
  const [status, setStatus] = useState(project.status);
  const [franchiseId, setFranchiseId] = useState(project.franchise_id || "");
  const [clientId, setClientId] = useState(project.client_id || "");

  const handleSubmit = () => {
    onSave({
      name,
      description,
      location,
      status,
      franchise_id: franchiseId || null,
      client_id: clientId || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />

          <Select value={status} onValueChange={(val) => setStatus(val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Optional: add dynamic Select for client_id and franchise_id */}
          <Input value={franchiseId} onChange={(e) => setFranchiseId(e.target.value)} placeholder="Franchise ID (optional)" />
          <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Client ID (optional)" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
