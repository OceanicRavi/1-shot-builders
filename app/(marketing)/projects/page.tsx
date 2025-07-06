"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProjectDetailsModal } from "@/components/project-details-modal";
import { ChevronRight, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/services/database";

interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  status: 'planning' | 'in_progress' | 'completed';
  category: string | null;
  tags: string[] | null;
  features: string[] | null;
  materials_used: string[] | null;
  budget: number | null;
  cost_breakdown: Record<string, number> | null;
  testimonial: string | null;
  rating: number | null;
  highlighted: boolean;
  show_on_website: boolean;
  start_date: string | null;
  end_date: string | null;
  franchise: { name: string } | null;
  franchise_id: string | null;
  client: { user: { full_name: string } } | null;
  client_id: string | null;
  project_manager: { full_name: string } | null;
  created_by: string | null;
  created_at: string;
  deleted_at?: string;
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const filterProjects = (category: string, status: string) => {
    let filtered = [...projects];

    if (category !== "all") {
      filtered = filtered.filter(project => project.category === category);
    }

    if (status !== "all") {
      filtered = filtered.filter(project => project.status === status);
    }

    // Sort: highlighted projects come first
    filtered.sort((a, b) => Number(b.highlighted) - Number(a.highlighted));

    setFilteredProjects(filtered);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterProjects(value, activeStatus);
  };

  const handleStatusChange = (value: string) => {
    setActiveStatus(value);
    filterProjects(activeTab, value);
  };

  async function loadProjects() {
    try {
      const { data, error } = await db.projects.publiclist();
      if (error) {
        console.error("[loadProjects] Supabase error:", JSON.stringify({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        }, null, 2));
        throw error;
      }

      setProjects(data || []);
      //setFilteredProjects(data || []);
      //filterProjects(activeTab, activeStatus);


    } catch (error: any) {
      console.error("[loadProjects] Caught error:", JSON.stringify({
        errorType: typeof error,
        message: error?.message || null,
        name: error?.name || null,
        stack: error?.stack || null,
        raw: error
      }, null, 2));

      toast({
        title: "Error loading projects",
        description: error?.message || error?.toString() || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Load projects once on mount
  useEffect(() => {
    loadProjects();
  }, []); // Empty dependency array - runs only once

  // Filter projects when projects data or filters change
  useEffect(() => {
    filterProjects(activeTab, activeStatus);
  }, [projects, activeTab, activeStatus]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Our Projects"
            fill
            quality={100}
            priority
            className="object-cover brightness-[0.4]"
          />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="flex flex-col max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Our Projects
            </h1>
            <p className="text-xl text-white/90">
              Explore our portfolio of completed and in progress construction and renovation projects.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 h-auto p-1">
                <TabsTrigger value="all" className="py-2 px-4">All Projects</TabsTrigger>
                <TabsTrigger value="renovations" className="py-2 px-4">Renovations</TabsTrigger>
                <TabsTrigger value="new-builds" className="py-2 px-4">New Builds</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex justify-center mb-12">
              <Tabs defaultValue="all" onValueChange={handleStatusChange} className="w-full max-w-md">
                <TabsList className="grid grid-cols-3 h-auto p-1">
                  <TabsTrigger value="all" className="py-2 px-4">All</TabsTrigger>
                  <TabsTrigger value="completed" className="py-2 px-4">Completed</TabsTrigger>
                  <TabsTrigger value="in_progress" className="py-2 px-4">In Progress</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="renovations" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new-builds" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Have a Project in Mind?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact our team to discuss how we can bring your vision to life.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <SiteFooter />
    </div>
  );
}

function ProjectCard({ project, onViewDetails }: { project: any; onViewDetails: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const projectImages = Array.isArray(project.media) && project.media.length > 0
    ? (project.media.filter((item: any) => item.is_main_image).length > 0
      ? project.media
        .filter((item: any) => item.is_main_image)
        .map((item: any) => item.file_url)
      : [project.image])
    : [project.image];

  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  const statusText = {
    completed: "Completed",
    in_progress: "In Progress",
    planning: "Planning",
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-xl group bg-white 
    ${project.highlighted ? 'border-2 border-blue-500' : 'border border-slate-200 dark:border-slate-800'}
    dark:bg-slate-900`} onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={projectImages[0]}
          alt={project.name}
          fill
          className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
        <div className="absolute top-4 right-4">
          <Badge className={`${statusColors[project.status as keyof typeof statusColors]} font-medium px-3 py-1 text-sm shadow-sm`}>
            {statusText[project.status as keyof typeof statusText]}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white transform translate-z-0 tracking-wide" style={{
            textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5), 1px 1px 0 #000, -1px -1px 0 #000"
          }}>
            <span className="bg-black bg-opacity-30 px-3 py-1 rounded backdrop-blur-sm">{project.name}</span>
          </h3>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">{project.address}</span>
            {project.location && <span className="text-slate-600 dark:text-slate-400"> · <span className="text-emerald-600 dark:text-emerald-400">{project.location}</span></span>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags?.map((tag: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="default"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium group-hover:shadow-md transition-all duration-200"
          onClick={onViewDetails}
        >
          View Details
          <ChevronRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}