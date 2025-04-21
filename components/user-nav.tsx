"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter, roleToLabel } from "@/lib/utils";
import { db } from "@/lib/services/database";
import { useToast } from "@/hooks/use-toast";

export function UserNav({ user }: { user: any }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await db.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    const role = user?.role || "user";
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "internal":
        return "/internal/dashboard";
      case "franchise":
        return "/franchise/dashboard";
      case "client":
        return "/client/dashboard";
      default:
        return "/dashboard";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials(user?.full_name || "")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            {user?.role && (
              <p className="text-xs leading-none text-muted-foreground">
                {roleToLabel[user.role] || capitalizeFirstLetter(user.role)}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600" 
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}