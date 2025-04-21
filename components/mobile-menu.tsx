"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MobileMenu({ routes, user }: { routes: any[], user?: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setOpen(false)}
          >
            <span className="font-bold inline-block text-2xl">1ShotBuilders</span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3 py-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {route.title}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Sign Up
                </Link>
                <Link
                  href="/franchise/apply"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Apply for Franchise
                </Link>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}