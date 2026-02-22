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
} from "../../../components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Eye,
  Users,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  UserCheck,
  UserX,
} from "lucide-react";
import { adminAPI } from "../../../services/api";

const ManagerList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch managers from API
  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllManagers();
      if (response.data.success) {
        setManagers(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch managers:", err);
      const details = err.response?.data?.message || err.message;
      setError(`Failed to load managers. Details: ${details}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Approve manager
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      const response = await adminAPI.approveManager(id);
      if (response.data.success) {
        // Update local state
        setManagers((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: "Active" } : m)),
        );
      }
    } catch (err) {
      console.error("Failed to approve manager:", err);
      alert("Failed to approve manager. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject manager
  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      const response = await adminAPI.rejectManager(id);
      if (response.data.success) {
        // Update local state
        setManagers((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: "Inactive" } : m)),
        );
      }
    } catch (err) {
      console.error("Failed to reject manager:", err);
      alert("Failed to reject manager. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter managers based on search and tab
  const getFilteredManagers = () => {
    let filtered = managers;

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((m) => m.status === "Pending");
    } else if (activeTab === "active") {
      filtered = filtered.filter((m) => m.status === "Active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((m) => m.status === "Inactive");
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (manager) =>
          `${manager.firstName} ${manager.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          manager.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filteredManagers = getFilteredManagers();

  // Stats
  const stats = {
    total: managers.length,
    pending: managers.filter((m) => m.status === "Pending").length,
    active: managers.filter((m) => m.status === "Active").length,
    inactive: managers.filter((m) => m.status === "Inactive").length,
    totalTeamMembers: managers.reduce((sum, m) => sum + (m.teamSize || 0), 0),
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading managers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchManagers}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Managers</h1>
        <p className="text-muted-foreground">
          View and manage all managers in the system
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Managers</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending Approval
            </CardDescription>
            <CardTitle className="text-2xl text-yellow-500">
              {stats.pending}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-500/30">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Active Managers
            </CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {stats.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Team Members</CardDescription>
            <CardTitle className="text-2xl">{stats.totalTeamMembers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Managers Table with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Managers</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search managers..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending" className="text-yellow-600">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-green-600">
                Active ({stats.active})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-red-600">
                Inactive ({stats.inactive})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredManagers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No managers found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manager</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredManagers.map((manager) => (
                      <TableRow key={manager._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={manager.avatar} />
                              <AvatarFallback>
                                {manager.firstName?.[0]}
                                {manager.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {manager.firstName} {manager.lastName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {manager.email}
                            </div>
                            {manager.phone && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {manager.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {manager.teamSize || 0} members
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(manager.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(manager.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve/Reject buttons for pending managers */}
                            {manager.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(manager._id)}
                                  disabled={actionLoading === manager._id}
                                >
                                  {actionLoading === manager._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(manager._id)}
                                  disabled={actionLoading === manager._id}
                                >
                                  {actionLoading === manager._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <UserX className="h-4 w-4 mr-1" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                              </>
                            )}

                            {/* Re-activate button for inactive managers */}
                            {manager.status === "Inactive" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(manager._id)}
                                disabled={actionLoading === manager._id}
                              >
                                {actionLoading === manager._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                            )}

                            {/* Deactivate button for active managers */}
                            {manager.status === "Active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                onClick={() => handleReject(manager._id)}
                                disabled={actionLoading === manager._id}
                              >
                                {actionLoading === manager._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserX className="h-4 w-4 mr-1" />
                                    Deactivate
                                  </>
                                )}
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/managers/${manager._id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerList;
