"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/mobile-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";
import { Landmark } from "lucide-react";
import { db } from "@/lib/services/database";
import { supabase } from "@/lib/supabase";

const routes = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function SiteHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);
          
          if (userError) throw userError;
          
          setUser(userData || { email: session.user.email });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b glass-effect">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Landmark className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-2xl">1 SHOT Builders</span>
          </Link>
        </div>

        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}>
                      {route.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <ThemeToggle />
          </div>
          
          {!loading && (
            user ? (
              <UserNav user={user} />
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" className="font-medium">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-gradient font-medium">Sign Up</Button>
                </Link>
              </div>
            )
          )}
          
          <div className="md:hidden">
            <MobileMenu routes={routes} user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}