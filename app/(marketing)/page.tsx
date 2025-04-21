"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, Clock, Copy, PencilRuler, Shield, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: <Wallet className="h-8 w-8 text-primary" />,
    title: "Finance",
    description: "Expert financial planning and consultation for your project budget.",
  },
  {
    icon: <PencilRuler className="h-8 w-8 text-primary" />,
    title: "Architecture",
    description: "Custom architectural designs that bring your vision to life.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Legal",
    description: "Comprehensive legal support for permits, contracts, and compliance.",
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

const testimonials = [
  {
    quote: "1ShotBuilders transformed our outdated kitchen into a modern masterpiece, on time and within budget. The attention to detail was exceptional.",
    author: "Sarah Johnson",
    position: "Homeowner",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    quote: "Working with 1ShotBuilders for our office renovation was a seamless experience. Their team's professionalism and quality craftsmanship exceeded our expectations.",
    author: "Michael Chen",
    position: "Business Owner",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    quote: "From the initial consultation to the final walkthrough, 1ShotBuilders provided exceptional service. Our new build is exactly what we envisioned.",
    author: "Emma Williams",
    position: "Homeowner",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export default function Home() {
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
              <Button asChild size="lg" className="btn-orange">
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" className="btn-orange">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{testimonial.author}</CardTitle>
                      <CardDescription>{testimonial.position}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Why Choose 1ShotBuilders?</h2>
              <p className="text-muted-foreground mb-8">
                Our commitment to excellence sets us apart in the construction industry. 
                We believe in delivering quality results that exceed your expectations.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Expert team with years of industry experience",
                  "Transparent pricing with no hidden costs",
                  "On-time project completion guaranteed",
                  "Premium materials and superior craftsmanship",
                  "Comprehensive warranty on all our work",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Button asChild className="btn-orange">
                  <Link href="/about">More About Us</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/8961116/pexels-photo-8961116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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