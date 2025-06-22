"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, X, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/services/database";

interface Project {
  id: string;
  name: string;
}

interface Testimonial {
  id: string;
  project_id: string;
  author: string;
  position: string;
  quote: string;
  type: "text" | "video";
  video_url?: string;
  is_public: boolean;
  project?: {
    name: string;
  };
}

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState<"text" | "video" | "">("");
  const [quote, setQuote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Testimonials data
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const { toast } = useToast();
  const router = useRouter();

useEffect(() => {
  loadData().then(() => {
    
  });
}, []);


  const loadData = async () => {
    try {
      // Load projects
      const { data: projectsData, error: projectsError } = await db.projects.list();
      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Load testimonials
      const { data: testimonialsData, error: testimonialsError } = await db.testimonials.list();
      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonialsData || []);

    } catch (error: any) {
      console.error("Error loading data:", error);
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
    setTitle("");
    setDescription("");
    setSelectedProject("");
    setAuthor("");
    setPosition("");
    setType("");
    setQuote("");
    setVideoUrl("");
    setIsPublic(false);
    setEditingTestimonial(null);
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setSelectedProject(testimonial.project_id);
    setAuthor(testimonial.author);
    setPosition(testimonial.position);
    setType(testimonial.type);
    setQuote(testimonial.quote);
    setVideoUrl(testimonial.video_url || "");
    setIsPublic(testimonial.is_public);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project for this testimonial",
        variant: "destructive",
      });
      return;
    }

    if (!author || !position || !quote || !type) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (type === "video" && !videoUrl) {
      toast({
        title: "Missing video URL",
        description: "Please provide a video URL",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        router.push("/auth/signin");
        return;
      }

      const testimonialData = {
        project_id: selectedProject,
        author,
        position,
        quote,
        type,
        video_url: type === "video" ? videoUrl : null,
        is_public: isPublic,
      };

      if (editingTestimonial) {
        // Update existing testimonial
        const { error: dbError } = await db.testimonials.update(editingTestimonial.id, testimonialData);
        if (dbError) throw dbError;

        toast({
          title: "Update successful",
          description: "Testimonial has been updated successfully",
        });
      } else {
        // Create new testimonial
        const { error: dbError } = await db.testimonials.create(testimonialData);
        if (dbError) throw dbError;

        toast({
          title: "Submission successful",
          description: "Your testimonial has been created successfully",
        });
      }

      closeForm();
      loadData(); // Reload data to show changes

    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: editingTestimonial ? "Update failed" : "Submission failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    setDeleting(testimonialId);

    try {
      const { error } = await db.testimonials.delete(testimonialId);
      if (error) throw error;

      toast({
        title: "Deleted successfully",
        description: "Testimonial has been deleted",
      });

      loadData(); // Reload data
    } catch (error: any) {
      console.error("Delete error:", error);
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
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Testimonials</h1>
        <Button onClick={openForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author's name"
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Author's position"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={type} onValueChange={(val) => setType(val as "text" | "video")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quote */}
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote *</Label>
                  <Textarea
                    id="quote"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Testimonial quote"
                    className="min-h-[100px]"
                  />
                </div>

                {/* Video URL (optional) */}
                {type === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL *</Label>
                    <Input
                      id="videoUrl"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                )}

                {/* Public Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublic">Make Public</Label>
                  <Switch
                    id="isPublic"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={closeForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingTestimonial ? "Updating..." : "Submitting..."}
                      </>
                    ) : (
                      editingTestimonial ? "Update Testimonial" : "Submit Testimonial"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                  {testimonial.project && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Project: {testimonial.project.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {testimonial.is_public ? (
                    <Eye className="h-4 w-4 text-green-600">
                      <title>Public</title>
                    </Eye>
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400">
                      <title>Private</title>
                    </EyeOff>
                  )}
                  <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">
                    {testimonial.type}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="text-sm italic border-l-2 pl-3">
                "{testimonial.quote}"
              </blockquote>

              {testimonial.type === "video" && testimonial.video_url && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Video:</span>{" "}
                  <a
                    href={testimonial.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Video
                  </a>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editTestimonial(testimonial)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(testimonial.id)}
                  disabled={deleting === testimonial.id}
                  className="flex-1"
                >
                  {deleting === testimonial.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {testimonials.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No testimonials found</p>
            <Button onClick={openForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}