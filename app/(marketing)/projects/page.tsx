"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProjectDetailsModal } from "@/components/project-details-modal";

const projects = [
  {
    id: 1,
    title: "Modern Home Renovation",
    description: "Complete renovation of a 1970s home with modern finishes and open concept design. The project included a full kitchen remodel, bathroom updates, and creating an open-plan living area. Energy-efficient appliances and sustainable materials were used throughout.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "renovations",
    status: "completed",
    location: "Auckland",
    tags: ["Kitchen", "Bathroom", "Residential"]
  },
  {
    id: 2,
    title: "Coastal Luxury Home",
    description: "Custom-built luxury home with ocean views and sustainable design features. This beachfront property features floor-to-ceiling windows, a gourmet kitchen, and an infinity pool. Smart home technology and solar panels were integrated into the design.",
    image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "new-builds",
    status: "completed",
    location: "Tauranga",
    tags: ["Luxury", "Residential", "New Build"]
  },
  {
    id: 3,
    title: "Commercial Office Renovation",
    description: "Modern office space renovation with flexible workspaces and collaborative areas. The project transformed an outdated office into a contemporary workspace with breakout areas, meeting rooms, and a staff café.",
    image: "https://images.pexels.com/photos/1743555/pexels-photo-1743555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "renovations",
    status: "completed",
    location: "Wellington",
    tags: ["Commercial", "Office", "Renovation"]
  },
  {
    id: 4,
    title: "Contemporary Apartment Complex",
    description: "Multi-unit residential complex with modern amenities and urban design. This development includes 24 luxury apartments, underground parking, a fitness center, and a rooftop garden.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "new-builds",
    status: "in_progress",
    location: "Christchurch",
    tags: ["Multi-Family", "Residential", "New Build"]
  },
  {
    id: 5,
    title: "Historic Home Restoration",
    description: "Careful restoration of a heritage home while adding modern conveniences. This project involved preserving original features while updating the electrical, plumbing, and HVAC systems to modern standards.",
    image: "https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "renovations",
    status: "completed",
    location: "Dunedin",
    tags: ["Historical", "Residential", "Renovation"]
  },
  {
    id: 6,
    title: "Mountain Retreat",
    description: "Custom holiday home with natural materials and panoramic mountain views. This luxury retreat features exposed timber beams, stone fireplaces, and large windows to capture the stunning landscape.",
    image: "https://images.pexels.com/photos/2480608/pexels-photo-2480608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "new-builds",
    status: "in_progress",
    location: "Queenstown",
    tags: ["Residential", "New Build", "Luxury"]
  },
  {
    id: 7,
    title: "Retail Store Remodel",
    description: "Modern retail space with custom display solutions and improved customer flow. The renovation included new lighting, flooring, and a contemporary storefront design.",
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "renovations",
    status: "in_progress",
    location: "Auckland",
    tags: ["Commercial", "Retail", "Renovation"]
  },
  {
    id: 8,
    title: "Eco-Friendly Family Home",
    description: "Sustainable home with solar power, rainwater harvesting, and passive design. This environmentally conscious build maximizes natural light and ventilation while minimizing energy consumption.",
    image: "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "new-builds",
    status: "planning",
    location: "Hamilton",
    tags: ["Residential", "Eco-Friendly", "New Build"]
  },
  {
    id: 9,
    title: "Kitchen Transformation",
    description: "Complete kitchen remodel with custom cabinetry and premium appliances. The renovation created an open-concept kitchen with a large island, wine storage, and professional-grade appliances.",
    image: "https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "renovations",
    status: "completed",
    location: "Wellington",
    tags: ["Kitchen", "Residential", "Renovation"]
  },
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const filterProjects = (category: string, status: string) => {
    let filtered = [...projects];
    
    if (category !== "all") {
      filtered = filtered.filter(project => project.category === category);
    }
    
    if (status !== "all") {
      filtered = filtered.filter(project => project.status === status);
    }
    
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
              Explore our portfolio of completed and ongoing construction and renovation projects.
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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className={`${statusColors[project.status as keyof typeof statusColors]}`}>
            {statusText[project.status as keyof typeof statusText]}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <div className="text-sm text-muted-foreground">{project.location}</div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}