import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  UserCog,
  Download,
  Filter,
  Users,
  Loader2,
  Check,
  Lock,
} from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { adminAPI, groupAPI } from "../../../services/api";
import { ScrollArea } from "../../../components/ui/scroll-area";

const getStatusBadge = (status) => {
  const variants = {
    Active: "default",
    Pending: "secondary",
    Inactive: "destructive", // Changed to destructive for visibility
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

const getRoleBadge = (role) => {
  const variants = {
    admin: "destructive",
    manager: "default",
    employee: "secondary",
  };
  return <Badge variant={variants[role] || "secondary"}>{role}</Badge>;
};

const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  // Groups state
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Group creation state
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [availableMembers, setAvailableMembers] = useState({
    managers: [],
    employees: [],
  });
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Fetch all users (managers + employees)
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const [managersRes, employeesRes] = await Promise.all([
        adminAPI.getAllManagers({ limit: 1000 }), // Get all for now
        adminAPI.getAllEmployees({ limit: 1000 }),
      ]);

      const managers = managersRes.data.data.map((m) => ({
        ...m,
        role: "manager",
      }));
      const employees = employeesRes.data.data.map((e) => ({
        ...e,
        role: "employee",
      }));

      // Sort by creation date
      const allUsers = [...managers, ...employees].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available members for group creation
  const fetchAvailableMembers = async () => {
    try {
      const response = await groupAPI.getAvailableMembers();
      if (response.data.success) {
        setAvailableMembers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch available members:", error);
    }
  };

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setGroupsLoading(true);
      const response = await groupAPI.getAllGroups({ limit: 100 });
      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Delete group
  const handleDeleteGroup = async (groupId, groupName) => {
    if (!confirm(`Are you sure you want to delete "${groupName}"?`)) return;

    try {
      await groupAPI.deleteGroup(groupId);
      fetchGroups(); // Refresh list
      alert("Group deleted successfully!");
    } catch (error) {
      console.error("Failed to delete group:", error);
      alert(error.response?.data?.message || "Failed to delete group");
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchGroups();
  }, []);

  useEffect(() => {
    if (createGroupOpen) {
      fetchAvailableMembers();
    }
  }, [createGroupOpen]);

  const handleCreateGroup = async () => {
    if (!groupName) return;

    try {
      setIsCreatingGroup(true);
      await groupAPI.createGroup({
        name: groupName,
        description: groupDescription,
        managers: selectedManagers,
        employees: selectedEmployees,
      });

      setCreateGroupOpen(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedManagers([]);
      setSelectedEmployees([]);

      // Refresh groups list
      fetchGroups();
      alert("Group created successfully!");
    } catch (error) {
      console.error("Failed to create group:", error);
      alert(error.response?.data?.message || "Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const toggleManagerSelection = (id) => {
    setSelectedManagers((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id],
    );
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id],
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            Manage all users (Managers & Employees) in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Create a new group and assign managers and employees to it.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 overflow-y-auto pr-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Engineering Team Alpha"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="What is this group for?"
                  />
                </div>

                {/* Step 1: Select Manager */}
                <div className="grid gap-2">
                  <Label>Select Manager *</Label>
                  <div className="border rounded-md p-3">
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search managers..."
                        className="h-8 pl-7 text-xs"
                      />
                    </div>
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-1">
                        {availableMembers.managers.map((manager) => (
                          <div
                            key={manager._id}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${selectedManagers.includes(manager._id) ? "bg-primary/10 border border-primary" : ""}`}
                            onClick={() => {
                              // Single select - replace instead of toggle
                              setSelectedManagers([manager._id]);
                            }}
                          >
                            <div
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedManagers.includes(manager._id) ? "bg-primary border-primary text-primary-foreground" : "border-input"}`}
                            >
                              {selectedManagers.includes(manager._id) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <div className="text-sm">
                              <p className="font-medium leading-none">
                                {manager.firstName} {manager.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {manager.email}
                              </p>
                            </div>
                          </div>
                        ))}
                        {availableMembers.managers.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            No active managers found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Step 2: Select Employees - Only enabled after manager selected */}
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2">
                    Select Employees
                    {selectedManagers.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        (Select a manager first)
                      </span>
                    )}
                    {selectedEmployees.length > 0 && (
                      <Badge variant="outline" className="ml-auto">
                        {selectedEmployees.length} selected
                      </Badge>
                    )}
                  </Label>
                  <div
                    className={`border rounded-md p-3 relative ${selectedManagers.length === 0 ? "opacity-50" : ""}`}
                  >
                    {/* Lock overlay when no manager selected */}
                    {selectedManagers.length === 0 && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-md flex flex-col items-center justify-center z-10">
                        <Lock className="h-6 w-6 text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground text-center">
                          Select a manager first
                        </p>
                      </div>
                    )}

                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        className="h-8 pl-7 text-xs"
                        disabled={selectedManagers.length === 0}
                      />
                    </div>
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-1">
                        {availableMembers.employees.map((employee) => (
                          <div
                            key={employee._id}
                            className={`flex items-center gap-2 p-2 rounded-md ${selectedManagers.length === 0 ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted"} ${selectedEmployees.includes(employee._id) ? "bg-primary/10" : ""}`}
                            onClick={() => {
                              if (selectedManagers.length > 0) {
                                toggleEmployeeSelection(employee._id);
                              }
                            }}
                          >
                            <div
                              className={`h-4 w-4 rounded border flex items-center justify-center ${selectedEmployees.includes(employee._id) ? "bg-primary border-primary text-primary-foreground" : "border-input"}`}
                            >
                              {selectedEmployees.includes(employee._id) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <div className="text-sm">
                              <p className="font-medium leading-none">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        ))}
                        {availableMembers.employees.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            No active employees found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateGroupOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!groupName || isCreatingGroup}
                >
                  {isCreatingGroup && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {users.filter((u) => u.status === "Active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Users</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {users.filter((u) => u.status === "Pending").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Managers</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {users.filter((u) => u.role === "manager").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users Directory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading users...
              </span>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="managers">Managers</TabsTrigger>
                <TabsTrigger value="employees">Employees</TabsTrigger>
              </TabsList>

              {["all", "active", "pending", "managers", "employees"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers
                          .filter((u) => {
                            if (tab === "all") return true;
                            if (tab === "active") return u.status === "Active";
                            if (tab === "pending")
                              return u.status === "Pending";
                            if (tab === "managers") return u.role === "manager";
                            if (tab === "employees")
                              return u.role === "employee";
                            return true;
                          })
                          .map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                      {user.firstName?.[0]}
                                      {user.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>{user.phone || "-"}</TableCell>
                              <TableCell>
                                {getStatusBadge(user.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link
                                    to={`/admin/${user.role === "manager" ? "managers" : "employees"}/${user._id}`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ),
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUsers;
