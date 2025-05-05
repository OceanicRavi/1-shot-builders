"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectDetailsModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const projectImages = project.images || [project.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === projectImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Project Details - {project.title}</DialogTitle>
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery */}
          <div className="relative w-full lg:w-2/3 aspect-video">
            <Image
              src={projectImages[currentImageIndex]}
              alt={project.title}
              fill
              className="object-cover"
            />
            
            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 ml-2"
                onClick={previousImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 mr-2"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {projectImages.length}
            </div>
          </div>

          {/* Project Details */}
          <div className="w-full lg:w-1/3 p-6 overflow-y-auto max-h-[600px]">
            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            <p className="text-muted-foreground mb-4">{project.location}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <Badge className={
                  project.status === "completed" ? "bg-green-100 text-green-800" :
                  project.status === "in_progress" ? "bg-amber-100 text-amber-800" :
                  "bg-blue-100 text-blue-800"
                }>
                  {project.status === "completed" ? "Completed" :
                   project.status === "in_progress" ? "In Progress" :
                   "Planning"}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Project Details</h3>
                <Card className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion</span>
                    <span>Mar 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span>{project.category === "new-builds" ? "New Build" : "Renovation"}</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}