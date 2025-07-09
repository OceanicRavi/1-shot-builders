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
      image: "/images/personal/mayur.JPG",
      bio: "With years of hands-on building experience, he takes pride in doing the job right the first time. He is known for his practical approach on site, attention to detail, and genuine commitment to ensuring every client is happy with the final result."
    },
    {
      name: "Prashant Dholakiya",
      role: "Founder",
      image: "/images/personal/prashant.JPG",
      bio: "A LBP focusing on keeping projects running smoothly and to a high standard. Easy to work with, communicates clearly, and always looks for ways to improve without cutting corners."
    }
  ];

  const certifications = [
    { name: "Licensed Building Practitioners", image: "/images/logos/lbp.jpg" },
    { name: "Registered Master Builders", image: "/images/logos/mb.png" },
    { name: "Site Safe Certified", image: "/images/logos/ss.png" }
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
                src="/images/brand/our_story.jpeg"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2021 by Mayurkumar Kakadiya and Prashant Dholakiya, 1ShotBuilders was born out of a shared passion to transform the construction and renovation industry in Auckland. Mayur's expertise and experience in Business and the industry, and Prashant's experience as an LBP with hands-on experience, to create a company that puts quality, precision, and client satisfaction at the heart of every project.
              </p>
              <p className="text-muted-foreground mb-4">
                1ShotBuilders has quickly built a reputation for delivering outstanding results — whether it’s a modern residential renovation or a complex commercial build. What sets us apart is our commitment to doing things right the first time. Our name, 1ShotBuilders, reflects this philosophy: we believe in getting every detail right from the start, ensuring smooth, stress-free project delivery.
              </p>
              <p className="text-muted-foreground mb-4">
                With a client-focused approach and a dedication to craftsmanship, Mayur and Prashant lead a team that prides itself on transparency, integrity, and excellence. Every project is treated with care, attention to detail, and the professionalism you deserve.
              </p>
              <p className="text-muted-foreground">
                As we grow, our commitment remains the same — to exceed expectations, set new standards, and build lasting relationships with the people and communities we serve.
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
                  To become the most trusted and reliable construction company, known for doing the job once and doing it right.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  To lead with precision, build with purpose, and deliver with pride. We don’t cut corners — we create legacies.
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
                    We build it once — and we build it right. From premium materials to masterful execution, quality is in every nail, beam, and finish.
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
                    We don’t just build structures — we build trust. Through clear communication and honest work, our word is as solid as our foundations.
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
                    We stay ahead by building smarter. With cutting-edge tools and forward-thinking methods, we deliver solutions that stand the test of time.
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
                  <div className="h-8 w-8 mx-auto mb-2 flex items-center justify-center">
                    <img
                      src={cert.image}
                      alt={`${cert.name} certification`}
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
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