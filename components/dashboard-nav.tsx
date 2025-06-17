import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  FileText, 
  Upload, 
  ClipboardList, 
  Settings, 
  Bell,
  Home,
  CheckCircle,
  History,
  UserCircle,
  Download,
  Building2,
  Quote,
  Mail,
  Send,
  UserPlus
} from "lucide-react";

interface DashboardNavProps {
  role?: string;
}

export function DashboardNav({ role }: DashboardNavProps) {
  const adminItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users
    },
    {
      title: "All Projects",
      href: "/admin/projects",
      icon: FileText
    },
    {
      title: "All Files",
      href: "/admin/files",
      icon: Upload
    },
    {
      title: "Client Testimonials",
      href: "/admin/content/upload",
      icon: Quote
    },
    {
      title: "Approve Content",
      href: "/admin/content/approve",
      icon: CheckCircle
    },
        {
      title: "Email Templates",
      href: "/admin/email/templates",
      icon: Mail
    },
    {
      title: "Email Recipients",
      href: "/admin/email/recipients",
      icon: UserPlus
    },
    {
      title: "Email Campaigns",
      href: "/admin/email/campaigns",
      icon: Send
    },
    {
      title: "Audit Logs",
      href: "/admin/audit",
      icon: History
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  const internalItems = [
    {
      title: "Dashboard",
      href: "/internal/dashboard",
      icon: Home
    },
    {
      title: "View All Projects",
      href: "/internal/projects",
      icon: FileText
    },
    {
      title: "Client Testimonials",
      href: "/internal/content/upload",
      icon: Quote 
    },
    {
      title: "Approve Content",
      href: "/internal/content/approve",
      icon: CheckCircle
    },
    {
      title: "Settings",
      href: "/internal/settings",
      icon: Settings
    }
  ];

  const franchiseItems = [
    {
      title: "Franchise Dashboard",
      href: "/franchise/dashboard",
      icon: Home
    },
    {
      title: "My Projects",
      href: "/franchise/projects",
      icon: FileText
    },
    {
      title: "Upload Documents",
      href: "/franchise/documents/upload",
      icon: Upload
    },
    {
      title: "Client Info",
      href: "/franchise/clients",
      icon: UserCircle
    },
    {
      title: "Settings",
      href: "/franchise/settings",
      icon: Settings
    }
  ];

  const clientItems = [
    {
      title: "My Dashboard",
      href: "/client/dashboard",
      icon: Home
    },
    {
      title: "My Projects",
      href: "/client/projects",
      icon: FileText
    },
    {
      title: "Download Files",
      href: "/client/files",
      icon: Download
    },
    {
      title: "Settings",
      href: "/client/settings",
      icon: Settings
    }
  ];

  const userItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings
    }
  ];

  const items = role === 'admin' ? adminItems :
                role === 'internal' ? internalItems :
                role === 'franchise' ? franchiseItems :
                role === 'client' ? clientItems :
                userItems;

  return (
    <ScrollArea className="h-full py-6">
      <div className="space-y-1">
        {items.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className="w-full justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}