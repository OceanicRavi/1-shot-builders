import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";

export default function ContactPage() {
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
                    <p className="text-muted-foreground">
                      20 Keats Place<br />
                      Blockhouse Bay<br />
                      Auckland, New Zealand
                    </p>
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
                    <p className="text-muted-foreground">
                      <a href="tel:+64220429642" className="hover:text-primary">(+64) 022-042-9642</a>
                    </p>
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
                  <li>Christchurch</li>
                  <li>Hamilton</li>
                  <li>Tauranga</li>
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
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.88417286835!2d174.69450217565088!3d-36.917033672213975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d46a92e5a45cf%3A0xdff320a4dbaddfc4!2s20%20Keats%20Place%2C%20Blockhouse%20Bay%2C%20Auckland%200600!5e0!3m2!1sen!2snz!4v1745149851380!5m2!1sen!2snz" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What areas do you service?",
                answer: "We currently service Auckland, Wellington, Christchurch, Hamilton, and Tauranga. Our franchise network is expanding to cover more regions across New Zealand."
              },
              {
                question: "How much does a typical renovation cost?",
                answer: "Renovation costs vary widely depending on the scope, materials, and specific requirements. We provide detailed quotes after an initial consultation to assess your needs."
              },
              {
                question: "Do you handle all permits and regulatory approvals?",
                answer: "Yes, we manage all necessary permits, consents, and regulatory approvals as part of our comprehensive service package."
              },
              {
                question: "How long does a typical project take?",
                answer: "Project timelines depend on size and complexity. A bathroom renovation might take 2-4 weeks, while a full home renovation could take 3-6 months. We provide detailed timelines during consultation."
              },
              {
                question: "Do you offer warranties on your work?",
                answer: "Yes, all our projects come with a comprehensive warranty. We stand behind our workmanship and use quality materials that come with manufacturer warranties."
              },
              {
                question: "Can I see examples of your previous work?",
                answer: "Absolutely! You can view our project portfolio on our website or request specific examples during consultation. We're proud of our track record and happy to share references."
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
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