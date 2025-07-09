"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, PencilRuler, Building, Play, CheckCircle2 } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import TestimonialsSection from "@/components/client-testimonial";
import { db } from "@/lib/services/database";

const services = [
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "New Builds",
    description: "Turn your dream project into reality with our end-to-end new build construction services, from design to completion.",
  },
  {
    icon: <PencilRuler className="h-8 w-8 text-primary" />,
    title: "Renovations",
    description: "Breathe new life into your existing space with our tailored renovation solutions, enhancing both style and functionality.",
  },
];


const timelineSteps = [
  {
    number: "01",
    title: "Consultation",
    description: "We meet to discuss your vision, needs, and budget.",
  },
  {
    number: "02",
    title: "Design",
    description: "Our architects create detailed plans for your approval.",
  },
  {
    number: "03",
    title: "Preparation",
    description: "We secure permits, arrange materials, and prepare the site.",
  },
  {
    number: "04",
    title: "Construction",
    description: "Our expert team builds your project with precision.",
  },
  {
    number: "05",
    title: "Completion",
    description: "Final inspection, cleanup, and handover of your project.",
  },
];

interface Testimonial {
  id: number;
  author: string;
  position: string;
  quote: string;
  type: string;
  video_url?: string;
  project?: {
    name: string;
  };
  image: string;
}
export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        setTestimonialsError(null);

        const { data, error } = await db.testimonials.publiclist();
        if (error) {
          throw error;
        }

        setTestimonials(data || []);
      } catch (error: any) {
        console.error("Error loading testimonials:", error);
        setTestimonialsError(error.message || "Failed to load testimonials");
      } finally {
        setTestimonialsLoading(false);
      }
    };

    loadTestimonials();
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Modern construction"
            fill
            quality={100}
            priority
            className="object-cover brightness-[0.6]"
          />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="flex flex-col max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Building Excellence in One Shot
            </h1>
            <p className="text-xl text-white/90">
              Transforming spaces with precision craftsmanship, innovative designs, and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="btn-orange" onClick={() => {}}>
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" className="btn-orange" onClick={() => {}}>
                <Link href="/projects">View Our Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive construction and renovation services tailored to your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="mb-2">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="p-0 h-auto font-semibold">
                    <Link href={`/services#${service.title.toLowerCase()}`} className="flex items-center gap-1">
                      Learn more <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="btn-orange">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple, effective approach to deliver your project with precision.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-border -translate-x-1/2"></div>

            <div className="space-y-12 relative">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="hidden md:block w-1/2"></div>

                    <div className="flex items-center justify-center z-10 mb-4 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                      <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
                        {step.number}
                      </div>
                    </div>

                    <Card className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}>
                      <CardHeader>
                        <CardTitle>{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let our expert team bring your vision to life with precision and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-orange">
              <Link href="/projects">View Our Projects</Link>
            </Button>
            <Button asChild size="lg" className="btn-orange">
              <Link href="/franchise/apply">Apply for Franchise</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Client Testimonials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our satisfied clients about their experiences working with us.
            </p>
          </div>

          <TestimonialsSection testimonials={testimonials} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Why Choose 1ShotBuilders?</h2>
              <p className="text-muted-foreground mb-8">
                Choosing the right construction partner is crucial for your project's success. Here's why clients across New Zealand trust 1ShotBuilders:
              </p>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Registered Master Builder and Licensed Building Practitioner (LBP)</span>
                    <p className="text-muted-foreground">We are proud to be a Registered Master Builder and Licensed Building Practitioner (LBP), ensuring the highest standards of quality, compliance, and professionalism in every project.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Proven Track Record</span>
                    <p className="text-muted-foreground">Over a decade of successful projects and satisfied clients.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Comprehensive Services</span>
                    <p className="text-muted-foreground">End-to-end solutions from design to completion.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Expert Team</span>
                    <p className="text-muted-foreground">Skilled professionals with specialized expertise.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Quality Guarantee</span>
                    <p className="text-muted-foreground">We stand behind our work with comprehensive warranties.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Transparent Process</span>
                    <p className="text-muted-foreground">Clear communication and no surprises from start to finish.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Insured and Covered</span>
                    <p className="text-muted-foreground">Backed by Professional Indemnity and Public Liability Insurance for your peace of mind.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/11429199/pexels-photo-11429199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Construction team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}