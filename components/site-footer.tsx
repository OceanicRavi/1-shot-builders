import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import AIWidget from "./AIAgent";

export function SiteFooter() {
  return (
    <footer className="bg-muted py-12 mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl mb-4">1ShotBuilders</h3>
            <p className="text-muted-foreground mb-4">
              Transforming spaces, delivering dreams in one shot.
            </p>
            <div className="flex space-x-4 mb-6">
              <Link href="https://facebook.com/1shotbuilders/" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com/1shotbuilders/" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
            <div className="flex flex-row gap-1">
              <Link href="https://www.masterbuilder.org.nz/" target="_blank" rel="noopener noreferrer" className="relative w-32 h-48">
                <Image
                  src="/images/logos/mb.png"
                  alt="Registered Master Builders"
                  fill
                  className="object-contain"
                />
              </Link>
              <Link href="https://www.lbp.govt.nz/" target="_blank" rel="noopener noreferrer" className="relative w-32 h-48">
                <Image
                  src="/images/logos/lbp.jpg"
                  alt="Licensed Building Practitioners"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">

              <li>
                <Link href="/services#renovation" className="text-muted-foreground hover:text-primary">
                  Renovation
                </Link>
              </li>
              <li>
                <Link href="/services#new-builds" className="text-muted-foreground hover:text-primary">
                  New Builds
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul>
              <li>
                <address className="not-italic text-muted-foreground">
                  <p><b>Auckland branch</b></p>
                  <p>20 Keats Place, Blockhouse Bay 0600.</p>
                  <div className="mt-2">
                    <div className="text-muted-foreground">
                      Contact <b>Mayur</b> on <a href="tel:+64220429642" className="hover:text-primary">(+64) 022-042-9642</a>
                    </div>
                    <div className="text-muted-foreground">
                      Contact <b>Prashant</b> on <a href="tel:+64277771483" className="hover:text-primary">(+64) 027-777-1483</a>
                    </div>
                  </div>
                  <p>
                    <a href="mailto:we@1shotbuilders.co.nz" className="hover:text-primary">
                      we@1shotbuilders.co.nz
                    </a>
                  </p>
                </address>
              </li>
              <li>
                <address className="not-italic text-muted-foreground mt-4 ">
                  <p><b>Wellington branch</b></p>
                  <p>56 Waiuta, St Tītahi Bay, Porirua 5022.</p>
                  <div className="mt-2">
                    <div className="text-muted-foreground">
                      Contact <b>Sunil Desai</b> on <a href="tel:+640211061122" className="hover:text-primary">(+64) 021-106-1122</a>
                    </div>
                  </div>
                  <p>
                    <a href="mailto:we@1shotbuilders.co.nz" className="hover:text-primary">
                      we.wellington@1shotbuilders.co.nz
                    </a>
                  </p>
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} 1ShotBuilders. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            {/*             <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/franchise/apply" className="hover:text-primary">
              Franchise Opportunities
            </Link> */}
            <div className="fixed bottom-24 right-4 z-50">
              <AIWidget />
            </div>
            <p>Created by NovaNexus AI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}