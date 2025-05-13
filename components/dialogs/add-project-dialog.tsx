import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Button
} from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
  Input
} from "@/components/ui/input";
import {
  Textarea
} from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  useToast
} from "@/hooks/use-toast";
import {
  Loader2
} from "lucide-react";
import {
  db
} from "@/lib/services/database";

const formSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  address: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // will convert to array
  features: z.string().optional(), // will convert to array
  materialsUsed: z.string().optional(), // will convert to array
  budget: z.string().optional(),
  franchiseId: z.string().optional(),
  clientId: z.string().optional(),
  status: z.enum(["planning", "in_progress", "completed"]),
  highlighted: z.boolean().optional(),
  showOnWebsite: z.boolean().optional()
});

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProjectDialog({ open, onOpenChange, onSuccess }: AddProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      address: "",
      category: "",
      tags: "",
      features: "",
      materialsUsed: "",
      budget: "",
      status: "planning",
      franchiseId: "",
      clientId: "",
      highlighted: false,
      showOnWebsite: true
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { error } = await db.projects.create({
        name: values.name,
        description: values.description,
        location: values.location,
        address: values.address,
        category: values.category,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        features: values.features ? values.features.split(",").map((f) => f.trim()) : [],
        materials_used: values.materialsUsed ? values.materialsUsed.split(",").map((m) => m.trim()) : [],
        budget: values.budget ? parseFloat(values.budget) : null,
        status: values.status,
        highlighted: values.highlighted ?? false,
        show_on_website: values.showOnWebsite ?? true,
        franchise_id: values.franchiseId || null,
        client_id: values.clientId || null,
        created_by: null,
      });

      if (error) throw error;

      toast({
        title: "Project created successfully",
        description: "The new project has been added to the system.",
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {/* Project Details Section */}
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Location */}
                <FormField name="location" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Address */}
                <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Category */}
                <FormField name="category" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Budget */}
                <FormField name="budget" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (NZD)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Status */}
                <FormField name="status" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Description */}
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Metadata Fields */}
              <h3 className="text-lg font-semibold mt-4">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <FormField name="tags" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Features */}
                <FormField name="features" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma-separated)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Materials Used */}
                <FormField name="materialsUsed" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materials Used (comma-separated)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Optional IDs */}
              <h3 className="text-lg font-semibold mt-4">Associations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="franchiseId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Franchise ID</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="clientId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 mt-4">
                <FormField name="highlighted" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highlight on Homepage</FormLabel>
                    <FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />

                <FormField name="showOnWebsite" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Show on Website</FormLabel>
                    <FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  );
}
