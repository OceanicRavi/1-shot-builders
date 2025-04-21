"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/services/database";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  experience: z.string().min(10, "Please provide more details about your experience").max(500, "Experience description too long"),
  reason: z.string().min(10, "Please provide more details about why you want to join").max(500, "Reason too long"),
});

export default function FranchiseApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      experience: "",
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {

      const { error } = await db.franchise_applications.create({
        applicant_name: values.name,
        email: values.email,
        phone: values.phone,
        reason: values.reason ?? null, // optional
      });
      
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      });
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast({
        title: "Error submitting application",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/6941883/pexels-photo-6941883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Franchise opportunity"
            fill
            quality={100}
            priority
            className="object-cover brightness-[0.4]"
          />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="flex flex-col max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Franchise Opportunities
            </h1>
            <p className="text-xl text-white/90">
              Join the 1ShotBuilders network and build a successful business with our proven model.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Why Join 1ShotBuilders?</h2>
              <p className="text-muted-foreground mb-6">
                Becoming a 1ShotBuilders franchise owner gives you the opportunity to run your own construction and renovation business with the support of an established brand and proven systems.
              </p>
              
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Recognition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Leverage our established brand reputation and marketing to attract clients in your territory.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Proven Systems</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access our tried and tested business systems, from client acquisition to project management.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Comprehensive Training</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Receive thorough initial training and ongoing support to ensure your success.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Exclusive Territory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Secure exclusive rights to a protected territory, ensuring you don't compete with other franchisees.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold">The Ideal Franchise Partner</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Industry experience in construction, renovation, or project management</li>
                  <li>Strong business acumen and entrepreneurial mindset</li>
                  <li>Commitment to quality craftsmanship and customer service</li>
                  <li>Financial capacity to invest in the franchise</li>
                  <li>Passion for the construction industry</li>
                </ul>
              </div>
            </div>
            
            <div>
              {submitted ? (
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-primary">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">Application Submitted!</h3>
                    <p className="text-muted-foreground">
                      Thank you for your interest in becoming a 1ShotBuilders franchise owner. Our team will review your application and contact you within 3-5 business days.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Apply for a Franchise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="(09) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Location/Region</FormLabel>
                              <FormControl>
                                <Input placeholder="Auckland, Wellington, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Construction/Business Experience</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about your experience in construction, renovation, or business ownership..." 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Please describe your relevant experience in the industry.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why do you want to join 1ShotBuilders?</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Share your motivation for applying..." 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-muted">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Franchise FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {[
              {
                question: "What is the initial investment?",
                answer: "The initial franchise investment ranges from $75,000 to $150,000 NZD, depending on your location and market size. This includes the franchise fee, initial training, and start-up equipment."
              },
              {
                question: "Do I need construction experience?",
                answer: "While construction experience is beneficial, it's not mandatory. We're looking for business-minded individuals with leadership skills. Our training program will help fill knowledge gaps."
              },
              {
                question: "What territories are available?",
                answer: "We currently have territories available across New Zealand, with a focus on growing regional centers. Contact us to discuss specific locations."
              },
              {
                question: "What ongoing support is provided?",
                answer: "Franchisees receive continuous support including marketing assistance, technical training, business coaching, and access to our proprietary project management system."
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-left">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}