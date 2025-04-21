"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle2 } from "lucide-react";
import { db } from "@/lib/services/database";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      
      if (sessionError || !session?.user) {
        router.push("/auth/signin");
        return;
      }

      const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);
      
      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      }

      setUser(userData || session.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>
                <UserCircle2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                {user?.full_name || user?.email}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Account created</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(user?.created_at || "").toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Last sign in</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(user?.last_sign_in_at || "").toLocaleDateString()}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}