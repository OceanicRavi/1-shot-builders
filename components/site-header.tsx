"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
  const [siteHeaderLoading, setSiteHeaderLoading] = useState(true);
  const supabase = createClientComponentClient();
  const lastSessionRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async (sessionUser: any) => {
      try {
         // Debug log
        
        const { data: userData, error: userError } = await db.users.getByAuthId(sessionUser.id);

        if (userError) {
          console.error("User data error:", userError);
          // Still return fallback user data even if DB query fails
          return {
            id: sessionUser.id,
            email: sessionUser.email,
            name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email
          };
        }

        // If no user data in DB, return session data as fallback
        if (!userData) {
          
          return {
            id: sessionUser.id,
            email: sessionUser.email,
            name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email
          };
        }

        return userData;
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Always return fallback user data to prevent infinite loading
        return {
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email
        };
      }
    };

    const handleAuthState = async (session: any, showLoading = true) => {
      if (!isMounted || isLoadingRef.current) return;

      const sessionId = session?.user?.id || null;

      // Skip if same session
      if (lastSessionRef.current === sessionId) {
        if (isMounted && siteHeaderLoading) {
          setSiteHeaderLoading(false);
        }
        return;
      }

      isLoadingRef.current = true;
      lastSessionRef.current = sessionId;

      if (showLoading && isMounted) {
        setSiteHeaderLoading(true);
      }

      try {
        if (session?.user) {
           // Debug log
          const userData = await fetchUserData(session.user);
           // Debug log
          
          if (isMounted) {
            setUser(userData);
          }
        } else {
           // Debug log
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error handling auth state:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setSiteHeaderLoading(false);
        }
        isLoadingRef.current = false;
      }
    };

    // Initial load - get session once
    const initializeAuth = async () => {
      try {
         // Debug log
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          if (isMounted) {
            setSiteHeaderLoading(false);
          }
          return;
        }

         // Debug log
        await handleAuthState(session, true);
      } catch (error) {
        console.error("Initialize auth error:", error);
        if (isMounted) {
          setSiteHeaderLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes - but be selective
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
         // Debug log

        if (!isMounted) return;

        switch (event) {
          case 'SIGNED_IN':
            await handleAuthState(session, true);
            break;

          case 'SIGNED_OUT':
             // Debug log
            lastSessionRef.current = null;
            setUser(null);
            setSiteHeaderLoading(false);
            break;

          case 'TOKEN_REFRESHED':
            // Don't refetch user data on token refresh, just update session reference
            if (session?.user?.id && lastSessionRef.current !== session.user.id) {
              await handleAuthState(session, false);
            } else {
              // Just stop loading if it's the same user
              setSiteHeaderLoading(false);
            }
            break;

          // Handle initial session case
          case 'INITIAL_SESSION':
            if (session) {
              await handleAuthState(session, true);
            } else {
              setSiteHeaderLoading(false);
            }
            break;

          // Ignore other events to prevent rate limiting
          default:
            if (isMounted) {
              setSiteHeaderLoading(false);
            }
            break;
        }
      }
    );

    return () => {
      isMounted = false;
      isLoadingRef.current = false;
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

          {siteHeaderLoading ? (
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