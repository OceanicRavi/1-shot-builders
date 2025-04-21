"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";
import { db } from "@/lib/services/database";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  timestamp: string;
  meta: any;
  user?: {
    email: string;
    full_name: string;
  };
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { session }, error: sessionError } = await db.auth.getSession();
      
      if (sessionError || !session?.user) {
        router.push("/auth/signin");
        return;
      }

      const { data: userData, error: userError } = await db.users.getByAuthId(session.user.id);

      if (userError || userData?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    }

    checkAdminAccess();
  }, [router]);

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const { data, error } = await db.audit.list({ limit: 100 });

        if (error) throw error;

        let filteredLogs = data || [];

        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredLogs = filteredLogs.filter(log => 
            log.action.toLowerCase().includes(searchLower) ||
            log.target_type.toLowerCase().includes(searchLower)
          );
        }

        if (actionFilter !== "all") {
          filteredLogs = filteredLogs.filter(log => log.action === actionFilter);
        }

        setLogs(filteredLogs);
      } catch (error: any) {
        console.error("Error loading audit logs:", error);
        toast({
          title: "Error loading audit logs",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
  }, [searchTerm, actionFilter, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track and monitor system activities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.user?.full_name || "System"}
                      {log.user?.email && (
                        <div className="text-sm text-muted-foreground">
                          {log.user.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{log.action}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.target_type}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {log.target_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.meta && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Action Details",
                              description: (
                                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                  <code className="text-white">
                                    {JSON.stringify(log.meta, null, 2)}
                                  </code>
                                </pre>
                              ),
                            });
                          }}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}