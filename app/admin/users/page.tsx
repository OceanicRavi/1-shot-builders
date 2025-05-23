"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, UserPlus } from "lucide-react";
import { roleToLabel } from "@/lib/utils";
import { db } from "@/lib/services/database";
import { AddUserDialog } from "@/components/dialogs/add-user-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { EditUserDialog } from "@/components/dialogs/edit-user-dialog";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
  deleted_at?: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null);
  const [editUser, setEditUser] = useState<null | User>(null);

  const { toast } = useToast();
  const router = useRouter();

  async function loadUsers() {
    try {
      const { data, error } = await db.users.list();

      if (error) throw error;

      let filteredUsers = data || [];

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(searchLower) ||
          (user.full_name?.toLowerCase() || "").includes(searchLower) ||
          (user.phone?.toLowerCase() || "").includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower) ||
          user.created_at.toLowerCase().includes(searchLower)
        );
      }

      if (roleFilter !== "all") {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      setUsers(filteredUsers);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, toast]);

  async function handleRoleChange(userId: string, newRole: "admin" | "user" | "client" | "franchise" | "internal") {
    try {
      const { error } = await db.users.update(userId, { role: newRole });

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      const { error } = await db.users.update(userId, {
        deleted_at: new Date().toISOString(),
      });
  
      if (error) throw error;
  
      setUsers(users.filter(user => user.id !== userId));
  
      toast({
        title: "User deleted",
        description: "The user has been soft-deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConfirmDelete(null);
    }
  }
  
  async function handleEditSave(data: { full_name: string; phone: string }) {
    if (!editUser) return;
  
    try {
      const { error } = await db.users.update(editUser.id, {
        full_name: data.full_name,
        phone: data.phone,
      });
  
      if (error) throw error;
  
      setUsers(users.map(user =>
        user.id === editUser.id
          ? { ...user, full_name: data.full_name, phone: data.phone }
          : user
      ));
  
      toast({
        title: "User updated",
        description: "User details updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setEditUser(null);
    }
  }  

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
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage system users and their roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="franchise">Franchise</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Button className="whitespace-nowrap" onClick={() => setShowAddDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: "admin" | "user" | "client" | "franchise" | "internal") =>
                        handleRoleChange(user.id, value)
                    }
                    >

                        <SelectTrigger className="w-[140px]">
                          <SelectValue>{roleToLabel[user.role] || user.role}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="internal">Internal Staff</SelectItem>
                          <SelectItem value="franchise">Franchise Owner</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmDelete(user.id)}
                    >
                      Delete
                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddUserDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={loadUsers}
      />
      {confirmDelete && (
        <ConfirmDialog
          open={!!confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDeleteUser(confirmDelete)}
          title="Delete User?"
          description="Are you sure you want to delete this user? This action is reversible."
        />
      )}
      {editUser && (
        <EditUserDialog
          open={!!editUser}
          onOpenChange={() => setEditUser(null)}
          user={editUser}
          onSave={handleEditSave}
        />
      )}
    </>
  );
}