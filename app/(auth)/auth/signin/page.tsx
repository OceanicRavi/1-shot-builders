"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/services/database";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {


      // Sign in with Auth
      const { data: authData, error: authError } = await db.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });




      if (authError) throw authError;

      if (authData.user) {


        // Get user role to determine redirect
        const { data: userData, error: userError } = await db.users.getByEmail(
          values.email.trim().toLowerCase()
        );




        if (userError && userError.code !== "PGRST116") {
          throw userError;
        }

        toast({
          title: "Sign in successful!",
          description: "Welcome back to 1ShotBuilders.",
        });

        const role = userData?.role;


        // Refresh the router to update the session state
        router.refresh();

        // Small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 500));

        // Navigate based on role
        switch (role) {
          case "admin":

            router.push("/admin/dashboard");
            break;
          case "internal":

            router.push("/internal/dashboard");
            break;
          case "franchise":

            router.push("/franchise/dashboard");
            break;
          case "client":

            router.push("/client/dashboard");
            break;
          default:

            router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("❌ Sign in error:", error);
      toast({
        title: "Error signing in",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input placeholder="********" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground text-center w-full">
                  Want to become a franchise? <Link href="/franchise/apply" className="text-primary hover:underline">Apply here</Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}