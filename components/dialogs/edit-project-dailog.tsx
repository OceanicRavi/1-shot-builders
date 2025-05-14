"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  status: "planning" | "in_progress" | "completed";
  franchise_id: string | null;
  client_id: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null | undefined;
  address: string | null | undefined;
  category: string | null | undefined;
  tags: string[] | null | undefined;
  project_manager: string | null | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;
  budget: number | null | undefined;
  cost_breakdown: Record<string, number> | null | undefined;
  features: string[] | null | undefined;
  materials_used: string[] | null | undefined;
  testimonial: string | null | undefined;
  rating: number | null | undefined;
  highlighted: boolean | null | undefined;
  show_on_website: boolean | null | undefined;
  image: string;
};

type EditProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any; // Using any to resolve type conflicts
  onSave: (updates: any) => void | Promise<void>;
};

export function EditProjectDialog({ open, onOpenChange, project, onSave }: EditProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project.name || "",
    description: project.description || "",
    location: project.location || "",
    status: project.status || "planning",
    franchise_id: project.franchise_id || null,
    client_id: project.client_id || null,
    address: project.address || "",
    category: project.category || "",
    tags: project.tags || [],
    project_manager: project.project_manager || null,
    start_date: project.start_date || null,
    end_date: project.end_date || null,
    budget: project.budget || null,
    cost_breakdown: project.cost_breakdown || {},
    features: project.features || [],
    materials_used: project.materials_used || [],
    testimonial: project.testimonial || "",
    rating: project.rating || null,
    highlighted: project.highlighted || false,
    show_on_website: project.show_on_website !== false, // Default to true if null
    image: project.image || ""
  });

  // For tags and array inputs
  const [newTag, setNewTag] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newMaterial, setNewMaterial] = useState("");

  // For cost breakdown management
  const [newCostKey, setNewCostKey] = useState("");
  const [newCostValue, setNewCostValue] = useState("");

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        materials_used: [...(prev.materials_used || []), newMaterial.trim()]
      }));
      setNewMaterial("");
    }
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials_used: prev.materials_used?.filter((_, i) => i !== index) || []
    }));
  };

  const addCostItem = () => {
    if (newCostKey.trim() && newCostValue.trim()) {
      const costValue = parseFloat(newCostValue);
      if (!isNaN(costValue)) {
        setFormData(prev => ({
          ...prev,
          cost_breakdown: {
            ...(prev.cost_breakdown || {}),
            [newCostKey.trim()]: costValue
          }
        }));
        setNewCostKey("");
        setNewCostValue("");
      }
    }
  };

  const removeCostItem = (key: string) => {
    setFormData(prev => {
      const updatedCosts = { ...(prev.cost_breakdown || {}) };
      delete updatedCosts[key];
      return { ...prev, cost_breakdown: updatedCosts };
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Basic Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-medium text-lg">Basic Information</h3>
            
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name"
                value={formData.name} 
                onChange={(e) => handleInputChange("name", e.target.value)} 
                placeholder="Project name" 
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description || ""} 
                onChange={(e) => handleInputChange("description", e.target.value)} 
                placeholder="Description" 
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image"
                value={formData.image} 
                onChange={(e) => handleInputChange("image", e.target.value)} 
                placeholder="Image URL" 
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category"
                value={formData.category || ""} 
                onChange={(e) => handleInputChange("category", e.target.value)} 
                placeholder="Category" 
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-medium text-lg">Location</h3>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                value={formData.location || ""} 
                onChange={(e) => handleInputChange("location", e.target.value)} 
                placeholder="Location" 
              />
            </div>

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea 
                id="address"
                value={formData.address || ""} 
                onChange={(e) => handleInputChange("address", e.target.value)} 
                placeholder="Full address" 
              />
            </div>
          </div>

          {/* Status & Dates */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Status & Dates</h3>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || "planning"} 
                onValueChange={(val) => handleInputChange("status", val)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(new Date(formData.start_date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date ? new Date(formData.start_date) : undefined}
                    onSelect={(date) => handleInputChange("start_date", date ? format(date, "yyyy-MM-dd") : null)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(new Date(formData.end_date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date ? new Date(formData.end_date) : undefined}
                    onSelect={(date) => handleInputChange("end_date", date ? format(date, "yyyy-MM-dd") : null)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* References */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">References</h3>
            
            <div>
              <Label htmlFor="franchise_id">Franchise ID</Label>
              <Input 
                id="franchise_id"
                value={formData.franchise_id || ""} 
                onChange={(e) => handleInputChange("franchise_id", e.target.value)} 
                placeholder="Franchise ID" 
              />
            </div>

            <div>
              <Label htmlFor="client_id">Client ID</Label>
              <Input 
                id="client_id"
                value={formData.client_id || ""} 
                onChange={(e) => handleInputChange("client_id", e.target.value)} 
                placeholder="Client ID" 
              />
            </div>

            <div>
              <Label htmlFor="project_manager">Project Manager ID</Label>
              <Input 
                id="project_manager"
                value={formData.project_manager || ""} 
                onChange={(e) => handleInputChange("project_manager", e.target.value)} 
                placeholder="Project Manager ID" 
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-medium text-lg">Financial Information</h3>
            
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input 
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget || ""} 
                onChange={(e) => handleInputChange("budget", parseFloat(e.target.value) || null)} 
                placeholder="Budget" 
              />
            </div>

            <div className="space-y-2">
              <Label>Cost Breakdown</Label>
              <div className="flex space-x-2">
                <Input 
                  value={newCostKey} 
                  onChange={(e) => setNewCostKey(e.target.value)} 
                  placeholder="Item name" 
                  className="flex-1"
                />
                <Input 
                  type="number" 
                  step="0.01"
                  value={newCostValue} 
                  onChange={(e) => setNewCostValue(e.target.value)} 
                  placeholder="Cost" 
                  className="w-24 md:w-32"
                />
                <Button type="button" onClick={addCostItem} size="sm">Add</Button>
              </div>
              <div className="space-y-1 mt-2">
                {formData.cost_breakdown && Object.entries(formData.cost_breakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span>{key}</span>
                    <div className="flex items-center space-x-2">
                      <span>${typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => removeCostItem(key)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags, Features & Materials */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-medium text-lg">Tags & Features</h3>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                  placeholder="Add tag" 
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex space-x-2">
                <Input 
                  value={newFeature} 
                  onChange={(e) => setNewFeature(e.target.value)} 
                  placeholder="Add feature" 
                  className="flex-1"
                />
                <Button type="button" onClick={addFeature} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Materials Used</Label>
              <div className="flex space-x-2">
                <Input 
                  value={newMaterial} 
                  onChange={(e) => setNewMaterial(e.target.value)} 
                  placeholder="Add material" 
                  className="flex-1"
                />
                <Button type="button" onClick={addMaterial} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.materials_used?.map((material, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {material}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeMaterial(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial & Rating */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-medium text-lg">Testimonial & Rating</h3>
            
            <div>
              <Label htmlFor="testimonial">Testimonial</Label>
              <Textarea 
                id="testimonial"
                value={formData.testimonial || ""} 
                onChange={(e) => handleInputChange("testimonial", e.target.value)} 
                placeholder="Client testimonial" 
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input 
                id="rating"
                type="number" 
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ""} 
                onChange={(e) => handleInputChange("rating", parseFloat(e.target.value) || null)} 
                placeholder="Rating" 
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-medium text-lg">Display Options</h3>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="highlighted"
                checked={formData.highlighted || false} 
                onCheckedChange={(checked) => handleInputChange("highlighted", checked)} 
              />
              <Label htmlFor="highlighted">Highlight this project</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="show_on_website"
                checked={formData.show_on_website !== false} 
                onCheckedChange={(checked) => handleInputChange("show_on_website", checked)} 
              />
              <Label htmlFor="show_on_website">Show on website</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}