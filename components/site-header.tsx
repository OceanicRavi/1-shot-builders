"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/mobile-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";
import Image from 'next/image';
import { db } from "@/lib/services/database";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createClientComponentClient();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Session data:", session); // Debug log
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (session?.user && isMounted) {
          console.log("Found session user:", session.user.id); // Debug log
          
          try {
            const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);
            
            if (userError) {
              console.error("User data error:", userError);
              // Don't throw here, just use session data as fallback
            }
            
            console.log("User data from DB:", userData); // Debug log
            
            if (isMounted) {
              setUser(userData || { 
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email
              });
            }
          } catch (dbError) {
            console.error("Database error:", dbError);
            // Fallback to session data if DB fails
            if (isMounted) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email
              });
            }
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial load
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id); // Debug log
        
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user && isMounted) {
            setLoading(true);
            await getUser();
          }
        } else if (event === 'INITIAL_SESSION') {
          // Handle initial session load
          if (session?.user && isMounted) {
            await getUser();
          } else if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b glass-effect">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/favicon.png"
              alt="1ShotBuilders logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
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
          
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : user ? (
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
          )}
          
          <div className="md:hidden">
            <MobileMenu routes={routes} user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}