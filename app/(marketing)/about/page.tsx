import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, CheckCircle2, Users } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Mayur Kakadiya",
      role: "Founder & CEO",
      image: "/images/personal/mayur.jpg",
      bio: "A passionate newcomer to the construction industry, Mayur combines fresh ideas with a strong entrepreneurial spirit to lead 1ShotBuilders."
    },
    {
      name: "Prashant Dholakiya",
      role: "Founder",
      image: "/images/personal/prashant.jpg",
      bio: "Prashant brings a hands-on approach and a drive for quality, stepping confidently into the construction space with a vision for growth."
    }
  ];

  const certifications = [
    "Licensed Building Practitioners",
    "Registered Master Builders",
    "Certified Green Building Professional",
    "Site Safe Certified",
    "Construction Health and Safety NZ Accredited",
    "New Zealand Institute of Architects Member"
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Construction team"
            fill
            quality={100}
            priority
            className="object-cover brightness-[0.4]"
          />
        </div>
        <div className="container relative z-10 py-24 md:py-32">
          <div className="flex flex-col max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              About Us
            </h1>
            <p className="text-xl text-white/90">
              Building excellence with integrity, innovation, and attention to detail.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                1ShotBuilders was founded in 2010 with a simple yet powerful vision: to deliver construction and renovation projects with precision and excellence—in one shot. 
              </p>
              <p className="text-muted-foreground mb-4">
                Our founder, John Smith, began his career as a carpenter and quickly developed a reputation for his attention to detail and commitment to quality. After years of working for various construction companies, John identified a gap in the market for a construction firm that truly prioritized client satisfaction and quality craftsmanship.
              </p>
              <p className="text-muted-foreground mb-4">
                Starting with a small team of skilled builders, 1ShotBuilders has grown into a comprehensive construction and renovation company with a diverse team of experts in architecture, interior design, project management, and specialized trades.
              </p>
              <p className="text-muted-foreground">
                Today, we're proud to have completed hundreds of successful projects across New Zealand, from luxurious residential renovations to complex commercial builds. Our name—1ShotBuilders—reflects our commitment to getting it right the first time, delivering a seamless experience for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision & Mission Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Vision & Mission</h2>
            <Separator className="mx-auto w-24 bg-primary h-1 mb-6" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  To be New Zealand's premier construction and renovation company, known for transforming spaces with uncompromising quality, innovative designs, and exceptional client experiences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  To deliver construction and renovation projects that exceed expectations through expert craftsmanship, transparent communication, and a relentless commitment to getting it right the first time.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Quality</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We never compromise on quality, using only the finest materials and techniques to ensure lasting results.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We operate with honesty and transparency in all our dealings, building trust with every interaction.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <Award className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    We embrace new technologies and approaches to deliver efficient, cutting-edge solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Leadership Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals who lead 1ShotBuilders with expertise and vision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Certifications Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Certifications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              1ShotBuilders maintains the highest industry standards through professional certifications and memberships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{cert}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
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
              </ul>
              
              <div className="mt-8">
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-lg overflow-hidden">
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
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start your journey with 1ShotBuilders today and experience construction excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Get a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="btn-orange">
              <Link href="/projects">View Our Projects</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}