"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ChevronDown, ChevronUp, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { useState } from "react";

export default function ContactPage() {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "I've never built before. Where do I start?",
      answer: "You're not alone — most of our clients are first-time builders or renovators. We'll guide you from the beginning: understanding your needs, working with designers, managing council consents, and creating a clear plan before any work begins. We believe in upfront advice, realistic budgeting, and honest expectations."
    },
    {
      question: "How much will it cost to build or renovate?",
      answer: "Cost depends on your design, site conditions, and level of finish. After an initial consultation, we'll give you a ballpark range and then work with you to refine the scope and materials to suit your budget. We're transparent from day one — no hidden surprises halfway through the project."
    },
    {
      question: "How long will the build take?",
      answer: "We'll give you a realistic timeline — not just what sounds good. We'll also explain the things that can cause delays (e.g. weather, material supply, consent wait times), and how we manage them."
    },
    {
      question: "Can I live in the house during renovation?",
      answer: "In some cases — yes. If the work is limited to one part of the house and safety can be maintained, we'll work in stages to minimise disruption. For larger or full-house renovations, it's usually best to move out temporarily. We'll assess this upfront and help you plan accordingly."
    },
    {
      question: "I'm still waiting on plans — can we talk before they're finalised?",
      answer: "Definitely. In fact, we prefer to be involved before the plans are finalised. We can give you feedback to ensure the design is buildable, practical, and within your budget. We've saved many clients from unnecessary rework and overspending by reviewing early concepts."
    },
    {
      question: "What if I want to change something during the build?",
      answer: "Changes are common. We have a variation process in place — every change is priced and approved by you in writing before we proceed. This keeps everything clear, with no unexpected costs at the end."
    },
    {
      question: "Will I be kept updated during the build?",
      answer: "Yes — communication is key. We provide regular updates (weekly or as agreed), send progress photos, and hold on-site meetings when needed. You'll always know what stage we're at and what's coming next."
    },
    {
      question: "Who's actually doing the work?",
      answer: "Our core team is led by licensed builders, and we work with reliable subcontractors we've built long-term relationships with. Each site is overseen by a site manager, and either Prashant or Mayur (our directors) stays personally involved in every project. You're not passed around — we stay connected."
    },
    {
      question: "What kind of projects do you specialise in?",
      answer: "We focus on: Residential new builds (including complex sites); High-end renovations and extensions; Recladding and leaky home repairs; Commercial work; Kainga Ora Contracts."
    },
    {
      question: "Do you offer fixed pricing?",
      answer: "Yes. Once plans, engineering, and specs are finalised, we provide a detailed fixed-price contract. If you're still at concept stage, we can start with a preliminary estimate to help with planning."
    },
    {
      question: "Can you take over a half-done job or a failed builder's work?",
      answer: "We can — but we'll need to assess the existing work carefully. We've helped clients in this situation before, and we approach it with empathy and caution. We'll let you know what's salvageable and what needs to be redone properly."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Contact us"
            fill
            quality={100}
            priority
            className="object-cover brightness-[0.4]"
          />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="flex flex-col max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Contact Us
            </h1>
            <p className="text-xl text-white/90">
              Get in touch with our team to discuss your project or request a quote.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Have a question about our services or want to discuss your project?
                Fill out the form below and one of our experts will get back to you shortly.
              </p>

              <ContactForm />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-base">Our Address</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <address className="text-muted-foreground">
                      20 Keats Place, Blockhouse Bay, Auckland<br /><br />
                      56 Waiuta St, Tītahi Bay, Porirua, Wellington
                    </address>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-base">Phone</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground">
                      Contact <b>Mayur</b> on <a href="tel:+64220429642" className="hover:text-primary">(+64) 022-042-9642</a>
                    </div>
                    <div className="text-muted-foreground">
                      Contact <b>Prashant</b> on <a href="tel:+64277771483" className="hover:text-primary">(+64) 027-777-1483</a>
                    </div>
                    <div className="text-muted-foreground">
                      Contact <b>Sunil</b> on <a href="tel:+640211061122" className="hover:text-primary">(+64) 021-106-1122</a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-base">Email</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      <a href="mailto:we@1shotbuilders.co.nz" className="hover:text-primary">we@1shotbuilders.co.nz</a>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-base">Business Hours</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Our Locations</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Auckland (Headquarters)</li>
                  <li>Wellington</li>
                </ul>

                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href="/franchise/apply">Become a Franchise</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Find Us</h2>
          <div className="aspect-video rounded-lg overflow-hidden max-w-5xl mx-auto">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.88417286835!2d174.69450217565088!3d-36.917033672213975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d46a92e5a45cf%3A0xdff320a4dbaddfc4!2s20%20Keats%20Place%2C%20Blockhouse%20Bay%2C%20Auckland%200600!5e0!3m2!1sen!2snz!4v1745149851380!5m2!1sen!2snz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h2>

          <div className="max-w-4xl mx-auto space-y-3">
            {faqData.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
                  >
                    <CardTitle className="text-lg pr-4">{item.question}</CardTitle>
                    <div className="flex-shrink-0">
                      {expandedItems[index] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                </CardHeader>

                {expandedItems[index] && (
                  <CardContent>
                    <p className="text-muted-foreground border-t border-gray-100 pt-4">{item.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Schedule a consultation with our team to discuss your project needs.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="#consultation">Book a Consultation</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}