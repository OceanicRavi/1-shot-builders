import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Home, PencilRuler, Scale, Wallet } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/8961116/pexels-photo-8961116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Construction services"
            fill
            quality={100}
            priority
            className="object-cover brightness-[0.4]"
          />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="flex flex-col max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Our Services
            </h1>
            <p className="text-xl text-white/90">
              Comprehensive construction and renovation solutions tailored to your specific needs.
            </p>
          </div>
        </div>
      </section>
      
      {/* Services Tabs */}
      <section className="py-20">
        <div className="container">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-3 h-auto p-1">
                <TabsTrigger value="all" className="py-2 px-4">All Services</TabsTrigger>
                <TabsTrigger value="renovations" className="py-2 px-4">Renovations</TabsTrigger>
                <TabsTrigger value="new-builds" className="py-2 px-4">New Builds</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-16 pt-4">
              {/* Finance Services */}
{/*               <div id="finance" className="scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/6693648/pexels-photo-6693648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Finance services"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="mb-4">
                      <Wallet className="h-10 w-10 text-primary mb-2" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Finance Services</h2>
                    <p className="text-muted-foreground mb-6">
                      Our expert financial team works with you to develop a clear, comprehensive budget for your project. 
                      We offer flexible financing options and transparent cost structures to ensure your project stays on budget.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <BarChart className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Detailed cost analysis and budgeting</span>
                      </li>
                      <li className="flex items-start">
                        <BarChart className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Financing options and partnerships</span>
                      </li>
                      <li className="flex items-start">
                        <BarChart className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>ROI projections for your investment</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </div>
                </div>
              </div> */}
              
              {/* Architecture Services */}
{/*               <div id="architecture" className="scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <div className="mb-4">
                      <PencilRuler className="h-10 w-10 text-primary mb-2" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Architecture Services</h2>
                    <p className="text-muted-foreground mb-6">
                      Our talented architects blend innovation with practicality to create designs that inspire.
                      We work closely with you to understand your vision and translate it into detailed plans that balance aesthetics with functionality.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <PencilRuler className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Custom architectural designs</span>
                      </li>
                      <li className="flex items-start">
                        <PencilRuler className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>3D modeling and visualization</span>
                      </li>
                      <li className="flex items-start">
                        <PencilRuler className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Sustainable and eco-friendly designs</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden order-1 md:order-2">
                    <Image
                      src="https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Architecture services"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div> */}
              
              {/* Legal Services */}
{/*               <div id="legal" className="scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Legal services"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="mb-4">
                      <Scale className="h-10 w-10 text-primary mb-2" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Legal Services</h2>
                    <p className="text-muted-foreground mb-6">
                      Our legal experts navigate the complex regulatory landscape of construction to ensure your project complies with all local codes and regulations. 
                      We handle all necessary permits and legal documentation for a smooth build process.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Building permits and regulatory compliance</span>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Contract drafting and review</span>
                      </li>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Zoning and land use consultation</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </div>
                </div>
              </div> */}
              
              {/* Renovation Services */}
              <div id="renovation" className="scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <div className="mb-4">
                      <PencilRuler className="h-10 w-10 text-primary mb-2" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Renovation Services</h2>
                    <p className="text-muted-foreground mb-6">
                      Transform your existing space with our comprehensive renovation services. Whether it's a kitchen update, bathroom renovation, or a complete home makeover, 
                      our expert team delivers stunning results that breathe new life into your space.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Home className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Kitchen and bathroom renovations</span>
                      </li>
                      <li className="flex items-start">
                        <Home className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Home extensions and additions</span>
                      </li>
                      <li className="flex items-start">
                        <Home className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Interior and exterior remodeling</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden order-1 md:order-2">
                    <Image
                      src="https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Renovation services"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* New Builds Services */}
              <div id="new-builds" className="scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="New builds services"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="mb-4">
                      <Home className="h-10 w-10 text-primary mb-2" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">New Builds</h2>
                    <p className="text-muted-foreground mb-6">
                      From concept to completion, we build your dream home or commercial building from the ground up. 
                      Our comprehensive approach ensures a seamless process, delivering a high-quality result that exceeds your expectations.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Home className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Custom residential homes</span>
                      </li>
                      <li className="flex items-start">
                        <Home className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Commercial buildings and offices</span>
                      </li>
                      <li className="flex items-start">
                        <Home className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Sustainable and energy-efficient construction</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="renovations" className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Kitchen Renovations",
                    description: "Transform your kitchen into a functional, beautiful space with custom cabinetry, premium countertops, and modern appliances.",
                    image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Bathroom Renovations",
                    description: "Create a spa-like retreat with luxury fixtures, custom tilework, and efficient layouts that maximize your space.",
                    image: "https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Home Extensions",
                    description: "Add valuable living space to your home with seamlessly integrated extensions that blend with your existing structure.",
                    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Interior Remodeling",
                    description: "Revitalize your interior spaces with open floor plans, updated finishes, and custom features that reflect your style.",
                    image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Exterior Renovations",
                    description: "Enhance curb appeal and protect your investment with exterior updates including siding, roofing, and landscape design.",
                    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Commercial Renovations",
                    description: "Update your business space to improve functionality, reflect your brand, and create a better experience for customers and employees.",
                    image: "https://images.pexels.com/photos/3759089/pexels-photo-3759089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                ].map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{service.description}</CardDescription>
                      <Button asChild className="mt-4" variant="outline">
                        <Link href="/contact">Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new-builds" className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Custom Homes",
                    description: "Build your dream home from the ground up with personalized designs that reflect your lifestyle and preferences.",
                    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Eco-Friendly Builds",
                    description: "Sustainable construction with energy-efficient features, renewable materials, and environmentally conscious practices.",
                    image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Modern Designs",
                    description: "Contemporary architectural designs featuring open spaces, large windows, and clean lines for a sleek, minimalist aesthetic.",
                    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Commercial Buildings",
                    description: "Functional, attractive commercial spaces designed for your business needs, from retail storefronts to office complexes.",
                    image: "https://images.pexels.com/photos/273209/pexels-photo-273209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Multi-Family Residences",
                    description: "Quality apartment buildings and townhomes designed for community living with shared amenities and private spaces.",
                    image: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  },
                  {
                    title: "Luxury Estates",
                    description: "High-end custom homes with premium finishes, smart home technology, and luxury amenities for discerning clients.",
                    image: "https://images.pexels.com/photos/32870/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                ].map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{service.description}</CardDescription>
                      <Button asChild className="mt-4" variant="outline">
                        <Link href="/contact">Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact us today for a consultation and let our experts bring your vision to life.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}