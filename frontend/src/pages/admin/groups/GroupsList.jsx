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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Plus,
  Search,
  Users,
  Loader2,
  Check,
  Lock,
  Trash2,
  UserCog,
  Calendar,
} from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { groupAPI } from "../../../services/api";
import { ScrollArea } from "../../../components/ui/scroll-area";

const GroupsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

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

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAllGroups({ limit: 100 });
      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
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

  useEffect(() => {
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
      fetchGroups();
      alert("Group created successfully!");
    } catch (error) {
      console.error("Failed to create group:", error);
      alert(error.response?.data?.message || "Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!confirm(`Are you sure you want to delete "${groupName}"?`)) return;

    try {
      await groupAPI.deleteGroup(groupId);
      fetchGroups();
      alert("Group deleted successfully!");
    } catch (error) {
      console.error("Failed to delete group:", error);
      alert(error.response?.data?.message || "Failed to delete group");
    }
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id],
    );
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Manage team groups with managers and employees
          </p>
        </div>
        <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group and assign a manager and employees to it.
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

              {/* Step 2: Select Employees */}
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
                disabled={
                  !groupName || selectedManagers.length === 0 || isCreatingGroup
                }
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Groups</CardDescription>
            <CardTitle className="text-2xl">{groups.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Groups</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {groups.filter((g) => g.status === "Active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Members</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {groups.reduce(
                (acc, g) =>
                  acc + (g.managers?.length || 0) + (g.employees?.length || 0),
                0,
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading groups...</span>
        </div>
      ) : filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No groups found</h3>
            <p className="text-muted-foreground text-center">
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first group to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card key={group._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {group.description}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteGroup(group._id, group.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Manager */}
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Manager:</span>
                  <span className="text-sm text-muted-foreground">
                    {group.managers?.length > 0
                      ? group.managers
                          .map((m) => `${m.firstName} ${m.lastName}`)
                          .join(", ")
                      : "Not assigned"}
                  </span>
                </div>

                {/* Employees */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Employees:</span>
                  <Badge variant="secondary">
                    {group.employees?.length || 0}
                  </Badge>
                </div>

                {/* Employee Names */}
                {group.employees?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {group.employees.slice(0, 3).map((emp) => (
                      <Badge
                        key={emp._id}
                        variant="outline"
                        className="text-xs"
                      >
                        {emp.firstName} {emp.lastName?.[0]}.
                      </Badge>
                    ))}
                    {group.employees.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.employees.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsList;
